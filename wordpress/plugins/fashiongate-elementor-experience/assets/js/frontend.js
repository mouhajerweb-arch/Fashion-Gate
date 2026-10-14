(() => {
  'use strict';
  const cfg = window.fgExperience || {};
  const keys = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','gbraid','wbraid','fbclid','msclkid'];
  const ar = String(cfg.language).startsWith('ar');
  let consent = {};
  try { consent = JSON.parse(localStorage.getItem('fashiongate_cookie_consent') || '{}'); } catch {}
  const allowed = () => consent.analytics === true;
  let gaLoaded = false;
  function analytics() {
    if (!allowed() || !cfg.ga4 || gaLoaded) return;
    gaLoaded = true;
    // Configure FG_GA4_ID only when this plugin is the sole tag owner for WordPress.
    if (!window.gtag && !document.querySelector('script[src*="googletagmanager.com"]')) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', cfg.ga4, { send_page_view: false, page_location: cfg.canonical, page_referrer: '' });
      const script = document.createElement('script'); script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4);
      document.head.append(script);
    }
  }
  const event = name => {
    if (!allowed()) return;
    // Fixed fields only: never DOM labels, hrefs, form values, query strings or referrers.
    (window.dataLayer = window.dataLayer || []).push({ event: name, fg_page_id: Number(cfg.pageId) || 0, fg_language: ar ? 'ar' : 'en' });
    if (cfg.ga4 && window.gtag) window.gtag('event', name, { fg_page_id: Number(cfg.pageId) || 0, fg_language: ar ? 'ar' : 'en', page_location: cfg.canonical, page_referrer: '' });
  };
  let viewed = false;
  function view() { attribution(); analytics(); if (allowed() && !viewed) { event('fg_landing_view'); viewed = true; } }
  view();
  document.addEventListener('fg:consent', e => { consent = e.detail || {}; view(); });
  function attribution() {
    const result = {};
    if (!consent.marketing) { try { sessionStorage.removeItem('fg_landing_attribution'); } catch {} return result; }
    try {
      const saved=JSON.parse(sessionStorage.getItem('fg_landing_attribution')||'{}');
      if(saved.expires>Date.now()) keys.forEach(key=>{if(typeof saved.values?.[key]==='string') result[key]=saved.values[key].slice(0,200);});
    } catch {}
    const params = new URLSearchParams(location.search);
    keys.forEach(key => { if (params.has(key)) result[key] = params.get(key).slice(0, 200); });
    try { sessionStorage.setItem('fg_landing_attribution',JSON.stringify({values:result,expires:Date.now()+30*60*1000})); } catch {}
    return result;
  }
  document.addEventListener('click', e => {
    const choice = e.target.closest('[data-fg-consent]');
    const panel = document.querySelector('.fg-consent');
    if (choice) {
      const accept = choice.dataset.fgConsent === 'accept';
      consent = { essential: true, analytics: accept, marketing: accept, timestamp: new Date().toISOString() };
      try { localStorage.setItem('fashiongate_cookie_consent', JSON.stringify(consent)); } catch {}
      if (window.gtag) window.gtag('consent','update',{ analytics_storage: accept ? 'granted' : 'denied', ad_storage: accept ? 'granted' : 'denied', ad_user_data: accept ? 'granted' : 'denied', ad_personalization: accept ? 'granted' : 'denied' });
      if (panel) panel.hidden = true;
      document.querySelector('.fg-privacy-settings')?.focus();
      view();
    }
    if (e.target.closest('.fg-privacy-settings') && panel) { panel.hidden = false; panel.querySelector('button')?.focus(); }
    const pause = e.target.closest('.fg-pause');
    if (pause) {
      const track = pause.closest('.fg-marquee')?.querySelector('.fg-marquee-track');
      const paused = pause.getAttribute('aria-pressed') !== 'true';
      pause.setAttribute('aria-pressed', String(paused));
      if (track) track.style.animationPlayState = paused ? 'paused' : 'running';
    }
    const carouselBtn = e.target.closest('.fg-carousel-btn');
    if (carouselBtn) {
      const wrap = carouselBtn.closest('.fg-product-showcase-wrap, #this-season, .this-season');
      const track = wrap ? wrap.querySelector('.fg-product-track') : null;
      if (track) {
        const card = track.querySelector('.fg-product-card');
        const cardWidth = card ? card.offsetWidth + 24 : 300;
        const isNext = carouselBtn.classList.contains('fg-next');
        const isRtl = document.documentElement.getAttribute('dir') === 'rtl' || document.body.classList.contains('rtl');
        const delta = isRtl ? (isNext ? -cardWidth : cardWidth) : (isNext ? cardWidth : -cardWidth);
        track.scrollBy({ left: delta, behavior: 'smooth' });
      }
    }
    const wishlist = e.target.closest('.fg-product-wishlist');
    if (wishlist) {
      e.preventDefault();
      e.stopPropagation();
      wishlist.classList.toggle('is-active');
    }
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (link.hreflang || link.closest('.lang-item')) event('fg_language_change');
    else if (href.startsWith('tel:')) event('fg_phone_click');
    else if (href.startsWith('mailto:')) event('fg_email_click');
    else if (/^https:\/\/(wa.me|api.whatsapp.com)\//.test(href)) event('fg_whatsapp_click');
    else if (link.dataset.fgCta === 'hero') event('fg_hero_cta_click');
    else if (link.dataset.fgCta || link.classList.contains('elementor-button')) event('fg_section_cta_click');
  });
  async function challenge() {
    const response = await fetch(cfg.challenge, { cache: 'no-store', credentials: 'same-origin' });
    if (!response.ok) throw Error('challenge');
    return (await response.json()).token;
  }
  const forms = new WeakSet();
  function setup() {
    const panel = document.querySelector('.fg-consent');
    if (panel && consent.analytics === undefined) panel.hidden = false;
    document.querySelectorAll('.fg-form').forEach(form => {
      if (forms.has(form)) return;
      forms.add(form);
      let token;
      let pending;
      let widgetId;
      let started = false;
      const refresh = () => { pending = challenge().then(value => { token = value; return value; }).catch(() => { token = null; }); };
      form.addEventListener('focusin', () => {
        if (!started) { started = true; event('fg_form_start'); refresh(); }
      });
      const renderTurnstile = () => {
        if (cfg.turnstile && window.turnstile && widgetId === undefined) widgetId = window.turnstile.render(form.querySelector('.fg-turnstile'), { sitekey: cfg.turnstile, action: 'fg_lead' });
      };
      renderTurnstile();
      document.addEventListener('fg:turnstile-ready', renderTurnstile);
      form.addEventListener('submit', async e => {
        e.preventDefault();
        if (!form.reportValidity() || form.getAttribute('aria-busy') === 'true') return;
        const button = form.querySelector('button[type="submit"]');
        const status = form.querySelector('.fg-status');
        form.setAttribute('aria-busy', 'true'); button.disabled = true;
        status.textContent = ar ? 'جارٍ الإرسال…' : 'Sending…';
        event('fg_form_submit');
        try {
          if (pending) await pending;
          if (!token) throw Error('challenge');
          const data = new FormData(form);
          const fields = {};
          for (const [key, value] of data) if (!['companyWebsite','cf-turnstile-response'].includes(key)) fields[key] = value;
          const response = await fetch(cfg.endpoint, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pageId: cfg.pageId, widget: form.dataset.widget, token, fields, companyWebsite: data.get('companyWebsite'), turnstile: data.get('cf-turnstile-response') || '', attribution: attribution() }), signal: AbortSignal.timeout(30000) });
          const result = await response.json();
          if (!response.ok || result.success !== true) throw Error('delivery');
          status.textContent = form.dataset.success || (ar ? 'تم إرسال طلبك بنجاح.' : 'Your enquiry has been sent.');
          event('fg_form_success'); form.reset();
        } catch {
          status.textContent = form.dataset.error || (ar ? 'تعذّر الإرسال. يرجى المحاولة مجدداً.' : 'Unable to send. Please try again.');
          event('fg_form_error');
        } finally {
          form.setAttribute('aria-busy', 'false'); button.disabled = false;
          status.focus(); refresh();
          if (widgetId !== undefined) window.turnstile?.reset(widgetId);
        }
      });
    });
    setupContactForms();
    setupNewsletterForms();
  }

  function setupNewsletterForms() {
    document.querySelectorAll('.fg-footer-subscribe-form').forEach(form => {
      if (form._fgBound) return;
      form._fgBound = true;

      const emailInput = form.querySelector('.fg-footer-input');
      const submitBtn = form.querySelector('.fg-footer-submit-btn');
      const statusEl = form.querySelector('.fg-footer-status');
      const isAr = form.dataset.lang === 'ar';

      form.addEventListener('submit', async e => {
        e.preventDefault();
        const email = emailInput?.value?.trim();
        const honeypot = form.querySelector('[name="companyWebsite"]')?.value;

        if (honeypot || !email) return;

        if (submitBtn) submitBtn.disabled = true;
        if (statusEl) {
          statusEl.textContent = isAr ? 'جاري الاشتراك...' : 'Subscribing...';
          statusEl.className = 'fg-footer-status fg-loading';
        }

        const payload = {
          email,
          language: isAr ? 'ar' : 'en',
          source: 'footer-subscribe',
          pageUrl: window.location.href,
          companyWebsite: ''
        };

        try {
          let res = await fetch('/wp-json/fashiongate/v1/newsletter-subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(() => null);

          let data = null;
          if (res && res.ok) {
            data = await res.json().catch(() => null);
          } else {
            const fallbackRes = await fetch('/api/newsletter/subscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            }).catch(() => null);
            if (fallbackRes && fallbackRes.ok) {
              data = await fallbackRes.json().catch(() => null);
            }
          }

          if (statusEl) {
            if (data && (data.code === 'already_subscribed' || (data.message && data.message.toLowerCase().includes('already')))) {
              statusEl.textContent = data.message || (isAr ? 'أنت مشترك بالفعل.' : 'Already subscribed.');
              statusEl.className = 'fg-footer-status fg-info';
            } else if (data && data.success) {
              statusEl.textContent = data.message || (isAr ? 'تم الاشتراك بنجاح.' : 'Subscribed successfully.');
              statusEl.className = 'fg-footer-status fg-success';
              if (emailInput) emailInput.value = '';
            } else {
              statusEl.textContent = (data && data.message) || (isAr ? 'تعذر الاشتراك الآن. يرجى المحاولة لاحقاً.' : 'Unable to subscribe right now.');
              statusEl.className = 'fg-footer-status fg-error';
            }
          }
        } catch (err) {
          if (statusEl) {
            statusEl.textContent = isAr ? 'تعذر الاشتراك الآن. يرجى المحاولة لاحقاً.' : 'Unable to subscribe right now.';
            statusEl.className = 'fg-footer-status fg-error';
          }
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    });
  }

  function setupContactForms() {
    document.querySelectorAll('.fg-contact-form').forEach(form => {
      if (form._fgBound) return;
      form._fgBound = true;
      form.addEventListener('submit', async e => {
        e.preventDefault();
        const submitBtn = form.querySelector('.fg-contact-submit-btn');
        const status = form.querySelector('.fg-contact-status');
        const card = form.closest('.fg-contact-form-card, .fg-modal-form-wrap');
        const successState = card ? card.querySelector('.fg-contact-success-state') : null;
        const isAr = form.dataset.lang === 'ar';

        const name = form.querySelector('[name="name"]')?.value?.trim();
        const email = form.querySelector('[name="email"]')?.value?.trim();
        const phone = form.querySelector('[name="phone"]')?.value?.trim() || '';
        const message = form.querySelector('[name="message"]')?.value?.trim();
        const companyWebsite = form.querySelector('[name="companyWebsite"]')?.value || '';

        if (!name || !email || !message) {
          if (status) status.textContent = isAr ? 'يرجى ملء كافة الحقول المطلوبة.' : 'Please fill all required fields.';
          return;
        }

        if (submitBtn) submitBtn.disabled = true;
        if (status) status.textContent = isAr ? 'جارٍ الإرسال...' : 'Sending...';

        try {
          const wpEndpoint = '/wp-json/fashiongate/v1/contact-inquiry';
          const payload = {
            name,
            email,
            phone,
            message,
            language: isAr ? 'ar' : 'en',
            source: form.dataset.source || 'wordpress-landing',
            companyWebsite,
            pageUrl: window.location.href
          };

          let res = await fetch(wpEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).catch(() => null);

          if (!res || !res.ok) {
            res = await fetch('/api/contact-inquiries', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            }).catch(() => null);
          }

          if (form) form.style.display = 'none';
          if (successState) {
            successState.style.display = 'block';
            const countdownEl = successState.querySelector('.fg-countdown-num');
            if (countdownEl) {
              let count = 4;
              countdownEl.textContent = count;
              const timer = setInterval(() => {
                count--;
                if (count <= 0) {
                  clearInterval(timer);
                  const modal = document.querySelector('.fg-contact-modal');
                  if (modal) modal.style.display = 'none';
                  form.reset();
                  form.style.display = '';
                  successState.style.display = 'none';
                  if (submitBtn) submitBtn.disabled = false;
                  if (status) status.textContent = '';
                  const floatBtn = document.querySelector('.fg-floating-contact-btn');
                  if (floatBtn) {
                    const agentIcon = floatBtn.querySelector('.fg-agent-icon');
                    const closeIcon = floatBtn.querySelector('.fg-close-icon');
                    if (agentIcon) agentIcon.style.display = '';
                    if (closeIcon) closeIcon.style.display = 'none';
                  }
                } else {
                  countdownEl.textContent = count;
                }
              }, 1000);
            }
          }
        } catch (err) {
          if (status) status.textContent = isAr ? 'حدث خطأ. يرجى المحاولة لاحقاً.' : 'Unable to send message. Please try again.';
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    });

    document.querySelectorAll('.fg-reset-form-btn').forEach(btn => {
      if (btn._fgBound) return;
      btn._fgBound = true;
      btn.addEventListener('click', () => {
        const card = btn.closest('.fg-contact-form-card, .fg-modal-form-wrap');
        if (!card) return;
        const form = card.querySelector('.fg-contact-form');
        const successState = card.querySelector('.fg-contact-success-state');
        if (form) {
          form.reset();
          form.style.display = '';
          const submitBtn = form.querySelector('.fg-contact-submit-btn');
          if (submitBtn) submitBtn.disabled = false;
          const status = form.querySelector('.fg-contact-status');
          if (status) status.textContent = '';
        }
        if (successState) successState.style.display = 'none';
      });
    });

    initLenisSmoothScroll();
  }

  function setModalState(open, bounce = true) {
    const modal = document.querySelector('.fg-contact-modal');
    if (!modal) return;
    modal.style.display = open ? 'flex' : 'none';
    const dialog = modal.querySelector('.fg-modal-dialog');
    if (dialog && open && bounce) {
      dialog.classList.remove('fg-bounce-anim');
      void dialog.offsetWidth;
      dialog.classList.add('fg-bounce-anim');
    }
    const floatBtn = document.querySelector('.fg-floating-contact-btn');
    if (floatBtn) {
      const agentIcon = floatBtn.querySelector('.fg-agent-icon');
      const closeIcon = floatBtn.querySelector('.fg-close-icon');
      if (agentIcon) agentIcon.style.display = open ? 'none' : '';
      if (closeIcon) closeIcon.style.display = open ? 'block' : 'none';
    }

    if (open) {
      document.body.classList.add('fg-modal-open');
      if (window.fgLenis) window.fgLenis.stop();
    } else {
      document.body.classList.remove('fg-modal-open');
      if (window.fgLenis) window.fgLenis.start();
    }
  }

  // Auto-open modal with luxury bounce on site entry (frontend only, not in Elementor editor)
  const isElementorEditor = () => window.elementorFrontend?.isEditMode?.() || new URLSearchParams(location.search).has('elementor-preview');
  setTimeout(() => {
    if (!isElementorEditor()) {
      setModalState(true, true);
    }
  }, 850);

  function initLenisSmoothScroll() {
    if (typeof window.Lenis === 'undefined') return;

    const lenis = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      infinite: false,
      prevent: (node) => {
        return !!node.closest('.fg-contact-modal');
      }
    });

    window.fgLenis = lenis;

    // Keep Lenis updated with document size changes
    window.addEventListener('load', () => lenis.resize(), { once: true });
    window.addEventListener('resize', () => lenis.resize());
    if (document.fonts) document.fonts.ready.then(() => lenis.resize());

    if (window.ScrollTrigger && window.gsap) {
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // Anchor smooth scroll via Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      if (anchor._fgSmoothBound) return;
      anchor._fgSmoothBound = true;
      anchor.addEventListener('click', e => {
        const href = anchor.getAttribute('href');
        if (href && href.length > 1 && !href.startsWith('#_')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: 0, duration: 1.15 });
          }
        }
      });
    });
  }

  document.addEventListener('click', e => {
    const floatBtn = e.target.closest('.fg-floating-contact-btn');
    if (floatBtn) {
      e.preventDefault();
      const modal = document.querySelector('.fg-contact-modal');
      const isOpen = modal && modal.style.display !== 'none';
      setModalState(!isOpen, true);
      return;
    }

    const closeBtn = e.target.closest('.fg-modal-close-btn, .fg-modal-backdrop');
    if (closeBtn) {
      e.preventDefault();
      setModalState(false, false);
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const modal = document.querySelector('.fg-contact-modal');
      if (modal && modal.style.display !== 'none') {
        setModalState(false, false);
      }
    }
  });

  if (cfg.turnstile && !document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
    window.fgTurnstileReady = () => document.dispatchEvent(new Event('fg:turnstile-ready'));
    const script = document.createElement('script'); script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=fgTurnstileReady&render=explicit'; script.async = true; document.head.append(script);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup); else setup();
  if (window.jQuery) window.jQuery(window).on('elementor/frontend/init', () => window.elementorFrontend.hooks.addAction('frontend/element_ready/global', setup));
})();
