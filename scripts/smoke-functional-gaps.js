const path=require('path');
const store=new Map();
global.localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k),clear:()=>store.clear()};
global.window={};
require(path.resolve(__dirname,'../js/core/admin-state.js'));
const api=window.VoltDriveAdmin,state=api.getState();
const assert=(c,m)=>{if(!c)throw new Error(m);};

assert(state.accountingEntries.length>=6,'Accounting journal seed is missing.');
assert(state.accountingMappings.length>=7,'Accounting mappings are missing.');
assert(state.financialReconciliations.some(x=>x.status==='review'),'Financial three-way reconciliation sample is missing.');
assert(state.profitabilityRecords.some(x=>x.scopeType==='Charger'),'Charger profitability sample is missing.');
assert(state.paymentTransactions.some(x=>x.status==='failed'),'Failed payment transaction coverage is missing.');
assert(state.paymentTransactions.some(x=>x.riskStatus==='blocked'),'High-risk payment transaction coverage is missing.');
assert(state.subscriptionPlans.some(x=>x.planType==='Subscription'),'Subscription plan coverage is missing.');
assert(state.subscriptionPlans.some(x=>x.planType==='Charging package'),'Charging package coverage is missing.');
for(const capability of ['Schedule optimization','Support assistance'])assert(state.aiModels.some(x=>x.capability===capability),`Missing AI capability: ${capability}`);
assert(state.automationRules.some(x=>x.name==='Safe Charger Recovery Proposal'),'Safe charger recovery automation is missing.');
assert(state.reportDefinitions.some(r=>(r.dataDomains||[]).includes('Customer activity')),'Customer activity report domain is missing.');
assert(state.reportDefinitions.some(r=>(r.dataDomains||[]).includes('Busy periods')),'Busy-period report domain is missing.');
assert(state.reportDefinitions.some(r=>(r.dataDomains||[]).includes('Carbon information')),'Carbon report domain is missing.');

assert(api.setCurrentUser('USR-007'),'Finance user switch failed.');
assert(api.canAccessAdminModule('accounting.view')===true,'Finance should access Accounting.');
assert(api.can('accounting.manage')===true,'Finance should manage accounting mappings and journals.');
const financeCompany=api.currentUser().companyId;
assert(state.accountingEntries.filter(x=>api.companyInScope(x.companyId)).every(x=>x.companyId===financeCompany),'Finance accounting scope leaks another company.');
assert(state.paymentTransactions.filter(x=>api.companyInScope(x.companyId)).every(x=>x.companyId===financeCompany),'Finance payment transaction scope leaks another company.');

assert(api.setCurrentUser('USR-009'),'Company Admin user switch failed.');
assert(api.can('accounting.view')===true,'Company Admin should view company accounting.');
assert(api.can('accounting.manage')===false,'Company Admin should not manage ledger configuration.');
assert(api.companyContextId('?companyId=CMP-001')==='', 'Company Admin must not accept cross-company Accounting context.');
assert(api.companyContextId('?companyId=CMP-002')==='CMP-002','Company Admin should accept own Accounting context.');

assert(api.setCurrentUser('USR-010'),'Auditor user switch failed.');
assert(api.can('accounting.view')===true,'Auditor should view Accounting when in scope.');
assert(api.can('accounting.manage')===false,'Auditor must remain read-only in Accounting.');

console.log('OK: functional-gap coverage smoke test passed.');
console.log(`Accounting entries: ${state.accountingEntries.length}; payment transactions: ${state.paymentTransactions.length}; plans: ${state.subscriptionPlans.length}; AI models: ${state.aiModels.length}; reports: ${state.reportDefinitions.length}.`);
