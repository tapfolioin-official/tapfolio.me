import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    typealias Entry = TapfolioEntry

    func placeholder(in context: Context) -> TapfolioEntry {
        .placeholder
    }

    func getSnapshot(in context: Context, completion: @escaping (TapfolioEntry) -> Void) {
        if context.isPreview {
            completion(.placeholder)
        } else {
            let entry = AppGroupStorage.loadEntry()
            completion(entry)
        }
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<TapfolioEntry>) -> Void) {
        // Load offline cached presentation data directly from App Group storage
        // Note: Zero network requests are performed in getTimeline to ensure fast, reliable rendering
        let currentEntry = AppGroupStorage.loadEntry()

        // Refresh policy: Request reload periodically as fallback; Flutter explicitly triggers updates via WidgetCenter
        let nextUpdate = Calendar.current.date(byAdding: .minute, value: 60, to: Date()) ?? Date().addingTimeInterval(3600)
        let timeline = Timeline(entries: [currentEntry], policy: .after(nextUpdate))

        completion(timeline)
    }
}
