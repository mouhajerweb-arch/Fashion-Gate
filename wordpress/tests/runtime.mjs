import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
const base=process.env.FG_QA_URL||'http://127.0.0.1:9401';
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
// Serve the exact checked-in brand assets locally; this suite works offline.
await context.route('https://www.fashiongatemall.com/brand/**',async route=>{
  const name=path.basename(new URL(route.request().url()).pathname);
  await route.fulfill({path:path.resolve('public/brand',name)});
});
const page=await context.newPage();
const errors=[]; page.on('pageerror',e=>errors.push(e.message));
await page.goto(base,{waitUntil:'networkidle'});
await page.locator('[data-fg-consent=reject]').click().catch(()=>{});
console.log('PAGE',page.url());
const languageLinks=await page.locator('.fg-languages a').evaluateAll(es=>es.map(e=>({href:e.href,text:e.textContent})));
console.log('LANGUAGES',JSON.stringify(languageLinks));
await page.screenshot({path:'wordpress/.qa/screenshots/final-hero-en.png'});
const englishURL=page.url();
const arabicURL=languageLinks.find(l=>l.href.includes('/ar'))?.href;
const widths=[1920,1600,1440,1280,1024,834,768,430,414,390,375,360];
const observations=[];
for(const [lang,url] of [['en',englishURL],['ar',arabicURL]]) {
  assert.ok(url,`Missing ${lang} translation link`);
  await page.goto(url,{waitUntil:'networkidle'});
  assert.equal(await page.locator('h1').count(),1);
  assert.equal(await page.locator('main#fg-main').count(),1);
  console.log(lang,'DIRECTION',await page.locator('html').getAttribute('dir'),'HREFLANG',await page.locator('link[hreflang]').count());
  if(lang==='ar') assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
  for(const width of widths) {
    await page.setViewportSize({width,height:1000}); await page.waitForTimeout(80);
    const measures=await page.evaluate(()=>({page:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth}));
    assert.ok(measures.page<=measures.viewport+1,`${lang} overflow at ${width}`);
    observations.push({lang,width,...measures});
    if(width===390) await page.screenshot({path:`wordpress/.qa/screenshots/final-hero-${lang}-390.png`});
  }
}
await page.goto(englishURL,{waitUntil:'networkidle'});
await page.emulateMedia({reducedMotion:'reduce'}); await page.reload({waitUntil:'networkidle'});
assert.equal(await page.locator('.pin-spacer').count(),0);
const config=await page.evaluate(()=>window.fgExperience);
const widget=await page.locator('.fg-form').getAttribute('data-widget');
const tokenResponse=await page.request.get(config.challenge); const {token}=await tokenResponse.json();
await page.waitForTimeout(2200);
const payload={pageId:config.pageId,widget,token,fields:{name:'Local QA',email:'qa@example.invalid',phone:'',interest:'Fashion',message:'Fixture-only enquiry',consent:'yes'},attribution:{utm_source:'qa'}};
const post=async data=>page.request.post(config.endpoint,{headers:{'X-FG-QA-Delivery':'mock'},data});
assert.equal((await post({...payload,fields:{...payload.fields,email:'invalid'}})).status(),400);
assert.equal((await post({...payload,companyWebsite:'bot.invalid'})).status(),400);
const success=await post(payload);
console.log('MOCK_DELIVERY',success.status(),await success.text());
assert.equal(success.status(),200);
assert.equal((await post(payload)).status(),409);
console.log('SECURITY invalid-email=400 honeypot=400 confirmed-mock=200 replay=409');
const edit=await page.locator('#wp-admin-bar-elementor_edit_page a').first().getAttribute('href');
await page.goto(edit,{waitUntil:'domcontentloaded'});
if(!page.url().includes('action=elementor')) await page.goto(edit,{waitUntil:'domcontentloaded'});
await page.waitForTimeout(6000);
console.log('EDITOR',await page.title(),page.url());
console.log('EDITOR_FRAMES',page.frames().map(f=>f.url()));
console.log('EDITOR_PANEL',(await page.locator('body').innerText()).slice(-2200));
await page.screenshot({path:'wordpress/.qa/screenshots/final-editor.png'});
await fs.writeFile('wordpress/.qa/final-runtime-results.json',JSON.stringify({observations,errors,languageLinks,security:'invalid-email=400 honeypot=400 mock=200 replay=409'},null,2));
console.log('JS_ERRORS',JSON.stringify(errors));
await browser.close();
