/* main.js — interacciones ligeras para la UI */
(function(){
  'use strict';

  // Helpers
  const $ = q => document.querySelector(q);
  const $$ = q => Array.from(document.querySelectorAll(q));

  // Theme toggle (persist in localStorage)
  function initThemeToggle(){
    const btn = document.querySelector('.theme-toggle');
    if(!btn) return;
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
    if(saved === 'light') root.dataset.theme = 'light';

    btn.addEventListener('click', ()=>{
      const current = root.dataset.theme === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      if(next === 'light'){
        root.dataset.theme = 'light';
        localStorage.setItem('theme','light');
      } else {
        root.removeAttribute('data-theme');
        localStorage.removeItem('theme');
      }
      btn.classList.add('active');
      setTimeout(()=>btn.classList.remove('active'),300);
    });
  }

  // Ripple effect for .btn
  function initButtonRipples(){
    document.addEventListener('click', (e)=>{
      const btn = e.target.closest('.btn');
      if(!btn) return;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height) * 0.9;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
      ripple.style.top  = (e.clientY - rect.top - size/2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', ()=> ripple.remove());
    });
  }

  // Reveal-on-scroll using IntersectionObserver
  function initRevealOnScroll(){
    const items = document.querySelectorAll('.reveal');
    if(items.length === 0) return;
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e => {
        if(e.isIntersecting) e.target.classList.add('in-view');
      });
    },{threshold:0.12});
    items.forEach(i=>obs.observe(i));
  }

  // Audio simple helper: find audio elements and wire play/pause by container click
  function initAudioPlayers(){
    const players = document.querySelectorAll('.audio-player');
    if(!players.length) return;
    players.forEach(container => {
      const audio = container.querySelector('audio');
      const btn = container.querySelector('.btn-play');
      const progressBar = container.querySelector('.progress > i');
      if(!audio) return;
      btn && btn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if(audio.paused) audio.play(); else audio.pause();
      });
      audio.addEventListener('play', ()=> container.classList.add('playing'));
      audio.addEventListener('pause', ()=> container.classList.remove('playing'));
      audio.addEventListener('timeupdate', ()=>{
        if(progressBar) progressBar.style.width = (audio.currentTime / Math.max(audio.duration,1) * 100) + '%';
      });
      // click on container toggles play too
      container.addEventListener('click', ()=> {
        if(audio.paused) audio.play(); else audio.pause();
      });
    });
  }

  // Smooth scroll for anchor links
  function initSmoothScroll(){
    document.addEventListener('click', (e)=>{
      const a = e.target.closest('a[href^="#"]');
      if(!a) return;
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  }

  /* =====================
     Reproductor: playlist, buscador, canvas waveform
     ===================== */
  function initPlayer(){
    const audio = document.getElementById('player-audio');
    if(!audio) return;

    const canvas = document.getElementById('waveform');
    const canvasCtx = canvas ? canvas.getContext('2d') : null;
    const tracks = Array.from(document.querySelectorAll('.playlist .track'));
    const playToggle = document.querySelector('.btn-play-toggle');
    const prevBtn = document.querySelector('.btn-prev');
    const nextBtn = document.querySelector('.btn-next');
    const progressBar = document.querySelector('.progress > i');
    const timeLabel = document.querySelector('.time');
    const titleEl = document.querySelector('.track-title');
    const artistEl = document.querySelector('.track-artist');
    const searchInput = document.querySelector('.search');

    let currentIndex = -1;
    let audioCtx, sourceNode, analyser, dataArray, animationId;

    function setupAudioContext(){
      if(audioCtx) return;
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      sourceNode = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      const bufferLength = analyser.fftSize;
      dataArray = new Uint8Array(bufferLength);
      sourceNode.connect(analyser);
      analyser.connect(audioCtx.destination);
    }

    function drawWave(){
      if(!canvasCtx || !analyser) return;
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      analyser.getByteTimeDomainData(dataArray);
      canvasCtx.fillStyle = 'rgba(255,255,255,0.02)';
      canvasCtx.fillRect(0,0,WIDTH,HEIGHT);
      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgba(124,92,255,0.9)';
      canvasCtx.beginPath();
      const sliceWidth = WIDTH * 1.0 / dataArray.length;
      let x = 0;
      for(let i=0;i<dataArray.length;i++){
        const v = dataArray[i] / 128.0;
        const y = v * HEIGHT/2;
        if(i===0) canvasCtx.moveTo(x,y); else canvasCtx.lineTo(x,y);
        x += sliceWidth;
      }
      canvasCtx.lineTo(WIDTH,HEIGHT/2);
      canvasCtx.stroke();
      animationId = requestAnimationFrame(drawWave);
    }

    function stopDrawing(){
      if(animationId) cancelAnimationFrame(animationId);
      animationId = null;
      if(canvasCtx){
        canvasCtx.clearRect(0,0,canvas.width,canvas.height);
      }
    }

    function playTrack(index){
      if(index < 0 || index >= tracks.length) return;
      const t = tracks[index];
      const src = t.dataset.src;
      const title = t.dataset.title || 'Desconocido';
      const artist = t.dataset.artist || '';
      tracks.forEach(tr=>tr.classList.remove('active'));
      t.classList.add('active');
      titleEl.textContent = title;
      artistEl.textContent = artist;
      currentIndex = index;
      audio.pause();
      audio.src = src;
      audio.load();
      audio.play().catch(err=>{
        // On some browsers autoplay is blocked until user gesture
        console.log('play blocked: ', err);
      });
      // ensure audio context connected from user gesture
      setupAudioContext();
      if(analyser) drawWave();
      updatePlayButton(true);
    }

    function updatePlayButton(isPlaying){
      if(!playToggle) return;
      playToggle.textContent = isPlaying ? '⏸' : '▶️';
    }

    // Track click / play buttons
    tracks.forEach((t, idx)=>{
      t.addEventListener('click', (e)=>{
        if(e.target.closest('.btn')) return; // handled by button
        playTrack(idx);
      });
      const btn = t.querySelector('.btn-play');
      btn && btn.addEventListener('click',(ev)=>{
        ev.stopPropagation();
        if(currentIndex === idx && !audio.paused){
          audio.pause();
        } else {
          playTrack(idx);
        }
      });
    });

    playToggle && playToggle.addEventListener('click', ()=>{
      if(audio.paused){
        audio.play();
      } else audio.pause();
    });

    prevBtn && prevBtn.addEventListener('click', ()=>{
      const next = (currentIndex - 1 + tracks.length) % tracks.length;
      playTrack(next);
    });
    nextBtn && nextBtn.addEventListener('click', ()=>{
      const next = (currentIndex + 1) % tracks.length;
      playTrack(next);
    });

    // Progress update
    audio.addEventListener('timeupdate', ()=>{
      const pct = audio.duration ? (audio.currentTime / audio.duration * 100) : 0;
      if(progressBar) progressBar.style.width = pct + '%';
      if(timeLabel) timeLabel.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)} `;
    });
    audio.addEventListener('play', ()=> updatePlayButton(true));
    audio.addEventListener('pause', ()=> updatePlayButton(false));

    audio.addEventListener('ended', ()=>{
      // auto next
      const next = (currentIndex + 1) % tracks.length;
      playTrack(next);
    });

    // progress click to seek
    const progressContainer = document.querySelector('.progress');
    progressContainer && progressContainer.addEventListener('click', (e)=>{
      const rect = progressContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = x / rect.width;
      if(audio.duration) audio.currentTime = pct * audio.duration;
    });

    // Search filter
    searchInput && searchInput.addEventListener('input', (e)=>{
      const q = e.target.value.trim().toLowerCase();
      tracks.forEach(t=>{
        const title = (t.dataset.title||'').toLowerCase();
        const artist = (t.dataset.artist||'').toLowerCase();
        const match = title.includes(q) || artist.includes(q);
        t.style.display = match ? '' : 'none';
      });
    });

    // utils
    function formatTime(s){
      if(!s || isNaN(s)) return '0:00';
      const m = Math.floor(s/60); const sec = Math.floor(s%60).toString().padStart(2,'0');
      return `${m}:${sec}`;
    }

    // Resize canvas for high-DPI
    function resizeCanvas(){
      if(!canvas) return;
      const ratio = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * ratio);
      canvas.height = Math.floor(h * ratio);
      if(canvasCtx) canvasCtx.scale(ratio, ratio);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  }

  // Init all
  document.addEventListener('DOMContentLoaded', ()=>{
    initThemeToggle();
    initButtonRipples();
    initRevealOnScroll();
    initAudioPlayers();
    initSmoothScroll();
    initPlayer();
  });
})();
