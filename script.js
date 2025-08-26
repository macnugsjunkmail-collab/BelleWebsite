// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  let youtubePlayers = {};
  let currentVideoIndex = 0;
  let isVideoPaused = false;

  // Manually load YouTube IFrame API if not already loaded
  function loadYouTubeAPI() {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }
  loadYouTubeAPI();

  // Initialize YouTube IFrame API
  window.onYouTubeIframeAPIReady = function() {
    console.log('YouTube IFrame API ready');
    youtubePlayers[2] = new YT.Player('video3', {
      height: '100%',
      width: '100%',
      videoId: 'jDu0UOIfBwM',
      playerVars: {
        'controls': 0,
        'rel': 0,
        'showinfo': 0,
        'modestbranding': 1,
        'enablejsapi': 1
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
    youtubePlayers[3] = new YT.Player('video4', {
      height: '100%',
      width: '100%',
      videoId: 'a4QlEBFXsxo',
      playerVars: {
        'controls': 0,
        'rel': 0,
        'showinfo': 0,
        'modestbranding': 1,
        'enablejsapi': 1
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  };

  function onPlayerReady(event) {
    console.log('YouTube player ready');
    const player = event.target;
    const playerId = player.getIframe().id;
    console.log(`YouTube player ${playerId} ready, currentIndex: ${currentVideoIndex}`);
    const quality = player.getAvailableQualityLevels();
    const currentQuality = player.getPlaybackQuality();
    console.log(`Available qualities for ${playerId}:`, quality);
    console.log(`Current playback quality for ${playerId}:`, currentQuality);
    if (playerId === `video${currentVideoIndex + 1}` && !isVideoPaused) {
      player.playVideo();
    }
    startQualityCheck(player);
  }

  function onPlayerStateChange(event) {
    const player = event.target;
    const playerId = player.getIframe().id;
    const currentQuality = player.getPlaybackQuality();
    console.log(`YouTube player state change for ${playerId}:`, event.data, `Quality: ${currentQuality}`);
    if (event.data == YT.PlayerState.ENDED) {
      player.stopVideo();
      let index = parseInt(playerId.replace('video', '')) - 1;
      console.log(`Parsed index for ${playerId}: ${index}`);
      handleVideoEnd(index);
      document.getElementById(playerId).style.display = 'none';
    } else if (event.data == YT.PlayerState.PLAYING) {
      // Removed on-screen update, keeping console log
      console.log(`Playing ${playerId} at quality: ${currentQuality}`);
    }
  }

  function startQualityCheck(player) {
    const playerId = player.getIframe().id;
    const checkQuality = () => {
      const currentQuality = player.getPlaybackQuality();
      const quality = player.getAvailableQualityLevels();
      console.log(`Quality check for ${playerId}: Current: ${currentQuality}, Available:`, quality);
    };
    const intervalId = setInterval(() => {
      if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        checkQuality();
      } else {
        clearInterval(intervalId);
      }
    }, 2000);
    setTimeout(() => clearInterval(intervalId), 30000); // Stop after 30 seconds
  }

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

  function playVideo(index, speed = 1) {
    const currentVideo = videos[currentVideoIndex];

    if (!videos[index]) return;

    // Hide all videos
    videos.forEach((video, i) => {
      if (video) video.style.display = 'none';
    });

    currentVideoIndex = index; // Ensure index is updated here
    console.log(`Setting currentVideoIndex to ${index}`);
    if (index === 0 || index === 1) {
      const nextVideo = videos[index];
      nextVideo.style.display = 'block';
      nextVideo.currentTime = 0;
      nextVideo.playbackRate = 1;
      nextVideo.playbackRate = speed;
      console.log(`Playing video ${index + 1} at speed ${speed}`);
      let playPromise = nextVideo.play();
      if (playPromise !== undefined && typeof playPromise.catch === 'function') {
        playPromise.catch(error => console.error('Video playback failed:', error));
      }
      if (pauseRing && (index === 0)) {
        pauseRing.style.display = 'block';
        pauseRing.style.opacity = '0.3';
        pauseRing.style.border = '2px solid white';
        pauseRing.style.background = 'transparent';
        isVideoPaused = false;
        if (showcaseButton) showcaseButton.style.display = 'none';
      } else {
        if (pauseRing) pauseRing.style.display = 'none';
        if (showcaseButton) showcaseButton.style.display = 'none';
      }
    } else if (index === 2 || index === 3) {
      const player = youtubePlayers[index];
      if (player && typeof player.playVideo === 'function') {
        document.getElementById(`video${index + 1}`).style.display = 'block';
        player.setSize('100%', '100%');
        player.setPlaybackRate(speed);
        console.log(`Attempting to play YouTube video ${index + 1} at speed ${speed}`);
        player.playVideo();
      } else {
        console.error(`YouTube player for index ${index} not initialized`);
      }
      if (pauseRing && (index === 2 || index === 3)) {
        pauseRing.style.display = 'block';
        pauseRing.style.opacity = '0.3';
        pauseRing.style.border = '2px solid white';
        pauseRing.style.background = 'transparent';
        isVideoPaused = false;
        if (showcaseButton) showcaseButton.style.display = 'none';
      } else {
        if (pauseRing) pauseRing.style.display = 'none';
        if (showcaseButton) showcaseButton.style.display = 'none';
      }
    }

    // Hide button and pop-ups
    if (nextButton) nextButton.style.display = 'none';
    if (popup) popup.style.display = 'none';
    if (speedPopup) speedPopup.style.display = 'none';
    if (bookShowcase) bookShowcase.style.display = 'none';

    if (currentVideo && currentVideo !== videos[index]) currentVideo.pause();
  }

  function showBookShowcase() {
    console.log('Showing book showcase');
    videos.forEach(video => {
      if (video) {
        video.style.display = 'none';
        if (video.pause) video.pause();
      }
    });
    Object.values(youtubePlayers).forEach(player => {
      if (player && typeof player.stopVideo === 'function') player.stopVideo();
    });
    if (nextButton) nextButton.style.display = 'none';
    if (pauseRing) pauseRing.style.display = 'none';
    if (showcaseButton) showcaseButton.style.display = 'none';
    if (popup) popup.style.display = 'none';
    if (speedPopup) speedPopup.style.display = 'none';
    if (bookShowcase) {
      console.log('ScrollTop:', document.getElementById('bookShowcase').scrollTop, 'ScrollLeft:', document.getElementById('bookShowcase').scrollLeft);
      requestAnimationFrame(() => {
        bookShowcase.style.display = 'flex';
      });
    } else {
      console.error('Book showcase element not found');
    }
  }

  function handleVideoEnd(index) {
    console.log(`Video ${index + 1} ended`);
    if (index === 1) {
      if (popup) popup.style.display = 'flex';
    } else if (index === 0) {
      if (nextButton) nextButton.style.display = 'block';
    } else if (index === 2 || index === 3) {
      showBookShowcase();
    }
  }

  videos.forEach((video, index) => {
    if (video && index < 2) {
      video.addEventListener('ended', () => handleVideoEnd(index));
      video.addEventListener('error', (e) => console.error(`Video ${index + 1} error:`, e));
    }
  });

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      playVideo(1);
    });
  }

  if (narratorButton) {
    narratorButton.addEventListener('click', () => playVideo(2));
  }

  if (noNarratorButton) {
    noNarratorButton.addEventListener('click', () => {
      if (popup) popup.style.display = 'none';
      if (speedPopup) speedPopup.style.display = 'flex';
    });
  }

  if (normalSpeedButton) {
    normalSpeedButton.addEventListener('click', () => playVideo(3, 1));
  }

  if (slowSpeedButton) {
    slowSpeedButton.addEventListener('click', () => playVideo(3, 0.75));
  }

  if (skipToShowcase) {
    skipToShowcase.addEventListener('click', (e) => {
      e.preventDefault();
      showBookShowcase();
    });
  }

  if (pauseRing) {
    pauseRing.addEventListener('click', () => {
      console.log('Toggling pause ring, currentIndex:', currentVideoIndex);
      const currentVideo = videos[currentVideoIndex];
      const fullscreenButton = document.getElementById('fullscreenButton');
      if (currentVideoIndex < 2) {
        if (currentVideo) {
          if (isVideoPaused) {
            currentVideo.play().catch(error => console.error('Video playback failed:', error));
            isVideoPaused = false;
            pauseRing.style.opacity = '0.3';
            pauseRing.style.border = '2px solid white';
            pauseRing.style.background = 'transparent';
            if (showcaseButton) showcaseButton.style.display = 'none';
            if (fullscreenButton) fullscreenButton.style.display = 'none';
            console.log(`Video ${currentVideoIndex + 1} unpaused`);
          } else {
            currentVideo.pause();
            isVideoPaused = true;
            pauseRing.style.opacity = '1';
            pauseRing.style.border = '2px solid #ff0000';
            pauseRing.style.background = 'transparent';
            if (currentVideoIndex === 0) {
              let fullscreenButton = document.getElementById('fullscreenButton');
              if (!fullscreenButton) {
                fullscreenButton = document.createElement('button');
                fullscreenButton.id = 'fullscreenButton';
                fullscreenButton.className = 'showcase-button';
                fullscreenButton.textContent = 'Fullscreen';
                fullscreenButton.style.position = 'absolute';
                fullscreenButton.style.bottom = '20px';
                fullscreenButton.style.left = '50%';
                fullscreenButton.style.transform = 'translateX(-50%)';
                document.querySelector('.button-container').appendChild(fullscreenButton);
              }
              fullscreenButton.style.display = 'block';
              if (showcaseButton) showcaseButton.style.display = 'none';
            } else if (currentVideoIndex === 1) {
              if (showcaseButton) showcaseButton.style.display = 'none';
            }
            console.log(`Video ${currentVideoIndex + 1} paused`);
          }
        }
      } else {
        const player = youtubePlayers[currentVideoIndex];
        if (player && typeof player.playVideo === 'function') {
          if (isVideoPaused) {
            player.playVideo();
            isVideoPaused = false;
            pauseRing.style.opacity = '0.3';
            pauseRing.style.border = '2px solid white';
            pauseRing.style.background = 'transparent';
            if (showcaseButton) showcaseButton.style.display = 'none';
            if (fullscreenButton) fullscreenButton.style.display = 'none';
            console.log(`YouTube video ${currentVideoIndex + 1} unpaused`);
          } else {
            player.pauseVideo();
            isVideoPaused = true;
            pauseRing.style.opacity = '1';
            pauseRing.style.border = '2px solid #ff0000';
            pauseRing.style.background = 'transparent';
            if (currentVideoIndex === 2 || currentVideoIndex === 3) {
              if (showcaseButton) showcaseButton.style.display = 'block';
            }
            console.log(`YouTube video ${currentVideoIndex + 1} paused`);
          }
        } else {
          console.error(`YouTube player for index ${currentVideoIndex} not available`);
        }
      }
    });
  }

  document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'fullscreenButton') {
      const body = document.querySelector('body');
      const fullscreenButton = document.getElementById('fullscreenButton');
      const currentVideo = videos[currentVideoIndex];
      if (body.requestFullscreen) {
        body.requestFullscreen().then(() => {
          if (fullscreenButton) fullscreenButton.style.display = 'none';
          if (currentVideoIndex === 0 && currentVideo && currentVideo.paused) {
            currentVideo.play().catch(error => console.error('Unpause failed:', error));
            isVideoPaused = false;
            if (pauseRing) pauseRing.style.display = 'none';
            console.log('Video1 unpaused via Fullscreen button');
          }
        }).catch(err => {
          console.log('Fullscreen request failed:', err);
        });
      } else if (body.webkitRequestFullscreen) {
        body.webkitRequestFullscreen();
        if (fullscreenButton) fullscreenButton.style.display = 'none';
        if (currentVideoIndex === 0 && currentVideo && currentVideo.paused) {
          currentVideo.play().catch(error => console.error('Unpause failed:', error));
          isVideoPaused = false;
          if (pauseRing) pauseRing.style.display = 'none';
          console.log('Video1 unpaused via Fullscreen button');
        }
      }
    }
  });

  if (showcaseButton) {
    showcaseButton.addEventListener('click', () => {
      showBookShowcase();
      console.log('Showcase button clicked');
    });
  }

  if (videos[0]) {
    playVideo(0);
  }

  const bookItems = document.querySelectorAll('.book-item');
  console.log('Book items found:', bookItems.length);
  if (bookItems.length === 0) {
    console.error('No book items found in the DOM');
  }
  bookItems.forEach((item, index) => {
    const character = item.querySelector('img').alt.replace(' at the Belle', '');
    const img = item.querySelector('img');
    if (!img) {
      console.error(`No img found in book item ${index}`);
      return;
    }
    console.log(`Setting up click for ${character} image`);
    img.addEventListener('click', (e) => {
      console.log(`Clicked ${character} image`);
      e.preventDefault();
      e.stopPropagation();
      console.log(`${character} image clicked`);
      const characterPopup = document.createElement('div');
      characterPopup.className = 'character-popup';
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
      console.log(`${character} popup created, appended to body, in DOM: ${document.body.contains(characterPopup)}`);

      characterPopup.addEventListener('click', (e) => {
        if (e.target === characterPopup) {
          characterPopup.remove();
          console.log(`${character} popup removed by clicking outside`);
        }
      });

      const watchButton = characterPopup.querySelector(`.watch-${character.toLowerCase()}`);
      const bringButton = characterPopup.querySelector(`.bring-${character.toLowerCase()}`);

      watchButton.addEventListener('click', () => {
        characterPopup.remove();
        const characterFolders = {
          'Ned': 'Ned index.html',
          'Kym': 'Kym index.html',
          'Neville': 'Neville index.html',
          'Anna': 'Anna index.html'
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
});