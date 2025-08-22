const videos = [
  document.getElementById('video1'),
  document.getElementById('video2'),
  document.getElementById('video3'),
  document.getElementById('video4')
];
const nextButton = document.getElementById('nextButton');
const pauseRing = document.getElementById('pauseRing');
const showcaseButton = document.getElementById('showcaseButton');
const popup = document.getElementById('popup');
const speedPopup = document.getElementById('speedPopup');
const bookShowcase = document.getElementById('bookShowcase');
const narratorButton = document.getElementById('narratorButton');
const noNarratorButton = document.getElementById('noNarratorButton');
const normalSpeedButton = document.getElementById('normalSpeedButton');
const slowSpeedButton = document.getElementById('slowSpeedButton');
const skipToShowcase = document.getElementById('skipToShowcase');
let currentVideoIndex = 0;
let isVideoPaused = false;

function playVideo(index, speed = 1) {
  const nextVideo = videos[index];
  const currentVideo = videos[currentVideoIndex];

  if (!nextVideo) return;

  // Show next video and start playback
  nextVideo.style.display = 'block';
  nextVideo.currentTime = 0;
  nextVideo.playbackRate = 1; // Reset to default
  nextVideo.playbackRate = speed; // Set desired speed
  console.log(`Playing video ${index + 1} at speed ${speed}`); // Debug log
  const playPromise = nextVideo.play().catch(error => console.error('Video playback failed:', error));

  // Wait for next video to be ready before hiding current video
  playPromise.then(() => {
    requestAnimationFrame(() => {
      // Hide all other videos
      videos.forEach((video, i) => {
        if (video && i !== index) video.style.display = 'none';
      });
      // Pause current video
      if (currentVideo && currentVideo !== nextVideo) currentVideo.pause();
      currentVideoIndex = index;
      // Show pause ring for video3 or video4
      if (pauseRing && (index === 2 || index === 3)) {
        pauseRing.style.display = 'block';
        pauseRing.style.border = '2px solid white';
        pauseRing.style.background = 'transparent';
        isVideoPaused = false;
        if (showcaseButton) showcaseButton.style.display = 'none';
      } else {
        if (pauseRing) pauseRing.style.display = 'none';
        if (showcaseButton) showcaseButton.style.display = 'none';
      }
    });
  });

  // Hide button and pop-ups
  if (nextButton) nextButton.style.display = 'none';
  if (popup) popup.style.display = 'none';
  if (speedPopup) speedPopup.style.display = 'none';
  if (bookShowcase) bookShowcase.style.display = 'none';
}

function showBookShowcase() {
  console.log('Showing book showcase'); // Debug log
  // Hide and pause videos
  videos.forEach(video => {
    if (video) {
      video.style.display = 'none';
      video.pause();
    }
  });
  if (nextButton) nextButton.style.display = 'none';
  if (pauseRing) pauseRing.style.display = 'none';
  if (showcaseButton) showcaseButton.style.display = 'none';
  if (popup) popup.style.display = 'none';
  if (speedPopup) speedPopup.style.display = 'none';
  if (bookShowcase) {
    requestAnimationFrame(() => {
      bookShowcase.style.display = 'flex';
    });
  } else {
    console.error('Book showcase element not found');
  }
}

function handleVideoEnd(index) {
  console.log(`Video ${index + 1} ended`); // Debug log
  if (index === 1) { // After video2.mp4
    if (popup) popup.style.display = 'flex';
  } else if (index === 0) { // After video1.mp4
    if (nextButton) nextButton.style.display = 'block';
  } else if (index === 2 || index === 3) { // After video3.mp4 or video4.mp4
    showBookShowcase();
  }
}

// Set up video end listeners
videos.forEach((video, index) => {
  if (video) {
    video.addEventListener('ended', () => handleVideoEnd(index));
    video.addEventListener('error', (e) => console.error(`Video ${index + 1} error:`, e)); // Debug log
  }
});

// Next button for video1 to video2
if (nextButton) {
  nextButton.addEventListener('click', () => {
    playVideo(1);
  });
}

// Narrator button plays video3
if (narratorButton) {
  narratorButton.addEventListener('click', () => playVideo(2));
}

// No Narrator button shows speed popup
if (noNarratorButton) {
  noNarratorButton.addEventListener('click', () => {
    if (popup) popup.style.display = 'none';
    if (speedPopup) speedPopup.style.display = 'flex';
  });
}

// Normal speed for video4
if (normalSpeedButton) {
  normalSpeedButton.addEventListener('click', () => playVideo(3, 1));
}

// Slow speed for video4
if (slowSpeedButton) {
  slowSpeedButton.addEventListener('click', () => playVideo(3, 0.75));
}

// Skip to book showcase
if (skipToShowcase) {
  skipToShowcase.addEventListener('click', (e) => {
    e.preventDefault();
    showBookShowcase();
  });
}

// Pause/unpause video and toggle showcase button and pause ring color
if (pauseRing) {
  pauseRing.addEventListener('click', () => {
    console.log('Toggling pause ring'); // Debug log
    const currentVideo = videos[currentVideoIndex];
    if (currentVideo) {
      if (isVideoPaused) {
        currentVideo.play().catch(error => console.error('Video playback failed:', error));
        isVideoPaused = false;
        if (showcaseButton) showcaseButton.style.display = 'none';
        pauseRing.style.border = '2px solid white';
        pauseRing.style.background = 'transparent';
        console.log(`Video ${currentVideoIndex + 1} unpaused`);
      } else {
        currentVideo.pause();
        isVideoPaused = true;
        if (showcaseButton) showcaseButton.style.display = 'block';
        pauseRing.style.border = '2px solid #FF6666';
        pauseRing.style.background = 'transparent';
        console.log(`Video ${currentVideoIndex + 1} paused`);
      }
    }
  });
}

// Showcase button to book showcase
if (showcaseButton) {
  showcaseButton.addEventListener('click', () => {
    showBookShowcase();
    console.log('Showcase button clicked');
  });
}

// Start the first video
if (videos[0]) {
  videos[0].play().catch(error => console.error('Initial video playback failed:', error));
}

// Add Book Showcase image interaction
const bookItems = document.querySelectorAll('.book-item');
bookItems.forEach((item, index) => {
  const character = item.querySelector('img').alt.replace(' at the Belle', '');
  const link = item.querySelector('a'); // Target the <a> tag
  console.log(`Setting up click for ${character} link`); // Debug log
  link.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`${character} link clicked`); // Debug log
    // Recreate characterPopup each time to avoid stale reference
    const characterPopup = document.createElement('div');
    characterPopup.className = 'character-popup'; // Unique class
    characterPopup.setAttribute('style', `
      display: flex !important;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background: rgba(0, 0, 0, 0.7) !important;
      z-index: 1000 !important;
      justify-content: center !important;
      align-items: center !important;
    `);
    characterPopup.innerHTML = `
      <div class="popup-content">
        <h2>Choose an Option</h2>
        <p>What would you like to do with ${character}?</p>
        <div class="button-row">
          <button class="popup-button watch-${character.toLowerCase()}">Watch ${character}'s Story</button>
          <button class="popup-button bring-${character.toLowerCase()}">Bring ${character} Home</button>
        </div>
      </div>
    `;
    document.body.appendChild(characterPopup);
    console.log(`${character} popup created, appended to body, in DOM: ${document.body.contains(characterPopup)}`); // Debug DOM presence

    // Add click-outside handler
    characterPopup.addEventListener('click', (e) => {
      if (e.target === characterPopup) {
        characterPopup.remove(); // Remove the element instead of just hiding
        console.log(`${character} popup removed by clicking outside`);
      }
    });

    const watchButton = characterPopup.querySelector(`.watch-${character.toLowerCase()}`);
    const bringButton = characterPopup.querySelector(`.bring-${character.toLowerCase()}`);

    watchButton.addEventListener('click', () => {
      characterPopup.remove();
      const characterFolders = {
        'Ned': 'file:///C:/Miss%20Belle%20Class/BelleWebsite/Ned%20Website/index.html',
        'Kym': 'file:///C:/Miss%20Belle%20Class/BelleWebsite/Kym%20Website/index.html',
        'Neville': 'file:///C:/Miss%20Belle%20Class/BelleWebsite/Neville%20Website/index.html',
        'Anna': 'file:///C:/Miss%20Belle%20Class/BelleWebsite/Anna%20Website/index.html'
      };
      window.location.href = characterFolders[character];
    });

    bringButton.addEventListener('click', () => {
      characterPopup.remove();
      const bringHomeLinks = {
        'Ned': 'https://a.co/d/hBaDbZA',
        'Kym': 'https://a.co/d/c4QHKXn',
        'Neville': 'https://a.co/d/5E6WCs0',
        'Anna': 'https://a.co/d/2BpyVux'
      };
      window.open(bringHomeLinks[character], '_blank');
    });
  });
});