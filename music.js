(() => {
  'use strict';
  const audio = document.getElementById('afternoon-music');
  const corner = document.querySelector('.music-corner');
  const toggle = document.getElementById('music-toggle');
  const label = document.getElementById('music-label');
  const status = document.getElementById('music-status');
  let desired = true, starting = false, fadeFrame = null, hasError = false;
  audio.loop = true;
  audio.volume = .18;

  function update() {
    const playing = !audio.paused && !audio.ended;
    corner.classList.toggle('is-playing', playing);
    corner.classList.toggle('has-error', hasError);
    toggle.setAttribute('aria-pressed', String(playing));
    toggle.setAttribute('aria-label', playing ? '暂停背景音乐：森林小厨' : '播放背景音乐：森林小厨');
    toggle.title = (playing ? '点击暂停' : '点击播放') + ' · 森水垚 / 沐灵仙《森林小厨》';
    label.textContent = hasError ? '再听一次' : playing ? '森林小厨' : '听一会儿';
    status.textContent = hasError ? '音乐暂时未能加载，可点击音符重试。' : playing ? '背景音乐正在播放。' : '点击音符，可以听一会儿音乐。';
  }
  function fadeIn() {
    if (fadeFrame) cancelAnimationFrame(fadeFrame);
    const from = performance.now();
    audio.volume = .06;
    function tick(now) {
      if (audio.paused || !desired) return;
      const progress = Math.min(1, (now - from) / 1400);
      audio.volume = .06 + .16 * progress;
      if (progress < 1) fadeFrame = requestAnimationFrame(tick);
      else fadeFrame = null;
    }
    fadeFrame = requestAnimationFrame(tick);
  }
  async function start() {
    if (starting || !desired || !audio.paused) return;
    starting = true;
    hasError = false;
    if (audio.error) audio.load();
    audio.volume = .18;
    try {
      await audio.play();
      if (!desired) audio.pause();
      else fadeIn();
    } catch (error) {
      // A blocked autoplay request remains ready for the first real gesture.
      hasError = error.name !== 'NotAllowedError' && error.name !== 'AbortError';
    } finally {
      starting = false;
      update();
    }
  }
  function pause() {
    desired = false;
    if (fadeFrame) cancelAnimationFrame(fadeFrame);
    fadeFrame = null;
    audio.pause();
    update();
  }
  toggle.addEventListener('click', () => {
    if (!audio.paused || starting) pause();
    else { desired = true; start(); }
  });
  function firstGesture(event) {
    if (!event.isTrusted || event.target.closest?.('#music-toggle')) return;
    if (event.type === 'keydown' && !['Enter', ' ', 'Spacebar'].includes(event.key)) return;
    if (desired && audio.paused) start();
  }
  document.addEventListener('pointerdown', firstGesture, {capture:true, passive:true});
  document.addEventListener('keydown', firstGesture, {capture:true});
  audio.addEventListener('play', update);
  audio.addEventListener('pause', update);
  audio.addEventListener('error', () => { hasError = true; update(); });
  window.addEventListener('pagehide', () => audio.pause());
  window.addEventListener('pageshow', event => { if (event.persisted && desired) start(); });
  update();
  if (desired) start();
})();
