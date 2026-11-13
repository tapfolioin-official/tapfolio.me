import prisma from '@/lib/db';

/**
 * Ensures the user has at least one Card. If not, auto-seeds a Default Active Card
 * from the user's existing Profile data (idempotent, backward-compatible).
 */
export async function ensureUserHasActiveCard(userId: number) {
  // Check if user already has cards
  const existingCards = await prisma.card.findMany({
    where: { userId },
    orderBy: [{ isActive: 'desc' }, { isDefault: 'desc' }, { updatedAt: 'desc' }],
  });

  if (existingCards.length > 0) {
    // Heal any card that was defaulted to "My Card" if the user has a real profile name
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { name: true },
    });
    if (profile?.name && profile.name.trim().length > 0 && profile.name !== 'My Card') {
      const needsHealing = existingCards.some((c) => c.name === 'My Card' || !c.name);
      if (needsHealing) {
        await prisma.card.updateMany({
          where: { userId, OR: [{ name: 'My Card' }, { name: '' }] },
          data: { name: profile.name },
        });
        existingCards.forEach((c) => {
          if (c.name === 'My Card' || !c.name) c.name = profile.name;
        });
      }
    }

    // Check if there is an active card
    const active = existingCards.find((c) => c.isActive);
    if (active) {
      return { cards: existingCards, activeCard: active };
    }
    // If no card is marked active, activate the default or first card
    const target = existingCards.find((c) => c.isDefault) || existingCards[0];
    const activated = await prisma.card.update({
      where: { id: target.id },
      data: { isActive: true },
    });
    const updatedList = existingCards.map((c) => (c.id === activated.id ? activated : c));
    return { cards: updatedList, activeCard: activated };
  }

  // User has 0 cards -> Seed first card from profile
  const profile = await prisma.profile.findUnique({
    where: { userId },
    include: { tags: true },
  });

  const userName = profile?.name || 'My Card';
  const designation = profile?.tagline || 'Professional';
  const bio = profile?.bio || '';
  const avatar = profile?.avatar || '/profile_avatar.png';
  const skills = profile?.tags?.map((t) => t.text) || [];

  const newCard = await prisma.card.create({
    data: {
      userId,
      name: userName,
      title: 'Personal Card',
      designation,
      tagline: profile?.tagline || "Let's connect!",
      bio,
      avatar,
      themeColor: '0xFF0052FF',
      skills,
      collectLeads: false,
      isDefault: true,
      isActive: true,
    },
  });

  return { cards: [newCard], activeCard: newCard };
}

/**
 * Atomically activates a card for the user and deactivates all others in a transaction.
 */
export async function setActiveCardAtomic(userId: number, cardId: string) {
  // Verify ownership
  const targetCard = await prisma.card.findFirst({
    where: { id: cardId, userId },
  });

  if (!targetCard) {
    throw new Error('CARD_NOT_FOUND_OR_FORBIDDEN');
  }

  const [_, activatedCard] = await prisma.$transaction([
    prisma.card.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    }),
    prisma.card.update({
      where: { id: cardId },
      data: { isActive: true },
    }),
  ]);

  return activatedCard;
}
