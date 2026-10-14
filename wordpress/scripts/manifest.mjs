import fs from 'node:fs/promises';
import path from 'node:path';
const excluded=new Set(['node_modules','.qa','.npm-cache','dist']);
async function walk(dir){
  const files=[];
  for(const e of await fs.readdir(dir,{withFileTypes:true})){
    if(excluded.has(e.name))continue;
    const file=path.posix.join(dir,e.name);
    if(e.isDirectory())files.push(...await walk(file));else files.push(file);
  }
  return files;
}
const created=['middleware.ts',...await walk('wordpress'),...await walk('docs/landing')];
if(!created.includes('docs/landing/FILES.md'))created.push('docs/landing/FILES.md');
const modified=['.env.local.example','app/robots.ts','next.config.ts'];
const list=files=>files.sort().map(file=>`- [${file}](../../${file})`).join('\n');
await fs.writeFile('docs/landing/FILES.md',`# Exact implementation file manifest\n\n## Created (${created.length})\n\n${list(created)}\n\n## Modified (${modified.length})\n\n${list(modified)}\n\n## Generated installation artifacts (ignored by Git)\n\n- wordpress/dist/fashiongate-elementor-experience.zip\n- wordpress/dist/fashiongate-astra-child.zip\n- wordpress/dist/SHA256SUMS.txt\n\nNode dependencies, npm cache and local WordPress/browser fixtures under wordpress/.qa are excluded from deployment packages. Unrelated pre-existing or concurrent changes are not part of this manifest.\n`);
console.log(`Recorded ${created.length} created files and ${modified.length} modified files.`);
