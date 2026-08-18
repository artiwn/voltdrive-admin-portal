const fs=require('fs');
const path=require('path');
const cp=require('child_process');
const root=path.resolve(__dirname,'..');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const files=walk(root);
const html=files.filter(f=>f.endsWith('.html'));
const js=files.filter(f=>f.endsWith('.js')&&!f.includes('node_modules'));
const portalPages=[
  'dashboard.html','companies.html','users-access.html','countries-currencies.html','tariffs.html','taxes.html','payments.html','accounting.html','partners-settlements.html',
  'roaming.html','integrations.html','firmware.html','security.html','ai-automation.html','energy-optimization.html','reports-audit.html','platform-settings.html'
];
let errors=[];
for(const file of js){
  try{cp.execFileSync(process.execPath,['--check',file],{stdio:'pipe'});}
  catch(e){errors.push(`JS syntax: ${path.relative(root,file)}\n${e.stderr?.toString()||e.message}`);}
}
for(const file of html){
  const text=fs.readFileSync(file,'utf8');
  for(const match of text.matchAll(/(?:href|src)="([^"]+)"/g)){
    const ref=match[1];
    if(/^(https?:|#|data:|mailto:)/.test(ref)) continue;
    const target=path.resolve(path.dirname(file),ref.split('?')[0]);
    if(!fs.existsSync(target)) errors.push(`Missing reference: ${path.relative(root,file)} -> ${ref}`);
  }
  if(/brand-mark/.test(text)) errors.push(`Brand regression: ${path.relative(root,file)} contains brand-mark.`);
  if(/data-planned-module/.test(text)) errors.push(`Planned-module regression: ${path.relative(root,file)} still contains a placeholder module.`);
}

for(const name of portalPages){
  const file=path.join(root,name);
  if(!fs.existsSync(file)){errors.push(`Missing portal page: ${name}`);continue;}
  const text=fs.readFileSync(file,'utf8');
  if(!/<div class="sidebar__brand">\s*<strong>VoltDrive<\/strong>\s*<span>Admin Portal<\/span>\s*<\/div>/.test(text)){
    errors.push(`Sidebar brand mismatch: ${name}`);
  }
  if(!/js\/layout\/common\.js/.test(text)) errors.push(`Missing common layout script: ${name}`);
  for(const linked of portalPages){
    if(!new RegExp(`href=["']${linked.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["']`).test(text)){
      errors.push(`Sidebar/navigation missing ${linked} in ${name}`);
    }
  }
}

const pageJs=files.filter(f=>f.includes(`${path.sep}js${path.sep}pages${path.sep}`)&&f.endsWith('.js'));
for(const file of pageJs){
  const text=fs.readFileSync(file,'utf8');
  if(!/canAccessAdminModule/.test(text)) errors.push(`Fail-closed Admin Portal guard missing: ${path.relative(root,file)}`);
  if(/state\.audit\.unshift\s*\(/.test(text)) errors.push(`Direct audit write bypasses central helper: ${path.relative(root,file)}`);
  if(/state\.audit\s*=\s*state\.audit\.slice\s*\(/.test(text)) errors.push(`Page-level audit cap bypasses retention policy: ${path.relative(root,file)}`);
  if(/2026-08-17\s+11:\d\d|time\s*:\s*['"]11:\d\d['"]|(?:time|date|lastUpdated|paidAt|startedAt)\s*:\s*['"]Now['"]/.test(text)){
    errors.push(`Hardcoded action timestamp found: ${path.relative(root,file)}`);
  }
}

const scopedPages=['dashboard.js','companies.js','users-access.js','countries-currencies.js','tariffs.js','taxes.js','payments.js','accounting.js','partners-settlements.js','integrations.js','reports-audit.js'];
for(const name of scopedPages){
  const file=path.join(root,'js/pages',name),text=fs.readFileSync(file,'utf8');
  if(!/(companyInScope|scopedCompan|scopedCountry|scopedAudit)/.test(text)) errors.push(`Scope invariant missing: js/pages/${name}`);
}
const stateSource=fs.readFileSync(path.join(root,'js/core/admin-state.js'),'utf8');
for(const helper of ['today','timeNow','now','addAudit','currentUser','currentRole','can','isPlatformScope','companyInScope']){
  if(!stateSource.includes(`function ${helper}(`)) errors.push(`Admin-state helper missing: ${helper}`);
}
const reportsSource=fs.readFileSync(path.join(root,'js/pages/reports-audit.js'),'utf8');
if(/const scopedAudit=[^;]*scopedAudit\(\)\.filter/.test(reportsSource)) errors.push('Reports audit recursion regression detected.');
if(/function filteredAudit\(\).*?return state\.audit\.filter/s.test(reportsSource)) errors.push('Audit filters must start from scopedAudit(), not global state.audit.');
if(/function renderAuditDistribution\(\).*?state\.audit\.forEach/s.test(reportsSource)) errors.push('Audit distribution must use scoped audit records.');
if(!/requireReportManage/.test(reportsSource)||!/reports\.manage/.test(reportsSource)) errors.push('Report generation/export permission guard is missing.');
if(/state\.audit\s*=\s*state\.audit\.slice\(0,\s*250\)/.test(stateSource)) errors.push('Fixed 250-record audit cap must not override retention policy.');
for(const helper of ['reportInScope','auditInScope','applyRetentionPolicies']){
  if(!stateSource.includes(`function ${helper}(`)) errors.push(`Reports/audit helper missing: ${helper}`);
}
const commonSource=fs.readFileSync(path.join(root,'js/layout/common.js'),'utf8');
if(!/admin\.portal\.view/.test(commonSource)) errors.push('Admin Portal route guard is missing.');
if(!/hasPortalAccess\(\).*admin\.portal\.view|hasPortalAccess=.*admin\.portal\.view/s.test(commonSource)) errors.push('All Admin Portal modules must require admin.portal.view.');
for(const name of ['roaming.html','firmware.html','security.html','ai-automation.html','energy-optimization.html','platform-settings.html']){
  if(!new RegExp(`['\"]${name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}['\"]:\{[^}]*scope:['\"]platform['\"]`).test(commonSource)) errors.push(`Platform-scope guard missing: ${name}`);
}

const integrationCss=fs.readFileSync(path.join(root,'css/pages/integrations.css'),'utf8');
if(!/\.integration-form-grid\s+\.checkbox-item\s+input\[type="checkbox"\]\s*\{[^}]*width:16px;[^}]*height:16px;[^}]*min-width:16px;[^}]*min-height:16px;/s.test(integrationCss)){
  errors.push('ERP checkbox compact-size invariant is missing.');
}
const adminUi=fs.readFileSync(path.join(root,'css/components/admin-ui.css'),'utf8');
if(!/\.ui-pill[^\{]*\{[^}]*display:inline-flex/s.test(adminUi)) errors.push('UI pill inline-flex invariant is missing.');

if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`OK: ${html.length} HTML, ${js.length} JavaScript files checked.`);
console.log(`Navigation: ${portalPages.length} portal pages fully linked; planned modules 0; brand regressions 0.`);
console.log('UI invariants: ERP checkbox compact sizing and centered pills verified.');
