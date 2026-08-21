/* ============================================
   PORTFOLIO INTERACTIVE FUNCTIONALITY
   ============================================ */

/**
 * Initialize the portfolio when DOM is ready
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeFloatingControls();
    initializeDarkMode();
    initializeNavigation();
    initializeResponsiveMenu();
    initializeAnimations();
    initializeSkillsCarousel();
    initializeSkillFilters();
    initializeCertificateTabs();
    initializeAboutTabs();
    initializeSkillPopup();
    initializeImageLightbox();
    initializeHeroPhotoCarousel();
    initializeMusicControl();
});

/* ============================================
   DARK MODE FUNCTIONALITY
   ============================================ */

/**
 * Initialize dark mode toggle and persistence
 */
function initializeDarkMode() {
    const themeToggles = document.querySelectorAll('.theme-toggle');
    if (!themeToggles.length) return;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme') || 
                      (prefersDark.matches ? 'dark' : 'light');
    
    // Apply saved theme
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    updateProfileImageSource();
    
    // Toggle theme on button click
    themeToggles.forEach(function(themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            updateProfileImageSource();
            
            // Save preference
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        });
    });
    
    // Listen for system theme changes
    prefersDark.addEventListener('change', function(e) {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            updateProfileImageSource();
        }
    });
}

function initializeFloatingControls() {
    if (document.querySelector('.floating-controls')) return;

    const path = window.location.pathname;
    const isHomePage = path === '/' || path.endsWith('/index.html') || path.endsWith('/index.php');
    if (isHomePage) return;

    const rootPath = getSiteRootPath();
    const controls = document.createElement('div');
    controls.className = 'floating-controls';
    controls.innerHTML = `
        <button class="theme-toggle" type="button" aria-label="Toggle dark mode">
            <span class="theme-icon moon-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            </span>
            <span class="theme-icon sun-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"></circle>
                    <path d="M12 2v2"></path>
                    <path d="M12 20v2"></path>
                    <path d="M4.93 4.93l1.41 1.41"></path>
                    <path d="M17.66 17.66l1.41 1.41"></path>
                    <path d="M2 12h2"></path>
                    <path d="M20 12h2"></path>
                    <path d="M4.93 19.07l1.41-1.41"></path>
                    <path d="M17.66 6.34l1.41-1.41"></path>
                </svg>
            </span>
        </button>

        <div class="lucky-chatbot" aria-live="polite">
            <div class="lucky-chatbot__window" role="dialog" aria-label="Lucky AI chatbot">
                <div class="lucky-chatbot__header">
                    <div class="lucky-chatbot__identity">
                        <div class="lucky-chatbot__avatar">
                            <img src="${rootPath}images/mypicture.png" alt="Marco AI avatar" class="lucky-chatbot__avatar-img">
                        </div>
                        <div class="lucky-chatbot__title-block">
                            <div class="lucky-chatbot__title">Marco AI</div>
                            <div class="lucky-chatbot__subtitle">Ask me anything about Marco.</div>
                        </div>
                    </div>
                    <button class="lucky-chatbot__clear" type="button">Clear</button>
                </div>

                <div class="lucky-chatbot__messages"></div>

                <div class="lucky-chatbot__composer">
                    <input class="lucky-chatbot__input" type="text" placeholder="Ask Marco AI..." aria-label="Ask Marco AI" />
                    <button class="lucky-chatbot__send" type="button" aria-label="Send message">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 2L11 13"></path>
                            <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <button class="lucky-chatbot__toggle" type="button" aria-label="Open Lucky AI chatbot">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>
        </div>
    `;

    document.body.appendChild(controls);

    if (!document.querySelector('link[href*="chatbot.css"]')) {
        const chatbotStyles = document.createElement('link');
        chatbotStyles.rel = 'stylesheet';
        chatbotStyles.href = `${rootPath}css/chatbot.css`;
        document.head.appendChild(chatbotStyles);
    }

    if (!document.querySelector('script[src*="chatbot.js"]')) {
        const chatbotScript = document.createElement('script');
        chatbotScript.src = `${rootPath}js/chatbot.js`;
        chatbotScript.defer = true;
        document.body.appendChild(chatbotScript);
    }
}

function getSiteRootPath() {
    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(Boolean);
    const portfolioIndex = segments.findIndex((segment) => segment.toLowerCase() === 'marco_new_portfolio');

    if (portfolioIndex !== -1) {
        return '/' + segments.slice(0, portfolioIndex + 1).join('/') + '/';
    }

    return '/';
}

/**
 * Update profile image source based on current theme and hover state.
 */
function updateProfileImageSource() {
    const profileImage = document.querySelector('.profile-image');
    if (!profileImage) return;

    const isDarkMode = document.body.classList.contains('dark-mode');
    const defaultSrc = isDarkMode ? profileImage.getAttribute('data-dark-default') : profileImage.getAttribute('data-default');
    const hoverSrc = isDarkMode ? profileImage.getAttribute('data-dark-hover') : profileImage.getAttribute('data-hover');

    profileImage.dataset.currentDefault = defaultSrc || profileImage.getAttribute('data-default');
    profileImage.dataset.currentHover = hoverSrc || profileImage.getAttribute('data-hover');

    const isHovered = profileImage.dataset.isHovered === 'true';
    profileImage.src = isHovered ? profileImage.dataset.currentHover : profileImage.dataset.currentDefault;
}

/* ============================================
   NAVIGATION FUNCTIONALITY
   ============================================ */

/**
 * Initialize navigation with smooth scrolling and active link tracking
 */
function initializeMusicControl() {
    const existingToggle = document.querySelector('.music-toggle');
    if (existingToggle) return;

    const navWrapper = document.querySelector('.nav-wrapper');
    const themeToggle = document.querySelector('.theme-toggle');
    const floatingControls = document.querySelector('.floating-controls');

    const musicButton = document.createElement('button');
    musicButton.className = 'music-toggle';
    musicButton.type = 'button';
    musicButton.setAttribute('aria-label', 'Play background music');
    musicButton.setAttribute('aria-pressed', 'false');
    musicButton.innerHTML = `
        <span class="music-icon music-play-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"></path>
            </svg>
        </span>
        <span class="music-icon music-pause-icon" aria-hidden="true">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 5h4v14H6zM14 5h4v14h-4z"></path>
            </svg>
        </span>
    `;

    if (floatingControls) {
        floatingControls.insertBefore(musicButton, floatingControls.firstChild);
    } else {
        const container = navWrapper || themeToggle?.parentElement || document.body;
        if (navWrapper && themeToggle) {
            navWrapper.insertBefore(musicButton, themeToggle);
        } else if (themeToggle) {
            themeToggle.parentElement.insertBefore(musicButton, themeToggle);
        } else {
            container.appendChild(musicButton);
        }
    }

    const musicFileName = 'Post Malone, Swae Lee - Sunflower (Spider-Man_ Into the Spider-Verse).mp3';
    const musicPath = window.location.pathname.includes('/about_me/') ||
        window.location.pathname.includes('/experience/') ||
        window.location.pathname.includes('/my_events/') ||
        window.location.pathname.includes('/projects/') ||
        window.location.pathname.includes('/UI/')
        ? `../music/${musicFileName}`
        : `music/${musicFileName}`;

    const audio = new Audio(musicPath);
    audio.loop = true;
    audio.volume = 0.2;
    audio.preload = 'auto';

    let isPlaying = false;
    const musicStateKey = 'musicEnabled';
    const musicTimeKey = 'musicCurrentTime';

    function updateButtonState(state) {
        isPlaying = state;
        musicButton.classList.toggle('is-playing', state);
        musicButton.setAttribute('aria-label', state ? 'Pause background music' : 'Play background music');
        musicButton.setAttribute('aria-pressed', state ? 'true' : 'false');
    }

    function saveMusicState() {
        localStorage.setItem(musicStateKey, String(isPlaying));
        if (!Number.isNaN(audio.currentTime)) {
            localStorage.setItem(musicTimeKey, String(audio.currentTime));
        }
    }

    function restoreMusicState() {
        const savedMusicState = localStorage.getItem(musicStateKey);
        const savedTime = Number(localStorage.getItem(musicTimeKey));

        if (savedMusicState !== 'true') {
            return;
        }

        updateButtonState(true);

        const applySavedTime = () => {
            if (!Number.isNaN(savedTime) && savedTime > 0) {
                audio.currentTime = Math.min(savedTime, audio.duration || savedTime);
            }
        };

        if (audio.readyState >= 1) {
            applySavedTime();
        } else {
            audio.addEventListener('loadedmetadata', applySavedTime, { once: true });
        }

        audio.play().catch(() => {
            updateButtonState(false);
            saveMusicState();
        });
    }

    audio.addEventListener('timeupdate', saveMusicState);
    window.addEventListener('pagehide', saveMusicState);
    window.addEventListener('beforeunload', saveMusicState);

    restoreMusicState();

    musicButton.addEventListener('click', async function() {
        if (isPlaying) {
            audio.pause();
            updateButtonState(false);
            saveMusicState();
            return;
        }

        try {
            await audio.play();
            updateButtonState(true);
            saveMusicState();
        } catch (error) {
            updateButtonState(false);
            saveMusicState();
        }
    });
}

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    // Add click event to nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
        
        // Add hover animations
        link.addEventListener('mouseenter', function() {
            this.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.textShadow = 'none';
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', function() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 100)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update active link based on scroll position
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });
}

/* ============================================
   ANIMATIONS & EFFECTS
   ============================================ */

/**
 * Initialize animations & effects
 */
function initializeAnimations() {
    // Profile image animation on load
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.style.animation = 'fadeInScale 0.6s ease-out';
        
        // Image switching with hover animation
        const profileImageWrapper = document.querySelector('.profile-image-wrapper');
        let isHovered = false;
        
        function getCurrentDefaultSrc() {
            return profileImage.dataset.currentDefault || profileImage.getAttribute('data-default');
        }

        function getCurrentHoverSrc() {
            return profileImage.dataset.currentHover || profileImage.getAttribute('data-hover');
        }

        profileImageWrapper.addEventListener('mouseenter', function() {
            if (isHovered) return;
            isHovered = true;
            profileImage.dataset.isHovered = 'true';
            
            const hoverSrc = getCurrentHoverSrc();
            
            // Add hover class for animation
            profileImage.classList.add('hovering');
            
            // Preload the hover image
            const preloadImg = new Image();
            preloadImg.onload = function() {
                // After image is loaded, switch with animation
                setTimeout(() => {
                    profileImage.style.opacity = '0';
                    profileImage.style.transform = 'scale(1.1) rotateZ(5deg)';
                    
                    setTimeout(() => {
                        profileImage.src = hoverSrc;
                        profileImage.style.opacity = '1';
                        profileImage.style.transform = 'scale(1) rotateZ(0deg)';
                    }, 200);
                }, 100);
            };
            preloadImg.src = hoverSrc;
        });
        
        profileImageWrapper.addEventListener('mouseleave', function() {
            isHovered = false;
            profileImage.dataset.isHovered = 'false';
            
            const defaultSrc = getCurrentDefaultSrc();
            
            // Remove hover class
            profileImage.classList.remove('hovering');
            
            // Switch back to default with animation
            setTimeout(() => {
                profileImage.style.opacity = '0';
                profileImage.style.transform = 'scale(1.1) rotateZ(-5deg)';
                
                setTimeout(() => {
                    profileImage.src = defaultSrc;
                    profileImage.style.opacity = '1';
                    profileImage.style.transform = 'scale(1) rotateZ(0deg)';
                }, 200);
            }, 100);
        });
    }
    
    // Profile info animation on load
    const profileInfo = document.querySelector('.profile-info');
    if (profileInfo) {
        profileInfo.style.animation = 'fadeInSlide 0.6s ease-out 0.2s backwards';
    }

    // Add ripple/pulse effect on profile image hover
    const profileImageWrapper = document.querySelector('.profile-image-wrapper');
    if (profileImageWrapper) {
        profileImageWrapper.addEventListener('mouseenter', function() {
            this.classList.add('image-hover-active');
        });
        
        profileImageWrapper.addEventListener('mouseleave', function() {
            this.classList.remove('image-hover-active');
        });
    }

    initializeContactStackCarousel();
    
    // Intersection observer for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

/**
 * Initialize the skills carousel using measured widths so it works when hosted.
 * It creates a keyframe animation that translates the track by the exact
 * scroll distance (in px) so the effect is visible regardless of layout.
 */
function initializeSkillsCarousel() {
    const skillsTrack = document.querySelector('.skills-track');
    const skillsGrid = document.querySelector('.skills-grid');
    if (!skillsTrack || !skillsGrid) return;

    // Clean up any previous animation/style
    const prevStyle = document.getElementById('skills-carousel-anim');
    if (prevStyle) prevStyle.remove();

    // If previously duplicated, restore original (keep first half)
    if (skillsGrid.dataset.duplicated === 'true') {
        const total = skillsGrid.children.length;
        const half = total / 2;
        if (Number.isInteger(half) && half > 0) {
            for (let i = skillsGrid.children.length - 1; i >= half; i--) {
                skillsGrid.removeChild(skillsGrid.children[i]);
            }
        }
        skillsGrid.dataset.duplicated = 'false';
    }

    // Measure widths
    const visibleWidth = skillsTrack.clientWidth;
    const contentWidth = skillsGrid.scrollWidth;

    // If content fits the container, no animation needed
    if (contentWidth <= visibleWidth) {
        skillsGrid.style.animation = 'none';
        return;
    }

    // Duplicate content to allow seamless looping
    const originalHTML = skillsGrid.innerHTML;
    skillsGrid.innerHTML += originalHTML;
    skillsGrid.dataset.duplicated = 'true';

    // Single cycle width equals the original content width
    const singleWidth = skillsGrid.scrollWidth / 2;

    // Compute duration so speed feels consistent (pixels per second)
    const pixelsPerSecond = 40;
    const duration = Math.max(8, Math.round(singleWidth / pixelsPerSecond));

    // Inject precise keyframes moving by the singleWidth (px)
    const animName = 'skills-loop-anim';
    const styleEl = document.createElement('style');
    styleEl.id = 'skills-carousel-anim';
    styleEl.innerHTML = `@keyframes ${animName} { from { transform: translateX(0); } to { transform: translateX(-${singleWidth}px); } }`;
    document.head.appendChild(styleEl);

    // Apply continuous linear animation (no alternate) for seamless loop
    skillsGrid.style.animation = `${animName} ${duration}s linear infinite`;
    skillsGrid.style.willChange = 'transform';

    // Pause on hover
    skillsTrack.addEventListener('mouseenter', () => skillsGrid.style.animationPlayState = 'paused');
    skillsTrack.addEventListener('mouseleave', () => skillsGrid.style.animationPlayState = 'running');

    // Debounced resize handling (ensure only one listener exists)
    if (window.__skillsCarouselResizeHandler) {
        window.removeEventListener('resize', window.__skillsCarouselResizeHandler);
    }
    window.__skillsCarouselResizeHandler = () => {
        clearTimeout(window.__skillsCarouselResizeTimeout);
        window.__skillsCarouselResizeTimeout = setTimeout(() => initializeSkillsCarousel(), 150);
    };
    window.addEventListener('resize', window.__skillsCarouselResizeHandler);
}

function initializeContactStackCarousel() {
    const stack = document.querySelector('.photo-stack');
    if (!stack) return;

    const imagePaths = [
        'images/about_me/1.jfif',
        'images/about_me/2.jfif',
        'images/about_me/3.jfif',
        'images/about_me/4.jfif',
        'images/about_me/5.jfif',
        'images/about_me/6.jfif',
        'images/about_me/7.jfif',
        'images/about_me/8.jfif',
        'images/about_me/9.jfif',
        'images/about_me/10.jfif'
    ];

    stack.innerHTML = '';
    const cards = imagePaths.map((src, index) => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.dataset.card = String(index);
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Contact photo ${index + 1}`;
        img.loading = 'lazy';
        card.appendChild(img);
        stack.appendChild(card);
        return card;
    });

    const updateCards = () => {
        cards.forEach((card, index) => {
            const overlapIndex = Math.min(index, 3);
            const x = overlapIndex * 6;
            const y = overlapIndex * 8;
            const rotate = overlapIndex === 0 ? 0 : overlapIndex === 1 ? -2 : overlapIndex === 2 ? -4 : -5;
            card.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
            card.style.zIndex = String(cards.length - index);
            card.style.opacity = index < 5 ? '1' : '0';
        });
    };

    const rotateCards = () => {
        const first = cards.shift();
        cards.push(first);
        updateCards();
    };

    stack.addEventListener('click', (event) => {
        const clickedCard = event.target.closest('.photo-card');
        if (!clickedCard || clickedCard !== cards[0]) return;
        rotateCards();
    });

    stack.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            rotateCards();
        }
    });

    updateCards();
}

/**
 * Initialize skill category filter buttons.
 */
function initializeSkillFilters() {
    const filterButtons = document.querySelectorAll('.skills-filter .skill-filter-btn');
    const skillsGrid = document.querySelector('.skills-grid');
    if (!filterButtons.length || !skillsGrid) return;

    const filterByCategory = (category) => {
        const skillItems = skillsGrid.querySelectorAll('.skill-item[data-category]');
        skillItems.forEach(item => {
            const categories = item.dataset.category.split(',').map(c => c.trim().toLowerCase());
            const isVisible = category === 'all' || categories.includes(category);
            item.style.display = isVisible ? 'flex' : 'none';
        });
        initializeSkillsCarousel();
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterByCategory(button.dataset.category);
        });
    });
}

function initializeCertificateTabs() {
    const tabs = document.querySelectorAll('.certificates-tab');
    const items = document.querySelectorAll('.certificate-item');
    if (!tabs.length || !items.length) return;

    const updateItems = (category) => {
        items.forEach(item => {
            const isVisible = item.dataset.category === category;
            item.style.display = isVisible ? 'flex' : 'none';
        });
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(btn => btn.classList.remove('active'));
            tab.classList.add('active');
            updateItems(tab.dataset.category);
        });
    });

    const activeTab = document.querySelector('.certificates-tab.active');
    if (activeTab) {
        updateItems(activeTab.dataset.category);
    }
}

function initializeAboutTabs() {
    const aboutTabs = document.querySelectorAll('.about-nav .tab');
    const aboutSections = document.querySelectorAll('.content-section');
    if (!aboutTabs.length || !aboutSections.length) return;

    aboutTabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = tab.getAttribute('href');
            if (!targetId) return;

            aboutTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            aboutSections.forEach(section => {
                section.classList.toggle('hidden', `#${section.id}` !== targetId);
            });
        });
    });
}

function initializeSkillPopup() {
    const skillsGrid = document.querySelector('.skills-grid');
    const modal = document.getElementById('skillModal');
    if (!skillsGrid || !modal) return;

    const modalImage = modal.querySelector('.skill-modal__image img');
    const modalTitle = modal.querySelector('#skillModalTitle');
    const modalDescription = modal.querySelector('.skill-modal__description');
    const closeButton = modal.querySelector('.skill-modal__close');
    const backdrop = modal.querySelector('.skill-modal__backdrop');

    const descriptions = {
        'Figma': [
            'I can create clean and user-friendly UI/UX designs and interactive prototypes using Figma.',
            'I enjoy turning ideas into modern and easy-to-use interfaces for both web and mobile applications.'
        ],
        'Alight Motion': [
            'I use Alight Motion to edit videos with smooth transitions, creative animations, and eye-catching effects, making my videos more engaging and professional.'
        ],
        'Bootstrap': [
            'I use Bootstrap to quickly build responsive and well-designed websites.',
            'It helps me create clean layouts and attractive user interfaces without writing everything from scratch.'
        ],
        'Canva': [
            'I use Canva to create posters, social media graphics, presentations, templates, and other visual designs with a clean and professional look.'
        ],
        'CapCut': [
            'I use CapCut to edit trailers, promotional videos, and long-form content.',
            'It helps me produce clean, high-quality videos with smooth transitions and effects.'
        ],
        'Claude Ai': [
            'I use Claude AI to help me write cleaner, more efficient code, solve programming problems, and speed up my development workflow.'
        ],
        'C# Sharp': [
            'I use C# to build console applications and practice object-oriented programming concepts while developing logic-based projects.'
        ],
        'CSS': [
            'I use CSS to style websites and create responsive, modern, and user-friendly web designs that improve the overall user experience.'
        ],
        'DaVinci Resolve': [
            'I use DaVinci Resolve for professional video editing, color grading, and advanced visual effects to produce high-quality video projects.'
        ],
        'Microsoft Excel': [
            'I use Excel for organizing data, creating reports, and developing VBA automation to simplify repetitive tasks and improve productivity.'
        ],
        'Gemini Ai': [
            'I use Gemini AI to generate ideas, create AI-assisted images, and improve visual content for presentations, videos, and creative projects.'
        ],
        'GPT Ai': [
            'I use ChatGPT to help with coding, debugging, brainstorming ideas, solving programming problems, and improving project logic and documentation.'
        ],
        'HTML': [
            'I use HTML to build the structure and content of websites, creating clean and well-organized web pages.'
        ],
        'JavaScript': [
            'I use JavaScript to add interactive features, dynamic content, and client-side functionality that improve the user experience of websites.'
        ],
        'Kodular': [
            'I use Kodular to quickly build Android mobile applications through its drag-and-drop block programming system without writing complex code.'
        ],
        'Laravel': [
            'I use Laravel to develop secure and organized PHP web applications by following the MVC architecture and modern web development practices.'
        ],
        'MIT App Inventor': [
            'I use MIT App Inventor to develop simple Android applications using block-based programming, making mobile app development faster and easier.'
        ],
        'PHP': [
            'I use PHP to develop the backend of web applications, handle server-side logic, process forms, and connect websites to databases.'
        ],
        'phpMyAdmin': [
            'I use phpMyAdmin to manage MySQL databases, including creating tables, running SQL queries, importing/exporting data, and organizing database structures.'
        ],
        'Microsoft PowerPoint': [
            'I use Microsoft PowerPoint to create clean, professional, and visually appealing presentations for school projects, reports, and presentations.'
        ],
        'Tailwind CSS': [
            'I use Tailwind CSS to build modern, responsive, and customizable website interfaces more efficiently with utility-first classes.'
        ],
        'Microsoft Word': [
            'I use Microsoft Word to create and format reports, documentation, research papers, and other professional documents with proper layouts and formatting.'
        ]
    };

    const openModal = (skillName, imageSrc, imageAlt) => {
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt;
        modalTitle.textContent = skillName;
        const descriptionItems = descriptions[skillName] || ['No description available for this skill yet.'];
        modalDescription.innerHTML = descriptionItems.map(text => `<p>${text}</p>`).join('');

        // Lock background scroll without changing layout/position
        document.body.classList.add('modal-open');

        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        modalDescription.innerHTML = '';

        // Unlock scrolling; do not change scroll position
        document.body.classList.remove('modal-open');
    };

    skillsGrid.addEventListener('click', (event) => {
        const skillItem = event.target.closest('.skill-item');
        if (!skillItem) return;

        const skillName = skillItem.querySelector('.skill-name')?.textContent?.trim();
        const skillImage = skillItem.querySelector('.skill-icon img');
        if (!skillName || !skillImage) return;

        openModal(skillName, skillImage.src, skillImage.alt || skillName);
    });

    closeButton.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

function initializeImageLightbox() {
    const lightboxId = 'imageLightbox';
    let lightbox = document.getElementById(lightboxId);

    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = lightboxId;
        lightbox.className = 'image-lightbox hidden';
        lightbox.innerHTML = `
            <div class="image-lightbox__backdrop" data-lightbox-close></div>
            <div class="image-lightbox__content" role="dialog" aria-modal="true" aria-label="Image preview">
                <button type="button" class="image-lightbox__close" aria-label="Close image preview">×</button>
                <div class="image-lightbox__image">
                    <img src="" alt="" loading="lazy">
                </div>
            </div>`;
        document.body.appendChild(lightbox);
    }

    const backdrop = lightbox.querySelector('.image-lightbox__backdrop');
    const closeButton = lightbox.querySelector('.image-lightbox__close');
    const image = lightbox.querySelector('.image-lightbox__image img');

    const openLightbox = (src, alt) => {
        image.src = src;
        image.alt = alt || '';
        lightbox.classList.remove('hidden');
        document.body.classList.add('modal-open');
    };

    const closeLightbox = () => {
        lightbox.classList.add('hidden');
        image.src = '';
        image.alt = '';
        document.body.classList.remove('modal-open');
    };

    document.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLImageElement)) return;
        if (target.closest('.skill-modal, .image-lightbox')) return;
        if (target.closest('.photo-stack')) return;

        const galleryItem = target.closest('.photo-card, .photo-item, .certificate-item');
        if (!galleryItem) return;

        event.preventDefault();
        openLightbox(target.src, target.alt || 'Preview image');
    });

    closeButton.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !lightbox.classList.contains('hidden')) {
            closeLightbox();
        }
    });
}

/* ============================================
   SMOOTH SCROLL BEHAVIOR
   ============================================ */

// Already handled in initializeNavigation()

/* ============================================
   RESPONSIVE MENU FOR MOBILE
   ============================================ */

/**
 * Handle mobile menu responsiveness
 */
function initializeResponsiveMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!navToggle || !navMenu) return;

    const closeMenu = () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
    };

    navToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        const isOpen = navMenu.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                closeMenu();
            }
        });
    });

    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

/**
 * Add keyboard navigation support
 */
document.addEventListener('keydown', function(e) {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentIndex = Array.from(navLinks).findIndex(link => 
        link.classList.contains('active')
    );
    
    if (e.key === 'ArrowRight' && currentIndex < navLinks.length - 1) {
        navLinks[currentIndex + 1].click();
        navLinks[currentIndex + 1].focus();
    } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        navLinks[currentIndex - 1].click();
        navLinks[currentIndex - 1].focus();
    }
});

/**
 * Add smooth page load animation
 */
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});

/**
 * Handle resume button click and animations
 */
document.addEventListener('DOMContentLoaded', function() {
    const resumeBtn = document.querySelector('.resume-btn');
    
    if (resumeBtn) {
        resumeBtn.addEventListener('click', function(e) {
            if (this.tagName !== 'A') {
                e.preventDefault();
            }
        });
    }
});

/* ============================================
   SOCIAL LINKS ANIMATION
   ============================================ */

/**
 * Add ripple effect to social icons
 */
function createRipple(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('click', function(e) {
        // Prevent default behavior for placeholder links
        if (this.getAttribute('href') === '#') {
            e.preventDefault();
        }
        createRipple(e);
    });
});

/* ============================================
   PERFORMANCE OPTIMIZATION
   ============================================ */

/**
 * Lazy load images
 */
if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Debounce function for resize events
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/* ============================================
   ANIMATIONS KEYFRAMES (CSS-in-JS)
   ============================================ */

/**
 * Add animation styles dynamically
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes fadeInSlide {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes buttonPulse {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-3px);
        }
    }
    
    @keyframes buttonClick {
        0% {
            transform: translateY(-2px);
        }
        50% {
            transform: translateY(0);
        }
        100% {
            transform: translateY(-2px);
        }
    }
    
    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
        }
        70% {
            box-shadow: 0 0 0 15px rgba(0, 0, 0, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
        }
    }
    
    @keyframes imageFadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    @keyframes imageFadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes imageRotateSwitch {
        0% {
            opacity: 1;
            transform: rotateY(0deg) scale(1);
        }
        50% {
            opacity: 0;
            transform: rotateY(90deg) scale(1.15);
        }
        100% {
            opacity: 1;
            transform: rotateY(0deg) scale(1);
        }
    }
    
    @keyframes imageZoom {
        from {
            transform: scale(0.95);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    .fade-in {
        animation: fadeIn 0.6s ease-out forwards;
    }
    
    .image-hover-active {
        animation: pulse 0.6s ease-out forwards;
    }
    
    @keyframes heroPhotoFadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    @keyframes heroPhotoFadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    .hero-photo-fade-out {
        animation: heroPhotoFadeOut 0.6s ease-out forwards;
    }
    
    .hero-photo-fade-in {
        animation: heroPhotoFadeIn 0.8s ease-in forwards;
    }
`;
document.head.appendChild(style);

/* ============================================
   HERO PHOTO CAROUSEL - FADE EFFECT
   ============================================ */

/**
 * Initialize carousel for the hero photo next to "Hello I'm Marco"
 */
function initializeHeroPhotoCarousel() {
    const heroPhoto = document.querySelector('.hero-photo img');
    if (!heroPhoto) return;

    // Only run on desktop view
    const isDesktop = () => window.innerWidth > 768;
    if (!isDesktop()) return;

    // Images to cycle through (from about_me folder)
    const carouselImages = [
        '../images/about_me/1.jfif',
        '../images/about_me/2.jfif',
        '../images/about_me/3.jfif',
        '../images/about_me/4.jfif',
        '../images/about_me/5.jfif',
        '../images/about_me/6.jfif',
        '../images/about_me/7.jfif',
        '../images/about_me/8.jfif',
        '../images/about_me/9.jfif',
        '../images/about_me/10.jfif'
    ];

    let currentImageIndex = 0;

    // Rotate hero photo with fade effect
    const rotateHeroPhoto = () => {
        if (!isDesktop()) return;

        heroPhoto.classList.add('hero-photo-fade-out');
        
        setTimeout(() => {
            heroPhoto.src = carouselImages[currentImageIndex];
            heroPhoto.classList.remove('hero-photo-fade-out');
            heroPhoto.classList.add('hero-photo-fade-in');
            
            setTimeout(() => {
                heroPhoto.classList.remove('hero-photo-fade-in');
            }, 800);
        }, 600);

        currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
    };

    // Start carousel every 5 seconds on desktop
    setInterval(() => {
        if (isDesktop()) {
            rotateHeroPhoto();
        }
    }, 5000);
}

console.log('Portfolio initialized successfully');

// Section tabs: swap Experience, Events, and Education views
(function() {
    const sectionTabs = document.querySelectorAll('.experience-tab');
    const mobileSwitchBtn = document.getElementById('experienceMobileSwitchBtn');
    const mobileSwitchMenu = document.getElementById('experienceMobileSwitchMenu');
    const mobileSwitchOptions = mobileSwitchMenu ? mobileSwitchMenu.querySelectorAll('.experience-switch-option') : [];
    const expItems = document.querySelector('.experience-items');
    const eventItems = document.querySelector('.events-items');
    const eduItems = document.querySelector('.education-items');
    const sectionTitle = document.getElementById('sectionTitle');
    const sectionDescription = document.getElementById('sectionDescription');

    if (!sectionTabs.length || !expItems || !eventItems || !eduItems || !sectionTitle || !sectionDescription) return;

    function showSectionView(target) {
        if (target === 'education') {
            expItems.classList.add('hidden');
            eventItems.classList.add('hidden');
            eduItems.classList.remove('hidden');
            sectionTitle.textContent = 'Education';
            sectionDescription.textContent = 'Education has been the foundation of my growth, equipping me with the knowledge and practical skills needed to pursue a career in technology and software development.';
        } else if (target === 'events') {
            expItems.classList.add('hidden');
            eventItems.classList.remove('hidden');
            eduItems.classList.add('hidden');
            sectionTitle.textContent = 'Events';
            sectionDescription.textContent = 'A collection of events and competitions that strengthened my confidence, teamwork, and problem-solving skills in real-world settings.';
        } else {
            eduItems.classList.add('hidden');
            eventItems.classList.add('hidden');
            expItems.classList.remove('hidden');
            sectionTitle.textContent = 'Experience';
            sectionDescription.textContent = 'A collection of the experiences and milestones that have shaped my growth, strengthened my technical abilities, and deepened my passion for technology.';
        }

        sectionTabs.forEach(tab => {
            const isActive = tab.dataset.target === target;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
            tab.tabIndex = isActive ? 0 : -1;
        });

        mobileSwitchOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.target === target);
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const initialView = urlParams.get('view');
    if (initialView === 'events') {
        showSectionView('events');
    } else if (initialView === 'education') {
        showSectionView('education');
    } else if (initialView === 'uiux') {
        // handled below for projects section
    } else {
        showSectionView('experience');
    }

    sectionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            showSectionView(tab.dataset.target);
        });

        tab.addEventListener('keydown', (event) => {
            if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
            event.preventDefault();
            const tabs = Array.from(sectionTabs);
            const currentIndex = tabs.indexOf(tab);
            const direction = event.key === 'ArrowRight' ? 1 : -1;
            const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
            tabs[nextIndex].focus();
            showSectionView(tabs[nextIndex].dataset.target);
        });
    });

    if (mobileSwitchBtn && mobileSwitchMenu) {
        mobileSwitchBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = !mobileSwitchMenu.classList.contains('hidden');
            mobileSwitchMenu.classList.toggle('hidden', isOpen);
            mobileSwitchBtn.setAttribute('aria-expanded', String(!isOpen));
        });

        mobileSwitchOptions.forEach(option => {
            option.addEventListener('click', () => {
                showSectionView(option.dataset.target);
                mobileSwitchMenu.classList.add('hidden');
                mobileSwitchBtn.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', (event) => {
            if (mobileSwitchMenu.classList.contains('hidden')) return;
            if (mobileSwitchMenu.contains(event.target) || mobileSwitchBtn.contains(event.target)) return;
            mobileSwitchMenu.classList.add('hidden');
            mobileSwitchBtn.setAttribute('aria-expanded', 'false');
        });
    }
})();

// Projects reveal: show the two newest cards first, then toggle the rest.
(function() {
    const toggles = document.querySelectorAll('.projects-toggle-more');
    if (!toggles.length) return;

    toggles.forEach(toggle => {
        const grid = document.getElementById(toggle.dataset.grid);
        const actions = toggle.closest('.projects-actions');
        const extraCards = grid ? grid.querySelectorAll('.project-card--extra') : [];

        if (!grid || !extraCards.length) {
            if (actions) actions.classList.add('hidden');
            return;
        }

        const setExpanded = (isExpanded) => {
            extraCards.forEach(card => {
                card.classList.toggle('is-hidden', !isExpanded);
            });
            toggle.textContent = isExpanded ? 'Read Less' : 'Read More';
            toggle.setAttribute('aria-expanded', String(isExpanded));
        };

        setExpanded(false);

        toggle.addEventListener('click', () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            setExpanded(!isExpanded);
        });
    });
})();

// Projects tabs: swap Projects <-> UI/UX views
(function() {
    const projectTabs = document.querySelectorAll('.projects-tab');
    const mobileSwitchBtn = document.getElementById('projectsMobileSwitchBtn');
    const mobileSwitchMenu = document.getElementById('projectsMobileSwitchMenu');
    const mobileSwitchOptions = mobileSwitchMenu ? mobileSwitchMenu.querySelectorAll('.projects-switch-option') : [];
    const projectsGrid = document.querySelector('.projects-grid');
    const uiuxGrid = document.querySelector('.uiux-grid');
    const projectActionGroups = document.querySelectorAll('.projects-actions[data-actions-for]');
    const projectsTitle = document.getElementById('projectsSectionTitle');
    const projectsDescription = document.getElementById('projectsSectionDescription');

    if (!projectTabs.length || !projectsGrid || !uiuxGrid || !projectsTitle || !projectsDescription) return;

    function showProjectsView(target) {
        if (target === 'uiux') {
            projectsGrid.classList.add('hidden');
            uiuxGrid.classList.remove('hidden');
            projectsTitle.textContent = 'UI/UX Designs';
            projectsDescription.textContent = 'A gallery of UI/UX design concepts focused on usability and visual clarity.';
        } else {
            uiuxGrid.classList.add('hidden');
            projectsGrid.classList.remove('hidden');
            projectsTitle.textContent = 'Projects';
            projectsDescription.textContent = 'A collection of academic and personal projects that reflect my experience in designing, developing, and delivering functional web applications.';
        }

        projectActionGroups.forEach(actions => {
            const isTargetActions = actions.dataset.actionsFor === (target === 'uiux' ? 'uiuxGrid' : 'projectsGrid');
            actions.classList.toggle('hidden', !isTargetActions);
        });

        projectTabs.forEach(tab => {
            const isActive = tab.dataset.target === target;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
            tab.tabIndex = isActive ? 0 : -1;
        });

        mobileSwitchOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.target === target);
        });
    }

    projectTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            showProjectsView(tab.dataset.target);
        });

        tab.addEventListener('keydown', (event) => {
            if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
            event.preventDefault();
            const tabs = Array.from(projectTabs);
            const currentIndex = tabs.indexOf(tab);
            const direction = event.key === 'ArrowRight' ? 1 : -1;
            const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
            tabs[nextIndex].focus();
            showProjectsView(tabs[nextIndex].dataset.target);
        });
    });

    if (mobileSwitchBtn && mobileSwitchMenu) {
        mobileSwitchBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const isOpen = !mobileSwitchMenu.classList.contains('hidden');
            mobileSwitchMenu.classList.toggle('hidden', isOpen);
            mobileSwitchBtn.setAttribute('aria-expanded', String(!isOpen));
        });

        mobileSwitchOptions.forEach(option => {
            option.addEventListener('click', () => {
                showProjectsView(option.dataset.target);
                mobileSwitchMenu.classList.add('hidden');
                mobileSwitchBtn.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', (event) => {
            if (mobileSwitchMenu.classList.contains('hidden')) return;
            if (mobileSwitchMenu.contains(event.target) || mobileSwitchBtn.contains(event.target)) return;
            mobileSwitchMenu.classList.add('hidden');
            mobileSwitchBtn.setAttribute('aria-expanded', 'false');
        });
    }

    const projectsUrlParams = new URLSearchParams(window.location.search);
    showProjectsView(projectsUrlParams.get('view') === 'uiux' ? 'uiux' : 'projects');
})();

/* ============================================
   SKILLS CAROUSEL FUNCTIONALITY
   ============================================ */

(function() {
    const skillsGrid = document.querySelector('.skills-grid');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    
    if (!skillsGrid || !prevBtn || !nextBtn) return;

    const scrollAmount = 120; // Adjust based on skill item width + gap

    // Next button
    nextBtn.addEventListener('click', function() {
        skillsGrid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Previous button
    prevBtn.addEventListener('click', function() {
        skillsGrid.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        const skillsSection = document.querySelector('.skills-section');
        if (!skillsSection) return;
        
        // Check if scrolling in skills section
        if (skillsSection.querySelector(':hover')) {
            if (e.key === 'ArrowRight') {
                nextBtn.click();
                e.preventDefault();
            } else if (e.key === 'ArrowLeft') {
                prevBtn.click();
                e.preventDefault();
            }
        }
    });
})();
