(function(){
  const api=window.VoltDriveAdmin;
  const sidebar=document.querySelector('.sidebar');
  const overlay=document.querySelector('.mobile-overlay');
  const menu=document.getElementById('menu-button');
  function closeMenu(){sidebar?.classList.remove('is-open');overlay?.classList.remove('is-visible');}
  menu?.addEventListener('click',()=>{sidebar?.classList.toggle('is-open');overlay?.classList.toggle('is-visible');});
  overlay?.addEventListener('click',closeMenu);
  window.addEventListener('resize',()=>{if(innerWidth>820)closeMenu();});

  // Keep the desktop sidebar at the same scroll position while navigating between pages.
  const SIDEBAR_SCROLL_KEY='voltdrive_admin_sidebar_scroll_v1';
  function saveSidebarScroll(){
    if(!sidebar)return;
    try{sessionStorage.setItem(SIDEBAR_SCROLL_KEY,String(sidebar.scrollTop));}catch(_){/* storage may be unavailable */}
  }
  function restoreSidebarScroll(){
    if(!sidebar)return;
    let saved=null;
    try{saved=sessionStorage.getItem(SIDEBAR_SCROLL_KEY);}catch(_){/* storage may be unavailable */}
    if(saved!==null&&Number.isFinite(Number(saved))){
      const top=Math.max(0,Number(saved));
      requestAnimationFrame(()=>{sidebar.scrollTop=top;requestAnimationFrame(()=>{sidebar.scrollTop=top;});});
      return;
    }
    const active=sidebar.querySelector('.nav-link.is-active');
    active?.scrollIntoView?.({block:'nearest'});
  }
  sidebar?.querySelectorAll('a.nav-link[href]').forEach(link=>link.addEventListener('click',saveSidebarScroll,{capture:true}));
  sidebar?.addEventListener('scroll',()=>{
    // Persist manual scrolling as well, so refresh/back navigation keeps the same section visible.
    saveSidebarScroll();
  },{passive:true});
  window.addEventListener('pagehide',saveSidebarScroll);
  restoreSidebarScroll();

  const PAGE_ACCESS={
    'dashboard.html':{view:'admin.portal.view',manage:null},
    'companies.html':{view:'companies.view',manage:'companies.manage'},
    'users-access.html':{view:'users.view',manage:'users.manage'},
    'countries-currencies.html':{view:'markets.view',manage:'markets.manage'},
    'tariffs.html':{view:'tariffs.view',manage:'tariffs.edit'},
    'taxes.html':{view:'taxes.view',manage:'taxes.manage'},
    'payments.html':{view:'payments.view',manage:'payments.manage'},
    'partners-settlements.html':{view:'settlements.view',manage:'settlements.manage'},
    'roaming.html':{view:'roaming.view',manage:'roaming.manage'},
    'integrations.html':{view:'integrations.view',manage:'integrations.manage'},
    'firmware.html':{view:'firmware.view',manage:'firmware.manage'},
    'security.html':{view:'security.view',manage:'security.certificates.manage'},
    'ai-automation.html':{view:'ai.view',manage:'ai.manage'},
    'energy-optimization.html':{view:'energy.view',manage:'energy.manage'},
    'reports-audit.html':{view:'audit.view',manage:'reports.manage'},
    'platform-settings.html':{view:'platform.settings.view',manage:'platform.settings.manage'}
  };
  const page=(location.pathname.split('/').pop()||'dashboard.html').toLowerCase();
  const access=PAGE_ACCESS[page];
  const can=(permission)=>!permission||api?.can?.(permission);

  // Sidebar identity follows the active prototype session rather than hard-coded markup.
  const currentUser=api?.currentUser?.();
  const currentRole=api?.currentRole?.();
  if(currentUser){
    document.querySelectorAll('.sidebar-user').forEach(card=>{
      const avatar=card.querySelector('.sidebar-user__avatar');
      const name=card.querySelector('strong');
      const role=card.querySelector('div > span');
      if(avatar)avatar.textContent=(currentUser.name||'U').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
      if(name)name.textContent=currentUser.name;
      if(role)role.textContent=currentRole?.name||'Administrator';
    });
  }

  // Hide/lock modules the current role cannot view. Platform Admin remains unaffected.
  document.querySelectorAll('.sidebar a.nav-link[href]').forEach(link=>{
    const target=(link.getAttribute('href')||'').split('?')[0];
    const rule=PAGE_ACCESS[target];
    if(rule&&!can(rule.view)){
      link.classList.add('is-access-locked');
      link.setAttribute('aria-disabled','true');
      link.title='Not available for the current role';
      link.addEventListener('click',event=>{event.preventDefault();window.AdminUI?.toast?.('This module is outside your current role permissions.');});
    }
  });

  function renderAccessDenied(){
    const content=document.querySelector('.page-content');
    if(!content||!access||can(access.view))return false;
    content.classList.add('is-access-denied');
    content.setAttribute('inert','');
    const panel=document.createElement('section');
    panel.className='access-denied-panel';
    panel.innerHTML=`<span class="access-denied-panel__icon">◇</span><div><h2>Access restricted</h2><p>Your current role does not include <strong>${access.view}</strong>. Use Users & Access to review the assigned role and scope.</p></div><a class="button button--secondary" href="dashboard.html">Return to Dashboard</a>`;
    content.parentNode.insertBefore(panel,content);
    return true;
  }

  const MUTATION_ID=/^(add-|create-|edit-|save-|toggle-|approve-|deny-|send-|revoke-|renew-|block-|resolve-|new-|run-|mark-|schedule-|start-|advance-|complete-|clone-|publish-|archive-|disable-|activate-|review-settings|invite-user|create-role)/i;
  function applyReadOnly(root=document){
    if(!access||can(access.manage))return;
    root.querySelectorAll?.('button').forEach(btn=>{
      const id=btn.id||'';
      const text=(btn.textContent||'').trim();
      const mutation=MUTATION_ID.test(id)||/^(add|create|edit|save|approve|deny|send|revoke|renew|block|resolve|run|schedule|start|complete|publish|archive|disable|activate|suspend|clone|mark paid|mark ready)/i.test(text);
      if(mutation){btn.disabled=true;btn.setAttribute('aria-disabled','true');btn.title='Read-only for the current role';btn.classList.add('is-permission-disabled');}
    });
    root.querySelectorAll?.('form').forEach(form=>{
      form.querySelectorAll('input,select,textarea').forEach(field=>{if(!field.closest('.toolbar-actions')&&!field.closest('.company-toolbar')&&!field.closest('.reports-toolbar')&&!field.closest('.audit-toolbar'))field.disabled=true;});
    });
  }

  const denied=renderAccessDenied();
  if(!denied&&access&&!can(access.manage)){
    document.body.classList.add('access-read-only');
    applyReadOnly();
    const observer=new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(node=>{if(node.nodeType===1)applyReadOnly(node);}))); 
    observer.observe(document.body,{childList:true,subtree:true});
  }

  const adminState=api?.getState?.();
  if(adminState){
    const pending=(adminState.accessRequests||[]).filter(item=>item.status==='review').length;
    document.querySelectorAll('a[href="users-access.html"] .nav-link__badge').forEach(badge=>{badge.textContent=pending;badge.hidden=pending===0;});
    const expiring=(adminState.securityCertificates||[]).filter(item=>item.status==='expiring').length;
    document.querySelectorAll('a[href="security.html"] .nav-link__badge').forEach(badge=>{badge.textContent=expiring;badge.hidden=expiring===0;});
    const aiApprovals=(adminState.aiApprovals||[]).filter(item=>item.status==='review').length;
    document.querySelectorAll('a[href="ai-automation.html"] .nav-link__badge').forEach(badge=>{badge.textContent=aiApprovals;badge.hidden=aiApprovals===0;});
  }
  const refresh=document.getElementById('refresh-button');
  refresh?.addEventListener('click',()=>{
    refresh.animate([{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}],{duration:420,easing:'ease-out'});
    window.dispatchEvent(new CustomEvent('admin:refresh'));
    window.AdminUI?.toast('Administration data refreshed.');
  });
})();
