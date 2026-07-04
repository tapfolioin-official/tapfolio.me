import prisma from './db';
import admin from './firebase-admin';

export type NotificationType =
  | 'connection_request'
  | 'connection_accepted'
  | 'profile_view'
  | 'nfc_tap'
  | 'system'
  | 'announcement'
  | 'security';

interface CreateNotificationOptions {
  receiverId: number;
  senderId?: number;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

/**
 * Creates a notification record and dispatches a push notification via FCM if tokens are registered.
 * Silently swallows errors so notification failures never break caller routes.
 */
export async function createNotification(opts: CreateNotificationOptions): Promise<void> {
  try {
    // Deduplicate: don't create another connection_request notification if one already exists
    // and is still unread for the same sender/receiver pair.
    if (opts.type === 'connection_request' && opts.senderId) {
      const existing = await prisma.notification.findFirst({
        where: {
          receiverId: opts.receiverId,
          senderId: opts.senderId,
          type: 'connection_request',
          isRead: false,
        },
      });
      if (existing) {
        console.log(`[NOTIFY] Skipping duplicate connection_request notification for receiver=${opts.receiverId}`);
        return;
      }
    }

    const dbNotif = await prisma.notification.create({
      data: {
        receiverId: opts.receiverId,
        senderId: opts.senderId ?? null,
        type: opts.type,
        title: opts.title,
        message: opts.message,
        data: opts.data ? (opts.data as any) : {},
      },
    });

    console.log(`[NOTIFY] Created database notification id=${dbNotif.id} for userId=${opts.receiverId}`);

    // Fetch registered FCM tokens for user
    const fcmTokens = await prisma.fcmToken.findMany({
      where: { userId: opts.receiverId },
    });

    if (fcmTokens.length > 0) {
      const tokens = fcmTokens.map((t) => t.token);

      const _adminAny = admin as any;
      if (_adminAny.apps && _adminAny.apps.length > 0) {
        const payload = {
          notification: {
            title: opts.title,
            body: opts.message,
          },
          data: {
            click_action: 'FLUTTER_NOTIFICATION_CLICK',
            notificationId: String(dbNotif.id),
            type: opts.type,
            payload: JSON.stringify(opts.data ?? {}),
          },
          android: {
            notification: {
              sound: 'default',
              clickAction: 'FLUTTER_NOTIFICATION_CLICK',
            },
          },
          apns: {
            payload: {
              aps: {
                sound: 'default',
              },
            },
          },
        };

        const response = await _adminAny.messaging().sendEachForMulticast({
          tokens,
          ...payload,
        });

        console.log(`[FCM] Sent push message: success=${response.successCount}, failure=${response.failureCount}`);

        if (response.failureCount > 0) {
          const tokensToRemove: string[] = [];
          response.responses.forEach((res: any, index: number) => {
            if (!res.success && res.error) {
              const code = res.error.code;
              if (
                code === 'messaging/invalid-registration-token' ||
                code === 'messaging/registration-token-not-registered'
              ) {
                tokensToRemove.push(tokens[index]);
              }
            }
          });

          if (tokensToRemove.length > 0) {
            await prisma.fcmToken.deleteMany({
              where: { token: { in: tokensToRemove } },
            });
            console.log(`[FCM] Pruned ${tokensToRemove.length} inactive/invalid FCM tokens.`);
          }
        }
      } else {
        console.log(`[FCM-MOCK] Push mock: would send to tokens: ${tokens.join(', ')}`);
      }
    }
  } catch (err) {
    // Never propagate — notifications are non-critical
    console.error('[NOTIFY] Failed to process notification (non-fatal):', err);
  }
}
