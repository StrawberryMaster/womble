document.addEventListener('DOMContentLoaded', () => {
    const THEME_STORAGE_KEY = 'womble-theme';
    const HIGHLIGHT_CLASS = 'womble-highlight';
    const VALID_THEMES = new Set(['classic', 'dark', 'metro', 'plain', 'scaruffi']);

    const tocLinkMap = new Map();
    let headingCache = [];
    let searchTimeout = null;
    let currentModalRawCode = '';
    let lastFocusedBeforeModal = null;

    // -------------------------------------------------------------------------
    // themes
    // -------------------------------------------------------------------------
    function applyTheme(themeName) {
        const theme = VALID_THEMES.has(themeName) ? themeName : 'classic';

        document.body.classList.toggle('theme-dark', theme === 'dark');
        document.body.classList.toggle('theme-metro', theme === 'metro');
        document.body.classList.toggle('theme-plain', theme === 'plain');
        document.body.classList.toggle('theme-scaruffi', theme === 'scaruffi');

        document.querySelectorAll('.theme-button').forEach((button) => {
            const isActive = button.dataset.theme === theme;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        try {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch (error) {
            console.warn('Theme preference could not be saved.', error);
        }

        requestAnimationFrame(updateHeadingCache);
    }

    function initializeThemes() {
        document.querySelector('.theme-list').addEventListener('click', (e) => {
            const btn = e.target.closest('.theme-button');
            if (btn) applyTheme(btn.dataset.theme);
        });

        let savedTheme = 'classic';
        try {
            savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'classic';
        } catch (error) {
            console.warn('Theme preference could not be loaded.', error);
        }

        applyTheme(savedTheme);
    }

    // -------------------------------------------------------------------------
    // markdown, headings & table of contents
    // -------------------------------------------------------------------------
    function slugifyHeading(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');
    }

    function addHeadingIds() {
        const contentDiv = document.getElementById('content');
        const headings = contentDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const usedIds = new Set();

        headings.forEach((heading) => {
            let baseId = heading.id || slugifyHeading(heading.textContent) || 'section';
            let uniqueId = baseId;
            let counter = 2;

            while (usedIds.has(uniqueId)) {
                uniqueId = `${baseId}-${counter}`;
                counter += 1;
            }

            heading.id = uniqueId;
            usedIds.add(uniqueId);
        });
    }

    function generateTableOfContents() {
        const contentDiv = document.getElementById('content');
        const headings = Array.from(contentDiv.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const tocList = document.getElementById('toc-list');
        const fragment = document.createDocumentFragment();

        tocLinkMap.clear();

        const headingsToInclude = headings.filter((heading, index) => {
            return !(index === 0 && heading.tagName === 'H1');
        });

        headingsToInclude.forEach((heading) => {
            const level = parseInt(heading.tagName[1], 10);
            const li = document.createElement('li');
            li.dataset.tocItem = 'true';
            li.style.marginLeft = `${Math.max(0, (level - 1) * 12)}px`;

            const a = document.createElement('a');
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent;

            tocLinkMap.set(heading.id, a);
            li.appendChild(a);
            fragment.appendChild(li);
        });

        const emptyLi = document.createElement('li');
        emptyLi.id = 'toc-empty';
        emptyLi.className = 'toc-empty';
        emptyLi.textContent = 'No matching headings';
        emptyLi.style.display = 'none';
        fragment.appendChild(emptyLi);

        tocList.innerHTML = '';
        tocList.appendChild(fragment);
    }

    function updateHeadingCache() {
        const headings = Array.from(
            document.querySelectorAll('#content h1, #content h2, #content h3, #content h4, #content h5, #content h6')
        ).filter((heading, index) => !(index === 0 && heading.tagName === 'H1'));

        const scrollY = window.scrollY;
        headingCache = headings.map((heading) => ({
            element: heading,
            offsetTop: heading.getBoundingClientRect().top + scrollY,
            link: tocLinkMap.get(heading.id) || null
        }));
    }

    function wrapTablesResponsively(root) {
        root.querySelectorAll('table').forEach((table) => {
            if (!table.parentElement.classList.contains('table-container')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-container';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
    }

    function scrollToHashSection() {
        const hash = window.location.hash;
        if (!hash) return;

        const targetHeading = document.getElementById(hash.slice(1));
        if (targetHeading) {
            targetHeading.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
    }

    async function loadReadme() {
        try {
            const response = await fetch('./README.md');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const markdown = await response.text();

            marked.setOptions({
                breaks: true,
                gfm: true
            });

            const html = marked.parse(markdown);
            const cleanHtml = DOMPurify.sanitize(html);

            const contentDiv = document.getElementById('content');
            contentDiv.innerHTML = cleanHtml;

            contentDiv.querySelectorAll('pre code').forEach((el) => {
                hljs.highlightElement(el);
            });

            wrapTablesResponsively(contentDiv);
            addHeadingIds();
            generateTableOfContents();
            updateHeadingCache();

            contentDiv.querySelectorAll('img').forEach((img) => {
                if (!img.complete) {
                    img.addEventListener('load', updateHeadingCache, { once: true });
                }
            });

            scrollToHashSection();

            const currentQuery = document.getElementById('sidebar-search').value;
            if (currentQuery) {
                applyHighlights(contentDiv, currentQuery);
                filterToc(currentQuery);
            }
        } catch (error) {
            console.error('Error loading README:', error);
            document.getElementById('content').innerHTML =
                '<h2>Error loading README</h2><p>Could not fetch README.md file.</p>';
        }
    }

    // -------------------------------------------------------------------------
    // mobile sidebar
    // -------------------------------------------------------------------------
    function closeMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const toggle = document.getElementById('toc-toggle');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
    }

    function openMobileSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        const toggle = document.getElementById('toc-toggle');
        sidebar.classList.add('active');
        overlay.classList.add('active');
        overlay.setAttribute('aria-hidden', 'false');
        toggle.setAttribute('aria-expanded', 'true');
    }

    function initializeSidebarNavigation() {
        document.getElementById('sidebar').addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            event.preventDefault();
            const targetId = href.slice(1);
            const targetHeading = document.getElementById(targetId);

            if (targetHeading) {
                history.replaceState(null, '', `#${targetId}`);
                targetHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            closeMobileSidebar();
        });

        document.getElementById('toc-toggle').addEventListener('click', () => {
            const sidebar = document.getElementById('sidebar');
            if (sidebar.classList.contains('active')) {
                closeMobileSidebar();
            } else {
                openMobileSidebar();
            }
        });

        document.getElementById('sidebar-overlay').addEventListener('click', closeMobileSidebar);
    }

    // -------------------------------------------------------------------------
    // search & highlighting
    // -------------------------------------------------------------------------
    function removeHighlights(root) {
        const marks = root.querySelectorAll(`mark.${HIGHLIGHT_CLASS}`);
        marks.forEach((mark) => {
            const parent = mark.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(mark.textContent), mark);
            }
        });
        root.normalize();
    }

    function escapeRegExp(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function applyHighlights(root, query) {
        removeHighlights(root);
        if (!query || query.trim() === '') return;

        const terms = query
            .toLowerCase()
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .sort((a, b) => b.length - a.length);

        if (terms.length === 0) return;

        const regex = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');

        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode(node) {
                const parent = node.parentElement;
                if (!parent || parent.closest('script, style, code, pre, mark')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        });

        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        textNodes.forEach((node) => {
            const val = node.nodeValue;
            regex.lastIndex = 0;
            if (!regex.test(val)) return;

            regex.lastIndex = 0;
            const fragment = document.createDocumentFragment();
            let lastIdx = 0;
            let match;

            while ((match = regex.exec(val)) !== null) {
                if (match.index > lastIdx) {
                    fragment.appendChild(document.createTextNode(val.substring(lastIdx, match.index)));
                }

                const mark = document.createElement('mark');
                mark.className = HIGHLIGHT_CLASS;
                mark.textContent = match[0];
                fragment.appendChild(mark);

                lastIdx = regex.lastIndex;
            }

            if (lastIdx < val.length) {
                fragment.appendChild(document.createTextNode(val.substring(lastIdx)));
            }

            node.parentNode.replaceChild(fragment, node);
        });
    }

    function filterToc(query) {
        const tocItems = document.querySelectorAll('#toc-list li[data-toc-item]');
        const emptyNotice = document.getElementById('toc-empty');
        const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
        let visibleCount = 0;

        tocItems.forEach((li) => {
            if (terms.length === 0) {
                li.style.display = '';
                visibleCount += 1;
                return;
            }
            const text = li.textContent.toLowerCase();
            const matchesAll = terms.every((term) => text.includes(term));
            li.style.display = matchesAll ? '' : 'none';
            if (matchesAll) visibleCount += 1;
        });

        if (emptyNotice) {
            emptyNotice.style.display = terms.length > 0 && visibleCount === 0 ? '' : 'none';
        }
    }

    function initializeSearch() {
        const searchInput = document.getElementById('sidebar-search');

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            filterToc(query);

            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                applyHighlights(document.getElementById('content'), query);
            }, 150);
        });

        window.addEventListener('keydown', (e) => {
            const active = document.activeElement;
            if (e.key === '/' && active.tagName !== 'INPUT' && active.tagName !== 'TEXTAREA') {
                e.preventDefault();
                if (window.innerWidth <= 768) {
                    openMobileSidebar();
                }
                searchInput.focus();
                searchInput.select();
            }
        });
    }

    // -------------------------------------------------------------------------
    // scroll effects
    // -------------------------------------------------------------------------
    function initializeScrollEffects() {
        const bttBtn = document.getElementById('back-to-top');
        const sidebar = document.getElementById('sidebar');
        let lastActiveLink = null;
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (ticking) return;

            ticking = true;
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                bttBtn.classList.toggle('visible', scrollY > 300);

                let currentHeadingObj = null;
                const atBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 4;

                if (atBottom && headingCache.length > 0) {
                    currentHeadingObj = headingCache[headingCache.length - 1];
                } else {
                    const threshold = window.innerHeight / 3;
                    for (let i = 0; i < headingCache.length; i += 1) {
                        if (headingCache[i].offsetTop - threshold < scrollY) {
                            currentHeadingObj = headingCache[i];
                        }
                    }
                }

                if (currentHeadingObj?.link) {
                    if (lastActiveLink && lastActiveLink !== currentHeadingObj.link) {
                        lastActiveLink.classList.remove('active');
                    }
                    currentHeadingObj.link.classList.add('active');

                    if (lastActiveLink !== currentHeadingObj.link) {
                        lastActiveLink = currentHeadingObj.link;
                        const linkRect = currentHeadingObj.link.getBoundingClientRect();
                        const sideRect = sidebar.getBoundingClientRect();
                        if (linkRect.top < sideRect.top || linkRect.bottom > sideRect.bottom) {
                            sidebar.scrollTop += (linkRect.top - sideRect.top) - sideRect.height / 2;
                        }
                    }
                } else if (lastActiveLink) {
                    lastActiveLink.classList.remove('active');
                    lastActiveLink = null;
                }

                ticking = false;
            });
        }, { passive: true });

        window.addEventListener('resize', updateHeadingCache, { passive: true });

        bttBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // -------------------------------------------------------------------------
    // code snippet modal
    // -------------------------------------------------------------------------
    function getCodeLanguageClass(url) {
        const cleanPath = url.split('?')[0].split('#')[0].toLowerCase();
        if (cleanPath.endsWith('.json')) return 'language-json';
        if (cleanPath.endsWith('.js') || cleanPath.endsWith('.mjs')) return 'language-javascript';
        if (cleanPath.endsWith('.css')) return 'language-css';
        if (cleanPath.endsWith('.html') || cleanPath.endsWith('.htm')) return 'language-xml';
        if (cleanPath.endsWith('.md')) return 'language-markdown';
        if (cleanPath.endsWith('.txt')) return 'language-plaintext';
        return '';
    }

    async function openJsModal(url, displayTitle) {
        const overlay = document.getElementById('womble-modal-overlay');
        const titleElem = document.getElementById('modal-title');
        const codeElem = document.getElementById('modal-code-content');
        const copyBtn = document.getElementById('modal-copy-btn');
        const rawBtn = document.getElementById('modal-raw-btn');

        lastFocusedBeforeModal = document.activeElement;
        if (rawBtn) rawBtn.href = url;

        const rawName = url.split('/').pop().split('?')[0];
        const fileName = rawName ? decodeURIComponent(rawName) : (displayTitle || 'Code snippet');
        const langClass = getCodeLanguageClass(url);

        titleElem.textContent = fileName;
        codeElem.textContent = '// Loading snippet...';
        delete codeElem.dataset.highlighted;
        codeElem.className = langClass;

        copyBtn.textContent = 'Copy code';
        currentModalRawCode = '';

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
            document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
        document.body.style.overflow = 'hidden';

        overlay.classList.add('visible');
        overlay.setAttribute('aria-hidden', 'false');
        document.getElementById('modal-close-btn').focus();

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const codeText = await response.text();
            currentModalRawCode = codeText;

            const MAX_PREVIEW_SIZE = 800000;
            const MAX_HIGHLIGHT_SIZE = 200000;

            if (codeText.length > MAX_PREVIEW_SIZE) {
                const sizeMb = (codeText.length / (1024 * 1024)).toFixed(2);
                const previewText = codeText.slice(0, MAX_PREVIEW_SIZE);
                codeElem.textContent =
                    `// This is a large file (${sizeMb} MB). For this reason, this preview has been truncated.\n` +
                    `// Clicking "Copy code" *will* copy the full file, though!\n\n` +
                    `${previewText}\n\n... [remaining preview hidden]`;
            } else {
                codeElem.textContent = codeText;
                if (codeText.length < MAX_HIGHLIGHT_SIZE && langClass !== 'language-plaintext') {
                    hljs.highlightElement(codeElem);
                }
            }
        } catch (err) {
            console.error('Error fetching snippet:', err);
            const errorMsg =
                `// Could not fetch snippet from: ${url}\n` +
                `// Error: ${err.message}\n\n` +
                `// You can click "Open raw" or open directly at:\n// ${url}`;
            currentModalRawCode = errorMsg;
            codeElem.textContent = errorMsg;
            codeElem.className = 'language-javascript';
            hljs.highlightElement(codeElem);
        }
    }

    function closeModal() {
        const overlay = document.getElementById('womble-modal-overlay');
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') {
            lastFocusedBeforeModal.focus();
            lastFocusedBeforeModal = null;
        }
    }

    function initializeModal() {
        const overlay = document.getElementById('womble-modal-overlay');
        const closeBtn = document.getElementById('modal-close-btn');
        const copyBtn = document.getElementById('modal-copy-btn');

        closeBtn.addEventListener('click', closeModal);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('visible')) {
                closeModal();
            }
        });

        copyBtn.addEventListener('click', async () => {
            if (!currentModalRawCode) return;
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(currentModalRawCode);
                } else {
                    const textarea = document.createElement('textarea');
                    textarea.value = currentModalRawCode;
                    textarea.style.position = 'fixed';
                    textarea.style.left = '-9999px';
                    document.body.appendChild(textarea);
                    textarea.focus();
                    textarea.setSelectionRange(0, currentModalRawCode.length);
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                }
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = 'Copy code'; }, 2000);
            } catch (err) {
                console.error('Failed to copy text:', err);
                copyBtn.textContent = 'Copy failed';
                setTimeout(() => { copyBtn.textContent = 'Copy code'; }, 2000);
            }
        });

        document.getElementById('content').addEventListener('click', (event) => {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.button === 1) return;

            const link = event.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (!href) return;

            const cleanPath = href.split('?')[0].split('#')[0];
            const isCodeExtension = /\.(js|txt|json)$/i.test(cleanPath);
            const isRawGithub = href.includes('raw.githubusercontent.com');

            if (isCodeExtension || isRawGithub) {
                event.preventDefault();
                openJsModal(href, link.textContent || href);
            }
        });
    }

    // -------------------------------------------------------------------------
    // init
    // -------------------------------------------------------------------------
    initializeThemes();
    initializeSidebarNavigation();
    initializeSearch();
    initializeScrollEffects();
    initializeModal();
    loadReadme();
});
