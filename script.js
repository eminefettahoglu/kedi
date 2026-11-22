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
