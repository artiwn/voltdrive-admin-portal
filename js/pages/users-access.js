(function(){
  if(!window.VoltDriveAdmin?.canAccessAdminModule?.('users.view'))return;
  const api=window.VoltDriveAdmin;
  let state=api.getState();
  const $=(s)=>document.querySelector(s);
  const $$=(s)=>Array.from(document.querySelectorAll(s));
  const esc=(v='')=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const initials=(name='')=>name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'US';
  const statusClass=(status)=>`status-${String(status||'disabled').toLowerCase().replace(/\s+/g,'-')}`;
  let toastTimer;
  let selectedRoleId=null;

  function toast(message){const el=$('#ui-toast');if(!el)return;el.textContent=message;el.classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('is-visible'),2300);}
  window.AdminUI={toast};
  function openDrawer(title,subtitle,body,footer=''){$('#drawer-title').textContent=title;$('#drawer-subtitle').textContent=subtitle;$('#drawer-body').innerHTML=body;$('#drawer-footer').innerHTML=footer;$('#drawer-backdrop').classList.add('is-visible');$('#admin-drawer').classList.add('is-open');}
  function closeDrawer(){$('#drawer-backdrop').classList.remove('is-visible');$('#admin-drawer').classList.remove('is-open');}
  $('#drawer-close')?.addEventListener('click',closeDrawer);$('#drawer-backdrop')?.addEventListener('click',closeDrawer);

  const company=(id)=>state.companies.find(c=>c.id===id)||{name:'Unknown company',country:'—'};
  const role=(id)=>state.roles.find(r=>r.id===id)||{id,name:'Unknown role',permissions:[],privileged:false,scopeModel:'—'};
  const scopedUsers=()=>state.userDirectory.filter(u=>api.companyInScope(u.companyId)&&api.companyContextMatch(u.companyId));
  const scopedCompanies=()=>state.companies.filter(c=>api.companyInScope(c.id)&&api.companyContextMatch(c.id));
  const scopedInvitations=()=>state.invitations.filter(i=>api.companyInScope(i.companyId)&&api.companyContextMatch(i.companyId));
  const scopedRequests=()=>state.accessRequests.filter(r=>api.companyInScope(r.companyId)&&api.companyContextMatch(r.companyId));
  const permissionCount=(r)=>r.permissions.includes('*')?state.permissionCatalog.reduce((n,g)=>n+g.items.length,0):r.permissions.length;
  const isGranted=(r,id)=>r.permissions.includes('*')||r.permissions.includes(id);
  const roleIcon=(r)=>r.id==='ROLE-PLATFORM-ADMIN'?'◆':r.id==='ROLE-COMPANY-ADMIN'?'▣':r.id==='ROLE-OP-SUPERVISOR'?'★':r.id==='ROLE-OPERATOR'?'◉':r.id==='ROLE-FLEET-MANAGER'?'◇':r.id==='ROLE-TECHNICIAN'?'⌁':r.id==='ROLE-FINANCE'?'¤':r.id==='ROLE-SUPPORT'?'☏':r.id==='ROLE-AUDITOR'?'▥':'♙';
  function addAudit(title,detail,icon='♙'){api.addAudit({icon,title,detail});}
  const canManageUsers=()=>api.can('users.manage');
  const canManageRoles=()=>api.can('roles.manage');
  const manageableUser=(u)=>canManageUsers()&&api.canManageUser(u);
  const assignableRoles=(companyId)=>state.roles.filter(r=>api.canAssignRole(r.id,companyId));
  function companyScope(companyId,level='company',siteId='',chargerIds=[]){
    const c=company(companyId);
    return {level,companyIds:level==='platform'?[]:[companyId],countryCodes:level==='platform'?[]:[c.countryCode].filter(Boolean),siteIds:level==='site'||level==='charger'?[siteId].filter(Boolean):[],chargerIds:level==='charger'?chargerIds:[]};
  }
  function scopeLabel(accessScope,companyId){
    const scope=api.normalizeAccessScope(accessScope,{companyId,accessScope});
    if(scope.level==='platform')return 'Platform · All companies';
    const c=company(companyId);
    if(scope.level==='country')return `${c.name} · ${c.country}`;
    if(scope.level==='site'){const site=state.locations?.find(x=>x.id===scope.siteIds[0]);return `${c.name} · ${site?.name||scope.siteIds[0]||'Selected site'}`;}
    if(scope.level==='charger')return `${c.name} · Charger ${scope.chargerIds.join(', ')||'scope'}`;
    return `${c.name} · All sites`;
  }
  function scopeFields(accessScope,companyId){
    const scope=api.normalizeAccessScope(accessScope,{companyId,accessScope});
    const sites=(state.locations||[]).filter(x=>x.companyId===companyId&&api.siteInScope(x.id));
    const allowPlatform=api.isPlatformScope()&&canManageRoles();
    return `<label class="form-field"><span>Scope level</span><select name="scopeLevel">${allowPlatform?`<option value="platform" ${scope.level==='platform'?'selected':''}>Platform</option>`:''}<option value="company" ${scope.level==='company'?'selected':''}>Company</option><option value="country" ${scope.level==='country'?'selected':''}>Country</option><option value="site" ${scope.level==='site'?'selected':''}>Site</option><option value="charger" ${scope.level==='charger'?'selected':''}>Charger</option></select></label><label class="form-field"><span>Site</span><select name="siteId"><option value="">All / not applicable</option>${sites.map(x=>`<option value="${esc(x.id)}" ${scope.siteIds.includes(x.id)?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label><label class="form-field form-field--full"><span>Charger IDs</span><input name="chargerIds" value="${esc(scope.chargerIds.join(', '))}" placeholder="Only required for Charger scope"></label>`;
  }
  function scopeFromForm(form,companyId){
    const data=new FormData(form),level=String(data.get('scopeLevel')||'company').toLowerCase(),siteId=String(data.get('siteId')||''),chargerIds=String(data.get('chargerIds')||'').split(',').map(x=>x.trim()).filter(Boolean);
    const scope=companyScope(companyId,level,siteId,chargerIds),site=siteId?state.locations?.find(x=>x.id===siteId):null;
    if(level==='site'&&!siteId){toast('Select a site for Site scope.');return null;}
    if(level==='charger'&&!siteId){toast('Select the charger site first.');return null;}
    if((level==='site'||level==='charger')&&(!site||site.companyId!==companyId)){toast('Selected site does not belong to the selected company.');return null;}
    if(level==='charger'&&!chargerIds.length){toast('Enter at least one charger ID for Charger scope.');return null;}
    if(!api.canGrantScope(scope,companyId)){toast('The selected scope is outside your own access scope.');return null;}
    return scope;
  }
  function syncScopedForm(form,currentRoleId=''){
    const companySelect=form?.elements?.companyId,roleSelect=form?.elements?.roleId,siteSelect=form?.elements?.siteId;if(!companySelect)return;
    const refresh=()=>{const companyId=companySelect.value;if(roleSelect){const keep=roleSelect.value||currentRoleId,roles=assignableRoles(companyId);if(currentRoleId&&!roles.some(r=>r.id===currentRoleId)){const current=role(currentRoleId);if(current?.id)roles.unshift(current);}roleSelect.innerHTML=roles.map(r=>`<option value="${esc(r.id)}" ${r.id===keep?'selected':''}>${esc(r.name)}</option>`).join('');if(!roles.some(r=>r.id===roleSelect.value)&&roles[0])roleSelect.value=roles[0].id;}if(siteSelect){const keepSite=siteSelect.value,sites=(state.locations||[]).filter(x=>x.companyId===companyId&&api.siteInScope(x.id));siteSelect.innerHTML='<option value="">All / not applicable</option>'+sites.map(x=>`<option value="${esc(x.id)}" ${x.id===keepSite?'selected':''}>${esc(x.name)}</option>`).join('');}};
    companySelect.addEventListener('change',refresh);
  }
  function setText(selector,value){const el=$(selector);if(el)el.textContent=value;return el;}
  function renderKpis(){
    const directory=scopedUsers();
    const active=directory.filter(u=>u.status==='active').length;
    const privileged=directory.filter(u=>u.status==='active'&&role(u.roleId).privileged).length;
    const with2fa=directory.filter(u=>u.status==='active'&&u.twoFactor).length;
    const coverage=Math.round(with2fa/Math.max(1,active)*100);
    const invites=scopedInvitations().filter(i=>['sent','draft'].includes(i.status)).length;
    const approvals=scopedRequests().filter(r=>r.status==='review').length;
    setText('#access-kpi-active',active);
    setText('#access-kpi-privileged',privileged);
    setText('#access-kpi-2fa',`${coverage}%`);
    setText('#access-kpi-2fa-note',`${directory.filter(u=>u.status==='active'&&!u.twoFactor).length} active accounts without 2FA`);
    setText('#access-kpi-invites',invites);
    setText('#access-kpi-approvals',approvals);
    setText('#tab-users-count',directory.length);
    setText('#tab-roles-count',state.roles.length);
    setText('#tab-requests-count',approvals);
    setText('#tab-invitations-count',invites);
    const sidebarBadge=$('a[href="users-access.html"] .nav-link__badge');
    if(sidebarBadge){sidebarBadge.textContent=approvals;sidebarBadge.hidden=approvals===0;}
  }

  function fillFilters(){
    const companySelect=$('#user-company'),roleSelect=$('#user-role');
    const companyValue=companySelect.value||'all',roleValue=roleSelect.value||'all';
    companySelect.innerHTML='<option value="all">All companies</option>'+scopedCompanies().map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('');
    roleSelect.innerHTML='<option value="all">All roles</option>'+state.roles.map(r=>`<option value="${esc(r.id)}">${esc(r.name)}</option>`).join('');
    if([...companySelect.options].some(o=>o.value===companyValue))companySelect.value=companyValue;
    if([...roleSelect.options].some(o=>o.value===roleValue))roleSelect.value=roleValue;
  }

  function renderUsers(){
    const q=$('#user-search').value.trim().toLowerCase(),companyId=$('#user-company').value,roleId=$('#user-role').value,status=$('#user-status').value;
    const rows=scopedUsers().filter(u=>{
      const c=company(u.companyId),r=role(u.roleId);
      const hay=[u.name,u.email,c.name,r.name,u.scope].join(' ').toLowerCase();
      return (!q||hay.includes(q))&&(companyId==='all'||u.companyId===companyId)&&(roleId==='all'||u.roleId===roleId)&&(status==='all'||u.status===status);
    });
    $('#user-result-count').textContent=`${rows.length} user${rows.length===1?'':'s'}`;
    $('#user-empty').hidden=rows.length>0;
    $('#user-table-body').innerHTML=rows.map(u=>{
      const c=company(u.companyId),r=role(u.roleId);
      return `<tr data-user="${esc(u.id)}"><td><div class="user-cell"><span class="user-avatar">${esc(initials(u.name))}</span><div><strong>${esc(u.name)}</strong><span>${esc(u.email)} · ${esc(u.id)}</span></div></div></td><td><div class="user-company"><strong>${esc(c.name)}</strong><span>${esc(c.country)}</span></div></td><td><span class="ui-pill ${r.privileged?'status-review':'status-info'}">${esc(r.name)}</span></td><td><div class="user-scope">${esc(u.scope)}</div></td><td><span class="two-factor ${u.twoFactor?'two-factor--on':'two-factor--off'}"><span class="two-factor__dot">${u.twoFactor?'✓':'!'}</span>${u.twoFactor?'Enabled':'Missing'}</span></td><td><div class="company-secondary">${esc(u.lastLogin)}</div></td><td><span class="ui-pill ${statusClass(u.status)}">${esc(u.status)}</span></td></tr>`;
    }).join('');
    $$('[data-user]').forEach(row=>row.addEventListener('click',()=>openUser(row.dataset.user)));
  }

  function userPermissionSummary(u){
    const r=role(u.roleId);
    const groups=state.permissionCatalog.map(g=>{
      const granted=g.items.filter(p=>isGranted(r,p.id));
      if(!granted.length)return '';
      return `<div class="permission-group"><div class="permission-group__head"><strong>${esc(g.group)}</strong><span>${granted.length}/${g.items.length}</span></div><div class="permission-list">${granted.map(p=>`<div class="permission-item is-granted"><span class="permission-mark">✓</span>${esc(p.label)}</div>`).join('')}</div></div>`;
    }).join('');
    return groups||'<div class="role-inspector-empty">No effective permissions.</div>';
  }

  function openUser(id){
    const u=state.userDirectory.find(x=>x.id===id);if(!u)return;
    const c=company(u.companyId),r=role(u.roleId);
    const canEdit=manageableUser(u);
    openDrawer(u.name,`${u.email} · ${u.id}`,`<div class="access-profile"><div class="access-profile__head"><span class="access-profile__avatar">${esc(initials(u.name))}</span><div><h3>${esc(u.name)}</h3><p>${esc(c.name)} · ${esc(u.email)}</p><div class="access-profile__chips"><span class="ui-pill ${r.privileged?'status-review':'status-info'}">${esc(r.name)}</span><span class="ui-pill ${statusClass(u.status)}">${esc(u.status)}</span><span class="ui-pill ${u.twoFactor?'status-approved':'status-warning'}">2FA ${u.twoFactor?'enabled':'missing'}</span></div></div></div><div class="scope-callout"><strong>Effective access scope</strong><span>${esc(u.scope)}. Role permissions are always constrained by this scope.</span></div><section class="ui-detail-section"><h3>Identity</h3><div class="ui-detail-grid"><div><span>Company</span><strong>${esc(c.name)}</strong></div><div><span>Role</span><strong>${esc(r.name)}</strong></div><div><span>Last login</span><strong>${esc(u.lastLogin)}</strong></div><div><span>Identity source</span><strong>${esc(u.source)}</strong></div><div><span>Created</span><strong>${esc(u.createdAt)}</strong></div><div><span>Permission count</span><strong>${permissionCount(r)}</strong></div></div></section><section class="ui-detail-section"><h3>Effective permissions</h3><div class="role-permission-groups">${userPermissionSummary(u)}</div></section>${canEdit?'':'<section class="ui-detail-section"><div class="ui-callout ui-callout--warning"><strong>Protected account</strong><span>Your role can view this account but cannot modify its privileged access.</span></div></section>'}</div>`,canEdit?`<button class="button button--secondary" id="edit-user-access">Edit access</button><button class="button ${u.status==='suspended'?'button--primary':'button--danger'}" id="toggle-user-status">${u.status==='suspended'?'Activate user':'Suspend user'}</button>`:`<button class="button button--secondary" id="protected-user-close">Close</button>`);
    if(canEdit){$('#edit-user-access').onclick=()=>openUserAccessForm(u.id);$('#toggle-user-status').onclick=()=>toggleUserStatus(u.id);}else $('#protected-user-close').onclick=closeDrawer;
  }

  function userAccessFormHtml(u){
    const roles=assignableRoles(u.companyId);
    if(!roles.some(r=>r.id===u.roleId))roles.unshift(role(u.roleId));
    return `<form id="user-access-form" class="form-grid"><label class="form-field form-field--full"><span>User</span><input value="${esc(u.name)} · ${esc(u.email)}" disabled></label><label class="form-field"><span>Company</span><select name="companyId">${scopedCompanies().map(c=>`<option value="${esc(c.id)}" ${c.id===u.companyId?'selected':''}>${esc(c.name)}</option>`).join('')}</select></label><label class="form-field"><span>Role</span><select name="roleId">${roles.map(r=>`<option value="${esc(r.id)}" ${r.id===u.roleId?'selected':''}>${esc(r.name)}</option>`).join('')}</select></label>${scopeFields(u.accessScope,u.companyId)}<label class="form-field"><span>Account status</span><select name="status"><option value="active" ${u.status==='active'?'selected':''}>Active</option><option value="setup" ${u.status==='setup'?'selected':''}>Setup</option><option value="suspended" ${u.status==='suspended'?'selected':''}>Suspended</option></select></label><label class="form-field"><span>Two-factor authentication</span><select name="twoFactor"><option value="true" ${u.twoFactor?'selected':''}>Required / enabled</option><option value="false" ${!u.twoFactor?'selected':''}>Not enabled</option></select></label><div class="form-field form-field--full"><p class="drawer-form-actions-note">Role permissions and structured scope are evaluated together. Platform access cannot be delegated by a company-scoped administrator.</p></div></form>`;
  }
  function openUserAccessForm(id){const u=state.userDirectory.find(x=>x.id===id);if(!u||!manageableUser(u)){toast('You cannot modify this account.');return;}openDrawer('Edit user access',`${u.name} · ${u.id}`,userAccessFormHtml(u),`<button class="button button--secondary" id="cancel-user-edit">Cancel</button><button class="button button--primary" id="save-user-edit">Save access</button>`);syncScopedForm($('#user-access-form'),u.roleId);$('#cancel-user-edit').onclick=openUser.bind(null,id);$('#save-user-edit').onclick=()=>saveUserAccess(id);}
  function saveUserAccess(id){const u=state.userDirectory.find(x=>x.id===id),form=$('#user-access-form');if(!u||!form||!form.reportValidity()||!manageableUser(u))return;const data=Object.fromEntries(new FormData(form).entries()),companyId=data.companyId,roleId=data.roleId;if(!api.companyInScope(companyId)){toast('Company is outside your access scope.');return;}if(roleId!==u.roleId&&!api.canAssignRole(roleId,companyId)){toast('You cannot assign this role.');return;}const accessScope=scopeFromForm(form,companyId);if(!accessScope)return;u.companyId=companyId;u.roleId=roleId;u.accessScope=accessScope;u.scope=scopeLabel(accessScope,companyId);u.status=data.status;u.twoFactor=data.twoFactor==='true';addAudit('User access changed',`${u.name} · ${role(u.roleId).name} · ${u.scope}`);api.save();toast('User access saved.');render();openUser(id);}
  function toggleUserStatus(id){const u=state.userDirectory.find(x=>x.id===id);if(!u||!manageableUser(u))return;if(u.id===api.currentUser()?.id){toast('You cannot suspend your own active session.');return;}u.status=u.status==='suspended'?'active':'suspended';addAudit(u.status==='active'?'User activated':'User suspended',`${u.name} · ${u.email}`);api.save();toast(u.status==='active'?'User activated.':'User suspended.');render();openUser(id);}


  function renderRoles(){
    $('#role-result-count').textContent=`${state.roles.length} roles`;
    if(!selectedRoleId||!state.roles.some(r=>r.id===selectedRoleId))selectedRoleId=state.roles[0]?.id||null;
    $('#role-list').innerHTML=state.roles.map(r=>`<div class="role-row ${r.id===selectedRoleId?'is-selected':''}" data-role="${esc(r.id)}"><div class="role-row__main"><span class="role-icon">${esc(roleIcon(r))}</span><div><strong>${esc(r.name)}</strong><span>${esc(r.description)}</span></div></div><div class="role-meta"><strong>${permissionCount(r)}</strong><span>Permissions</span></div><div class="role-meta"><strong>${esc(r.scopeModel)}</strong><span>Scope model</span></div><div class="role-meta"><strong>${r.users||state.userDirectory.filter(u=>u.roleId===r.id).length}</strong><span>Users</span></div></div>`).join('');
    $$('[data-role]').forEach(el=>el.addEventListener('click',()=>{selectedRoleId=el.dataset.role;renderRoles();}));
    renderRoleInspector();
  }
  function renderRoleInspector(){
    const r=role(selectedRoleId);if(!r||!selectedRoleId){$('#role-inspector').innerHTML='<div class="role-inspector-empty">Select a role.</div>';return;}
    $('#role-inspector').innerHTML=`<div class="role-inspector-head"><h3>${esc(r.name)}</h3><p>${esc(r.description)}</p><div class="role-inspector-meta"><span class="ui-pill ${r.privileged?'status-review':'status-info'}">${r.privileged?'privileged':'standard'}</span><span class="panel-chip">${esc(r.scopeModel)}</span><span class="panel-chip">${r.type==='system'?'system role':'custom role'}</span></div></div><div class="role-permission-groups">${state.permissionCatalog.map(g=>{const count=g.items.filter(p=>isGranted(r,p.id)).length;return `<div class="permission-group"><div class="permission-group__head"><strong>${esc(g.group)}</strong><span>${count}/${g.items.length}</span></div><div class="permission-list">${g.items.map(p=>`<div class="permission-item ${isGranted(r,p.id)?'is-granted':''}"><span class="permission-mark">${isGranted(r,p.id)?'✓':'—'}</span>${esc(p.label)}</div>`).join('')}</div></div>`}).join('')}</div><div style="display:flex;gap:8px;margin-top:14px"><button class="action-button" id="open-role-details">Open details</button>${canManageRoles()?(r.type==='custom'?'<button class="action-button" id="edit-custom-role">Edit role</button>':'<button class="action-button" id="clone-system-role">Clone role</button>'):''}</div>`;
    $('#open-role-details').onclick=()=>openRole(r.id);
    if(canManageRoles()){if(r.type==='custom')$('#edit-custom-role').onclick=()=>openRoleForm(r.id);else $('#clone-system-role').onclick=()=>openRoleForm(null,r);}
  }
  function openRole(id){const r=role(id),editable=canManageRoles();openDrawer(r.name,`${r.type==='system'?'System role':'Custom role'} · ${r.scopeModel}`,`<section class="ui-detail-section"><div class="ui-callout ${r.privileged?'ui-callout--warning':'ui-callout--info'}"><strong>${r.privileged?'Privileged role':'Standard role'}</strong><span>${esc(r.description)}</span></div></section><section class="ui-detail-section"><h3>Role definition</h3><div class="ui-detail-grid"><div><span>Users</span><strong>${r.users||state.userDirectory.filter(u=>u.roleId===r.id).length}</strong></div><div><span>Permission count</span><strong>${permissionCount(r)}</strong></div><div><span>Scope model</span><strong>${esc(r.scopeModel)}</strong></div><div><span>Type</span><strong>${esc(r.type)}</strong></div></div></section><section class="ui-detail-section"><h3>Permissions</h3><div class="role-permission-groups">${state.permissionCatalog.map(g=>`<div class="permission-group"><div class="permission-group__head"><strong>${esc(g.group)}</strong><span>${g.items.filter(p=>isGranted(r,p.id)).length}/${g.items.length}</span></div><div class="permission-list">${g.items.map(p=>`<div class="permission-item ${isGranted(r,p.id)?'is-granted':''}"><span class="permission-mark">${isGranted(r,p.id)?'✓':'—'}</span>${esc(p.label)}</div>`).join('')}</div></div>`).join('')}</div></section>`,editable?(r.type==='custom'?`<button class="button button--secondary" id="role-close">Close</button><button class="button button--primary" id="role-edit">Edit role</button>`:`<button class="button button--secondary" id="role-close">Close</button><button class="button button--primary" id="role-clone">Clone as custom role</button>`):`<button class="button button--secondary" id="role-close">Close</button>`);$('#role-close').onclick=closeDrawer;if(editable){if(r.type==='custom')$('#role-edit').onclick=()=>openRoleForm(r.id);else $('#role-clone').onclick=()=>openRoleForm(null,r);}}


  function permissionFormGroups(selected=[]){return state.permissionCatalog.map(g=>`<div class="permission-edit-group"><strong>${esc(g.group)}</strong>${g.items.map(p=>`<label class="permission-check"><input type="checkbox" name="permissions" value="${esc(p.id)}" ${selected.includes('*')||selected.includes(p.id)?'checked':''}><span>${esc(p.label)}</span></label>`).join('')}</div>`).join('');}
  function openRoleForm(id=null,clone=null){if(!canManageRoles()){toast('Managing roles requires roles.manage.');return;}const existing=id?state.roles.find(r=>r.id===id):null;const base=existing||clone||{name:'',description:'',privileged:false,scopeModel:'Company / Region / Site',permissions:[]};const title=existing?'Edit custom role':clone?`Clone ${clone.name}`:'Create role';openDrawer(title,existing?existing.id:'Custom access role',`<form id="role-form" class="form-grid"><label class="form-field form-field--full"><span>Role name</span><input name="name" value="${esc(existing?base.name:`${base.name}${clone?' Copy':''}`)}" placeholder="e.g. Regional Operations Lead" required></label><label class="form-field form-field--full"><span>Description</span><textarea name="description" required>${esc(base.description)}</textarea></label><label class="form-field"><span>Scope model</span><select name="scopeModel"><option ${base.scopeModel==='Platform'?'selected':''}>Platform</option><option ${base.scopeModel==='Company'?'selected':''}>Company</option><option ${base.scopeModel==='Company / Region / Site'?'selected':''}>Company / Region / Site</option><option ${base.scopeModel==='Region / Site'?'selected':''}>Region / Site</option><option ${base.scopeModel==='Company / Depot'?'selected':''}>Company / Depot</option></select></label><label class="form-field"><span>Privilege level</span><select name="privileged"><option value="false" ${!base.privileged?'selected':''}>Standard</option><option value="true" ${base.privileged?'selected':''}>Privileged</option></select></label><div class="form-field form-field--full"><span>Permissions</span><div class="permission-checkboxes">${permissionFormGroups(base.permissions)}</div></div></form>`,`<button class="button button--secondary" id="cancel-role-form">Cancel</button><button class="button button--primary" id="save-role-form">${existing?'Save role':'Create role'}</button>`);$('#cancel-role-form').onclick=closeDrawer;$('#save-role-form').onclick=()=>saveRole(id);}
  function saveRole(id){if(!api.requirePermission('roles.manage','Managing roles requires roles.manage.'))return;const form=$('#role-form');if(!form||!form.reportValidity())return;const data=new FormData(form),name=String(data.get('name')||'').trim(),description=String(data.get('description')||'').trim(),permissions=data.getAll('permissions');if(!permissions.length){toast('Select at least one permission.');return;}if(id){const r=state.roles.find(x=>x.id===id);Object.assign(r,{name,description,scopeModel:data.get('scopeModel'),privileged:data.get('privileged')==='true',permissions});selectedRoleId=r.id;addAudit('Custom role updated',`${r.name} · ${permissions.length} permissions`);}else{const r={id:api.nextId('ROLE-CUSTOM',state.roles),name,description,type:'custom',privileged:data.get('privileged')==='true',scopeModel:data.get('scopeModel'),permissions,users:0};state.roles.push(r);selectedRoleId=r.id;addAudit('Custom role created',`${r.name} · ${permissions.length} permissions`);}api.save();toast(id?'Role updated.':'Custom role created.');closeDrawer();render();switchTab('roles');}

  function renderRequests(){
    const requests=scopedRequests();const reviews=requests.filter(r=>r.status==='review').length;$('#request-review-count').textContent=`${reviews} in review`;
    if(!requests.length){$('#request-list').innerHTML='<div class="request-empty">No access requests.</div>';return;}
    $('#request-list').innerHTML=requests.map(req=>{const c=company(req.companyId),r=role(req.requestedRoleId),canApprove=canManageUsers()&&api.canAssignRole(req.requestedRoleId,req.companyId);return `<article class="request-card ${req.status!=='review'?'is-resolved':''}"><div class="request-card__main"><span class="request-card__icon">${req.status==='review'?'!':req.status==='approved'?'✓':'×'}</span><div><strong>${esc(req.name)}</strong><span>${esc(req.email)}</span><small>${esc(req.reason||'Role and scope access request.')}</small></div></div><div class="request-card__meta"><strong>${esc(req.requestedRole||r.name)}</strong><span>${esc(c.name)} · requested role</span></div><div class="request-card__meta"><strong>${esc(req.scope)}</strong><span>${esc(req.requestedAt||'Pending review')}</span></div><div class="request-card__actions">${req.status==='review'&&canManageUsers()?`<button class="action-button" data-deny-request="${esc(req.id)}">Deny</button><button class="action-button action-button--primary" data-approve-request="${esc(req.id)}" ${canApprove?'':'disabled aria-disabled="true" title="Requested role requires higher delegation authority"'}>Approve</button>`:`<span class="ui-pill ${statusClass(req.status)}">${esc(req.status)}</span>`}</div></article>`}).join('');
    $$('[data-approve-request]').forEach(btn=>btn.addEventListener('click',()=>resolveRequest(btn.dataset.approveRequest,true)));$$('[data-deny-request]').forEach(btn=>btn.addEventListener('click',()=>resolveRequest(btn.dataset.denyRequest,false)));
  }
  function resolveRequest(id,approve){const req=state.accessRequests.find(r=>r.id===id);if(!req||req.status!=='review'||!canManageUsers()||!api.companyInScope(req.companyId))return;if(approve&&!api.canAssignRole(req.requestedRoleId,req.companyId)){toast('This requested role requires higher delegation authority.');return;}const accessScope=req.accessScope||companyScope(req.companyId,'company');if(approve&&!api.canGrantScope(accessScope,req.companyId)){toast('Requested scope is outside your access scope.');return;}req.status=approve?'approved':'denied';if(approve){let u=state.userDirectory.find(x=>x.email.toLowerCase()===req.email.toLowerCase());if(u){u.roleId=req.requestedRoleId||u.roleId;u.companyId=req.companyId||u.companyId;u.accessScope=accessScope;u.scope=scopeLabel(accessScope,u.companyId);u.status='active';}else{state.userDirectory.push({id:api.nextId('USR',state.userDirectory),name:req.name,email:req.email,companyId:req.companyId,roleId:req.requestedRoleId,scope:scopeLabel(accessScope,req.companyId),accessScope,status:'active',twoFactor:false,lastLogin:'Never',source:'Access approval',createdAt:api.today()});}addAudit('Access request approved',`${req.name} · ${req.requestedRole}`);}else addAudit('Access request denied',`${req.name} · ${req.requestedRole}`);api.save();toast(approve?'Access request approved.':'Access request denied.');render();switchTab('requests');}


  function renderInvitations(){const invitations=scopedInvitations();const open=invitations.filter(i=>['sent','draft'].includes(i.status)).length;$('#invitation-open-count').textContent=`${open} open`;$('#invitation-table-body').innerHTML=invitations.map(i=>{const c=company(i.companyId),r=role(i.roleId);return `<tr data-invitation="${esc(i.id)}"><td><div class="invitee-cell"><strong>${esc(i.name)}</strong><span>${esc(i.email)} · ${esc(i.id)}</span></div></td><td>${esc(c.name)}</td><td><span class="ui-pill ${r.privileged?'status-review':'status-info'}">${esc(r.name)}</span></td><td><div class="user-scope">${esc(i.scope)}</div></td><td><span class="two-factor ${i.twoFactorRequired?'two-factor--on':'two-factor--off'}"><span class="two-factor__dot">${i.twoFactorRequired?'✓':'—'}</span>${i.twoFactorRequired?'Required':'Optional'}</span></td><td>${esc(i.sentAt)}</td><td>${esc(i.expiresAt)}</td><td><span class="ui-pill ${statusClass(i.status)}">${esc(i.status)}</span></td></tr>`}).join('');$$('[data-invitation]').forEach(row=>row.addEventListener('click',()=>openInvitation(row.dataset.invitation)));}
  function openInvitation(id){const i=state.invitations.find(x=>x.id===id);if(!i)return;const c=company(i.companyId),r=role(i.roleId),canSend=canManageUsers()&&api.canAssignRole(i.roleId,i.companyId)&&api.canGrantScope(i.accessScope||companyScope(i.companyId,'company'),i.companyId),canRevoke=canManageUsers()&&api.companyInScope(i.companyId);openDrawer(i.name,`${i.email} · ${i.id}`,`<section class="ui-detail-section"><div class="ui-callout ${i.status==='sent'?'ui-callout--info':i.status==='revoked'?'ui-callout--danger':'ui-callout--warning'}"><strong>Invitation ${esc(i.status)}</strong><span>The invitation grants no platform access until accepted.</span></div></section><section class="ui-detail-section"><h3>Invitation access</h3><div class="ui-detail-grid"><div><span>Company</span><strong>${esc(c.name)}</strong></div><div><span>Role</span><strong>${esc(r.name)}</strong></div><div><span>Scope</span><strong>${esc(i.scope)}</strong></div><div><span>2FA</span><strong>${i.twoFactorRequired?'Required':'Optional'}</strong></div><div><span>Sent</span><strong>${esc(i.sentAt)}</strong></div><div><span>Expires</span><strong>${esc(i.expiresAt)}</strong></div></div></section>`,i.status==='revoked'||(!canRevoke&&!canSend)?`<button class="button button--secondary" id="invite-close">Close</button>`:`${canRevoke?'<button class="button button--secondary" id="revoke-invite">Revoke invitation</button>':''}${canSend?`<button class="button button--primary" id="resend-invite">${i.status==='draft'?'Send invitation':'Resend invitation'}</button>`:''}`);if($('#invite-close'))$('#invite-close').onclick=closeDrawer;if($('#revoke-invite'))$('#revoke-invite').onclick=()=>revokeInvitation(id);if($('#resend-invite'))$('#resend-invite').onclick=()=>sendInvitation(id);}
  function sendInvitation(id){const i=state.invitations.find(x=>x.id===id);if(!i||!canManageUsers()||!api.canAssignRole(i.roleId,i.companyId)||!api.canGrantScope(i.accessScope||companyScope(i.companyId,'company'),i.companyId)){toast('You cannot send this invitation with the selected role or scope.');return;}i.status='sent';i.sentAt=`Today · ${api.timeNow()}`;i.expiresAt=`${api.addDays(7)} · ${api.timeNow()}`;addAudit('Invitation sent',`${i.name} · ${role(i.roleId).name}`);api.save();toast('Invitation sent.');render();openInvitation(id);}
  function revokeInvitation(id){const i=state.invitations.find(x=>x.id===id);if(!i||!canManageUsers()||!api.companyInScope(i.companyId))return;i.status='revoked';addAudit('Invitation revoked',`${i.name} · ${i.email}`);api.save();toast('Invitation revoked.');render();openInvitation(id);}
  function openInviteForm(){if(!canManageUsers()){toast('Managing users requires users.manage.');return;}const companies=scopedCompanies(),defaultCompany=companies[0];if(!defaultCompany)return;const roles=assignableRoles(defaultCompany.id);openDrawer('Invite user','Create a scoped invitation for a new platform user.',`<form id="invite-form" class="form-grid"><label class="form-field"><span>Full name</span><input name="name" placeholder="Full name" required></label><label class="form-field"><span>Email</span><input name="email" type="email" placeholder="user@company.com" required></label><label class="form-field"><span>Company</span><select name="companyId">${companies.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')}</select></label><label class="form-field"><span>Role</span><select name="roleId">${roles.map(r=>`<option value="${esc(r.id)}">${esc(r.name)}</option>`).join('')}</select></label>${scopeFields(companyScope(defaultCompany.id,'company'),defaultCompany.id)}<label class="form-field"><span>2FA policy</span><select name="twoFactorRequired"><option value="true">Required</option><option value="false">Optional</option></select></label><label class="form-field"><span>Delivery</span><select name="delivery"><option value="sent">Send now</option><option value="draft">Save as draft</option></select></label></form>`,`<button class="button button--secondary" id="cancel-invite">Cancel</button><button class="button button--primary" id="save-invite">Create invitation</button>`);syncScopedForm($('#invite-form'));$('#cancel-invite').onclick=closeDrawer;$('#save-invite').onclick=saveInvitation;}
  function saveInvitation(){const form=$('#invite-form');if(!form||!form.reportValidity()||!canManageUsers())return;const d=Object.fromEntries(new FormData(form).entries());if(!api.companyInScope(d.companyId)||!api.canAssignRole(d.roleId,d.companyId)){toast('You cannot assign this role in the selected company.');return;}const accessScope=scopeFromForm(form,d.companyId);if(!accessScope)return;if(state.invitations.some(i=>i.email.toLowerCase()===d.email.trim().toLowerCase()&&i.status!=='revoked')){toast('An open invitation already exists for this email.');return;}const i={id:api.nextId('INV',state.invitations),name:d.name.trim(),email:d.email.trim(),companyId:d.companyId,roleId:d.roleId,scope:scopeLabel(accessScope,d.companyId),accessScope,status:d.delivery,twoFactorRequired:d.twoFactorRequired==='true',sentAt:d.delivery==='sent'?`Today · ${api.timeNow()}`:'Not sent',expiresAt:d.delivery==='sent'?`${api.addDays(7)} · ${api.timeNow()}`:'—'};state.invitations.unshift(i);addAudit(d.delivery==='sent'?'Invitation sent':'Invitation drafted',`${i.name} · ${role(i.roleId).name}`);api.save();toast(d.delivery==='sent'?'Invitation created and sent.':'Invitation saved as draft.');closeDrawer();render();switchTab('invitations');}


  function switchTab(name){$$('.access-tab').forEach(b=>b.classList.toggle('is-active',b.dataset.tab===name));$$('.access-view').forEach(v=>v.classList.toggle('is-active',v.dataset.view===name));if(name==='roles')renderRoles();if(name==='requests')renderRequests();if(name==='invitations')renderInvitations();}
  function bind(){
    $$('.access-tab').forEach(btn=>btn.addEventListener('click',()=>switchTab(btn.dataset.tab)));
    ['user-search','user-company','user-role','user-status'].forEach(id=>$('#'+id)?.addEventListener(id==='user-search'?'input':'change',renderUsers));
    $('#reset-user-filters')?.addEventListener('click',()=>{$('#user-search').value='';$('#user-company').value='all';$('#user-role').value='all';$('#user-status').value='all';renderUsers();});
    $('#invite-user')?.addEventListener('click',openInviteForm);$('#create-role')?.addEventListener('click',()=>openRoleForm());
  }
  function applyAccessUi(){const createRole=$('#create-role'),invite=$('#invite-user');if(createRole){createRole.disabled=!canManageRoles();createRole.title=canManageRoles()?'Create a custom role':'Requires roles.manage';}if(invite){invite.disabled=!canManageUsers();invite.title=canManageUsers()?'Invite a user':'Requires users.manage';}}
  function render(){state=api.getState();fillFilters();renderKpis();renderUsers();renderRoles();renderRequests();renderInvitations();applyAccessUi();}
  window.addEventListener('admin:refresh',()=>{render();toast('Users & access data refreshed.');});
  bind();render();
})();
