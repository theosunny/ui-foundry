import SwiftUI
@main struct FoundryDemo: App {
    @State private var draft = MeetingDraft()
    var body: some Scene { WindowGroup { NavigationStack { MeetingEditor(initialDraft: draft, onSave: { draft = $0 }) } } }
}
