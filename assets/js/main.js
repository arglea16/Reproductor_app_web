/* main.js — interacciones ligeras para la UI y reproductor con visualización de barras */
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
       Reproductor: playlist, buscador, canvas bars
       ===================== */
    function initPlayer(){
      const audio = document.getElementById('player-audio');
      if(!audio) return;

      const canvas = document.getElementById('waveform');
      const canvasCtx = canvas ? canvas.getContext('2d') : null;
      let tracks = Array.from(document.querySelectorAll('.playlist .track'));
      const playToggle = document.querySelector('.btn-play-toggle');
      const prevBtn = document.querySelector('.btn-prev');
      const nextBtn = document.querySelector('.btn-next');
      const progressBar = document.querySelector('.progress > i');
      const timeLabel = document.querySelector('.time');
      const titleEl = document.querySelector('.track-title');
      const artistEl = document.querySelector('.track-artist');
      const searchInput = document.querySelector('.search');
      const addBtn = document.querySelector('.add-track');
      const fileInput = document.getElementById('file-add');

      let currentIndex = -1;
      let audioCtx, sourceNode, analyser, dataArray, animationId;

      function setupAudioContext(){
        if(audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        sourceNode = audioCtx.createMediaElementSource(audio);
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024; // smaller -> fewer bins
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        sourceNode.connect(analyser);
        analyser.connect(audioCtx.destination);
      }

      // drawing: frequency bars
      function drawWave(){
        if(!canvasCtx || !analyser) return;
        const WIDTH = canvas.clientWidth;
        const HEIGHT = canvas.clientHeight;
        analyser.getByteFrequencyData(dataArray);

        // trailing clear for smoothness
        canvasCtx.fillStyle = 'rgba(2,6,20,0.06)';
        canvasCtx.fillRect(0,0,WIDTH,HEIGHT);

        const maxBars = Math.min(120, Math.floor(WIDTH / 4));
        const barCount = Math.max(16, maxBars);
        const step = Math.max(1, Math.floor(dataArray.length / barCount));
        const barWidth = WIDTH / barCount * 0.75;
        const gap = (WIDTH / barCount) * 0.25;

        const grad = canvasCtx.createLinearGradient(0,0,0,HEIGHT);
        grad.addColorStop(0, 'rgba(124,92,255,0.95)');
        grad.addColorStop(0.5, 'rgba(0,212,255,0.85)');
        grad.addColorStop(1, 'rgba(0,212,255,0.35)');

        canvasCtx.fillStyle = grad;
        canvasCtx.shadowBlur = 12;
        canvasCtx.shadowColor = 'rgba(0,212,255,0.25)';

        for(let i=0;i<barCount;i++){
          const dataIndex = i * step;
          const v = dataArray[dataIndex] || 0; // 0..255
          const h = (v / 255) * (HEIGHT * 0.95);
          const x = i * (barWidth + gap);
          const y = HEIGHT - h;
          const radius = Math.min(6, barWidth * 0.2);
          roundRect(canvasCtx, x, y, barWidth, h, radius);
          canvasCtx.fill();
        }

        canvasCtx.shadowBlur = 0;
        animationId = requestAnimationFrame(drawWave);
      }

      function stopDrawing(){
        if(animationId) cancelAnimationFrame(animationId);
        animationId = null;
        if(canvasCtx){
          canvasCtx.clearRect(0,0,canvas.width,canvas.height);
        }
      }

      // helper to draw rounded rectangle path (does not fill)
      function roundRect(ctx, x, y, w, h, r){
        const radius = Math.min(r, w/2, h/2);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + w, y, x + w, y + h, radius);
        ctx.arcTo(x + w, y + h, x, y + h, radius);
        ctx.arcTo(x, y + h, x, y, radius);
        ctx.arcTo(x, y, x + w, y, radius);
        ctx.closePath();
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
          console.log('play blocked: ', err);
        });
        setupAudioContext();
        if(analyser) drawWave();
        updatePlayButton(true);
      }

      function updatePlayButton(isPlaying){
        if(!playToggle) return;
        playToggle.textContent = isPlaying ? '⏸' : '▶️';
      }

      // Create track element dynamically
      function escapeHtml(s){
        return String(s).replace(/[&<>"']/g, function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m];});
      }
      function createTrackElement(src, title, artist, autoplay=false){
        const tpl = document.createElement('div');
        tpl.className = 'track reveal';
        tpl.dataset.src = src;
        tpl.dataset.title = title || 'Sin título';
        tpl.dataset.artist = artist || '';
        tpl.innerHTML = `<div class="track-meta"><strong>${escapeHtml(title||'Sin título')}</strong><span class="muted">${escapeHtml(artist||'Local')}</span></div><div class="track-actions"><button class="btn btn-play">Play</button></div>`;
        const list = document.querySelector('.playlist');
        list.appendChild(tpl);
        // attach listeners
        const idx = tracks.length;
        tpl.addEventListener('click', (e)=>{
          if(e.target.closest('.btn')) return;
          playTrack(idx);
        });
        const btn = tpl.querySelector('.btn-play');
        btn && btn.addEventListener('click',(ev)=>{
          ev.stopPropagation();
          if(currentIndex === idx && !audio.paused){
            audio.pause();
          } else {
            playTrack(idx);
          }
        });
        tracks.push(tpl);
        if(autoplay) playTrack(idx);
      }

      // Wire existing tracks
      tracks.forEach((t, idx)=>{
        t.addEventListener('click', (e)=>{
          if(e.target.closest('.btn')) return;
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
          // ensure AudioContext is created from a user gesture
          try{ setupAudioContext(); } catch(e){ /* ignore */ }
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
      // When audio starts, ensure audio context exists and start visualizer
      audio.addEventListener('play', ()=>{
        try{ setupAudioContext(); } catch(e){}
        if(analyser) drawWave();
        updatePlayButton(true);
      });
      audio.addEventListener('pause', ()=>{
        updatePlayButton(false);
        stopDrawing();
      });

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

      // Add-track logic: upload to server, fallback to objectURL
      if(addBtn && fileInput){
        addBtn.addEventListener('click', ()=> fileInput.click());
        fileInput.addEventListener('change', async (ev)=>{
          const files = Array.from(ev.target.files || []);
          if(files.length === 0) return;
          try{
            const saved = await uploadFilesToServer(files);
            if(Array.isArray(saved) && saved.length){
              saved.forEach((path, i)=>{
                const file = files[i] || {};
                const name = file.name ? file.name.replace(/\.[^/.]+$/, '') : path.split('/').pop();
                createTrackElement(path, name, 'Servidor', i===0);
              });
            } else {
              files.forEach((file, i)=>{
                if(!file.type.startsWith('audio/')) return;
                const src = URL.createObjectURL(file);
                const name = file.name.replace(/\.[^/.]+$/, '');
                createTrackElement(src, name, 'Local', i===0);
              });
            }
          } catch(err){
            console.error('Upload failed, using local URLs', err);
            files.forEach((file, i)=>{
              if(!file.type.startsWith('audio/')) return;
              const src = URL.createObjectURL(file);
              const name = file.name.replace(/\.[^/.]+$/, '');
              createTrackElement(src, name, 'Local', i===0);
            });
          }
          fileInput.value = '';
        });
      }

      // Upload helper: sends files to routes/upload.php, returns array of saved relative paths
      async function uploadFilesToServer(files){
        const form = new FormData();
        files.forEach(f=> form.append('tracks[]', f));

        const resp = await fetch('routes/upload.php', {
          method: 'POST',
          body: form
        });
        if(!resp.ok) throw new Error('Upload HTTP error ' + resp.status);
        const data = await resp.json();
        if(data && Array.isArray(data.saved) && data.saved.length) return data.saved;
        if(data && data.errors && data.errors.length) throw new Error('Upload errors: ' + data.errors.join('; '));
        return [];
      }

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
        // set backing store size in device pixels
        canvas.width = Math.floor(w * ratio);
        canvas.height = Math.floor(h * ratio);
        // reset transform and scale so drawing uses CSS pixels coordinates
        if(canvasCtx){
          if(typeof canvasCtx.resetTransform === 'function') canvasCtx.resetTransform();
          // set transform to scale drawing operations by ratio
          canvasCtx.setTransform(ratio,0,0,ratio,0,0);
        }
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
