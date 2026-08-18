const http=require('http');
const fs=require('fs');
const path=require('path');
const os=require('os');
const net=require('net');
const {spawn}=require('child_process');

const ROOT=process.cwd();
const HOST='127.0.0.1';
const APP_HOST=process.env.VOLTDRIVE_TEST_HOST||HOST;
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp'};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const STRICT=process.argv.includes('--strict');
function assert(cond,msg){if(!cond)throw new Error(msg);}

async function freePort(){return await new Promise((resolve,reject)=>{const s=net.createServer();s.on('error',reject);s.listen(0,HOST,()=>{const p=s.address().port;s.close(()=>resolve(p));});});}
function serve(){return new Promise((resolve,reject)=>{const server=http.createServer((req,res)=>{
  try{
    const raw=decodeURIComponent((req.url||'/').split('?')[0]);
    if(raw==='/favicon.ico'){res.writeHead(204);return res.end();}
    const rel=raw==='/'?'/dashboard.html':raw;
    const file=path.resolve(ROOT,'.'+rel);
    if(!file.startsWith(ROOT+path.sep)){res.writeHead(403);return res.end('Forbidden');}
    if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404,{'Content-Type':'text/plain'});return res.end('Not found');}
    res.writeHead(200,{'Content-Type':MIME[path.extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});
    fs.createReadStream(file).pipe(res);
  }catch(err){res.writeHead(500);res.end(String(err));}
});server.on('error',reject);server.listen(0,'0.0.0',()=>resolve(server));});}

class CDP{
  constructor(url){this.url=url;this.ws=null;this.id=0;this.pending=new Map();this.listeners=new Map();}
  async connect(){await new Promise((resolve,reject)=>{const ws=new WebSocket(this.url);this.ws=ws;ws.onopen=resolve;ws.onerror=()=>reject(new Error('CDP websocket connection failed'));ws.onmessage=e=>this._on(JSON.parse(e.data));ws.onclose=()=>{for(const {reject} of this.pending.values())reject(new Error('CDP websocket closed'));this.pending.clear();};});}
  _on(msg){if(msg.id){const p=this.pending.get(msg.id);if(!p)return;this.pending.delete(msg.id);if(msg.error)p.reject(new Error(`${msg.error.message}${msg.error.data?`: ${msg.error.data}`:''}`));else p.resolve(msg.result);return;}const key=`${msg.sessionId||''}:${msg.method}`;for(const fn of this.listeners.get(key)||[])fn(msg.params||{});for(const fn of this.listeners.get(`*:${msg.method}`)||[])fn(msg.params||{});}
  send(method,params={},sessionId){const id=++this.id;return new Promise((resolve,reject)=>{this.pending.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));});}
  on(method,sessionId,fn){const key=`${sessionId||'*'}:${method}`;if(!this.listeners.has(key))this.listeners.set(key,new Set());this.listeners.get(key).add(fn);return()=>this.listeners.get(key)?.delete(fn);}
  wait(method,sessionId,timeout=8000){return new Promise((resolve,reject)=>{let timer;const off=this.on(method,sessionId,p=>{clearTimeout(timer);off();resolve(p);});timer=setTimeout(()=>{off();reject(new Error(`Timeout waiting for ${method}`));},timeout);});}
  close(){try{this.ws?.close();}catch(_){}}
}

async function launchBrowser(){
  const debugPort=await freePort();
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'voltdrive-chrome-'));
  const args=['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--no-first-run','--no-default-browser-check',`--remote-debugging-port=${debugPort}`,`--user-data-dir=${profile}`,'about:blank'];
  const proc=spawn(process.env.CHROMIUM_BIN||'chromium',args,{stdio:['ignore','ignore','pipe'],env:{...process.env,TERM:process.env.TERM||'xterm'}});
  let stderr='';proc.stderr.on('data',d=>stderr+=d.toString());
  let info=null;
  for(let i=0;i<80;i++){try{const r=await fetch(`http://${HOST}:${debugPort}/json/version`);if(r.ok){info=await r.json();break;}}catch(_){ }await sleep(100);}
  if(!info){proc.kill('SIGKILL');throw new Error(`Chromium DevTools did not start. ${stderr.slice(-1000)}`);}
  const cdp=new CDP(info.webSocketDebuggerUrl);await cdp.connect();
  return {proc,profile,cdp,async close(){try{await cdp.send('Browser.close');}catch(_){}cdp.close();proc.kill('SIGKILL');try{fs.rmSync(profile,{recursive:true,force:true});}catch(_){}}};
}

async function createPage(browser,base,userId){
  const {targetId}=await browser.cdp.send('Target.createTarget',{url:'about:blank'});
  const {sessionId}=await browser.cdp.send('Target.attachToTarget',{targetId,flatten:true});
  await browser.cdp.send('Page.enable',{},sessionId);await browser.cdp.send('Runtime.enable',{},sessionId);await browser.cdp.send('Log.enable',{},sessionId);
  const errors=[];
  browser.cdp.on('Runtime.exceptionThrown',sessionId,p=>errors.push(`exception: ${p.exceptionDetails?.text||'Runtime exception'} ${p.exceptionDetails?.exception?.description||''}`.trim()));
  browser.cdp.on('Runtime.consoleAPICalled',sessionId,p=>{if(p.type==='error')errors.push(`console.error: ${(p.args||[]).map(x=>x.value||x.description||'').join(' ')}`);});
  browser.cdp.on('Log.entryAdded',sessionId,p=>{if(p.entry?.level==='error'&&!/favicon\.ico/i.test(p.entry.text||''))errors.push(`log.error: ${p.entry.text}`);});
  const seed=`(()=>{try{localStorage.clear();sessionStorage.clear();localStorage.setItem('voltdrive_admin_v1',JSON.stringify({currentSession:{userId:${JSON.stringify(userId)}}}));}catch(e){}})();`;
  await browser.cdp.send('Page.addScriptToEvaluateOnNewDocument',{source:seed},sessionId);
  async function evaluate(expression){const r=await browser.cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true},sessionId);if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text||'Evaluation failed');return r.result?.value;}
  async function goto(route){errors.length=0;const wait=browser.cdp.wait('Page.loadEventFired',sessionId,10000);await browser.cdp.send('Page.navigate',{url:`${base}/${route}`},sessionId);await wait;await sleep(120);const info=await evaluate(`({title:document.title,denied:!!document.querySelector('.access-denied-panel'),path:location.pathname+location.search,body:document.body.innerText.slice(0,5000),user:window.VoltDriveAdmin?.currentUser?.()?.id,role:window.VoltDriveAdmin?.currentRole?.()?.id})`);if(/is blocked/i.test(info.body||'')&&/organization/i.test(info.body||'')){const e=new Error('Chromium enterprise policy blocks the local VoltDrive test server.');e.code='BROWSER_POLICY_BLOCK';throw e;}return info;}
  async function close(){try{await browser.cdp.send('Target.closeTarget',{targetId});}catch(_){}}
  return {sessionId,targetId,errors,evaluate,goto,close};
}

const ALL_PAGES=['dashboard.html','companies.html','users-access.html','countries-currencies.html','tariffs.html','taxes.html','payments.html','accounting.html','partners-settlements.html','roaming.html','integrations.html','firmware.html','security.html','ai-automation.html','energy-optimization.html','reports-audit.html','platform-settings.html'];
const COMPANY_ALLOWED=new Set(['dashboard.html','companies.html','users-access.html','countries-currencies.html','tariffs.html','taxes.html','payments.html','accounting.html','partners-settlements.html','integrations.html','reports-audit.html']);
const FINANCE_ALLOWED=new Set(['dashboard.html','tariffs.html','taxes.html','payments.html','accounting.html','partners-settlements.html','integrations.html','reports-audit.html']);
const AUDITOR_ALLOWED=new Set(['dashboard.html','companies.html','users-access.html','countries-currencies.html','tariffs.html','taxes.html','payments.html','accounting.html','partners-settlements.html','integrations.html','reports-audit.html']);
const PLATFORM_DRAWER_ACTIONS={
  'companies.html':'#create-company','users-access.html':'#invite-user','countries-currencies.html':'#add-country','tariffs.html':'#add-tariff','taxes.html':'#add-tax-profile','payments.html':'#add-provider','accounting.html':'#add-journal','partners-settlements.html':'#add-partner','roaming.html':'#add-roaming-partner','integrations.html':'#add-integration','firmware.html':'#add-version','security.html':'#add-certificate','ai-automation.html':'#add-model','energy-optimization.html':'#add-site-policy','reports-audit.html':'#add-report'
};

async function assertPageMatrix(page,userId,allowedSet,label){
  for(const route of ALL_PAGES){const info=await page.goto(route);const expected=allowedSet.has(route);assert(info.user===userId,`${label}: session mismatch on ${route}; got ${String(info.user)} role=${String(info.role)} body=${String(info.body).slice(0,80)}`);assert(info.denied===!expected,`${label}: ${route} expected ${expected?'allowed':'denied'} but denied=${info.denied}`);assert(page.errors.length===0,`${label}: browser errors on ${route}: ${page.errors.join(' | ')}`);}
}

async function run(){
  const server=await serve();const port=server.address().port;const base=`http://${APP_HOST}:${port}`;const browser=await launchBrowser();
  const results=[];
  try{
    // 1) Platform Admin: every portal page must execute in a real browser without access denial or JS exceptions.
    let p=await createPage(browser,base,'USR-001');
    await assertPageMatrix(p,'USR-001',new Set(ALL_PAGES),'Platform Admin');
    for(const [route,selector] of Object.entries(PLATFORM_DRAWER_ACTIONS)){await p.goto(route);const opened=await p.evaluate(`(()=>{const b=document.querySelector(${JSON.stringify(selector)});if(!b||b.disabled)return{button:false,disabled:b?.disabled??null,drawer:false};b.click();return{button:true,disabled:b.disabled,drawer:document.querySelector('#admin-drawer')?.classList.contains('is-open')||false,title:document.querySelector('#drawer-title')?.textContent||''};})()`);await sleep(40);assert(opened.button&&opened.drawer,`Platform Admin: ${route} ${selector} did not open its drawer/form (${JSON.stringify(opened)})`);assert(p.errors.length===0,`Platform Admin: drawer/form error on ${route}: ${p.errors.join(' | ')}`);}
    results.push(`Platform Admin: ${ALL_PAGES.length}/${ALL_PAGES.length} pages render + ${Object.keys(PLATFORM_DRAWER_ACTIONS).length} drawers/forms open`);await p.close();

    // 2) Company Admin: company-aware modules only; global configuration is denied.
    p=await createPage(browser,base,'USR-009');
    await assertPageMatrix(p,'USR-009',COMPANY_ALLOWED,'Company Admin');
    let info=await p.goto('users-access.html?companyId=CMP-002');
    let access=await p.evaluate(`(()=>{const create=document.querySelector('#create-role'),invite=document.querySelector('#invite-user');invite?.click();const form=document.querySelector('#invite-form');const company=[...(form?.querySelector('[name="companyId"]')?.options||[])].map(o=>o.value);const roles=[...(form?.querySelector('[name="roleId"]')?.options||[])].map(o=>o.value);return{createDisabled:create?.disabled,inviteDisabled:invite?.disabled,companies:company,roles};})()`);
    assert(access.createDisabled===true,'Company Admin: Create role must be disabled without roles.manage.');
    assert(access.inviteDisabled===false,'Company Admin: Invite user should remain enabled with users.manage.');
    assert(JSON.stringify(access.companies)===JSON.stringify(['CMP-002']),'Company Admin: invite company selector leaked another company.');
    assert(!access.roles.includes('ROLE-PLATFORM-ADMIN')&&!access.roles.includes('ROLE-COMPANY-ADMIN'),'Company Admin: privileged role appeared in assignable role list.');
    // Tamper the DOM to inject Platform Admin, then invoke the normal save click. State must remain unchanged.
    const before=await p.evaluate(`VoltDriveAdmin.getState().invitations.length`);
    const tamper=await p.evaluate(`(()=>{const f=document.querySelector('#invite-form');if(!f)return 'no-form';f.querySelector('[name="name"]').value='Privilege Test';f.querySelector('[name="email"]').value='privilege.test@example.com';const r=f.querySelector('[name="roleId"]');const o=document.createElement('option');o.value='ROLE-PLATFORM-ADMIN';o.textContent='Platform Admin';r.appendChild(o);r.value='ROLE-PLATFORM-ADMIN';document.querySelector('#save-invite')?.click();return document.querySelector('#ui-toast')?.textContent||'';})()`);
    await sleep(80);
    const after=await p.evaluate(`VoltDriveAdmin.getState().invitations.length`);
    assert(after===before,`Company Admin: DOM tampering created a privileged invitation. Toast: ${tamper}`);
    assert(p.errors.length===0,`Company Admin Users browser errors: ${p.errors.join(' | ')}`);
    // Cross-company URL must not expose CMP-001 data.
    await p.goto('payments.html?companyId=CMP-001');
    const cross=await p.evaluate(`(()=>{const rows=[...document.querySelectorAll('#provider-table-body tr')];return{context:VoltDriveAdmin.companyContext()?.id||null,companies:rows.map(r=>r.children[1]?.innerText||'').join('|'),stateProviders:VoltDriveAdmin.getState().paymentProviders.filter(x=>VoltDriveAdmin.companyInScope(x.companyId)&&VoltDriveAdmin.companyContextMatch(x.companyId)).map(x=>x.companyId)};})()`);
    assert(cross.context===null,'Company Admin: foreign companyId should not become active context.');
    assert(cross.stateProviders.every(x=>x==='CMP-002'),'Company Admin: foreign provider entered scoped dataset.');
    results.push('Company Admin: route guard, scope, role delegation and DOM-tamper protection OK');await p.close();

    // 3) Finance: financial pages allowed, organization/global pages denied, refund permission remains actionable.
    p=await createPage(browser,base,'USR-007');
    await assertPageMatrix(p,'USR-007',FINANCE_ALLOWED,'Finance');
    await p.goto('payments.html?companyId=CMP-001');
    const paid=await p.evaluate(`(()=>{const s=VoltDriveAdmin.getState();return s.paymentTransactions.find(x=>x.companyId==='CMP-001'&&x.status==='paid')?.id||null;})()`);
    assert(paid,'Finance: no paid transaction available for refund test.');
    await p.evaluate(`document.querySelector('[data-transaction-id="${paid}"]')?.click()`);await sleep(80);
    const refundButton=await p.evaluate(`(()=>{const b=document.querySelector('#transaction-refund');return b?{exists:true,disabled:b.disabled,aria:b.getAttribute('aria-disabled'),permission:b.dataset.permission||null}:{exists:false};})()`);
    assert(refundButton.exists,'Finance: payments.refund did not expose refund action.');
    assert(refundButton.disabled===false,'Finance: refund action was incorrectly disabled by generic read-only UI.');
    await p.evaluate(`document.querySelector('#transaction-refund')?.click()`);await sleep(80);
    const refunded=await p.evaluate(`VoltDriveAdmin.getState().paymentTransactions.find(x=>x.id===${JSON.stringify(paid)})?.status`);
    assert(refunded==='refunded','Finance: permitted refund action did not update transaction state.');
    await p.goto('taxes.html?companyId=CMP-001');
    const taxEdit=await p.evaluate(`(()=>{const b=document.querySelector('#add-tax-profile')||document.querySelector('[id^="edit-"]')||[...document.querySelectorAll('button')].find(x=>/^edit/i.test(x.textContent.trim()));return b?{disabled:b.disabled,id:b.id,text:b.textContent.trim()}:null;})()`);
    assert(!taxEdit||taxEdit.disabled===false,'Finance: taxes.manage action unexpectedly disabled.');
    results.push('Finance: financial route matrix + granular refund/manage permissions OK');await p.close();

    // 4) Auditor: company-scoped read-only; no mutation controls become actionable.
    p=await createPage(browser,base,'USR-010');
    await assertPageMatrix(p,'USR-010',AUDITOR_ALLOWED,'Auditor');
    await p.goto('payments.html?companyId=CMP-003');
    const auditButtons=await p.evaluate(`[...document.querySelectorAll('button')].filter(b=>/^(add|create|edit|save|approve|deny|send|revoke|run|schedule|publish|archive|disable|activate|refund)/i.test((b.textContent||'').trim())).map(b=>({id:b.id,text:b.textContent.trim(),disabled:b.disabled}))`);
    assert(auditButtons.every(b=>b.disabled),`Auditor: mutable payment button enabled: ${JSON.stringify(auditButtons.filter(b=>!b.disabled))}`);
    await p.goto('accounting.html?companyId=CMP-003');
    const accountingMutation=await p.evaluate(`[...document.querySelectorAll('button')].filter(b=>/^(add|create|edit|save|post|approve|run|schedule)/i.test((b.textContent||'').trim())).map(b=>({id:b.id,text:b.textContent.trim(),disabled:b.disabled}))`);
    assert(accountingMutation.every(b=>b.disabled),`Auditor: accounting mutation button enabled: ${JSON.stringify(accountingMutation.filter(b=>!b.disabled))}`);
    results.push('Auditor: scoped read-only behavior OK');await p.close();

    // 5) Operator attack: a role-specific user with payments.view cannot enter the Admin Portal directly.
    p=await createPage(browser,base,'USR-004');
    info=await p.goto('payments.html');
    assert(info.denied===true,'Operator: direct payments.html URL bypassed admin.portal.view.');
    const operatorRender=await p.evaluate(`({providers:document.querySelector('#payment-provider-count')?.textContent||null,rows:document.querySelectorAll('#provider-table-body tr').length,portal:VoltDriveAdmin.can('admin.portal.view')})`);
    assert(operatorRender.portal===false,'Operator: unexpectedly has admin.portal.view.');
    assert(operatorRender.rows===0,'Operator: page controller rendered payment data before access denial.');
    assert(p.errors.length===0,`Operator attack produced browser errors: ${p.errors.join(' | ')}`);
    results.push('Operator direct-URL attack blocked before page data render');await p.close();

    console.log('OK: real-browser role/access regression suite passed.');
    for(const line of results)console.log(`  - ${line}`);
  }finally{await browser.close();await new Promise(r=>server.close(r));}
}

run().catch(err=>{if(err?.code==='BROWSER_POLICY_BLOCK'&&!STRICT){console.log(`SKIP: ${err.message}`);console.log('      Run with --strict in an environment where Chromium may access localhost to enforce the browser suite.');process.exitCode=0;return;}console.error(`FAIL: ${err.message}`);process.exitCode=1;});
