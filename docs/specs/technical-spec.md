# GitHub Swapper - Technical Specification

## Architecture

### Components

#### 1. Background Service Worker (`background.js`)

- **Purpose:** Tab deduplication and omnibox handling
- **Lifecycle:** Event-driven, terminates when idle
- **Permissions:** `tabs`, `storage`

**Responsibilities:**

- Monitor tab creation and updates
- Implement deduplication logic
- Handle omnibox input and navigation
- Manage default settings

**Tab Deduplication Algorithm:**

```
For each tab:
  1. Parse URL to extract key information
  2. For github.com PRs: key = host:repo:pr:number
  3. For github.dev: key = host:owner/repo:type:identifier
  4. Group tabs by key
  5. For each group with >1 tab:
     - Keep first tab (oldest)
     - Close remaining tabs
```

#### 2. Content Script (`content.js`)

- **Purpose:** GitHub page enhancements
- **Injection:** `document_end` on github.com and github.dev
- **Permissions:** None (runs in page context)

**Responsibilities:**

- Detect page type (issues, PRs, github.dev)
- Inject user filter buttons
- Inject view switching buttons
- Apply custom styles

**Page Detection:**

```javascript
isIssuePage = url.includes('/issues');
isPRPage = url.includes('/pull/');
isPRsListPage = url.includes('/pulls');
isGitHubDev = url.includes('github.dev');
```

#### 3. Popup (`popup.html` + `popup.js`)

- **Purpose:** Quick reference for shortcuts
- **Interaction:** Read-only display of current shortcuts
- **Link:** Opens options page

#### 4. Options Page (`options.html` + `options.js`)

- **Purpose:** Full configuration interface
- **Storage:** Chrome sync storage
- **Features:**
  - Feature toggles (checkboxes)
  - Shortcut management (add/remove/edit)
  - Reset to defaults

### Data Flow

```
User Action → Content Script → Chrome Storage ← Background Worker
                     ↓                              ↓
              Page Modification              Tab Management
```

### Storage Schema

```javascript
{
  settings: {
    enableTabDedup: boolean,
    enableOmnibox: boolean,
    enableUserFilters: boolean,
    enableViewSwitching: boolean,
    shortcuts: [
      { keyword: string, url: string }
    ]
  }
}
```

### Security Considerations

#### XSS Prevention

- Never use `innerHTML` with user data
- Use `createElement()` and `textContent` for DOM manipulation
- Sanitize all inputs from storage

#### URL Validation

- Strict domain matching for GitHub domains
- Prevent malicious domains (e.g., `evil-github.com`)
- Use `hostname.endsWith()` with subdomain validation

```javascript
isGitHubCom =
  host === 'github.com' || (host.endsWith('.github.com') && !host.slice(0, -11).includes('.'));
```

## Build Process

### Development

```bash
npm install      # Install dependencies
npm run check    # Lint and format check
npm run format   # Auto-fix issues
npm test         # Run tests
npm run build    # Build to dist/
```

### Testing Locally

1. Build extension: `npm run build`
2. Open `chrome://extensions/`
3. Enable Developer mode
4. Click "Load unpacked"
5. Select `dist/` directory

### Release

```bash
npm run validate  # check + test + build
npm run package   # Create .zip for Chrome Web Store
```

## File Structure

```
.
├── .github/
│   ├── copilot-instructions.md
│   └── workflows/
│       ├── ci-build.yml
│       ├── ci-check.yml
│       ├── ci-test.yml
│       └── cd-release.yml
├── bin/                    # Executable scripts
├── docs/
│   ├── PRD.md
│   ├── specs/
│   └── research/
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── rc.d/                   # direnv scripts
│   ├── 00-mise.sh
│   ├── 10-path.sh
│   └── 20-npm-install.sh
├── scripts/
│   ├── build.js
│   ├── package.js
│   └── release.js
├── background.js           # Service worker
├── content.js              # Content script
├── popup.html/js           # Extension popup
├── options.html/js         # Settings page
├── styles.css              # Content styles
├── manifest.json           # Extension config
├── .envrc                  # direnv config
├── .mise.toml              # Tool versions
├── package.json            # Dependencies
├── eslint.config.js        # Linting config
└── .prettierrc.json        # Formatting config
```

## API Usage

### Chrome Extensions API

#### Manifest V3

```json
{
  "manifest_version": 3,
  "permissions": ["tabs", "storage", "scripting"],
  "host_permissions": ["https://github.com/*", "https://github.dev/*"]
}
```

#### Storage API

```javascript
// Save
chrome.storage.sync.set({ settings: {...} })

// Load
chrome.storage.sync.get(['settings'], (result) => {
  const settings = result.settings || DEFAULT_SETTINGS
})
```

#### Tabs API

```javascript
// Query tabs
const tabs = await chrome.tabs.query({});

// Close tabs
await chrome.tabs.remove([id1, id2]);

// Update tab URL
await chrome.tabs.update(tabId, { url });
```

#### Omnibox API

```javascript
// Listen for input
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  suggest([{ content: url, description: text }]);
});

// Handle enter
chrome.omnibox.onInputEntered.addListener((text) => {
  // Navigate to URL
});
```

## Performance Optimization

### Content Script

- Use `MutationObserver` with timeout
- Disconnect observers after 10 seconds
- Check for existing elements before injection

### Background Worker

- Debounce tab deduplication (500ms delay)
- Only process GitHub URLs
- Minimize storage reads/writes

### Bundle Size

- No external libraries in content script
- Minimal dependencies
- Icon optimization

## Browser Compatibility

### Minimum Requirements

- Chrome 88+ (Manifest V3 support)
- Storage sync API
- ES2022 JavaScript features

### Future Support

- Firefox (Manifest V3 when stable)
- Edge (Chromium-based, should work)
- Safari (requires conversion)

## Error Handling

### Tab Deduplication

- Gracefully handle invalid URLs
- Continue on individual tab errors
- Log errors only in dev mode

### Content Script

- Handle missing DOM elements
- Timeout protection on observers
- Fail silently if features can't inject

### Storage

- Always provide defaults
- Validate stored data structure
- Migrate old data formats

## Testing Strategy

### Manual Testing

- [ ] Omnibox shortcuts work
- [ ] User filter buttons appear and function
- [ ] View switching buttons appear and function
- [ ] Tab deduplication merges correctly
- [ ] Settings save and persist
- [ ] All features can be disabled

### Automated Testing

- Unit tests for URL parsing
- Integration tests for storage
- E2E tests for user workflows

### Performance Testing

- Measure content script injection time
- Monitor background worker memory
- Check storage usage

## Deployment

### Chrome Web Store

1. Create developer account ($5 one-time fee)
2. Prepare store listing:
   - Screenshots (1280x800 or 640x400)
   - Promotional images (440x280)
   - Description and features
3. Upload `.zip` file from `build/`
4. Submit for review (typically 1-3 days)

### Updates

- Increment version in `manifest.json`
- Create git tag: `git tag v1.0.1`
- Push tag: `git push --tags`
- CD workflow publishes automatically
