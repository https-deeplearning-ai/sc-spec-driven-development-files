"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const header_1 = require("../components/header");
const footer_1 = require("../components/footer");
const layout_1 = require("../components/layout");
(0, vitest_1.describe)('header()', () => {
    (0, vitest_1.it)('returns a <header> element', () => {
        (0, vitest_1.expect)((0, header_1.header)()).toContain('<header class="container">');
        (0, vitest_1.expect)((0, header_1.header)()).toContain('</header>');
    });
    (0, vitest_1.it)('contains the site name', () => {
        (0, vitest_1.expect)((0, header_1.header)()).toContain('AgentClinic');
    });
    (0, vitest_1.it)('contains navigation links for phase 3 pages', () => {
        (0, vitest_1.expect)((0, header_1.header)()).toContain('href="/agents"');
        (0, vitest_1.expect)((0, header_1.header)()).toContain('href="/ailments"');
    });
});
(0, vitest_1.describe)('footer()', () => {
    (0, vitest_1.it)('returns a <footer> element', () => {
        (0, vitest_1.expect)((0, footer_1.footer)()).toContain('<footer class="container">');
        (0, vitest_1.expect)((0, footer_1.footer)()).toContain('</footer>');
    });
    (0, vitest_1.it)('contains the current year', () => {
        (0, vitest_1.expect)((0, footer_1.footer)()).toContain(String(new Date().getFullYear()));
    });
});
(0, vitest_1.describe)('layout()', () => {
    (0, vitest_1.it)('returns a full HTML document', () => {
        const html = (0, layout_1.layout)('<p>Hello</p>');
        (0, vitest_1.expect)(html).toContain('<!DOCTYPE html>');
        (0, vitest_1.expect)(html).toContain('<html');
        (0, vitest_1.expect)(html).toContain('</html>');
    });
    (0, vitest_1.it)('injects the content into <main>', () => {
        const html = (0, layout_1.layout)('<p>Hello</p>');
        (0, vitest_1.expect)(html).toContain('<main class="container">');
        (0, vitest_1.expect)(html).toContain('<p>Hello</p>');
        (0, vitest_1.expect)(html).toContain('</main>');
    });
    (0, vitest_1.it)('uses the default title when none is provided', () => {
        (0, vitest_1.expect)((0, layout_1.layout)('')).toContain('<title>AgentClinic</title>');
    });
    (0, vitest_1.it)('uses a custom title when provided', () => {
        (0, vitest_1.expect)((0, layout_1.layout)('', 'Dashboard')).toContain('<title>Dashboard</title>');
    });
    (0, vitest_1.it)('links the stylesheet', () => {
        (0, vitest_1.expect)((0, layout_1.layout)('')).toContain('href="/styles.css"');
        (0, vitest_1.expect)((0, layout_1.layout)('')).toContain('@picocss/pico@2/css/pico.min.css');
    });
    (0, vitest_1.it)('includes header and footer', () => {
        const html = (0, layout_1.layout)('');
        (0, vitest_1.expect)(html).toContain('<header class="container">');
        (0, vitest_1.expect)(html).toContain('<footer class="container">');
    });
});
