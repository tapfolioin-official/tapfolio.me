import WidgetKit
import SwiftUI

// MARK: - Tapfolio Brand Constants
enum TapfolioTheme {
    static let primaryBlue = Color(red: 0.0, green: 82.0 / 255.0, blue: 1.0) // #0052FF
    static let accentPurple = Color(red: 99.0 / 255.0, green: 102.0 / 255.0, blue: 241.0 / 255.0)
    static let emeraldGreen = Color(red: 16.0 / 255.0, green: 185.0 / 255.0, blue: 129.0 / 255.0)
}

// MARK: - Main Widget Definition
struct TapfolioWidget: Widget {
    let kind: String = "TapfolioWidget"

    var body: some WidgetConfiguration {
        let config = StaticConfiguration(kind: kind, provider: Provider()) { entry in
            TapfolioWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Tapfolio")
        .description("Quick access to your digital business card, QR code, and profile analytics.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])

        if #available(iOSApplicationExtension 17.0, *) {
            return config.contentMarginsDisabled()
        } else {
            return config
        }
    }
}

// MARK: - Entry View Routing by Size
struct TapfolioWidgetEntryView: View {
    @Environment(\.widgetFamily) var family
    var entry: Provider.Entry

    var body: some View {
        Group {
            switch family {
            case .systemSmall:
                SmallWidgetView(entry: entry)
            case .systemMedium:
                MediumWidgetView(entry: entry)
            case .systemLarge:
                LargeWidgetView(entry: entry)
            default:
                SmallWidgetView(entry: entry)
            }
        }
        .widgetBackground()
    }
}

// MARK: - Small Widget (1x1)
struct SmallWidgetView: View {
    let entry: TapfolioEntry

    var body: some View {
        ZStack {
            if entry.data.isLoggedIn {
                VStack(alignment: .leading, spacing: 6) {
                    // Header Brand
                    HStack(spacing: 5) {
                        BrandBadge(size: 20)
                        Text("TAPFOLIO")
                            .font(.system(size: 11, weight: .black, design: .rounded))
                            .foregroundColor(TapfolioTheme.primaryBlue)
                        Spacer()
                    }

                    Spacer()

                    // User Info
                    HStack(spacing: 8) {
                        AvatarView(image: entry.avatarImage, initials: entry.data.initials, size: 36)
                        VStack(alignment: .leading, spacing: 1) {
                            Text(entry.data.name)
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(.primary)
                                .lineLimit(1)
                            Text(entry.data.title)
                                .font(.system(size: 10, weight: .medium))
                                .foregroundColor(.secondary)
                                .lineLimit(1)
                        }
                    }

                    Spacer()

                    // Footer Action CTA
                    HStack {
                        Text("Tap to View")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(TapfolioTheme.primaryBlue)
                        Image(systemName: "arrow.right")
                            .font(.system(size: 8, weight: .bold))
                            .foregroundColor(TapfolioTheme.primaryBlue)
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(TapfolioTheme.primaryBlue.opacity(0.12))
                    .clipShape(Capsule())
                }
                .padding(14)
                .widgetURL(URL(string: "tapfolio://profile"))
            } else {
                // Logged-out Small View
                VStack(spacing: 8) {
                    BrandBadge(size: 28)
                    Text("TAPFOLIO")
                        .font(.system(size: 12, weight: .black, design: .rounded))
                        .foregroundColor(TapfolioTheme.primaryBlue)

                    Text("Sign in to\nview profile")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)

                    Text("Open App")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(TapfolioTheme.primaryBlue)
                        .clipShape(Capsule())
                }
                .padding(12)
                .widgetURL(URL(string: "tapfolio://login"))
            }
        }
    }
}

// MARK: - Medium Widget (2x1)
struct MediumWidgetView: View {
    let entry: TapfolioEntry

    var body: some View {
        if entry.data.isLoggedIn {
            VStack(alignment: .leading, spacing: 8) {
                // Top Header Row
                HStack(spacing: 6) {
                    BrandBadge(size: 20)
                    Text("TAPFOLIO")
                        .font(.system(size: 12, weight: .black, design: .rounded))
                        .foregroundColor(TapfolioTheme.primaryBlue)

                    Spacer()

                    Link(destination: URL(string: "tapfolio://profile")!) {
                        HStack(spacing: 4) {
                            Text("View Profile")
                                .font(.system(size: 11, weight: .bold))
                            Image(systemName: "arrow.up.right")
                                .font(.system(size: 9, weight: .bold))
                        }
                        .foregroundColor(TapfolioTheme.primaryBlue)
                    }
                }

                // Profile Info Row
                HStack(spacing: 12) {
                    AvatarView(image: entry.avatarImage, initials: entry.data.initials, size: 44)

                    VStack(alignment: .leading, spacing: 2) {
                        Text(entry.data.name)
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.primary)
                            .lineLimit(1)

                        Text(entry.data.title)
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(.secondary)
                            .lineLimit(1)
                    }
                    Spacer()
                }

                Divider().opacity(0.5)

                // Interactive Stats Row with Deep Links
                HStack(spacing: 16) {
                    Link(destination: URL(string: "tapfolio://connections")!) {
                        HStack(spacing: 5) {
                            Image(systemName: "person.2.fill")
                                .font(.system(size: 11))
                                .foregroundColor(TapfolioTheme.primaryBlue)
                            Text("\(entry.data.formattedConnections) Connections")
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundColor(.primary)
                        }
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(UIColor.secondarySystemBackground))
                        .clipShape(RoundedRectangle(cornerRadius: 6))
                    }

                    Link(destination: URL(string: "tapfolio://analytics")!) {
                        HStack(spacing: 5) {
                            Image(systemName: "eye.fill")
                                .font(.system(size: 11))
                                .foregroundColor(TapfolioTheme.emeraldGreen)
                            Text("\(entry.data.formattedViews) Views")
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundColor(.primary)
                        }
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(UIColor.secondarySystemBackground))
                        .clipShape(RoundedRectangle(cornerRadius: 6))
                    }

                    Spacer()
                }
            }
            .padding(14)
        } else {
            // Logged-out Medium View
            HStack(spacing: 16) {
                VStack(alignment: .leading, spacing: 6) {
                    HStack(spacing: 6) {
                        BrandBadge(size: 22)
                        Text("TAPFOLIO")
                            .font(.system(size: 13, weight: .black, design: .rounded))
                            .foregroundColor(TapfolioTheme.primaryBlue)
                    }

                    Text("Your Professional Identity")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.primary)

                    Text("Sign in to sync your digital card & stats.")
                        .font(.system(size: 11))
                        .foregroundColor(.secondary)
                }

                Spacer()

                Link(destination: URL(string: "tapfolio://login")!) {
                    Text("Sign In")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(TapfolioTheme.primaryBlue)
                        .clipShape(Capsule())
                }
            }
            .padding(16)
        }
    }
}

// MARK: - Large Widget (2x2)
struct LargeWidgetView: View {
    let entry: TapfolioEntry

    var body: some View {
        if entry.data.isLoggedIn {
            VStack(alignment: .leading, spacing: 10) {
                // Header
                HStack {
                    BrandBadge(size: 22)
                    Text("TAPFOLIO")
                        .font(.system(size: 13, weight: .black, design: .rounded))
                        .foregroundColor(TapfolioTheme.primaryBlue)

                    Spacer()

                    Text("Digital Card")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(.secondary)
                }

                // Profile Card Header
                HStack(spacing: 12) {
                    ZStack(alignment: .bottomTrailing) {
                        AvatarView(image: entry.avatarImage, initials: entry.data.initials, size: 54)
                        Circle()
                            .fill(TapfolioTheme.emeraldGreen)
                            .frame(width: 12, height: 12)
                            .overlay(Circle().stroke(Color(UIColor.systemBackground), lineWidth: 2))
                    }

                    VStack(alignment: .leading, spacing: 3) {
                        Text(entry.data.name)
                            .font(.system(size: 17, weight: .bold))
                            .foregroundColor(.primary)
                            .lineLimit(1)

                        Text(entry.data.title)
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(.secondary)
                            .lineLimit(1)

                        if !entry.data.username.isEmpty {
                            Text("@\(entry.data.username)")
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundColor(TapfolioTheme.primaryBlue)
                        }
                    }
                    Spacer()
                }

                // 3-Column Stats Grid Card
                HStack(spacing: 8) {
                    StatPill(
                        icon: "person.2.fill",
                        iconColor: TapfolioTheme.primaryBlue,
                        value: entry.data.formattedConnections,
                        label: "Connections"
                    )

                    StatPill(
                        icon: "eye.fill",
                        iconColor: TapfolioTheme.emeraldGreen,
                        value: entry.data.formattedViews,
                        label: "Views"
                    )

                    StatPill(
                        icon: "diamond.fill",
                        iconColor: TapfolioTheme.accentPurple,
                        value: entry.data.diamonds,
                        label: "Diamonds"
                    )
                }

                Spacer()

                // Action Buttons Grid
                VStack(spacing: 6) {
                    HStack(spacing: 8) {
                        Link(destination: URL(string: "tapfolio://profile")!) {
                            ActionButton(title: "View Profile", icon: "person.crop.circle", isPrimary: true)
                        }

                        Link(destination: URL(string: "tapfolio://qr")!) {
                            ActionButton(title: "Share QR", icon: "qrcode", isPrimary: false)
                        }
                    }

                    HStack(spacing: 8) {
                        Link(destination: URL(string: "tapfolio://connections")!) {
                            ActionButton(title: "Connections", icon: "person.2", isPrimary: false)
                        }

                        Link(destination: URL(string: "tapfolio://analytics")!) {
                            ActionButton(title: "Analytics", icon: "chart.bar.xaxis", isPrimary: false)
                        }
                    }
                }
            }
            .padding(16)
        } else {
            // Logged-out Large View
            VStack(spacing: 14) {
                BrandBadge(size: 38)
                Text("TAPFOLIO")
                    .font(.system(size: 18, weight: .black, design: .rounded))
                    .foregroundColor(TapfolioTheme.primaryBlue)

                Text("Your Smart Identity Card")
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.primary)

                Text("Sign in to Tapfolio to view your profile shortcut, live connection count, and view analytics directly on your home screen.")
                    .font(.system(size: 12))
                    .foregroundColor(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 10)

                Spacer()

                Link(destination: URL(string: "tapfolio://login")!) {
                    HStack {
                        Image(systemName: "lock.open.fill")
                        Text("Sign In to Tapfolio")
                    }
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(TapfolioTheme.primaryBlue)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                }
            }
            .padding(20)
        }
    }
}

// MARK: - Reusable UI Components
struct BrandBadge: View {
    let size: CGFloat

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: size * 0.28)
                .fill(TapfolioTheme.primaryBlue)
                .frame(width: size, height: size)
            Text("T")
                .font(.system(size: size * 0.65, weight: .black, design: .rounded))
                .foregroundColor(.white)
        }
    }
}

struct AvatarView: View {
    let image: UIImage?
    let initials: String
    let size: CGFloat

    var body: some View {
        ZStack {
            if let uiImage = image {
                Image(uiImage: uiImage)
                    .resizable()
                    .scaledToFill()
                    .frame(width: size, height: size)
                    .clipShape(Circle())
            } else {
                Circle()
                    .fill(LinearGradient(
                        colors: [TapfolioTheme.primaryBlue, TapfolioTheme.accentPurple],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ))
                    .frame(width: size, height: size)
                Text(initials)
                    .font(.system(size: size * 0.4, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
            }
        }
        .overlay(Circle().stroke(Color.primary.opacity(0.1), lineWidth: 1.5))
    }
}

struct StatPill: View {
    let icon: String
    let iconColor: Color
    let value: String
    let label: String

    var body: some View {
        VStack(alignment: .leading, spacing: 3) {
            HStack(spacing: 4) {
                Image(systemName: icon)
                    .font(.system(size: 10))
                    .foregroundColor(iconColor)
                Text(value)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.primary)
            }
            Text(label)
                .font(.system(size: 9, weight: .medium))
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(.horizontal, 8)
        .padding(.vertical, 6)
        .background(Color(UIColor.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }
}

struct ActionButton: View {
    let title: String
    let icon: String
    let isPrimary: Bool

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: icon)
                .font(.system(size: 10, weight: .bold))
            Text(title)
                .font(.system(size: 11, weight: .bold))
        }
        .foregroundColor(isPrimary ? .white : TapfolioTheme.primaryBlue)
        .frame(maxWidth: .infinity)
        .padding(.vertical, 7)
        .background(isPrimary ? TapfolioTheme.primaryBlue : TapfolioTheme.primaryBlue.opacity(0.12))
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }
}

// MARK: - Dynamic Widget Background Modifier
extension View {
    func widgetBackground() -> some View {
        if #available(iOS 17.0, *) {
            return containerBackground(for: .widget) {
                Color(UIColor.systemBackground)
            }
        } else {
            return background(Color(UIColor.systemBackground))
        }
    }
}
