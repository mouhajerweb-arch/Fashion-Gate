import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import Parser from 'php-parser';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = path.dirname(root);
const require = createRequire(import.meta.url);
const ts = require('../../node_modules/typescript');
const plugin = path.join(root, 'plugins/fashiongate-elementor-experience');
const walk = dir => fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const parser = new Parser({ parser: { extractDoc: true, phpVersion: '8.1' } });
test('Every authored PHP file parses as PHP 8.1', () => {
  for (const dir of ['plugins','themes','config']) for (const file of walk(path.join(root,dir)).filter(f=>f.endsWith('.php'))) assert.doesNotThrow(()=>parser.parseCode(fs.readFileSync(file,'utf8'),file),file);
});
const flatten = nodes => nodes.flatMap(n=>[n,...flatten(n.elements||[])]);
for (const lang of ['en','ar']) test(`${lang}: editable template tree, one H1, unique IDs, configurable form, all sections`, () => {
  const data = JSON.parse(fs.readFileSync(path.join(plugin,`templates/immersive-landing-${lang}.json`),'utf8'));
  assert.equal(data.content.length,4);
  assert.ok(data.content.every(n=>n.elType==='container'));
  const elements = flatten(data.content);
  assert.equal(elements.filter(n=>n.elType==='container').length,17);
  assert.equal(elements.filter(n=>n.settings.html_tag==='main').length,1);
  for(const anchor of ['fg-main','experience','register']) assert.equal(elements.filter(n=>n.settings._element_id===anchor).length,1);
  assert.equal(new Set(elements.map(n=>n.id)).size,elements.length);
  assert.equal(elements.filter(n=>n.settings.tag==='h1'||n.settings.header_size==='h1').length,1);
  assert.equal(elements.filter(n=>n.widgetType==='fg-lead-experience').length,1);
  const fields=elements.find(n=>n.widgetType==='fg-lead-experience').settings.fields;
  assert.equal(new Set(fields.map(f=>f.key)).size,fields.length);
  assert.ok(fields.some(f=>f.type==='checkbox'&&f.required==='yes'));
  assert.ok(!JSON.stringify(data).includes('[Insert approved'));
  assert.ok(!JSON.stringify(data).includes('wp-landing.'));
});
test('Frontend remains readable if GSAP is absent', () => {
  const src=fs.readFileSync(path.join(plugin,'assets/js/motion-engine.js'),'utf8');
  const sandbox={window:{addEventListener(){}},document:{readyState:'complete'},location:{search:''},URLSearchParams,requestAnimationFrame:fn=>fn()};
  assert.doesNotThrow(()=>vm.runInNewContext(src,sandbox));
});
function middleware(env) {
  const source=fs.readFileSync(path.join(repo,'middleware.ts'),'utf8');
  const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
  class Response { constructor(body,opts){this.body=body;this.status=opts.status;} static next(){return {next:true};} static rewrite(url,options){return {url,options,headers:new Headers()};} }
  const exports={};
  vm.runInNewContext(compiled,{exports,require:()=>({NextResponse:Response}),process:{env},URL,Headers});
  return exports.middleware;
}
const request=url=>({nextUrl:new URL(url),headers:new Headers({'x-fg-proxy-token':'attacker'})});
test('Proxy opt-in, fail closed configuration and exact query preservation',()=>{
  assert.equal(middleware({})(request('https://www.fashiongatemall.com/landing')).next,true);
  for(const origin of ['http://origin.example','https://origin.example/sub','https://www.fashiongatemall.com']) assert.equal(middleware({FG_WORDPRESS_ORIGIN:origin,FG_PROXY_SECRET:'x'.repeat(32)})(request('https://www.fashiongatemall.com/landing')).status,503);
  const result=middleware({FG_WORDPRESS_ORIGIN:'https://origin.example',FG_PROXY_SECRET:'x'.repeat(32)})(request('https://www.fashiongatemall.com/landing/ar/campaign?utm_source=test&x=1&x=2'));
  assert.equal(result.url.href,'https://origin.example/landing/ar/campaign?utm_source=test&x=1&x=2');
  assert.equal(result.options.request.headers.get('x-fg-proxy-token'),'x'.repeat(32));
  assert.equal(result.headers.has('x-fg-proxy-token'),false);
  assert.match(result.headers.get('Cache-Control'),/no-store/);
  const admin=middleware({FG_WORDPRESS_ORIGIN:'https://origin.example',FG_PROXY_SECRET:'x'.repeat(32)})(request('https://www.fashiongatemall.com/landing/wp-admin?test=1'));
  assert.equal(admin.url.href,'https://origin.example/landing/wp-admin/index.php?test=1');
});
test('Analytics payload excludes visitor text, URLs and attribution',()=>{
  const src=fs.readFileSync(path.join(plugin,'assets/js/frontend.js'),'utf8');
  const events=[];
  const sandbox={window:{fgExperience:{pageId:42,language:'en'},dataLayer:events},localStorage:{getItem:()=>'{"analytics":true}'},document:{addEventListener(){},readyState:'loading'},URLSearchParams,location:{search:'?email=private@example.com'}};
  vm.runInNewContext(src,sandbox);
  assert.equal(events.length,1);
  assert.deepEqual(Object.keys(events[0]).sort(),['event','fg_language','fg_page_id']);
  assert.equal(events[0].event,'fg_landing_view');
});
