const path=require('path');

const store=new Map();
global.localStorage={
  getItem:key=>store.has(key)?store.get(key):null,
  setItem:(key,value)=>store.set(key,String(value)),
  removeItem:key=>store.delete(key),
  clear:()=>store.clear()
};
global.window={};

require(path.resolve(__dirname,'../js/core/admin-state.js'));
const api=window.VoltDriveAdmin;
if(!api) throw new Error('VoltDriveAdmin API was not initialized.');
const state=api.getState();
const assert=(condition,message)=>{if(!condition) throw new Error(message);};

assert(api.currentUser()?.id==='USR-001','Default session should use USR-001.');
assert(api.currentRole()?.id==='ROLE-PLATFORM-ADMIN','Default session should be Platform Admin.');
assert(api.can('ai.manage')===true,'Platform Admin should manage AI.');
assert(api.companyInScope('CMP-004')===true,'Platform Admin should see every company.');
assert(api.currentAccessScope().level==='platform','Platform Admin must resolve an explicit Platform scope.');
assert(api.canAssignRole('ROLE-PLATFORM-ADMIN','CMP-004')===true,'Platform Admin should be allowed to assign privileged platform roles.');
assert(api.canAccessAdminModule('ai.view',{platformOnly:true})===true,'Platform Admin should pass platform-only module guards.');

const aggregateUsers=state.companies.reduce((sum,c)=>sum+Number(c.users||0),0);
assert(state.users.active===aggregateUsers,`Aggregate users mismatch: ${state.users.active} !== ${aggregateUsers}`);
assert(state.users.directoryTotal===state.userDirectory.length,'Directory total should equal sample directory length.');
assert(state.users.directoryActive===10,'Expected 10 active sample directory users.');
assert(state.security.twoFactorCoverage===96,'Platform aggregate 2FA coverage should remain 96%.');
assert(state.security.directoryTwoFactorCoverage===90,'Sample directory 2FA coverage should be 90%.');

assert(api.setCurrentUser('USR-009')===true,'Should switch to Company Admin USR-009.');
assert(api.currentRole()?.id==='ROLE-COMPANY-ADMIN','USR-009 should resolve Company Admin role.');
assert(api.can('admin.portal.view')===true,'Company Admin should access Admin Portal.');
assert(api.can('companies.view')===true,'Company Admin should view companies.');
assert(api.can('companies.manage')===false,'Company Admin should not manage company records in this prototype role.');
assert(api.companyInScope('CMP-002')===true,'Company Admin should see own company.');
assert(api.companyInScope('CMP-001')===false,'Company Admin should not see another company.');
assert(api.currentAccessScope().level==='company','Company Admin should resolve a company scope.');
assert(api.countryInScope('AM')===true,'Company Admin should see the country containing its company.');
assert(api.countryInScope('GE')===false,'Company Admin should not see another country.');
assert(api.can('roles.manage')===false,'Company Admin must not manage roles.');
assert(api.canAssignRole('ROLE-PLATFORM-ADMIN','CMP-002')===false,'Company Admin must not assign Platform Admin.');
assert(api.canAssignRole('ROLE-COMPANY-ADMIN','CMP-002')===false,'Company Admin must not delegate privileged Company Admin role without roles.manage.');
assert(api.canAssignRole('ROLE-OPERATOR','CMP-002')===true,'Company Admin should be able to delegate a standard scoped Operator role.');
assert(api.canGrantScope({level:'platform',companyIds:[],countryCodes:[],siteIds:[],chargerIds:[]},'CMP-002')===false,'Company Admin must not grant Platform scope.');
assert(api.canGrantScope({level:'company',companyIds:['CMP-002'],countryCodes:['AM'],siteIds:[],chargerIds:[]},'CMP-002')===true,'Company Admin should grant scope inside its own company.');
assert(api.canGrantScope({level:'site',companyIds:['CMP-002'],countryCodes:['AM'],siteIds:['LOC-AM-YER-MALL'],chargerIds:[]},'CMP-002')===false,'Company Admin must not grant a site belonging to another company.');

const before=state.audit.length;
api.addAudit({icon:'✓',module:'Smoke Test',severity:'info',title:'Access smoke test',detail:'Runtime state validation.'});
assert(state.audit.length===before+1,'addAudit should append a new audit record.');
const audit=state.audit[0];
assert(/^\d{4}-\d{2}-\d{2}$/.test(audit.date),`Audit date is not normalized: ${audit.date}`);
assert(/^\d{2}:\d{2}$/.test(audit.time),`Audit time is not normalized: ${audit.time}`);
assert(audit.actor==='Davit Khachatryan',`Audit actor should follow current session user: ${audit.actor}`);
assert(audit.companyId==='CMP-002',`Company-scoped audit should carry CMP-002: ${audit.companyId}`);

assert(api.setCurrentUser('USR-010')===true,'Should switch to scoped Auditor USR-010.');
assert(api.isPlatformScope()===false,'Company auditor must not become platform-wide because the role supports both scope models.');
assert(api.companyInScope('CMP-003')===true,'Auditor should see assigned company.');
assert(api.companyInScope('CMP-001')===false,'Auditor should not see other companies.');
assert(api.can('companies.manage')===false,'Auditor must remain read-only.');
assert(api.currentAccessScope().level==='company','Scoped Auditor must resolve company scope even though the role supports Platform / Company.');
assert(api.canAccessAdminModule('companies.view')===true,'Company-scoped Auditor should enter scoped Admin modules it can view.');
assert(api.canAccessAdminModule('ai.view',{platformOnly:true})===false,'Company-scoped Auditor must not enter platform-wide AI configuration.');
assert(api.setCurrentUser('USR-004')===true,'Should switch to Operator USR-004.');
assert(api.can('admin.portal.view')===false,'Operator should use Operator Portal, not Admin Portal.');
assert(api.canAccessAdminModule('payments.view')===false,'Operator must be blocked from Admin Payments even though the role can view payment context elsewhere.');
assert(api.currentAccessScope().level==='site','Operator should keep a site-level scope.');
assert(api.siteInScope('LOC-AM-YER-MALL')===true,'Yerevan-scoped Operator should access an assigned site.');
assert(api.siteInScope('LOC-AM-ARARAT-DEPOT')===false,'Yerevan-scoped Operator should not access another company site.');
assert(api.canAssignRole('ROLE-OPERATOR','CMP-001')===false,'Operator cannot delegate roles.');

assert(api.setCurrentUser('USR-007')===true,'Should switch to Finance USR-007.');
assert(api.currentRole()?.id==='ROLE-FINANCE','USR-007 should resolve Finance role.');
assert(api.can('reports.manage')===true,'Finance should manage company-scoped reports and exports.');
assert(api.reportInScope(state.reportDefinitions.find(r=>r.id==='RPT-003'))===true,'Finance should see the VoltDrive Armenia financial report.');
assert(api.reportInScope(state.reportDefinitions.find(r=>r.id==='RPT-001'))===false,'Company-scoped Finance must not see a platform-wide executive report.');
assert(api.reportInScope(state.reportRuns.find(r=>r.id==='RUN-0267'))===true,'Finance should see scheduled runs belonging to its company even when generated by Scheduler.');
assert(api.reportInScope(state.reportRuns.find(r=>r.id==='RUN-0268'))===false,'Finance must not see platform-wide scheduled report runs.');
assert(api.auditInScope(state.audit.find(a=>a.id==='AUD-106'))===true,'Finance should see its company payment audit entry.');
assert(api.auditInScope(state.audit.find(a=>a.id==='AUD-105'))===false,'Finance must not see another company audit entry.');
assert(api.auditInScope(state.audit.find(a=>a.id==='AUD-104'))===false,'Finance must not see platform-only security audit entries.');

assert(api.setCurrentUser('USR-001')===true,'Should restore Platform Admin session.');
assert(api.currentUser()?.id==='USR-001','Platform Admin session was not restored.');
assert(api.reportInScope(state.reportDefinitions.find(r=>r.id==='RPT-001'))===true,'Platform Admin should see platform reports.');
assert(api.reportInScope(state.reportDefinitions.find(r=>r.id==='RPT-003'))===true,'Platform Admin should see company reports.');
assert(api.auditInScope(state.audit.find(a=>a.id==='AUD-105'))===true,'Platform Admin should see all company audit entries.');
const inferredTargetAudit=api.addAudit({icon:'T',module:'Smoke Test',severity:'info',title:'Company configuration updated',detail:'Ararat Mobility · active'});
assert(inferredTargetAudit.companyId==='CMP-002','Platform Admin audit should inherit the target company when the affected object is company-scoped.');

const oldAuditDays=state.platformSettings.retention.auditDays,oldReportDays=state.reportingPolicies.reportRetentionDays;
state.audit.unshift({id:'AUD-RETENTION-OLD',date:'2020-01-01',time:'00:00',icon:'T',module:'Smoke Test',actor:'Smoke',severity:'info',title:'Old audit',detail:'Retention test',source:'Smoke',companyId:''});
state.reportRuns.unshift({id:'RUN-RETENTION-OLD',reportId:'RPT-001',runAt:'2020-01-01 00:00',period:'Old',format:'CSV',rows:1,status:'ready',generatedBy:'Smoke',scopeLevel:'platform',companyIds:[],summary:'Retention test'});
state.platformSettings.retention.auditDays=30;state.reportingPolicies.auditRetentionDays=30;state.reportingPolicies.reportRetentionDays=30;
api.applyRetentionPolicies();
assert(!state.audit.some(a=>a.id==='AUD-RETENTION-OLD'),'Audit retention must remove records older than the configured number of days.');
assert(!state.reportRuns.some(r=>r.id==='RUN-RETENTION-OLD'),'Report retention must remove runs older than the configured number of days.');
state.platformSettings.retention.auditDays=oldAuditDays;state.reportingPolicies.auditRetentionDays=oldAuditDays;state.reportingPolicies.reportRetentionDays=oldReportDays;

console.log('OK: admin-state runtime smoke test passed.');
console.log(`Users aggregate: ${state.users.active}; sample directory: ${state.users.directoryTotal}; platform 2FA: ${state.security.twoFactorCoverage}%; sample 2FA: ${state.security.directoryTwoFactorCoverage}%.`);
