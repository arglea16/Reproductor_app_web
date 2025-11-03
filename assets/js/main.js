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

  // Init all
  document.addEventListener('DOMContentLoaded', ()=>{
    initThemeToggle();
    initButtonRipples();
    initRevealOnScroll();
    initAudioPlayers();
    initSmoothScroll();
  });
})();
