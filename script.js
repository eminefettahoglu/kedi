function toggleCatTongue() {
    const catWrapper = document.getElementById('floatingCat');
    if (catWrapper) {
        catWrapper.classList.toggle('blep');
    }
}

function showTab(tabId) {
    const sections = document.querySelectorAll('.tab-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    const activeSection = document.getElementById(tabId);
    if (activeSection) {
        activeSection.classList.add('active');
    }

    const activeBtn = document.querySelector(`.nav-btn[data-target="${tabId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const STORAGE_KEY = 'pati_dunyasi_kedi_yazilari_v1';

const defaultStories = [
    {
        id: 'ornek-1',
        catName: 'Mırnav',
        catBreed: 'Tekir • 3 yaşında',
        ownerName: 'Emine',
        story: 'Sabah alarm çalmadan tam on dakika önce patisiyle kapıyı tırmalayıp güne başlamamı sağlar. Güneş vuran pencere kenarı en sevdiği yer.',
        date: 'Örnek Yazı'
    }
];

function escapeText(value) {
    return String(value || '').trim();
}

function getStories() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStories));
            return [...defaultStories];
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [...defaultStories];
    } catch (err) {
        return [...defaultStories];
    }
}

function saveStories(stories) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
    } catch (err) {
        const statusEl = document.getElementById('storyStatus');
        if (statusEl) {
            statusEl.textContent = 'Yazı tarayıcı hafızasına kaydedilemedi.';
        }
    }
}

function renderStories() {
    const listEl = document.getElementById('storyList');
    const countEl = document.getElementById('storyCount');
    if (!listEl || !countEl) return;

    const stories = getStories();
    countEl.textContent = stories.length;
    listEl.innerHTML = '';

    if (stories.length === 0) {
        const emptyCard = document.createElement('div');
        emptyCard.className = 'card';
        const emptyText = document.createElement('p');
        emptyText.textContent = 'Henüz yazı eklenmemiş. İlk kedi hikayesini sen paylaş!';
        emptyCard.appendChild(emptyText);
        listEl.appendChild(emptyCard);
        return;
    }

    stories.forEach(item => {
        const card = document.createElement('article');
        card.className = 'story-card';

        const top = document.createElement('div');
        top.className = 'story-top';

        const titleWrap = document.createElement('div');
        const catTitle = document.createElement('div');
        catTitle.className = 'story-cat-name';
        catTitle.textContent = item.catName;

        const ownerLine = document.createElement('div');
        ownerLine.className = 'story-owner';
        ownerLine.textContent = `Yazan: ${item.ownerName}`;

        titleWrap.appendChild(catTitle);
        titleWrap.appendChild(ownerLine);
        top.appendChild(titleWrap);

        if (item.catBreed) {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = item.catBreed;
            top.appendChild(tag);
        }

        const body = document.createElement('p');
        body.className = 'story-text';
        body.textContent = item.story;

        const footer = document.createElement('div');
        footer.className = 'story-footer';

        const dateSpan = document.createElement('span');
        dateSpan.textContent = item.date || '';

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'delete-story-btn';
        delBtn.textContent = 'Sil';
        delBtn.addEventListener('click', () => deleteStory(item.id));

        footer.appendChild(dateSpan);
        footer.appendChild(delBtn);

        card.appendChild(top);
        card.appendChild(body);
        card.appendChild(footer);
        listEl.appendChild(card);
    });
}

function deleteStory(id) {
    const updated = getStories().filter(item => item.id !== id);
    saveStories(updated);
    renderStories();
}

document.addEventListener('DOMContentLoaded', () => {
    renderStories();

    const form = document.getElementById('catStoryForm');
    const statusEl = document.getElementById('storyStatus');
    if (!form) return;

    form.addEventListener('submit', event => {
        event.preventDefault();

        const catName = escapeText(document.getElementById('catName').value);
        const catBreed = escapeText(document.getElementById('catBreed').value);
        const ownerName = escapeText(document.getElementById('ownerName').value);
        const story = escapeText(document.getElementById('catStory').value);

        if (!catName || !ownerName || !story) {
            if (statusEl) statusEl.textContent = 'Lütfen zorunlu alanları doldurun.';
            return;
        }

        const nowStr = new Date().toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        const newStory = {
            id: 'kedi-' + Date.now(),
            catName,
            catBreed,
            ownerName,
            story,
            date: nowStr
        };

        const stories = getStories();
        stories.unshift(newStory);
        saveStories(stories);
        renderStories();

        form.reset();
        if (statusEl) {
            statusEl.textContent = `${catName} için yazı eklendi!`;
        }
    });
});
const INTRO_CAT_SVG = `
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 66C13 64 9 54 14 46" stroke="#a3a3a3" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M26 38L20 14L41 27C44 26.2 47 25.8 50 25.8C53 25.8 56 26.2 59 27L80 14L74 38C79 44 82 51.5 82 60C82 77 67.7 88 50 88C32.3 88 18 77 18 60C18 51.5 21 44 26 38Z" fill="#1e1e1e" stroke="#f5f5f5" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M27 33L24 21L35 28Z" fill="#f48fb1" opacity="0.65"/>
    <path d="M73 33L76 21L65 28Z" fill="#f48fb1" opacity="0.65"/>
    <circle cx="37" cy="52" r="4" fill="#f5f5f5"/>
    <circle cx="63" cy="52" r="4" fill="#f5f5f5"/>
    <circle cx="38.2" cy="50.8" r="1.2" fill="#0a0a0a"/>
    <circle cx="64.2" cy="50.8" r="1.2" fill="#0a0a0a"/>
    <path d="M46.5 58.5H53.5L50 62L46.5 58.5Z" fill="#f48fb1"/>
    <path d="M50 62V64.5M50 64.5C47.5 67 44 67 41.5 65M50 64.5C52.5 67 56 67 58.5 65" stroke="#d4d4d4" stroke-width="2" stroke-linecap="round"/>
    <path d="M24 56H11M24 62H13M76 56H89M76 62H87" stroke="#888888" stroke-width="1.8" stroke-linecap="round"/>
</svg>
`;

function enterSiteFromIntro() {
    const introEl = document.getElementById('introScreen');
    if (introEl && !introEl.classList.contains('is-hidden')) {
        introEl.classList.add('is-hidden');
        showTab('anasayfa');
    }
}

function initIntroCats() {
    const stage = document.getElementById('introCatStage');
    if (!stage) return;

    const catsConfig = [
        { bottom: '14%', run: '6.5s', delay: '0s', hop: '0.48s', hopDelay: '0s', hopHeight: '42px', scale: 1 },
        { bottom: '32%', run: '8.2s', delay: '-2.5s', hop: '0.58s', hopDelay: '-0.2s', hopHeight: '34px', scale: 0.9 },
        { bottom: '52%', run: '5.8s', delay: '-4.2s', hop: '0.44s', hopDelay: '-0.1s', hopHeight: '48px', scale: 1.05 },
        { bottom: '70%', run: '7.6s', delay: '-1.3s', hop: '0.62s', hopDelay: '-0.35s', hopHeight: '30px', scale: 0.85 }
    ];

    catsConfig.forEach((cfg, index) => {
        const catBtn = document.createElement('button');
        catBtn.type = 'button';
        catBtn.className = 'runner-cat';
        catBtn.setAttribute('aria-label', `Koşan kedi ${index + 1} - Siteye gir`);
        catBtn.style.bottom = cfg.bottom;
        catBtn.style.setProperty('--run-duration', cfg.run);
        catBtn.style.setProperty('--run-delay', cfg.delay);
        catBtn.style.setProperty('--hop-duration', cfg.hop);
        catBtn.style.setProperty('--hop-delay', cfg.hopDelay);
        catBtn.style.setProperty('--hop-height', cfg.hopHeight);
        catBtn.style.width = `${Math.round(92 * cfg.scale)}px`;
        catBtn.style.height = `${Math.round(92 * cfg.scale)}px`;
        catBtn.innerHTML = INTRO_CAT_SVG;
        catBtn.addEventListener('click', enterSiteFromIntro);
        stage.appendChild(catBtn);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initIntroCats();
});