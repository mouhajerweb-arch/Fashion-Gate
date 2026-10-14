/* GSAP is enhancement: nothing is hidden until a supported animation is constructed. */
(() => {
  'use strict';
  let media;
  let scheduled = false;
  let introPlayed = false;
  const editor = () => window.elementorFrontend?.isEditMode?.() || new URLSearchParams(location.search).has('elementor-preview');
  const num = (value, fallback, min, max) => Math.min(max, Math.max(min, Number.isFinite(Number(value)) && value !== '' ? Number(value) : fallback));
  function init() {
    scheduled = false;
    media?.revert();
    if (editor() || !window.gsap || !window.ScrollTrigger) return;
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    if (!introPlayed && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      introPlayed = true;
      let seen = false;
      try { seen = sessionStorage.getItem('fg-intro-seen') === 'yes'; sessionStorage.setItem('fg-intro-seen', 'yes'); } catch {}
      const intro = document.querySelector('.fg-intro');
      if (intro && !seen) {
        gsap.set(intro, { display: 'flex', opacity: 1 });
        gsap.to(intro, { opacity: 0, duration: .55, delay: .35, onComplete: () => gsap.set(intro, { display: 'none' }) });
      }
    }
    media = gsap.matchMedia();
    const mobile = window.fgMotion?.mobile || 767;
    const tablet = window.fgMotion?.tablet || 1024;
    media.add({ desktop: `(min-width:${tablet + 1}px)`, tablet: `(min-width:${mobile + 1}px) and (max-width:${tablet}px)`, mobile: `(max-width:${mobile}px)`, reduce: '(prefers-reduced-motion: reduce)' }, context => {
      const cleanup = [];
      const conditions = context.conditions;
      const device = conditions.desktop ? 'desktop' : conditions.tablet ? 'tablet' : 'mobile';
      document.querySelectorAll('[data-fg-animation]').forEach(el => {
        const d = el.dataset;
        if (d[`fg${device[0].toUpperCase() + device.slice(1)}`] !== 'yes') return;
        let animation;
        try {
          if (conditions.reduce) {
            if (d.fgReduced === 'fade') gsap.fromTo(el, { opacity: .8 }, { opacity: 1, duration: .15, clearProps: 'opacity' });
            return;
          }
          const type = d.fgAnimation;
          const rtl = getComputedStyle(el).direction === 'rtl' ? -1 : 1;
          const presets = {
            fade: { opacity: 0 }, 'fade-up': { opacity: 0, y: 32 }, 'fade-down': { opacity: 0, y: -32 },
            'reveal-left': { opacity: 0, x: -40 * rtl }, 'reveal-right': { opacity: 0, x: 40 * rtl },
            'mask-up': { clipPath: 'inset(100% 0% 0% 0%)' }, 'mask-down': { clipPath: 'inset(0% 0% 100% 0%)' },
            'scale-reveal': { opacity: 0, scale: 1.04 }, 'blur-reveal': { opacity: 0, filter: 'blur(6px)' },
            'text-reveal': { opacity: 0, y: 22 }, parallax: { yPercent: -num(d.fgStrength, 10, 0, 30) }
          };
          if (!presets[type]) return;
          const targets = type === 'text-reveal' && el.querySelector('.fg-text-part') ? el.querySelectorAll('.fg-text-part') : el;
          const scrub = type === 'parallax' || d.fgTrigger === 'progress' ? num(d.fgScrub, 1, .1, 3) : num(d.fgScrub, 0, 0, 3);
          const to = { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)', clipPath: 'inset(0% 0% 0% 0%)', yPercent: type === 'parallax' ? num(d.fgStrength, 10, 0, 30) : 0,
            duration: num(d.fgDuration, .8, .1, 3), delay: num(d.fgDelay, 0, 0, 2), stagger: num(d.fgStagger, .08, 0, .5), ease: ['none','power2.out','power3.out','expo.out'].includes(d.fgEase) ? d.fgEase : 'power2.out' };
          if (d.fgTrigger !== 'load') to.scrollTrigger = { trigger: el, start: d.fgStart || 'top 85%', end: d.fgEnd || 'bottom top', scrub: scrub || false, pin: conditions.desktop && d.fgPin === 'yes', once: !scrub && d.fgPin !== 'yes', invalidateOnRefresh: true };
          if (!scrub) to.onComplete = () => gsap.set(targets, { clearProps: 'opacity,transform,filter,clipPath' });
          animation = gsap.fromTo(targets, presets[type], to);
        } catch (error) {
          animation?.kill();
          gsap.set(el, { clearProps: 'opacity,transform,filter,clipPath' });
        }
      });
      if (conditions.desktop && !conditions.reduce) {
        document.querySelectorAll('[data-fg-gallery="horizontal"][data-pin="yes"]').forEach(gallery => {
          const track = gallery.querySelector('.fg-track');
          if (!track) return;
          const distance = () => Math.max(0, track.scrollWidth - gallery.clientWidth);
          if (distance() < 1) return;
          const rtl = getComputedStyle(gallery).direction === 'rtl';
          let tween;
          try {
            gallery.classList.add('fg-pinned');
            tween = gsap.to(track, { x: () => (rtl ? 1 : -1) * distance(), ease: 'none', scrollTrigger: { trigger: gallery, start: 'top 12%', end: () => `+=${distance()}`, scrub: num(gallery.dataset.scrub, 1, .1, 3), pin: true, invalidateOnRefresh: true } });
            // Keyboard focus must reveal offscreen cards in a pinned track.
            const focus = event => {
              const card = event.target.closest('.fg-card');
              if (!card || !tween?.scrollTrigger) return;
              const offset = Math.abs(card.offsetLeft - track.firstElementChild.offsetLeft);
              window.scrollTo({ top: tween.scrollTrigger.start + Math.min(offset, distance()), behavior: 'instant' });
            };
            gallery.addEventListener('focusin', focus);
            cleanup.push(() => { gallery.removeEventListener('focusin', focus); gallery.classList.remove('fg-pinned'); });
          } catch (error) { tween?.kill(); gallery.classList.remove('fg-pinned'); gsap.set(track, { clearProps: 'transform' }); }
        });
      }
      return () => cleanup.forEach(fn => fn());
    });

    initSplitText(gsap, ScrollTrigger);
    ScrollTrigger.refresh();
  }

  function initSplitText(gsap, ScrollTrigger) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('.fg-split-text').forEach(el => {
      if (el._fgSplitDone) return;
      el._fgSplitDone = true;

      const rawText = el.dataset.fgText || el.textContent.trim();
      const splitType = el.dataset.splitType || 'chars';
      const isRtl = getComputedStyle(el).direction === 'rtl' || /[\u0600-\u06FF]/.test(rawText);

      el.setAttribute('aria-label', rawText);
      el.innerHTML = '';

      const words = rawText.split(/\s+/);
      const targets = [];

      words.forEach((word, wIdx) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'split-word';
        wordSpan.style.display = 'inline-block';
        wordSpan.style.whiteSpace = 'nowrap';

        if (isRtl || splitType === 'words') {
          const charSpan = document.createElement('span');
          charSpan.className = 'split-char';
          charSpan.style.display = 'inline-block';
          charSpan.style.willChange = 'transform, opacity, filter';
          charSpan.textContent = word;
          wordSpan.appendChild(charSpan);
          targets.push(charSpan);
        } else {
          for (let i = 0; i < word.length; i++) {
            const charSpan = document.createElement('span');
            charSpan.className = 'split-char';
            charSpan.style.display = 'inline-block';
            charSpan.style.willChange = 'transform, opacity, filter';
            charSpan.textContent = word[i];
            wordSpan.appendChild(charSpan);
            targets.push(charSpan);
          }
        }

        el.appendChild(wordSpan);
        if (wIdx < words.length - 1) {
          el.appendChild(document.createTextNode(' '));
        }
      });

      // SplitText GSAP Animation: power3.out, duration: 1.3s, stagger: 50ms, blur text
      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y: 40,
          filter: 'blur(8px)'
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.3,
          ease: 'power3.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el.closest('.fg-curated-fashion-banner') || el,
            start: 'top 85%',
            once: true,
            fastScrollEnd: true,
            anticipatePin: 0.4
          },
          willChange: 'transform, opacity, filter',
          force3D: true,
          onComplete: () => {
            gsap.set(targets, { clearProps: 'filter,transform,opacity' });
          }
        }
      );
    });

    // Eyebrow entrance animation (no translate transform on banner image)
    document.querySelectorAll('.fg-curated-fashion-banner').forEach(banner => {
      if (banner._fgParallaxDone) return;
      banner._fgParallaxDone = true;
      const eyebrow = banner.querySelector('.fg-curated-eyebrow');
      if (eyebrow) {
        gsap.fromTo(
          eyebrow,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: banner,
              start: 'top 85%',
              once: true
            }
          }
        );
      }
    });
  }
  const schedule = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(init); } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule); else schedule();
  window.addEventListener('load', schedule, { once: true });
  document.fonts?.ready.then(schedule);
  window.addEventListener('pagehide', () => media?.revert());
  window.addEventListener('pageshow', schedule);
  if (window.jQuery) window.jQuery(window).on('elementor/frontend/init', () => {
    window.elementorFrontend.hooks.addAction('frontend/element_ready/global', schedule);
  });
})();
