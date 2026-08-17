const fs=require('fs');const path=require('path');const cp=require('child_process');const root=path.resolve(__dirname,'..');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=walk(root);const html=files.filter(f=>f.endsWith('.html'));const js=files.filter(f=>f.endsWith('.js')&&!f.includes('node_modules'));
let errors=[];
for(const file of js){try{cp.execFileSync(process.execPath,['--check',file],{stdio:'pipe'});}catch(e){errors.push(`JS syntax: ${path.relative(root,file)}\n${e.stderr?.toString()||e.message}`)}}
for(const file of html){const text=fs.readFileSync(file,'utf8');for(const match of text.matchAll(/(?:href|src)="([^"]+)"/g)){const ref=match[1];if(/^(https?:|#|data:|mailto:)/.test(ref))continue;const target=path.resolve(path.dirname(file),ref.split('?')[0]);if(!fs.existsSync(target))errors.push(`Missing reference: ${path.relative(root,file)} -> ${ref}`)}}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}console.log(`OK: ${html.length} HTML, ${js.length} JavaScript files checked.`);
