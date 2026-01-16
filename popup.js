// Popup script
document.getElementById('openOptions').addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

// Load and display shortcuts
chrome.storage.sync.get(['settings'], (result) => {
  if (result.settings?.shortcuts) {
    const container = document.getElementById('shortcuts');
    container.innerHTML = '';
    
    result.settings.shortcuts.forEach(shortcut => {
      const div = document.createElement('div');
      div.className = 'shortcut';
      div.innerHTML = `
        <span class="shortcut-key">gh ${shortcut.keyword}</span>
        <span class="shortcut-desc">${shortcut.url || 'Home'}</span>
      `;
      container.appendChild(div);
    });
  }
});
