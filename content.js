// Content script for GitHub page enhancements
// Adds user filter buttons and view-switching buttons

// Configuration constants
const OBSERVER_TIMEOUT_MS = 10000;

(async function() {
  const settings = await chrome.storage.sync.get(['settings']);
  const config = settings.settings || {};

  // Detect page type
  const url = window.location.href;
  const isIssuePage = url.includes('/issues');
  const isPRPage = url.includes('/pull/');
  const isPRsListPage = url.includes('/pulls');
  const isGitHubDev = url.includes('github.dev');

  // Add user filter buttons on issues/PRs
  if (config.enableUserFilters !== false && (isIssuePage || isPRsListPage || isPRPage)) {
    addUserFilterButtons();
  }

  // Add view-switching buttons on PRs & github.dev
  if (config.enableViewSwitching !== false && (isPRPage || isGitHubDev)) {
    addViewSwitchingButtons();
  }

  function addUserFilterButtons() {
    // Wait for the page to load
    const observer = new MutationObserver(() => {
      const existingFilter = document.querySelector('.github-swapper-user-filter');
      if (existingFilter) return;

      let targetElement;
      
      // Try to find the subnav or filter area
      targetElement = document.querySelector('.subnav') || 
                     document.querySelector('.table-list-header-toggle') ||
                     document.querySelector('.Box-header');

      if (targetElement) {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'github-swapper-user-filter';

        // Get current user
        const userLink = document.querySelector('meta[name="user-login"]');
        const currentUser = userLink ? userLink.getAttribute('content') : null;

        const buttons = [
          { label: 'My Items', filter: currentUser ? `author:${currentUser}` : '' },
          { label: 'Assigned to Me', filter: currentUser ? `assignee:${currentUser}` : '' },
          { label: 'Mentions Me', filter: currentUser ? `mentions:${currentUser}` : '' }
        ];

        buttons.forEach(btn => {
          if (!btn.filter) return;
          
          const button = document.createElement('button');
          button.className = 'btn btn-sm github-swapper-filter-btn';
          button.textContent = btn.label;
          
          button.addEventListener('click', () => {
            const currentUrl = new URL(window.location.href);
            const searchParams = new URLSearchParams(currentUrl.search);
            
            const currentQ = searchParams.get('q') || '';
            const filterPrefixes = ['author:', 'assignee:', 'mentions:'];
            const filters = currentQ.split(' ').filter(f => 
              !filterPrefixes.some(prefix => f.startsWith(prefix))
            );
            filters.push(btn.filter);
            
            searchParams.set('q', filters.join(' '));
            window.location.href = `${currentUrl.pathname}?${searchParams.toString()}`;
          });
          
          filterContainer.appendChild(button);
        });

        targetElement.appendChild(filterContainer);
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), OBSERVER_TIMEOUT_MS);
  }

  function addViewSwitchingButtons() {
    const observer = new MutationObserver(() => {
      const existingSwitch = document.querySelector('.github-swapper-view-switch');
      if (existingSwitch) return;

      let targetElement = document.querySelector('.gh-header-actions') || 
                         document.querySelector('.gh-header-meta') ||
                         document.querySelector('.tabnav-tabs');

      if (targetElement) {
        const switchContainer = document.createElement('div');
        switchContainer.className = 'github-swapper-view-switch';

        const currentUrl = window.location.href;
        const prMatch = currentUrl.match(/\/pull\/(\d+)/);

        let views = [];
        
        if (isPRPage && prMatch) {
          const basePath = currentUrl.split('/pull/')[0];
          const prNum = prMatch[1];
          views = [
            { label: 'Conversation', path: `/pull/${prNum}` },
            { label: 'Commits', path: `/pull/${prNum}/commits` },
            { label: 'Files', path: `/pull/${prNum}/files` },
            { label: 'Checks', path: `/pull/${prNum}/checks` }
          ];
        } else if (isGitHubDev) {
          // Convert github.dev URL to github.com
          const url = new URL(window.location.href);
          let githubHost = url.hostname;
          
          // Handle both github.dev and subdomains like vscode.github.dev
          if (githubHost === 'github.dev') {
            githubHost = 'github.com';
          } else if (githubHost.endsWith('.github.dev')) {
            githubHost = githubHost.slice(0, -11) + '.github.com';
          }
          
          const githubUrl = `${url.protocol}//${githubHost}${url.pathname}${url.search}${url.hash}`;
          
          views = [
            { label: 'Editor', path: window.location.pathname },
            { label: 'GitHub', path: githubUrl }
          ];
        }

        views.forEach(view => {
          const button = document.createElement('a');
          button.className = 'btn btn-sm github-swapper-view-btn';
          button.textContent = view.label;
          
          if (isPRPage) {
            const basePath = currentUrl.split('/pull/')[0];
            button.href = basePath + view.path;
          } else {
            button.href = view.path;
          }
          
          // Highlight active view
          if (currentUrl.includes(view.path) || (view.label === 'Conversation' && currentUrl.match(/\/pull\/\d+$/))) {
            button.style.backgroundColor = '#0969da';
            button.style.color = 'white';
          }
          
          switchContainer.appendChild(button);
        });

        targetElement.appendChild(switchContainer);
        observer.disconnect();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), OBSERVER_TIMEOUT_MS);
  }
})();
