// ---- Mobile nav toggle ----
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---- Profile photo fallback ----
// If "aashish photo.jpg" hasn't been added yet, show initials instead of a broken image.
const profileImg = document.getElementById('profileImg');
const avatarFallback = document.getElementById('avatarFallback');

profileImg.addEventListener('error', () => {
  profileImg.style.display = 'none';
  avatarFallback.style.display = 'flex';
});

// ---- Popup modal ----
const popup = document.getElementById('popup');
const popupClose = document.getElementById('popupClose');

function showPopup(show) {
  popup.classList.toggle('open', show);
}

popupClose.addEventListener('click', () => showPopup(false));
popup.addEventListener('click', (e) => {
  if (e.target === popup) showPopup(false);
});

// ---- Add a recommendation ----
const recommendBtn = document.getElementById('recommend_btn');
const newRecommendation = document.getElementById('new_recommendation');
const allRecommendations = document.getElementById('all_recommendations');

function addRecommendation() {
  const text = newRecommendation.value.trim();
  if (!text) {
    newRecommendation.focus();
    return;
  }

  const card = document.createElement('div');
  card.className = 'recommendation';
  card.innerHTML = `<span class="quote-mark">&#8220;</span><p></p>`;
  card.querySelector('p').textContent = text;

  allRecommendations.appendChild(card);
  newRecommendation.value = '';
  showPopup(true);
}

recommendBtn.addEventListener('click', addRecommendation);