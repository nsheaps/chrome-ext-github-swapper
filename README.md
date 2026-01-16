# GitHub Swapper

A Chrome extension that enhances GitHub navigation with configurable shortcuts, user filters, view switching, and intelligent tab deduplication.

## Features

### 🔗 Configurable Shortcuts
- Type `gh` in your address bar followed by a keyword to quickly navigate
- Customize shortcuts in the settings page
- Default shortcuts: `gh issues`, `gh prs`, `gh repos`

### 👤 User Filter Buttons
- Quick filter buttons on issues and pull request pages
- Filter by: "My Items", "Assigned to Me", "Mentions Me"
- Automatically uses your GitHub username

### 🔄 View Switching Buttons
- Fast navigation between PR views: Conversation, Commits, Files, Checks
- Quick switching between github.dev and github.com
- Highlighted active view

### 🗂️ Tab Deduplication
- Automatically merges duplicate PR tabs (same PR# and host)
- Merges github.dev tabs by branch/PR (ignoring file paths)
- Keeps your tabs organized and clutter-free

### ⚙️ Fully Configurable
- Enable/disable any feature independently
- Customize omnibox shortcuts
- All settings accessible via the options page

## Installation

### From Source
1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the extension directory

### From Chrome Web Store
Coming soon!

## Usage

### Omnibox Shortcuts
1. Type `gh` in the address bar and press Space or Tab
2. Type a keyword (e.g., `issues`, `prs`, `repos`)
3. Press Enter to navigate

### User Filters
- Visit any GitHub issues or pull requests page
- Look for the filter buttons in the page header
- Click to quickly filter by author, assignee, or mentions

### View Switching
- Open any GitHub pull request
- Look for view switching buttons near the page header
- Click to navigate between Conversation, Commits, Files, and Checks

### Tab Deduplication
- Works automatically in the background
- Opens multiple tabs of the same PR? The extension will merge them
- Customizable in settings (can be disabled)

## Configuration

Click the extension icon and select "Settings & Options" to:
- Enable/disable individual features
- Add custom omnibox shortcuts
- Reset to default settings

## Privacy

This extension:
- Only runs on github.com and github.dev domains
- Stores settings locally using Chrome's sync storage
- Does not collect or transmit any personal data
- Does not make external network requests

## License

This software is proprietary. See LICENSE-PRIVATE for details.

## Support

For issues, feature requests, or questions, please open an issue on GitHub.