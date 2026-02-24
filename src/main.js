const gameGrid = document.getElementById('game-grid');
const searchInput = document.getElementById('search-input');
const gameCount = document.getElementById('game-count');
const noResults = document.getElementById('no-results');
const currentYear = document.getElementById('current-year');

const modal = document.getElementById('game-modal');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');
const modalThumb = document.getElementById('modal-thumb');
const modalExternal = document.getElementById('modal-external');
const gameIframe = document.getElementById('game-iframe');
const closeModalBtn = document.getElementById('close-modal');
const toggleFullscreenBtn = document.getElementById('toggle-fullscreen');

let isFullscreen = false;

// Initialize
async function init() {
  currentYear.textContent = new Date().getFullYear();
  
  try {
    const response = await fetch('./src/games.json');
    const gamesData = await response.json();
    
    renderGames(gamesData);

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = gamesData.filter(game => 
        game.title.toLowerCase().includes(query) || 
        game.description.toLowerCase().includes(query)
      );
      renderGames(filtered);
    });
  } catch (error) {
    console.error('Error loading games data:', error);
    gameGrid.innerHTML = '<p class="text-center py-10 text-red-500">Failed to load games. Please try again later.</p>';
  }

  closeModalBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  toggleFullscreenBtn.addEventListener('click', toggleFullscreen);
}

function renderGames(games) {
  gameGrid.innerHTML = '';
  gameCount.textContent = `${games.length} Games Available`;

  if (games.length === 0) {
    noResults.classList.remove('hidden');
  } else {
    noResults.classList.add('hidden');
    games.forEach(game => {
      const card = document.createElement('div');
      card.className = 'group bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-1';
      card.innerHTML = `
        <div class="aspect-video relative overflow-hidden">
          <img src="${game.thumbnail}" alt="${game.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" referrerpolicy="no-referrer">
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div class="bg-white text-zinc-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
              Play Now
            </div>
          </div>
        </div>
        <div class="p-4">
          <h3 class="font-bold text-lg mb-1">${game.title}</h3>
          <p class="text-zinc-500 text-sm line-clamp-2">${game.description}</p>
        </div>
      `;
      card.addEventListener('click', () => openGame(game));
      gameGrid.appendChild(card);
    });
  }
}

function openGame(game) {
  modalTitle.textContent = game.title;
  modalThumb.src = game.thumbnail;
  modalExternal.href = game.iframeUrl;
  gameIframe.src = game.iframeUrl;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  
  // Animate in
  setTimeout(() => {
    modal.classList.add('opacity-100');
    modalContent.classList.remove('scale-95', 'opacity-0');
    modalContent.classList.add('scale-100', 'opacity-100');
  }, 10);
}

function closeModal() {
  modal.classList.remove('opacity-100');
  modalContent.classList.remove('scale-100', 'opacity-100');
  modalContent.classList.add('scale-95', 'opacity-0');
  
  isFullscreen = false;
  updateFullscreenUI();

  setTimeout(() => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    gameIframe.src = '';
  }, 300);
}

function toggleFullscreen() {
  isFullscreen = !isFullscreen;
  updateFullscreenUI();
}

function updateFullscreenUI() {
  if (isFullscreen) {
    modalContent.classList.add('fixed', 'inset-0', 'rounded-none', 'max-w-none', 'aspect-none');
    modalContent.classList.remove('w-full', 'max-w-5xl', 'aspect-[16/10]', 'rounded-3xl');
  } else {
    modalContent.classList.remove('fixed', 'inset-0', 'rounded-none', 'max-w-none', 'aspect-none');
    modalContent.classList.add('w-full', 'max-w-5xl', 'aspect-[16/10]', 'rounded-3xl');
  }
}

init();
