// Popup script

// Constants
const REPOS_KEYWORD = 'repos';

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
      const description = shortcut.url || (shortcut.keyword === REPOS_KEYWORD ? 'GitHub Home' : 'Navigate');
      div.innerHTML = `
        <span class="shortcut-key">gh ${shortcut.keyword}</span>
        <span class="shortcut-desc">${description}</span>
      `;
      container.appendChild(div);
    });
  }
});
