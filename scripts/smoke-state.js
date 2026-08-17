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
assert(api.setCurrentUser('USR-004')===true,'Should switch to Operator USR-004.');
assert(api.can('admin.portal.view')===false,'Operator should use Operator Portal, not Admin Portal.');
assert(api.setCurrentUser('USR-001')===true,'Should restore Platform Admin session.');
assert(api.currentUser()?.id==='USR-001','Platform Admin session was not restored.');

console.log('OK: admin-state runtime smoke test passed.');
console.log(`Users aggregate: ${state.users.active}; sample directory: ${state.users.directoryTotal}; platform 2FA: ${state.security.twoFactorCoverage}%; sample 2FA: ${state.security.directoryTwoFactorCoverage}%.`);
