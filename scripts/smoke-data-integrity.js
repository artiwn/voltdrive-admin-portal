const path=require('path');
const store=new Map();
global.localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k),clear:()=>store.clear()};
global.window={};
require(path.resolve(__dirname,'../js/core/admin-state.js'));
const api=window.VoltDriveAdmin,state=api.getState(),assert=(v,m)=>{if(!v)throw new Error(m)};
const byId=(rows,id)=>rows.find(x=>x.id===id);

assert(Array.isArray(state.locations)&&state.locations.length>=8,'Canonical Location registry should be initialized.');
assert(Array.isArray(state.chargers)&&state.chargers.length>=8,'Canonical Charger registry should be initialized.');
assert(api.validateDataIntegrity().length===0,`Clean seed has integrity issues: ${JSON.stringify(api.validateDataIntegrity())}`);

const operator=byId(state.userDirectory,'USR-004'),gyumri=byId(state.userDirectory,'USR-012');
assert(operator.accessScope.siteIds.includes('LOC-AM-YER-MALL'),'Legacy Yerevan energy-site scope must migrate to canonical Location ID.');
assert(!operator.accessScope.siteIds.some(id=>id.startsWith('ENG-SITE-')),'Legacy ENG-SITE IDs must not remain in user access scope.');
assert(gyumri.accessScope.siteIds.includes('LOC-AM-GYUMRI'),'Legacy SITE-GYUMRI scope must migrate to canonical Location ID.');

for(const e of state.energySites){assert(byId(state.locations,e.locationId),`Energy policy ${e.id} must reference a canonical Location.`);const loc=byId(state.locations,e.locationId);assert(e.companyId===loc.companyId&&e.countryCode===loc.countryCode,`Energy policy ${e.id} must inherit company/market from Location.`);}
for(const t of state.tariffProfiles){for(const id of t.scopeRefs?.locationIds||[]){const loc=byId(state.locations,id);assert(loc&&loc.companyId===t.companyId,`Tariff ${t.id} has invalid Location ref ${id}.`);}for(const id of t.scopeRefs?.chargerIds||[]){const ch=byId(state.chargers,id);assert(ch&&ch.companyId===t.companyId,`Tariff ${t.id} has invalid Charger ref ${id}.`);}}
for(const p of state.partners){for(const id of p.siteIds||[]){const loc=byId(state.locations,id);assert(loc&&loc.companyId===p.companyId,`Partner ${p.id} has invalid Location ref ${id}.`);}assert(p.linkedSites===(p.siteIds||[]).length,`Partner ${p.id} linkedSites must derive from canonical siteIds.`);}
for(const r of state.settlementRuns){const p=byId(state.partners,r.partnerId);assert(p&&r.companyId===p.companyId,`Settlement ${r.id} must inherit partner company.`);assert(r.currency===p.currency,`Settlement ${r.id} must inherit partner currency.`);}
for(const p of state.paymentProviders){const c=byId(state.companies,p.companyId);assert(c&&p.countryCode===c.countryCode,`Provider ${p.id} market must derive from company.`);assert((p.currencies||[]).every(code=>state.currencies.some(c=>c.code===code)),`Provider ${p.id} contains unknown currency.`);}
for(const t of state.paymentTransactions){if(t.providerId){const p=byId(state.paymentProviders,t.providerId);assert(p&&p.companyId===t.companyId,`Transaction ${t.id} provider/company mismatch.`);}}
const brokenSettlement=byId(state.accountingEntries,'JRN-000377');assert(brokenSettlement.sourceId==='SET-2608-001','Legacy broken accounting settlement ref must be repaired.');assert(byId(state.settlementRuns,brokenSettlement.sourceId),'Accounting settlement source must exist.');
for(const e of state.accountingEntries){if(e.siteId)assert(byId(state.locations,e.siteId),`Accounting ${e.id} Location missing.`);if(e.chargerId){const ch=byId(state.chargers,e.chargerId);assert(ch,`Accounting ${e.id} Charger missing.`);assert(!e.siteId||ch.locationId===e.siteId,`Accounting ${e.id} Charger/Location mismatch.`);}}
for(const r of state.profitabilityRecords){if(r.scopeType==='Site')assert(byId(state.locations,r.entityId),`Profitability ${r.id} Location missing.`);if(r.scopeType==='Charger')assert(byId(state.chargers,r.entityId),`Profitability ${r.id} Charger missing.`);}

// Reset must rebuild canonical refs too, not only first-load migrations.
api.reset();const resetState=api.getState();
assert(api.validateDataIntegrity().length===0,`Reset seed has integrity issues: ${JSON.stringify(api.validateDataIntegrity())}`);
assert(byId(resetState.accountingEntries,'JRN-000377').sourceId==='SET-2608-001','Reset must repair known legacy accounting source ref.');
assert(byId(resetState.energySites,'ENG-SITE-001').locationId==='LOC-AM-YER-MALL','Reset must restore Energy -> Location canonical ref.');
assert((byId(resetState.partners,'PRT-001').siteIds||[]).includes('LOC-AM-YER-MALL'),'Reset must restore Partner -> Location refs.');
assert((byId(resetState.tariffProfiles,'TAR-002').scopeRefs.locationIds||[]).includes('LOC-AM-YER-MALL'),'Reset must restore Tariff -> Location refs.');
assert(byId(resetState.profitabilityRecords,'PROF-001').entityId==='LOC-AM-YER-MALL','Reset must restore profitability entity IDs.');

// Validator must detect a real orphan instead of silently accepting it.
const original=resetState.chargers[0].locationId;resetState.chargers[0].locationId='LOC-MISSING';
const orphanIssues=api.validateDataIntegrity();
assert(orphanIssues.some(x=>x.code==='CHARGER_LOCATION_MISSING'&&x.entityId===resetState.chargers[0].id),'Validator must report orphan Charger -> Location references.');
resetState.chargers[0].locationId=original;api.repairDataIntegrity();
assert(api.validateDataIntegrity().length===0,'Integrity state should return clean after repair/restoration.');

console.log('OK: canonical data-integrity smoke test passed.');
console.log(`Locations: ${resetState.locations.length}; Chargers: ${resetState.chargers.length}; integrity issues: ${api.validateDataIntegrity().length}.`);
