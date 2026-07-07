(function () {
    'use strict';

    /* ── Easter egg for curious devs ── */
    console.log(
        '%c' +
        '╔═══════════════════════════════════════════════╗\n' +
        '║                                               ║\n' +
        '║   $ whoami                                    ║\n' +
        '║   > Dogukan Kotan — Computer Engineer         ║\n' +
        '║                                               ║\n' +
        '║   Hey, you\'re reading the source. Nice.      ║\n' +
        '║   Built with HTML, CSS, JS & caffeine.        ║\n' +
        '║                                               ║\n' +
        '║   Say hi → me@dogukankotan.com                ║\n' +
        '║                                               ║\n' +
        '╚═══════════════════════════════════════════════╝',
        'color: #00ff87; font-family: monospace; font-size: 12px; line-height: 1.6;'
    );

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(pointer: coarse)').matches;

    /* ── Pill choice gateway ── */
    (function pillGate() {
        const gate = document.getElementById('pillGate');
        if (!gate) return;

        // Skip the gate if the user already took the red pill this session.
        if (sessionStorage.getItem('pill') === 'red') {
            gate.remove();
            document.body.classList.remove('gate-open');
            return;
        }

        document.body.classList.add('gate-open');

        gate.querySelectorAll('[data-pill]').forEach(btn => {
            btn.addEventListener('click', () => {
                const choice = btn.dataset.pill;

                if (choice === 'blue') {
                    window.location.href = 'blue.html';
                    return;
                }

                // Red pill → stay, reveal the full site.
                sessionStorage.setItem('pill', 'red');
                gate.classList.add('hidden');
                document.body.classList.remove('gate-open');
                gate.addEventListener('transitionend', () => gate.remove(), { once: true });
            });
        });
    })();

    /* ── Custom cursor ── */
    if (!isMobile) {
        const dot  = document.querySelector('.cursor-dot');
        const ring = document.querySelector('.cursor-ring');
        let mx = window.innerWidth / 2, my = window.innerHeight / 2;
        let rx = mx, ry = my;

        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            dot.style.left = mx + 'px';
            dot.style.top  = my + 'px';
        });

        (function loop() {
            rx += (mx - rx) * 0.13;
            ry += (my - ry) * 0.13;
            ring.style.left = rx + 'px';
            ring.style.top  = ry + 'px';
            requestAnimationFrame(loop);
        })();

        document.querySelectorAll('a, button, .skill-tag').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
        });
    }

    /* ── Hamburger menu ── */
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks  = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        navToggle.textContent = open ? '[close]' : '[menu]';
        navToggle.setAttribute('aria-expanded', open);
    });

    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.textContent = '[menu]';
            navToggle.setAttribute('aria-expanded', false);
        });
    });

    /* ── Nav scrollspy ── */
    const sections   = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    sections.forEach(s =>
        new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting)
                    navAnchors.forEach(a =>
                        a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)
                    );
            });
        }, { rootMargin: '-30% 0px -60% 0px' }).observe(s)
    );

    /* ── Typewriter for hero name ── */
    function typewriter(el, text, speed, onDone) {
        el.textContent = '';
        const cursor = Object.assign(document.createElement('span'), {
            className: 'blink-cursor',
            textContent: '_'
        });
        el.appendChild(cursor);
        let i = 0;
        (function tick() {
            if (i < text.length) {
                cursor.insertAdjacentText('beforebegin', text[i++]);
                setTimeout(tick, speed);
            } else {
                onDone && onDone();
            }
        })();
    }

    /* ── Animations ── */
    if (prefersReducedMotion) {
        const nameEl = document.getElementById('hero-name');
        nameEl.textContent = 'Dogukan Kotan';
        document.querySelector('.scroll-hint').style.opacity = '1';
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* Hero entrance */
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('nav',               { y: -56, opacity: 0, duration: 0.55 })
      .from('.hero-avatar-wrap', { scale: 0.7, opacity: 0, duration: 0.75, ease: 'back.out(1.7)' }, '-=0.15')
      .from('.hero-prompt',      { y: 12, opacity: 0, duration: 0.4 }, '-=0.2')
      .add(() => {
          typewriter(
              document.getElementById('hero-name'),
              'Dogukan Kotan',
              55,
              null
          );
      })
      .from('.hero-tagline',     { y: 16, opacity: 0, duration: 0.5 }, '+=0.8')
      .from('.hero-cta',         { y: 12, opacity: 0, duration: 0.45 }, '-=0.3')
      .to('.scroll-hint',        { opacity: 1, duration: 0.5 }, '-=0.1');

    /* Remove will-change after float settles */
    setTimeout(() => {
        const pic = document.querySelector('.profile-pic');
        if (pic) pic.style.willChange = 'auto';
    }, 9000);

    /* Section label reveal */
    gsap.utils.toArray('.section-label').forEach(el => {
        gsap.from(el, {
            scaleX: 0, transformOrigin: 'left center',
            duration: 0.65, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top bottom', once: true }
        });
    });

    /* About paragraphs */
    gsap.utils.toArray('#about p').forEach((el, i) => {
        gsap.from(el, {
            y: 18, opacity: 0, duration: 0.55,
            delay: i * 0.07, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top bottom', once: true }
        });
    });

    /* Skill groups stagger */
    gsap.utils.toArray('.skill-group').forEach(group => {
        gsap.from(group.querySelector('.skill-group-label'), {
            x: -12, opacity: 0, duration: 0.4, ease: 'power2.out',
            scrollTrigger: { trigger: group, start: 'top bottom', once: true }
        });
        gsap.from(group.querySelectorAll('.skill-tag'), {
            y: 12, opacity: 0, duration: 0.35,
            stagger: 0.04, ease: 'power2.out', delay: 0.1,
            scrollTrigger: { trigger: group, start: 'top bottom', once: true }
        });
    });

    /* Vibe coding terminal */
    gsap.from('.vibe-terminal', {
        y: 20, opacity: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: '.vibe-terminal', start: 'top bottom', once: true }
    });
    gsap.from('.vibe-tag', {
        y: 10, opacity: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out',
        scrollTrigger: { trigger: '.vibe-tags', start: 'top bottom', once: true }
    });

    /* Timeline items */
    gsap.utils.toArray('.timeline-item').forEach(el => {
        gsap.from(el, {
            x: -18, opacity: 0, duration: 0.45, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top bottom', once: true }
        });
    });

    /* Contact — label + text only, buttons never hidden */
    gsap.from('#contact > p:not(.section-label)', {
        y: 14, opacity: 0, duration: 0.45, ease: 'power2.out',
        scrollTrigger: { trigger: '#contact', start: 'top bottom', once: true }
    });

    /* Dividers */
    gsap.utils.toArray('.divider').forEach(el => {
        gsap.from(el, {
            scaleX: 0, transformOrigin: 'left center',
            duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top bottom', once: true }
        });
    });

})();
