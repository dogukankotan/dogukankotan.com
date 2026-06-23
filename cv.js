(function () {
    'use strict';

    /* ── Easter egg for curious devs ── */
    console.log(
        '%c' +
        '╔═══════════════════════════════════════════════╗\n' +
        '║                                               ║\n' +
        '║   $ cat cv.html                               ║\n' +
        '║   > You\'re reading the source of my CV.      ║\n' +
        '║                                               ║\n' +
        '║   If you\'re this curious, let\'s talk.        ║\n' +
        '║   me@dogukankotan.com                         ║\n' +
        '║                                               ║\n' +
        '╚═══════════════════════════════════════════════╝',
        'color: #00ff87; font-family: monospace; font-size: 12px; line-height: 1.6;'
    );

    document.querySelector('.print-btn').addEventListener('click', () => window.print());

})();
