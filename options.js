// Options page script

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

// Load settings
function loadSettings() {
  chrome.storage.sync.get(['settings'], (result) => {
    const settings = result.settings || DEFAULT_SETTINGS;
    
    document.getElementById('enableTabDedup').checked = settings.enableTabDedup !== false;
    document.getElementById('enableOmnibox').checked = settings.enableOmnibox !== false;
    document.getElementById('enableUserFilters').checked = settings.enableUserFilters !== false;
    document.getElementById('enableViewSwitching').checked = settings.enableViewSwitching !== false;
    
    renderShortcuts(settings.shortcuts || DEFAULT_SETTINGS.shortcuts);
  });
}

// Render shortcuts
function renderShortcuts(shortcuts) {
  const container = document.getElementById('shortcuts-container');
  container.innerHTML = '';
  
  shortcuts.forEach((shortcut, index) => {
    const item = document.createElement('div');
    item.className = 'shortcut-item';
    
    const keywordInput = document.createElement('input');
    keywordInput.type = 'text';
    keywordInput.value = shortcut.keyword;
    keywordInput.placeholder = 'Keyword';
    keywordInput.dataset.index = index;
    keywordInput.dataset.field = 'keyword';
    
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.value = shortcut.url;
    urlInput.placeholder = 'GitHub path (e.g., /issues)';
    urlInput.dataset.index = index;
    urlInput.dataset.field = 'url';
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn remove-shortcut-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.dataset.index = index;
    
    item.appendChild(keywordInput);
    item.appendChild(urlInput);
    item.appendChild(removeBtn);
    container.appendChild(item);
  });
}

// Add shortcut
document.getElementById('addShortcut').addEventListener('click', () => {
  chrome.storage.sync.get(['settings'], (result) => {
    const settings = result.settings || DEFAULT_SETTINGS;
    settings.shortcuts.push({ keyword: '', url: '' });
    renderShortcuts(settings.shortcuts);
  });
});

// Remove shortcut using event delegation
function removeShortcut(index) {
  chrome.storage.sync.get(['settings'], (result) => {
    const settings = result.settings || DEFAULT_SETTINGS;
    settings.shortcuts.splice(index, 1);
    renderShortcuts(settings.shortcuts);
  });
}

// Handle remove button clicks via event delegation
document.getElementById('shortcuts-container').addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-shortcut-btn')) {
    const index = parseInt(e.target.dataset.index, 10);
    removeShortcut(index);
  }
});

// Save settings
document.getElementById('saveSettings').addEventListener('click', () => {
  const shortcuts = [];
  document.querySelectorAll('.shortcut-item').forEach(item => {
    const keywordInput = item.querySelector('[data-field="keyword"]');
    const urlInput = item.querySelector('[data-field="url"]');
    if (keywordInput.value.trim()) {
      shortcuts.push({
        keyword: keywordInput.value.trim(),
        url: urlInput.value.trim()
      });
    }
  });

  const settings = {
    enableTabDedup: document.getElementById('enableTabDedup').checked,
    enableOmnibox: document.getElementById('enableOmnibox').checked,
    enableUserFilters: document.getElementById('enableUserFilters').checked,
    enableViewSwitching: document.getElementById('enableViewSwitching').checked,
    shortcuts: shortcuts
  };

  chrome.storage.sync.set({ settings }, () => {
    showMessage('Settings saved successfully!');
  });
});

// Reset settings
document.getElementById('resetSettings').addEventListener('click', () => {
  if (confirm('Are you sure you want to reset all settings to defaults?')) {
    chrome.storage.sync.set({ settings: DEFAULT_SETTINGS }, () => {
      loadSettings();
      showMessage('Settings reset to defaults!');
    });
  }
});

// Show message
function showMessage(text) {
  const message = document.getElementById('message');
  message.textContent = text;
  message.className = 'message success';
  message.style.display = 'block';
  
  setTimeout(() => {
    message.style.display = 'none';
  }, 3000);
}

// Initialize
loadSettings();
