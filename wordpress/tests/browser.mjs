import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const base=process.env.FG_QA_URL || 'http://127.0.0.1:9400';
await fs.mkdir('wordpress/.qa/screenshots',{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext();
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const response=await page.goto(base,{waitUntil:'networkidle'});
console.log('HTTP',response.status());
console.log('TITLE',await page.title());
console.log('H1',await page.locator('h1').allTextContents());
console.log('WIDGETS',await page.locator('.fg-experience').count());
console.log('FORMS',await page.locator('.fg-form').count());
await page.locator('[data-fg-consent="reject"]').click().catch(()=>{});
const widths=[1920,1600,1440,1280,1024,834,768,430,414,390,375,360];
const results=[];
for(const width of widths){
  await page.setViewportSize({width,height:900});
  await page.waitForTimeout(200);
  results.push({width,...await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,h1:document.querySelector('h1')?.getBoundingClientRect().width}))});
  if([1440,390].includes(width)) await page.screenshot({path:`wordpress/.qa/screenshots/en-${width}.png`,fullPage:true});
}
await page.emulateMedia({reducedMotion:'reduce'});
await page.reload({waitUntil:'networkidle'});
console.log('REDUCED_PIN_SPACERS',await page.locator('.pin-spacer').count());
const form=page.locator('.fg-form');
if(await form.count()){
  const challengeResponse=page.waitForResponse(r=>r.url().includes('/fashiongate/v1/challenge'));
  await form.locator('[name=name]').fill('QA Test');
  await form.locator('[name=email]').fill('qa@example.invalid');
  await form.locator('[name=interest]').selectOption({index:1});
  await form.locator('[name=message]').fill('Local test only; no destination configured.');
  await form.locator('[name=consent]').check();
  await challengeResponse;
  await page.waitForTimeout(2500);
  const sent=page.waitForResponse(r=>r.url().includes('/fashiongate/v1/leads')).catch(()=>null);
  await form.locator('button[type=submit]').click();
  const result=await sent;
  console.log('UNCONFIGURED_LEAD_STATUS',result?.status());
  console.log('LEAD_RESPONSE',await result?.text());
  console.log('FORM_FEEDBACK',await form.locator('.fg-status').innerText());
}
console.log('WIDTHS',JSON.stringify(results));
console.log('JS_ERRORS',JSON.stringify(errors));
await fs.writeFile('wordpress/.qa/browser-results.json',JSON.stringify({results,errors},null,2));
await browser.close();
