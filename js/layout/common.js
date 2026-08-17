(function(){
  const sidebar=document.querySelector('.sidebar');
  const overlay=document.querySelector('.mobile-overlay');
  const menu=document.getElementById('menu-button');
  function closeMenu(){sidebar?.classList.remove('is-open');overlay?.classList.remove('is-visible');}
  menu?.addEventListener('click',()=>{sidebar?.classList.toggle('is-open');overlay?.classList.toggle('is-visible');});
  overlay?.addEventListener('click',closeMenu);
  window.addEventListener('resize',()=>{if(innerWidth>820)closeMenu();});
  document.querySelectorAll('[data-planned-module]').forEach(btn=>btn.addEventListener('click',()=>{
    window.AdminUI?.toast(`${btn.dataset.plannedModule}: module shell is planned for the next implementation stage.`);
    if(innerWidth<=820)closeMenu();
  }));

  const adminState=window.VoltDriveAdmin?.getState?.();
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
