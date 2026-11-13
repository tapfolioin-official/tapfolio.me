import WidgetKit
import SwiftUI

// MARK: - Presentation-Safe Profile Model
struct TapfolioProfileData: Codable {
    var name: String
    var title: String
    var username: String
    var avatarFileName: String?
    var connections: Int
    var views: Int
    var diamonds: String
    var profileUrl: String
    var isLoggedIn: Bool
    var lastUpdated: String

    var formattedViews: String {
        if views >= 1_000_000 {
            let val = Double(views) / 1_000_000.0
            return String(format: "%.1fM", val)
        } else if views >= 1_000 {
            let val = Double(views) / 1_000.0
            return String(format: "%.1fK", val)
        }
        return "\(views)"
    }

    var formattedConnections: String {
        if connections >= 1_000 {
            let val = Double(connections) / 1_000.0
            return String(format: "%.1fK", val)
        }
        return "\(connections)"
    }

    var initials: String {
        let parts = name.trimmingCharacters(in: .whitespacesAndNewlines).split(separator: " ")
        if parts.count >= 2 {
            let first = parts[0].prefix(1)
            let second = parts[1].prefix(1)
            return "\(first)\(second)".uppercased()
        } else if let first = parts.first {
            return String(first.prefix(2)).uppercased()
        }
        return "TF"
    }

    static var placeholder: TapfolioProfileData {
        TapfolioProfileData(
            name: "Mohammed Nibrasul Haqq",
            title: "Full-Stack Developer",
            username: "nibras",
            avatarFileName: "profile.jpg",
            connections: 124,
            views: 1240,
            diamonds: "50",
            profileUrl: "https://tapfolio.me/portfolio/nibras",
            isLoggedIn: true,
            lastUpdated: ISO8601DateFormatter().string(from: Date())
        )
    }

    static var loggedOut: TapfolioProfileData {
        TapfolioProfileData(
            name: "Tapfolio Member",
            title: "Your Professional Identity",
            username: "",
            avatarFileName: nil,
            connections: 0,
            views: 0,
            diamonds: "0",
            profileUrl: "https://tapfolio.me",
            isLoggedIn: false,
            lastUpdated: ISO8601DateFormatter().string(from: Date())
        )
    }
}

// MARK: - Timeline Entry
struct TapfolioEntry: TimelineEntry {
    let date: Date
    let data: TapfolioProfileData
    let avatarImage: UIImage?

    static var placeholder: TapfolioEntry {
        TapfolioEntry(
            date: Date(),
            data: .placeholder,
            avatarImage: nil
        )
    }

    static var loggedOut: TapfolioEntry {
        TapfolioEntry(
            date: Date(),
            data: .loggedOut,
            avatarImage: nil
        )
    }
}

// MARK: - App Group Storage Loader
enum AppGroupStorage {
    static let appGroupId = "group.me.tapfolio.app"

    static func loadEntry() -> TapfolioEntry {
        guard let userDefaults = UserDefaults(suiteName: appGroupId) else {
            return .loggedOut
        }

        var profileData: TapfolioProfileData?

        // 1. Try decoding full JSON payload
        if let jsonString = userDefaults.string(forKey: "profile_json"),
           let jsonData = jsonString.data(using: .utf8) {
            do {
                profileData = try JSONDecoder().decode(TapfolioProfileData.self, from: jsonData)
            } catch {
                // Fallback to individual keys
            }
        }

        // 2. Fallback to individual key-values
        if profileData == nil {
            let isLoggedIn = userDefaults.bool(forKey: "isLoggedIn")
            let name = userDefaults.string(forKey: "name") ?? (isLoggedIn ? "Tapfolio User" : "Tapfolio Member")
            let title = userDefaults.string(forKey: "title") ?? "Professional"
            let username = userDefaults.string(forKey: "username") ?? ""
            let connections = userDefaults.integer(forKey: "connections")
            let views = userDefaults.integer(forKey: "views")
            let diamonds = userDefaults.string(forKey: "diamonds") ?? "0"
            let profileUrl = userDefaults.string(forKey: "profileUrl") ?? "https://tapfolio.me"
            let lastUpdated = userDefaults.string(forKey: "lastUpdated") ?? ""

            profileData = TapfolioProfileData(
                name: name,
                title: title,
                username: username,
                avatarFileName: "profile.jpg",
                connections: connections,
                views: views,
                diamonds: diamonds,
                profileUrl: profileUrl,
                isLoggedIn: isLoggedIn,
                lastUpdated: lastUpdated
            )
        }

        let resolvedData = profileData ?? .loggedOut

        // 3. Load avatar image if user is logged in
        var loadedImage: UIImage? = nil
        if resolvedData.isLoggedIn {
            // First: Check shared App Group container file
            if let containerUrl = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: appGroupId) {
                let imageFileUrl = containerUrl.appendingPathComponent("Widget/profile.jpg")
                if let data = try? Data(contentsOf: imageFileUrl), let img = UIImage(data: data) {
                    loadedImage = img
                } else {
                    let rootImageUrl = containerUrl.appendingPathComponent("profile.jpg")
                    if let data = try? Data(contentsOf: rootImageUrl), let img = UIImage(data: data) {
                        loadedImage = img
                    }
                }
            }

            // Second: Check base64 cached thumbnail in UserDefaults
            if loadedImage == nil,
               let base64 = userDefaults.string(forKey: "avatar_base64"),
               !base64.isEmpty,
               let data = Data(base64Encoded: base64),
               let img = UIImage(data: data) {
                loadedImage = img
            }
        }

        return TapfolioEntry(
            date: Date(),
            data: resolvedData,
            avatarImage: loadedImage
        )
    }
}
