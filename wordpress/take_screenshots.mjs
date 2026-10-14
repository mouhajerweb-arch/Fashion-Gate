import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

await fs.mkdir('.qa', { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });

// Desktop 1440px
const pageDesktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await pageDesktop.goto('http://localhost:8080/landing', { waitUntil: 'networkidle' });
await pageDesktop.screenshot({ path: '.qa/desktop_1440.png', fullPage: true });
console.log('Saved desktop_1440.png');

// Mobile 390px
const pageMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await pageMobile.goto('http://localhost:8080/landing', { waitUntil: 'networkidle' });
await pageMobile.screenshot({ path: '.qa/mobile_390.png', fullPage: true });
console.log('Saved mobile_390.png');

// iPhone 16 Pro Max 440px
const pageIPhone = await browser.newPage({ viewport: { width: 440, height: 956 } });
await pageIPhone.goto('http://localhost:8080/landing', { waitUntil: 'networkidle' });
await pageIPhone.screenshot({ path: '.qa/iphone_440.png', fullPage: true });
console.log('Saved iphone_440.png');

await browser.close();
