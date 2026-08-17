(function(){
  const api=window.VoltDriveAdmin;
  let state=api.getState();
  const $=(s)=>document.querySelector(s);
  const esc=(v='')=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const statusClass=(status)=>`status-${String(status||'disabled').toLowerCase().replace(/\s+/g,'-')}`;
  const severityIcon={critical:'!',warning:'!',info:'i'};
  const isPlatformScope=()=>api.isPlatformScope?.()===true;
  const scopedCompanies=()=>state.companies.filter(c=>api.companyInScope(c.id));
  const scopedCompanyIds=()=>new Set(scopedCompanies().map(c=>c.id));
  const scopedUsers=()=>{const ids=scopedCompanyIds();return state.userDirectory.filter(u=>ids.has(u.companyId));};
  const scopedRequests=()=>{const ids=scopedCompanyIds();return (state.accessRequests||[]).filter(r=>ids.has(r.companyId));};
  const scopedCountries=()=>{const codes=new Set(scopedCompanies().map(c=>c.countryCode));return state.countries.filter(c=>codes.has(c.code));};
  const healthPermission={ERP:'integrations.view',Payments:'payments.view',Roaming:'roaming.view',Security:'security.view',Firmware:'firmware.view',Energy:'energy.view',AI:'ai.view'};
  const visibleHealth=()=>state.integrations.filter(item=>{
    if(!api.can(healthPermission[item.type]))return false;
    if(item.type==='ERP'&&!isPlatformScope())return (state.enterpriseIntegrations||[]).some(x=>x.category==='ERP'&&api.companyInScope(x.companyId));
    return true;
  });
  const visibleAttention=()=>state.attention.filter(item=>{
    if(isPlatformScope())return true;
    if(item.module==='Security & Certificates')return api.can('security.view');
    if(item.module==='Users & Access')return api.can('users.view')&&scopedRequests().some(r=>r.status==='review');
    if(item.module==='Countries & Taxes')return api.can('taxes.view')&&scopedCountries().some(c=>c.name===item.entity);
    if(item.module==='ERP & Integrations')return api.can('integrations.view')&&(state.enterpriseIntegrations||[]).some(x=>api.companyInScope(x.companyId)&&x.system==='1C');
    if(item.module==='Roaming')return api.can('roaming.view');
    return false;
  });
  const visibleAudit=()=>{if(isPlatformScope())return state.audit;const ids=scopedCompanyIds();const names=new Set(scopedUsers().map(u=>u.name));return state.audit.filter(a=>(a.companyId&&ids.has(a.companyId))||names.has(a.actor));};
  let toastTimer;
  function toast(message){const el=$('#ui-toast');if(!el)return;el.textContent=message;el.classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('is-visible'),2200);}
  window.AdminUI={toast};
  function openDrawer(title,subtitle,body,footer=''){
    $('#drawer-title').textContent=title;$('#drawer-subtitle').textContent=subtitle;$('#drawer-body').innerHTML=body;$('#drawer-footer').innerHTML=footer;
    $('#drawer-backdrop').classList.add('is-visible');$('#admin-drawer').classList.add('is-open');
  }
  function closeDrawer(){ $('#drawer-backdrop').classList.remove('is-visible');$('#admin-drawer').classList.remove('is-open'); }
  $('#drawer-close')?.addEventListener('click',closeDrawer);$('#drawer-backdrop')?.addEventListener('click',closeDrawer);
  function renderKpis(){
    const companies=scopedCompanies();
    const users=scopedUsers();
    const countries=scopedCountries();
    const health=visibleHealth();
    const attention=visibleAttention();
    const aggregateUsers=companies.reduce((sum,c)=>sum+Number(c.users||0),0);
    const sites=companies.reduce((sum,c)=>sum+Number(c.sites||0),0);
    const invites=(state.invitations||[]).filter(i=>api.companyInScope(i.companyId));
    $('#kpi-companies').textContent=companies.length;
    $('#kpi-users').textContent=aggregateUsers;
    $('#kpi-users-note').textContent=`${users.length} prototype directory records · ${invites.filter(i=>i.status!=='revoked').length} invitations`;
    $('#kpi-countries').textContent=countries.length;
    $('#kpi-sites').textContent=sites;
    $('#kpi-integrations').textContent=health.filter(x=>['connected','scheduled'].includes(x.status)).length;
    const issues=attention.filter(x=>x.severity!=='info').length;
    $('#kpi-issues').textContent=issues;
    $('#kpi-issues-note').textContent=`${attention.filter(x=>x.severity==='critical').length} critical · ${attention.filter(x=>x.severity==='warning').length} warnings`;
  }
  function renderHealth(){
    $('#platform-health').innerHTML=visibleHealth().map(item=>`<div class="health-row" data-integration="${esc(item.id)}"><div class="health-row__main"><span class="health-row__icon">${esc(item.icon)}</span><div><strong>${esc(item.name)}</strong><span>${esc(item.detail)}</span></div></div><div class="health-row__side"><span class="ui-pill ${statusClass(item.status)}">${esc(item.status)}</span><small>${esc(item.lastSync)} · ${esc(item.latency)}</small></div></div>`).join('');
    document.querySelectorAll('[data-integration]').forEach(el=>el.addEventListener('click',()=>openIntegration(el.dataset.integration)));
  }
  function openIntegration(id){
    const item=state.integrations.find(x=>x.id===id);if(!item)return;
    openDrawer(item.name,`${item.type} · ${item.id}`,`<section class="ui-detail-section"><div class="ui-callout ${item.status==='warning'?'ui-callout--warning':'ui-callout--info'}"><strong>${esc(item.detail)}</strong><span>This stage provides a platform-level administration overview. Detailed configuration will live in the dedicated module.</span></div></section><section class="ui-detail-section"><h3>Connection status</h3><div class="ui-detail-grid"><div><span>Status</span><strong><span class="ui-pill ${statusClass(item.status)}">${esc(item.status)}</span></strong></div><div><span>Last sync</span><strong>${esc(item.lastSync)}</strong></div><div><span>Type</span><strong>${esc(item.type)}</strong></div><div><span>State</span><strong>${esc(item.latency)}</strong></div></div></section>`,`<button class="button button--secondary" id="drawer-close-action">Close</button><button class="button button--primary" id="drawer-open-module">Open ${esc(item.type)} module</button>`);
    $('#drawer-close-action').onclick=closeDrawer;$('#drawer-open-module').onclick=()=>{if(item.type==='Roaming'){location.href='roaming.html';return;}if(item.type==='ERP'){location.href='integrations.html';return;}if(item.type==='Payments'){location.href='payments.html';return;}if(item.type==='Firmware'){location.href='firmware.html';return;}if(item.type==='Security'){location.href='security.html';return;}if(item.type==='AI'){location.href='ai-automation.html';return;}if(item.type==='Energy'){location.href='energy-optimization.html';return;}toast(`${item.type} module will be implemented in a dedicated stage.`);};
  }
  function renderAttention(){
    $('#attention-list').innerHTML=visibleAttention().map(item=>`<div class="attention-entry attention-entry--${esc(item.severity)}" data-attention="${esc(item.id)}"><span class="attention-entry__icon">${severityIcon[item.severity]||'i'}</span><div><strong>${esc(item.title)}</strong><span>${esc(item.detail)}</span></div><time>${esc(item.time)}</time></div>`).join('');
    document.querySelectorAll('[data-attention]').forEach(el=>el.addEventListener('click',()=>openAttention(el.dataset.attention)));
  }
  function openAttention(id){
    const item=state.attention.find(x=>x.id===id);if(!item)return;
    const isAccess=item.module==='Users & Access';const isRoaming=item.module==='Roaming';const isErp=item.module==='ERP & Integrations';const isSecurity=item.module==='Security & Certificates';
    openDrawer(item.title,`${item.module} · ${item.entity}`,`<section class="ui-detail-section"><div class="ui-callout ${item.severity==='critical'?'ui-callout--danger':item.severity==='warning'?'ui-callout--warning':'ui-callout--info'}"><strong>${esc(item.title)}</strong><span>${esc(item.detail)}</span></div></section><section class="ui-detail-section"><h3>Administrative context</h3><div class="ui-detail-grid"><div><span>Module</span><strong>${esc(item.module)}</strong></div><div><span>Severity</span><strong>${esc(item.severity)}</strong></div><div><span>Entity</span><strong>${esc(item.entity)}</strong></div><div><span>Detected</span><strong>${esc(item.time)}</strong></div></div></section>`,`<button class="button button--secondary" id="drawer-dismiss">${isAccess?'Review later':'Acknowledge'}</button><button class="button button--primary" id="drawer-module">Open ${esc(item.module)}</button>`);
    $('#drawer-dismiss').onclick=()=>{toast(isAccess?'Access request kept in review queue.':'Administration issue acknowledged.');closeDrawer();};
    $('#drawer-module').onclick=()=>{if(isAccess){location.href='users-access.html';return;}if(isRoaming){location.href='roaming.html';return;}if(isErp){location.href='integrations.html';return;}if(isSecurity){location.href='security.html';return;}toast(`${item.module} will be implemented in the next relevant stage.`);};
  }
  function renderOrg(){
    const companies=scopedCompanies();
    const countries=scopedCountries();
    const companyIds=scopedCompanyIds();
    const aggregateUsers=companies.reduce((sum,c)=>sum+Number(c.users||0),0);
    const sites=companies.reduce((sum,c)=>sum+Number(c.sites||0),0);
    const approvals=scopedRequests().filter(r=>r.status==='review').length;
    const tariffs=(state.tariffProfiles||[]).filter(t=>companyIds.has(t.companyId));
    const countryCodes=new Set(countries.map(c=>c.code));
    const currencies=new Set(tariffs.map(t=>t.currency));
    const taxProfiles=(state.taxProfiles||[]).filter(t=>countryCodes.has(t.countryCode));
    const providers=(state.paymentProviders||[]).filter(p=>!p.companyId||companyIds.has(p.companyId));
    $('#organization-summary').innerHTML=`<article class="summary-stat"><span>Legal entities</span><strong>${companies.length}</strong><small>${companies.filter(x=>x.status==='active').length} active</small></article><article class="summary-stat"><span>Countries</span><strong>${countries.length}</strong><small>${countries.map(x=>x.code).join(' · ')||'—'}</small></article><article class="summary-stat"><span>Sites</span><strong>${sites}</strong><small>in assigned company scope</small></article><article class="summary-stat"><span>Employees</span><strong>${aggregateUsers}</strong><small>${approvals} access approvals</small></article>`;
    $('#financial-summary').innerHTML=`<article class="summary-stat"><span>Active tariffs</span><strong>${tariffs.filter(t=>t.status==='active').length}</strong><small>${tariffs.filter(t=>t.status==='draft').length} drafts</small></article><article class="summary-stat"><span>Currencies</span><strong>${currencies.size}</strong><small>${[...currencies].join(' · ')||'—'}</small></article><article class="summary-stat"><span>Tax profiles</span><strong>${taxProfiles.length}</strong><small>${taxProfiles.filter(t=>t.status!=='active').length} incomplete</small></article><article class="summary-stat"><span>Payment providers</span><strong>${providers.length}</strong><small>within visible scope</small></article>`;
  }
  function renderSecurity(){
    if(api.can('security.view')){
      $('#security-stack').innerHTML=`<div class="security-card"><span class="security-card__icon">✓</span><div><strong>Two-factor authentication</strong><span>${state.security.twoFactorCoverage}% platform aggregate coverage</span></div><span class="ui-pill status-healthy">Healthy</span></div><div class="security-card"><span class="security-card__icon">◇</span><div><strong>Security certificates</strong><span>${state.security.certificates} certificates · ${state.security.expiringCertificates} expiring soon</span></div><span class="ui-pill ${state.security.expiringCertificates?'status-warning':'status-healthy'}">${state.security.expiringCertificates?'Review':'Healthy'}</span></div><div class="security-card"><span class="security-card__icon">♙</span><div><strong>Privileged access</strong><span>${state.security.privilegedUsers} privileged accounts · last change ${state.security.lastPermissionChange}</span></div><span class="ui-pill status-connected">Tracked</span></div>`;
      return;
    }
    const users=scopedUsers().filter(u=>u.status==='active');
    const roles=new Map(state.roles.map(r=>[r.id,r]));
    const without2fa=users.filter(u=>!u.twoFactor).length;
    const privileged=users.filter(u=>roles.get(u.roleId)?.privileged).length;
    const coverage=users.length?Math.round((users.length-without2fa)/users.length*100):100;
    $('#security-stack').innerHTML=`<div class="security-card"><span class="security-card__icon">✓</span><div><strong>Two-factor authentication</strong><span>${coverage}% in prototype directory scope</span></div><span class="ui-pill ${without2fa?'status-warning':'status-healthy'}">${without2fa?'Review':'Healthy'}</span></div><div class="security-card"><span class="security-card__icon">♙</span><div><strong>Privileged access</strong><span>${privileged} privileged sample account(s) in scope</span></div><span class="ui-pill status-connected">Scoped</span></div><div class="security-card"><span class="security-card__icon">◇</span><div><strong>Certificate inventory</strong><span>Restricted by Security & Certificates permission</span></div><span class="ui-pill status-disabled">Restricted</span></div>`;
  }
  function renderActivity(){
    $('#activity-list').innerHTML=visibleAudit().map(item=>`<div class="activity-entry"><span class="activity-entry__icon">${esc(item.icon)}</span><div><strong>${esc(item.title)}</strong><span>${esc(item.detail)}</span></div><time>${esc(item.time)}</time></div>`).join('');
  }
  function openAccessQueue(){
    const reviews=scopedRequests().filter(r=>r.status==='review');
    openDrawer('Access approval queue',`${reviews.length} requests waiting for review`, `<section class="ui-detail-section"><div class="ui-callout ui-callout--warning"><strong>Role and scope approval</strong><span>Permissions are evaluated together with company, region and site scope. Open Users & Access for the full permission matrix and approval workflow.</span></div></section><section class="ui-detail-section"><h3>Requests</h3>${reviews.map(r=>`<div class="health-row" data-access="${esc(r.id)}"><div><strong>${esc(r.name)}</strong><span>${esc(r.requestedRole)} · ${esc(r.scope)}</span></div><span class="ui-pill status-review">review</span></div>`).join('')||'<div class="ui-callout ui-callout--info"><strong>No pending approvals</strong><span>The access approval queue is currently clear.</span></div>'}</section>`, `<button class="button button--secondary" id="access-close">Close</button><button class="button button--primary" id="access-module">Users & Access</button>`);
    $('#access-close').onclick=closeDrawer;$('#access-module').onclick=()=>{location.href='users-access.html';};
  }
  function renderQuickLinks(){
    const targetPermission={companies:'companies.view',access:'users.view',tariffs:'tariffs.view',countries:'markets.view',taxes:'taxes.view',erp:'integrations.view',security:'security.view'};
    document.querySelectorAll('[data-quick]').forEach(btn=>{
      const key=btn.dataset.quick;
      const permission=targetPermission[key];
      if(permission&&!api.can(permission)){btn.disabled=true;btn.classList.add('is-permission-disabled');btn.title='Not available for the current role';return;}
      btn.addEventListener('click',()=>{
        if(key==='companies'){location.href='companies.html';return;}
        if(key==='access'){location.href='users-access.html';return;}
        if(key==='tariffs'){location.href='tariffs.html';return;}
        if(key==='countries'){location.href='countries-currencies.html';return;}
        if(key==='taxes'){location.href='taxes.html';return;}
        if(key==='erp'){location.href='integrations.html';return;}
        if(key==='security'){location.href='security.html';return;}
      });
    });
  }
  function render(){state=api.getState();renderKpis();renderHealth();renderAttention();renderOrg();renderSecurity();renderActivity();}
  window.addEventListener('admin:refresh',render);
  renderQuickLinks();render();
})();
