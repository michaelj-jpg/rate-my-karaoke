/* ==========================================================================
   RATE MY KARAOKE - CORE APPLICATION LOGIC (REACTIVE STATE MANAGEMENT)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. DEFAULT DATA & INITIALIZATION
  // --------------------------------------------------------------------------
  const DEFAULT_CONTESTANTS = ['Jessica Miller', 'Tyler Robinson', 'Amanda Lee', 'Daniel Kim'];

  const DEFAULT_RATINGS = {
    'Jessica Miller': [
      { lyric: 10, tone: 9, crowd: 10, avg: 9.7 }
    ],
    'Tyler Robinson': [
      { lyric: 9, tone: 9, crowd: 9, avg: 9.0 },
      { lyric: 8, tone: 9, crowd: 10, avg: 8.8 }
    ],
    'Amanda Lee': [
      { lyric: 8, tone: 8, crowd: 9, avg: 8.3 },
      { lyric: 8, tone: 8, crowd: 8, avg: 8.0 }
    ],
    'Daniel Kim': []
  };

  // Main application state
  let state = {
    screen: 'landing', // 'landing' | 'thankyou'
    mode: 'host',      // 'host' | 'guest' (primarily for mobile view toggles)
    currentContestant: 'Jessica Miller',
    contestants: [...DEFAULT_CONTESTANTS],
    customLogo: null,  // Base64 DataURL
    ratings: JSON.parse(JSON.stringify(DEFAULT_RATINGS)),
    lastSubmittedVote: null
  };

  // --------------------------------------------------------------------------
  // 2. STATE PERSISTENCE (LOCAL STORAGE)
  // --------------------------------------------------------------------------
  const STORAGE_KEY = 'rate_my_karaoke_state_v1';

  function saveStateToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentContestant: state.currentContestant,
        contestants: state.contestants,
        customLogo: state.customLogo,
        ratings: state.ratings
      }));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }

  function loadStateFromLocalStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        state.currentContestant = parsed.currentContestant || state.currentContestant;
        state.contestants = parsed.contestants || state.contestants;
        state.customLogo = parsed.customLogo || state.customLogo;
        state.ratings = parsed.ratings || state.ratings;
      }
    } catch (e) {
      console.warn('Could not load localStorage, fallback to defaults:', e);
    }
  }

  // --------------------------------------------------------------------------
  // 3. CACHED DOM ELEMENTS
  // --------------------------------------------------------------------------
  const logoPreview = document.getElementById('app-logo-preview');
  const logoUpload = document.getElementById('logo-upload');
  const contestantSelector = document.getElementById('contestant-selector');
  const inputNewContestant = document.getElementById('input-new-contestant');
  const btnAddContestant = document.getElementById('btn-add-contestant');
  const leaderboardList = document.getElementById('leaderboard-list');
  const totalVotesCount = document.getElementById('total-votes-count');
  const guestScreenContent = document.getElementById('guest-screen-content');
  const btnResetDemo = document.getElementById('btn-reset-demo');

  // Mobile navigation tabs
  const btnToggleHost = document.getElementById('btn-toggle-host');
  const btnToggleGuest = document.getElementById('btn-toggle-guest');

  // --------------------------------------------------------------------------
  // 4. RENDERING ENGINE
  // --------------------------------------------------------------------------

  // A. Header Logo Render
  function renderHeaderLogo() {
    if (state.customLogo) {
      logoPreview.innerHTML = `<img src="${state.customLogo}" alt="Custom Venue Logo" />`;
      logoPreview.style.border = '1px solid var(--neon-pink)';
      logoPreview.style.boxShadow = '0 0 15px var(--neon-pink-glow)';
    } else {
      // Default SVG Mic Logo
      logoPreview.innerHTML = `
        <svg class="mic-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" x2="12" y1="19" y2="22"></line>
        </svg>
      `;
      logoPreview.style.border = '1px solid var(--neon-cyan)';
      logoPreview.style.boxShadow = '0 0 15px var(--neon-cyan-glow)';
    }
  }

  // B. Host Console Performer Selector Grid
  function renderPerformerSelector() {
    contestantSelector.innerHTML = '';
    
    state.contestants.forEach(contestant => {
      const button = document.createElement('button');
      button.className = `btn-performer ${state.currentContestant === contestant ? 'active' : ''}`;
      button.textContent = contestant;
      button.setAttribute('data-name', contestant);
      
      button.addEventListener('click', () => {
        state.currentContestant = contestant;
        saveStateToLocalStorage();
        
        // Re-render host components and guest app landing instantly (real-time sync effect!)
        renderPerformerSelector();
        
        // If guest is currently on the voting screen, update the performer name immediately
        const guestActiveName = document.getElementById('guest-active-performer');
        if (guestActiveName) {
          guestActiveName.textContent = contestant;
          // Apply a quick scale effect to indicate state update
          guestActiveName.style.transform = 'scale(1.05)';
          setTimeout(() => guestActiveName.style.transform = 'scale(1)', 150);
        }
      });
      
      contestantSelector.appendChild(button);
    });
  }

  // C. Host Console Leaderboard & Stats
  function renderLeaderboard() {
    leaderboardList.innerHTML = '';
    let totalVotes = 0;
    
    // Calculate stats for each contestant
    const statsList = state.contestants.map(contestant => {
      const contestantRatings = state.ratings[contestant] || [];
      const voteCount = contestantRatings.length;
      totalVotes += voteCount;

      let averageScore = 0;
      if (voteCount > 0) {
        const sum = contestantRatings.reduce((acc, curr) => acc + curr.avg, 0);
        averageScore = parseFloat((sum / voteCount).toFixed(1));
      }

      return {
        name: contestant,
        voteCount: voteCount,
        average: averageScore
      };
    });

    // Sort: high scores first. If scores are 0, put them last.
    statsList.sort((a, b) => {
      if (a.average === 0 && b.average > 0) return 1;
      if (b.average === 0 && a.average > 0) return -1;
      return b.average - a.average; // Descending
    });

    // Update global counter in Header Card
    totalVotesCount.textContent = `${totalVotes} ${totalVotes === 1 ? 'Vote' : 'Votes'} Cast`;

    if (totalVotes === 0) {
      leaderboardList.innerHTML = `
        <div class="empty-state">
          No ratings submitted yet.<br>Go to the Guest Phone App on the right and cast a vote!
        </div>
      `;
      return;
    }

    // Render sorted list items
    statsList.forEach((stat, index) => {
      // Create element
      const item = document.createElement('div');
      item.className = 'leaderboard-item';
      
      const averageText = stat.voteCount > 0 ? stat.average.toFixed(1) : '—';
      
      item.innerHTML = `
        <div class="leaderboard-rank-info">
          <span class="rank-number">${index + 1}</span>
          <span class="rank-name">${stat.name}</span>
        </div>
        <div class="rank-score-details">
          <span class="vote-badge">${stat.voteCount} ${stat.voteCount === 1 ? 'rating' : 'ratings'}</span>
          <span class="rank-score">${averageText}</span>
        </div>
      `;
      
      leaderboardList.appendChild(item);
    });
  }

  // D. Guest Mobile App Router & Screen Renderer
  function renderGuestScreen() {
    guestScreenContent.innerHTML = '';
    
    if (state.screen === 'landing') {
      const template = document.getElementById('temp-guest-landing');
      const clone = template.content.cloneNode(true);
      
      // Inject performer name
      clone.getElementById('guest-active-performer').textContent = state.currentContestant;
      
      // Setup dynamic slider bindings & interactive number display
      setupSliderGroup(clone, 'lyric', 'label-val-lyric');
      setupSliderGroup(clone, 'tone', 'label-val-tone');
      setupSliderGroup(clone, 'crowd', 'label-val-crowd');
      
      // Event listener for Submit Anonymous Rating
      clone.getElementById('btn-submit-rating').addEventListener('click', () => {
        const lyricVal = parseInt(document.getElementById('slider-lyric').value);
        const toneVal = parseInt(document.getElementById('slider-tone').value);
        const crowdVal = parseInt(document.getElementById('slider-crowd').value);
        
        // Calculate dynamic average
        const avgVal = parseFloat(((lyricVal + toneVal + crowdVal) / 3).toFixed(1));
        
        // Save the new score under ratings
        if (!state.ratings[state.currentContestant]) {
          state.ratings[state.currentContestant] = [];
        }
        
        const newRating = { lyric: lyricVal, tone: toneVal, crowd: crowdVal, avg: avgVal };
        state.ratings[state.currentContestant].push(newRating);
        
        // Set receipt data
        state.lastSubmittedVote = {
          performer: state.currentContestant,
          lyric: lyricVal,
          tone: toneVal,
          crowd: crowdVal,
          avg: avgVal
        };
        
        state.screen = 'thankyou';
        saveStateToLocalStorage();
        
        // Full Refresh
        renderLeaderboard();
        renderGuestScreen();
      });
      
      guestScreenContent.appendChild(clone);
      
    } else if (state.screen === 'thankyou') {
      const template = document.getElementById('temp-guest-thankyou');
      const clone = template.content.cloneNode(true);
      
      // Populate receipt data from state
      if (state.lastSubmittedVote) {
        clone.getElementById('receipt-contestant').textContent = state.lastSubmittedVote.performer;
        clone.getElementById('receipt-lyric').textContent = state.lastSubmittedVote.lyric;
        clone.getElementById('receipt-tone').textContent = state.lastSubmittedVote.tone;
        clone.getElementById('receipt-crowd').textContent = state.lastSubmittedVote.crowd;
        clone.getElementById('receipt-avg').textContent = state.lastSubmittedVote.avg.toFixed(1);
      }
      
      // Return back to voting home
      clone.getElementById('btn-return-home').addEventListener('click', () => {
        state.screen = 'landing';
        state.lastSubmittedVote = null;
        renderGuestScreen();
      });
      
      guestScreenContent.appendChild(clone);
    }
  }

  // E. Utility function to bind range inputs to their dynamic span numbers
  function setupSliderGroup(container, sliderId, labelId) {
    const slider = container.getElementById(`slider-${sliderId}`);
    const label = container.getElementById(labelId);
    
    // Set initial display
    label.textContent = `${slider.value}/10`;
    
    // Update live text on input drag
    slider.addEventListener('input', (e) => {
      label.textContent = `${e.target.value}/10`;
    });
  }

  // --------------------------------------------------------------------------
  // 5. EVENT HANDLERS & BINDINGS
  // --------------------------------------------------------------------------

  // A. Logo Upload handler
  logoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 3MB for localStorage base64 string storage safety)
    if (file.size > 3 * 1024 * 1024) {
      alert('Selected image is too large! Please choose an image smaller than 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      state.customLogo = event.target.result;
      saveStateToLocalStorage();
      renderHeaderLogo();
    };
    reader.readAsDataURL(file);
  });

  // B. Add Performer Controller
  function addCustomPerformer() {
    const rawName = inputNewContestant.value.trim();
    
    // Validations
    if (!rawName) return;
    
    // Escape simple tags, keep it clean
    const safeName = rawName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    if (state.contestants.includes(safeName)) {
      alert('A performer with this name already exists!');
      return;
    }

    // Insert new performer
    state.contestants.push(safeName);
    state.ratings[safeName] = []; // Initialize empty votes array
    
    // Clean up interface
    inputNewContestant.value = '';
    
    // Automatically select the newly created performer as active
    state.currentContestant = safeName;
    
    saveStateToLocalStorage();
    
    // Update dashboard views instantly
    renderPerformerSelector();
    renderLeaderboard();
    renderGuestScreen();
  }

  btnAddContestant.addEventListener('click', addCustomPerformer);
  inputNewContestant.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      addCustomPerformer();
    }
  });

  // C. Reset Demo button
  btnResetDemo.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all scores, uploaded logo, and custom performers? This will restore the demo defaults.')) {
      localStorage.removeItem(STORAGE_KEY);
      
      // Reset state completely
      state.screen = 'landing';
      state.currentContestant = 'Jessica Miller';
      state.contestants = [...DEFAULT_CONTESTANTS];
      state.customLogo = null;
      state.ratings = JSON.parse(JSON.stringify(DEFAULT_RATINGS));
      state.lastSubmittedVote = null;
      
      // Re-initialize views
      renderHeaderLogo();
      renderPerformerSelector();
      renderLeaderboard();
      renderGuestScreen();
    }
  });

  // D. Mobile Screen view manager (CSS class switches panels on body)
  function setMobileView(viewMode) {
    state.mode = viewMode;
    
    if (viewMode === 'host') {
      document.body.className = 'view-host';
      btnToggleHost.classList.add('active');
      btnToggleGuest.classList.remove('active');
    } else {
      document.body.className = 'view-guest';
      btnToggleHost.classList.remove('active');
      btnToggleGuest.classList.add('active');
    }
  }

  btnToggleHost.addEventListener('click', () => setMobileView('host'));
  btnToggleGuest.addEventListener('click', () => setMobileView('guest'));

  // --------------------------------------------------------------------------
  // 6. INITIAL RENDER CALLS
  // --------------------------------------------------------------------------
  loadStateFromLocalStorage();
  
  // Set default body class for responsive view rendering
  document.body.className = 'view-host';

  renderHeaderLogo();
  renderPerformerSelector();
  renderLeaderboard();
  renderGuestScreen();
});

// Register PWA Service Worker for offline / standalone mobile installations
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered successfully with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });
  });
}
