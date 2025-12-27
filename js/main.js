// ========================================
// Theme Toggle Functionality
// ========================================
(function() {
  const THEME_KEY = 'zde-blog-theme';

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }

  // Set theme immediately to avoid flash
  setTheme(getPreferredTheme());

  // Add theme toggle button after DOM loads
  document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    toggle.innerHTML = `
      <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
      <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    `;
    toggle.addEventListener('click', toggleTheme);
    document.body.appendChild(toggle);
  });
})();

// ========================================
// Reading Progress Bar
// ========================================
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    // Only show on post pages
    if (!document.querySelector('.post-content')) return;

    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress';
    progressContainer.innerHTML = '<div class="reading-progress-bar"></div>';
    document.body.insertBefore(progressContainer, document.body.firstChild);

    const progressBar = progressContainer.querySelector('.reading-progress-bar');

    function updateProgress() {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progressBar.style.width = scrolled + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  });
})();

// ========================================
// Table of Contents Generator
// ========================================
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const postContent = document.querySelector('.post-content');
    if (!postContent) return;

    const headings = postContent.querySelectorAll('h2, h3, h4');
    if (headings.length < 3) return; // Only show TOC if there are enough headings

    // Generate TOC
    const tocWrapper = document.createElement('div');
    tocWrapper.className = 'toc-wrapper';
    tocWrapper.innerHTML = '<div class="toc-title">Table of Contents</div><ul id="toc"></ul>';

    const toc = tocWrapper.querySelector('#toc');
    let currentLevel = 2;
    let currentList = toc;
    const listStack = [toc];

    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.substring(1));
      const id = heading.id || `heading-${index}`;
      if (!heading.id) heading.id = id;

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${id}`;
      a.textContent = heading.textContent;
      li.appendChild(a);

      // Handle nesting
      if (level > currentLevel) {
        const ul = document.createElement('ul');
        currentList.lastElementChild.appendChild(ul);
        listStack.push(ul);
        currentList = ul;
      } else if (level < currentLevel) {
        for (let i = currentLevel; i > level; i--) {
          listStack.pop();
        }
        currentList = listStack[listStack.length - 1];
      }

      currentList.appendChild(li);
      currentLevel = level;
    });

    // Insert TOC after first paragraph or heading
    const firstHeading = postContent.querySelector('h1, h2');
    const insertPoint = firstHeading ? firstHeading.nextElementSibling : postContent.firstChild;
    if (insertPoint) {
      insertPoint.parentNode.insertBefore(tocWrapper, insertPoint);
    } else {
      postContent.insertBefore(tocWrapper, postContent.firstChild);
    }

    // Smooth scroll for TOC links
    toc.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, null, `#${targetId}`);
        }
      }
    });
  });
})();

// ========================================
// Estimated Read Time
// ========================================
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const postContent = document.querySelector('.post-content');
    const postMeta = document.querySelector('.post-meta');

    if (!postContent || !postMeta) return;

    const text = postContent.textContent;
    const wordCount = text.trim().split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words/min

    const readTimeSpan = document.createElement('span');
    readTimeSpan.className = 'read-time';
    readTimeSpan.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0z"/>
        <path d="M7.5 3.5v4.5h4v1h-5V3.5h1z"/>
      </svg>
      ${readingTime} min read
    `;

    postMeta.appendChild(readTimeSpan);
  });
})();

// ========================================
// External Links - Open in New Tab
// ========================================
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="http"]');
    links.forEach(link => {
      if (!link.hostname.includes(window.location.hostname)) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  });
})();

// ========================================
// Copy Code Button
// ========================================
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const codeBlocks = document.querySelectorAll('pre code');

    codeBlocks.forEach(codeBlock => {
      const pre = codeBlock.parentElement;
      const button = document.createElement('button');
      button.className = 'copy-code-button';
      button.textContent = 'Copy';
      button.setAttribute('aria-label', 'Copy code to clipboard');

      button.addEventListener('click', async () => {
        const code = codeBlock.textContent;
        try {
          await navigator.clipboard.writeText(code);
          button.textContent = 'Copied!';
          setTimeout(() => {
            button.textContent = 'Copy';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
          button.textContent = 'Failed';
        }
      });

      pre.style.position = 'relative';
      pre.appendChild(button);
    });
  });
})();
