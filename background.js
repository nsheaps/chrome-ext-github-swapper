// Background service worker for GitHub Swapper extension
// Handles tab deduplication and omnibox functionality

// Configuration constants
const DEDUP_DELAY_MS = 500;

// Default settings
const DEFAULT_SETTINGS = {
  enableTabDedup: true,
  enableOmnibox: true,
  enableUserFilters: true,
  enableViewSwitching: true,
  shortcuts: [
    { keyword: 'issues', url: '/issues' },
    { keyword: 'prs', url: '/pulls' },
    { keyword: 'repos', url: '' }
  ]
};

// Initialize settings on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['settings'], (result) => {
    if (!result.settings) {
      chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
    }
  });
});

// Tab deduplication logic
async function deduplicateTabs() {
  const settings = await chrome.storage.sync.get(['settings']);
  if (!settings.settings?.enableTabDedup) return;

  const tabs = await chrome.tabs.query({});
  const tabGroups = new Map();

  tabs.forEach(tab => {
    if (!tab.url) return;

    const url = new URL(tab.url);
    const host = url.hostname;

    // Only process GitHub and github.dev URLs - strict domain validation
    // Matches: github.com, *.github.com, github.dev, *.github.dev
    const isGitHubCom = host === 'github.com' || (host.endsWith('.github.com') && !host.slice(0, -11).includes('.'));
    const isGitHubDev = host === 'github.dev' || (host.endsWith('.github.dev') && !host.slice(0, -11).includes('.'));
    
    if (!isGitHubCom && !isGitHubDev) return;

    let key;

    if (isGitHubDev) {
      // For github.dev: merge by branch/PR, ignore paths
      const pathParts = url.pathname.split('/').filter(p => p);
      if (pathParts.length >= 3) {
        // Format: /owner/repo/tree/branch or /owner/repo/pull/123
        const owner = pathParts[0];
        const repo = pathParts[1];
        const type = pathParts[2]; // 'tree' or 'pull'
        const identifier = pathParts[3]; // branch name or PR number
        key = `${host}:${owner}/${repo}:${type}:${identifier}`;
      }
    } else if (isGitHubCom) {
      // For GitHub PRs: merge by PR# & host
      const prMatch = url.pathname.match(/\/([^/]+\/[^/]+)\/pull\/(\d+)/);
      if (prMatch) {
        const repo = prMatch[1];
        const prNumber = prMatch[2];
        key = `${host}:${repo}:pr:${prNumber}`;
      }
    }

    if (key) {
      if (!tabGroups.has(key)) {
        tabGroups.set(key, []);
      }
      tabGroups.get(key).push(tab);
    }
  });

  // Close duplicate tabs (keep the first one)
  for (const [key, groupTabs] of tabGroups) {
    if (groupTabs.length > 1) {
      const tabsToClose = groupTabs.slice(1).map(t => t.id);
      if (tabsToClose.length > 0) {
        await chrome.tabs.remove(tabsToClose);
      }
    }
  }
}

// Run deduplication when tabs are created or updated
chrome.tabs.onCreated.addListener(() => {
  setTimeout(deduplicateTabs, DEDUP_DELAY_MS);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.url) {
    setTimeout(deduplicateTabs, DEDUP_DELAY_MS);
  }
});

// Omnibox functionality for quick navigation
chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  const settings = await chrome.storage.sync.get(['settings']);
  if (!settings.settings?.enableOmnibox) return;

  const shortcuts = settings.settings?.shortcuts || DEFAULT_SETTINGS.shortcuts;
  const suggestions = shortcuts
    .filter(s => s.keyword.includes(text.toLowerCase()))
    .map(s => ({
      content: s.url,
      description: `Navigate to ${s.keyword}: ${s.url}`
    }));

  suggest(suggestions);
});

chrome.omnibox.onInputEntered.addListener(async (text) => {
  const settings = await chrome.storage.sync.get(['settings']);
  const shortcuts = settings.settings?.shortcuts || DEFAULT_SETTINGS.shortcuts;

  let url = text;
  const shortcut = shortcuts.find(s => s.keyword === text.toLowerCase());
  
  if (shortcut) {
    url = shortcut.url;
  }

  // If URL doesn't start with http, assume it's a GitHub path
  if (!url.startsWith('http')) {
    url = `https://github.com${url}`;
  }

  const currentTab = await chrome.tabs.query({ active: true, currentWindow: true });
  if (currentTab[0]) {
    chrome.tabs.update(currentTab[0].id, { url });
  } else {
    chrome.tabs.create({ url });
  }
});
