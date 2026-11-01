---
"@jocoding-ax-partners/react": minor
---

Add `AdminShell`, the shared admin frame (60px GNB + 244px sidebar + canvas main, with a mobile drawer that reuses the same nav), and `PageHeader` `density="compact"` matching admin.axhub.ai (56px row, 24px title, 14px description). Every admin surface now renders this one frame instead of assembling TopBar/Sidebar/canvas itself.
