/* ============================================
   LUCKY AI CHATBOT LOGIC
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initLuckyChatbot();
});

function initLuckyChatbot() {
    const chatbot = document.querySelector('.lucky-chatbot');
    if (!chatbot) return;

    const toggle = chatbot.querySelector('.lucky-chatbot__toggle');
    const windowEl = chatbot.querySelector('.lucky-chatbot__window');
    const messagesEl = chatbot.querySelector('.lucky-chatbot__messages');
    const inputEl = chatbot.querySelector('.lucky-chatbot__input');
    const sendBtn = chatbot.querySelector('.lucky-chatbot__send');
    const clearBtn = chatbot.querySelector('.lucky-chatbot__clear');
    const chips = chatbot.querySelectorAll('.lucky-chatbot__chip');

    const state = {
        isOpen: false,
        history: []
    };

    // Avatar fallback: if the image is missing, replace it with an initial
    const avatarImg = chatbot.querySelector('.lucky-chatbot__avatar-img');
    if (avatarImg) {
        avatarImg.addEventListener('error', () => {
            const avatarWrapper = avatarImg.closest('.lucky-chatbot__avatar');
            if (!avatarWrapper) return;
            avatarWrapper.innerHTML = '';
            const span = document.createElement('span');
            span.textContent = 'M';
            span.style.display = 'inline-flex';
            span.style.alignItems = 'center';
            span.style.justifyContent = 'center';
            span.style.width = '100%';
            span.style.height = '100%';
            span.style.fontWeight = '700';
            span.style.color = 'var(--bg-primary, #ffffff)';
            avatarWrapper.appendChild(span);
        });
    }

    const responses = {
        identity: [
            'Marco C. Lunas, also known as Lucky Marco, is an IT student and aspiring software developer focused on building functional, user-centered digital solutions.',
            'His portfolio highlights web systems, UI/UX designs, certificates, events, and current work like Tracktern, a 2026 personal OJT Tracking System project.'
        ],
        about: [
            'Lucky Marco is an IT student who enjoys turning ideas into functional, user-centered digital experiences. He is passionate about modern design, problem-solving, and building meaningful solutions with code.',
            'He studies at the University of Rizal System - Binangonan and continues to grow through academic projects, personal projects, hackathons, certificates, and hands-on work.',
            'He is driven by creativity, continuous learning, and the desire to create projects that are both practical and impactful.'
        ],
        education: [
            'Lucky Marco is currently pursuing a Bachelor of Science in Information Technology at the University of Rizal System, Binangonan.',
            'He also completed his senior high school education in ICT at San Lorenzo Ruiz Senior High School.'
        ],
        skills: [
            'His skills include web development, UI/UX design, app development, and digital content creation. He works with HTML, CSS, JavaScript, PHP, Laravel, Bootstrap, Tailwind, MySQL, Figma, and several design and editing tools.'
        ],
        technologies: [
            'Lucky Marco is experienced with HTML, CSS, JavaScript, PHP, Laravel, MySQL, Bootstrap, Tailwind, C#, Kodular, Figma, and AI-assisted tools such as ChatGPT, Claude, and Gemini.'
        ],
        projects: [
            'His recent projects include Tracktern, a 2026 personal OJT Tracking System that is currently in progress, and G! Vote, a web-based digital voting system.',
            'Other portfolio projects include InfoTranSys, Beeble, ImReach, and a C# console application, showing his growth in web development, app development, and design.'
        ],
        tracktern: [
            'Tracktern is Marco\'s 2026 personal project. It is an OJT Tracking System and is currently being worked on.'
        ],
        gvote: [
            'G! Vote is Marco\'s capstone project for 2025-2026. It is a web-based digital voting system designed for University of Rizal System Binangonan.'
        ],
        infotransys: [
            'InfoTranSys is a web-based transaction system made to improve long queue concerns in the University Cashier and Dean\'s Offices.'
        ],
        beeble: [
            'Beeble is an interactive mobile learning application for children under 10, focused on nature and environmental learning through engaging activities.'
        ],
        certificates: [
            'Marco has certificates related to computer systems servicing, cybersecurity, leadership, seminars, and gaming events. These support his continuous learning and professional growth.'
        ],
        hackathon: [
            'Lucky Marco joined the Startup QC Student Competition and the eGov Hackathon, where he gained valuable experience working on real-world ideas, collaboration, and innovation.'
        ],
        immersion: [
            'Marco\'s experience includes working as a Full Stack Developer at CertiCode, serving as a Student Assistant at the University Cashier Office, and completing work immersion at Capellan Institute of Technology.',
            'These experiences strengthened his technical skills, communication, teamwork, and understanding of real professional workflows.'
        ],
        languages: [
            'His programming language experience includes HTML, CSS, JavaScript, PHP, C#, and SQL.'
        ],
        uiux: [
            'Lucky Marco is interested in user-centered design and has worked on UI/UX concepts such as Gvote, Beeble, and Due It in Figma.'
        ],
        ai: [
            'He is also learning about AI tools and agentic coding, exploring how AI can support smarter workflows, automation, and modern development practices.'
        ],
        agentic: [
            'Agentic coding is one of the areas he is actively learning, especially how AI can assist in guided development, problem solving, and productivity.'
        ],
        goals: [
            'His goal is to grow into a capable software developer who builds practical, meaningful, and scalable digital solutions while continuously improving his craft.'
        ],
        hobbies: [
            'Outside coding, Lucky Marco enjoys designing, exploring creative ideas, riding, and continuing to learn new skills.'
        ],
        coding: [
            'He enjoys coding because it allows him to turn ideas into real products and solve problems in a creative way.'
        ],
        designing: [
            'Designing is one of his favorite creative activities, especially when it merges aesthetics with functionality.'
        ],
        riding: [
            'Riding is one of his relaxing hobbies and a way to enjoy time outside while staying balanced.'
        ],
        contact: [
            'You can reach Lucky Marco through email at luckymarcolunas1117@gmail.com, via GitHub at github.com/MarcoLucky, or through Facebook at Marco Lunas.'
        ],
        resume: [
            'You can download his resume from the contact section of this portfolio. It contains his background, experience, and skills.'
        ],
        greeting: [
            "Hi! I'm Marco AI. I can answer questions about Marco's background, skills, projects, education, experience, certificates, events, hobbies, and contact information."
        ]
    };

    function formatTime(date = new Date()) {
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }

    function renderMessages() {
        messagesEl.innerHTML = '';
        state.history.forEach((item) => {
            appendBubble(item.text, item.sender, item.time);
        });
        scrollToBottom();
    }

    function appendBubble(text, sender, time) {
        const bubble = document.createElement('div');
        bubble.className = `lucky-chatbot__bubble lucky-chatbot__bubble--${sender}`;
        const textEl = document.createElement('div');
        textEl.className = 'lucky-chatbot__bubble-text';
        textEl.textContent = text;
        const timeEl = document.createElement('div');
        timeEl.className = 'lucky-chatbot__bubble-time';
        timeEl.textContent = time;
        bubble.append(textEl, timeEl);
        messagesEl.appendChild(bubble);
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function pushMessage(text, sender) {
        state.history.push({ text, sender, time: formatTime() });
        if (sender === 'user') {
            appendBubble(text, sender, state.history[state.history.length - 1].time);
        } else {
            appendBubble(text, sender, state.history[state.history.length - 1].time);
        }
        scrollToBottom();
    }

    function showTypingIndicator() {
        const typing = document.createElement('div');
        typing.className = 'lucky-chatbot__bubble lucky-chatbot__bubble--bot';
        typing.dataset.typing = 'true';
        typing.innerHTML = `
            <div class="lucky-chatbot__typing">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="lucky-chatbot__bubble-time">typing...</div>
        `;
        messagesEl.appendChild(typing);
        scrollToBottom();
        return typing;
    }

    function removeTypingIndicator() {
        const typing = messagesEl.querySelector('[data-typing="true"]');
        if (typing) {
            typing.remove();
        }
    }

    function getReply(input) {
        const cleaned = input.toLowerCase().trim();

        if (!cleaned) return null;

        if (/(who'?s marco|who is marco|about marco|marco lunas|lucky marco|who is lucky|who is lucky marco)/.test(cleaned)) {
            return responses.identity.join(' ');
        }

        if (/(who are you|introduce yourself|tell me about yourself|about you|yourself)/.test(cleaned)) {
            return responses.about.join(' ');
        }

        if (/(education|school|college|university|degree|study)/.test(cleaned)) {
            return responses.education.join(' ');
        }

        if (/(skill|skills|tech stack|technology|technologies|programming language|programming languages|stack)/.test(cleaned)) {
            return responses.skills.join(' ');
        }

        if (/(tracktern|ojt tracking|ojt system|tracking system)/.test(cleaned)) {
            return responses.tracktern.join(' ');
        }

        if (/(g! vote|gvote|g vote|voting system)/.test(cleaned)) {
            return responses.gvote.join(' ');
        }

        if (/(infotransys|transaction system|queue|cashier)/.test(cleaned)) {
            return responses.infotransys.join(' ');
        }

        if (/(beeble|mobile learning|learning app|children)/.test(cleaned)) {
            return responses.beeble.join(' ');
        }

        if (/(certificate|certificates|certification|certifications|seminar|leadership|cybersecurity|css nc ii|nc ii)/.test(cleaned)) {
            return responses.certificates.join(' ');
        }

        if (/(project|projects|portfolio|works|work|show your projects)/.test(cleaned)) {
            return responses.projects.join(' ');
        }

        if (/(hackathon|startup|egov|competition)/.test(cleaned)) {
            return responses.hackathon.join(' ');
        }

        if (/(immersion|work immersion|internship|experience)/.test(cleaned)) {
            return responses.immersion.join(' ');
        }

        if (/(ui|ux|design|designs|figma)/.test(cleaned)) {
            return responses.uiux.join(' ');
        }

        if (/(ai|artificial intelligence|learning|learn|learning about ai)/.test(cleaned)) {
            return responses.ai.join(' ');
        }

        if (/(agentic|agentic coding|coding agent)/.test(cleaned)) {
            return responses.agentic.join(' ');
        }

        if (/(goal|goals|dream|ambition)/.test(cleaned)) {
            return responses.goals.join(' ');
        }

        if (/(hobby|hobbies|coding|designing|riding)/.test(cleaned)) {
            if (cleaned.includes('coding')) return responses.coding.join(' ');
            if (cleaned.includes('design')) return responses.designing.join(' ');
            if (cleaned.includes('ride')) return responses.riding.join(' ');
            return responses.hobbies.join(' ');
        }

        if (/(contact|email|github|facebook|linkedin|phone)/.test(cleaned)) {
            return responses.contact.join(' ');
        }

        if (/(resume|cv|download)/.test(cleaned)) {
            return responses.resume.join(' ');
        }

        return "I'm still learning! I can currently answer questions about Lucky Marco's portfolio, skills, projects, education, experience, hobbies, and contact information.";
    }

    function sendMessage(message) {
        const text = message.trim();
        if (!text) return;

        pushMessage(text, 'user');
        inputEl.value = '';

        const reply = getReply(text);
        pushMessage(reply, 'bot');
    }

    toggle.addEventListener('click', () => {
        state.isOpen = !state.isOpen;
        chatbot.classList.toggle('is-open', state.isOpen);
        if (state.isOpen) {
            inputEl.focus();
            if (state.history.length === 0) {
                const greeting = responses.greeting[0];
                pushMessage(greeting, 'bot');
            }
        }
    });

    sendBtn.addEventListener('click', () => sendMessage(inputEl.value));

    inputEl.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage(inputEl.value);
        }
    });

    clearBtn.addEventListener('click', () => {
        state.history = [];
        renderMessages();
        if (state.isOpen) {
            pushMessage(responses.greeting[0], 'bot');
        }
    });

    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            sendMessage(chip.dataset.prompt || chip.textContent);
        });
    });

    document.addEventListener('click', (event) => {
        if (!state.isOpen) return;
        const clickedInside = chatbot.contains(event.target);
        if (!clickedInside) {
            state.isOpen = false;
            chatbot.classList.remove('is-open');
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && state.isOpen) {
            state.isOpen = false;
            chatbot.classList.remove('is-open');
        }
    });

    if (state.history.length === 0) {
        pushMessage(responses.greeting[0], 'bot');
    }
}
