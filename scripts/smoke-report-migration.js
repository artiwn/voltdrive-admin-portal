const path=require('path');
const store=new Map();
global.localStorage={
  getItem:key=>store.has(key)?store.get(key):null,
  setItem:(key,value)=>store.set(key,String(value)),
  removeItem:key=>store.delete(key),
  clear:()=>store.clear()
};
global.window={};

store.set('voltdrive_admin_v1',JSON.stringify({
  currentSession:{userId:'USR-007'},
  reportDefinitions:[{
    id:'RPT-999',name:'Legacy company report',category:'Finance',scope:'VoltDrive Armenia',owner:'Finance',schedule:'Manual',format:'CSV',status:'active',lastRun:'Never',nextRun:'Manual',dataDomains:['Revenue'],description:'Legacy report created before structured report scope.'
  }],
  reportRuns:[{
    id:'RUN-9999',reportId:'RPT-999',runAt:'2026-08-18 10:00',period:'Today',format:'CSV',rows:2,status:'ready',generatedBy:'Scheduler',summary:'Legacy scheduled run'
  }]
}));

require(path.resolve(__dirname,'../js/core/admin-state.js'));
const api=window.VoltDriveAdmin,state=api.getState();
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const report=state.reportDefinitions.find(item=>item.id==='RPT-999');
const run=state.reportRuns.find(item=>item.id==='RUN-9999');
assert(report,'Legacy report should survive state migration.');
assert(report.scopeLevel==='company','Legacy company report should migrate to company scope.');
assert(report.companyIds?.includes('CMP-001'),'Legacy VoltDrive Armenia report should resolve CMP-001.');
assert(run?.scopeLevel==='company','Legacy scheduled run should inherit report scope.');
assert(run?.companyIds?.includes('CMP-001'),'Legacy scheduled run should inherit CMP-001.');
assert(api.reportInScope(report)===true,'Finance user should see migrated company report.');
assert(api.reportInScope(run)===true,'Finance user should see migrated Scheduler run.');
console.log('OK: legacy report/run scope migration passed.');
