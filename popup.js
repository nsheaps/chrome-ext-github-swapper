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

    result.settings.shortcuts.forEach((shortcut) => {
      const div = document.createElement('div');
      div.className = 'shortcut';

      const keySpan = document.createElement('span');
      keySpan.className = 'shortcut-key';
      keySpan.textContent = `gh ${shortcut.keyword}`;

      const descSpan = document.createElement('span');
      descSpan.className = 'shortcut-desc';
      const description =
        shortcut.url || (shortcut.keyword === REPOS_KEYWORD ? 'GitHub Home' : 'Navigate');
      descSpan.textContent = description;

      div.appendChild(keySpan);
      div.appendChild(descSpan);
      container.appendChild(div);
    });
  }
});
