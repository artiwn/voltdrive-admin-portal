const path=require('path');
const cp=require('child_process');

if(process.argv.length===2){
  for(const userId of ['USR-001','USR-007']) cp.execFileSync(process.execPath,[__filename,userId],{stdio:'inherit'});
  console.log('OK: Reports & Audit page-level render smoke passed for Platform Admin and Finance.');
  process.exit(0);
}

const userId=process.argv[2];
const store=new Map([['voltdrive_admin_v1',JSON.stringify({currentSession:{userId}})]]);
global.localStorage={
  getItem:key=>store.has(key)?store.get(key):null,
  setItem:(key,value)=>store.set(key,String(value)),
  removeItem:key=>store.delete(key),
  clear:()=>store.clear()
};

const elements=new Map();
function makeElement(selector=''){
  const defaultValue=selector==='#audit-period'?'7d':selector.includes('category')||selector.includes('status')||selector.includes('module')||selector.includes('severity')?'all':'';
  return {
    selector,textContent:'',innerHTML:'',hidden:false,value:defaultValue,disabled:false,title:'',dataset:{},options:[],
    classList:{add(){},remove(){},toggle(){}},
    addEventListener(){},removeEventListener(){},setAttribute(){},removeAttribute(){},
    appendChild(){},insertAdjacentHTML(){},click(){},closest(){return null;},
    reportValidity(){return true;}
  };
}
global.document={
  querySelector(selector){if(!elements.has(selector))elements.set(selector,makeElement(selector));return elements.get(selector);},
  querySelectorAll(){return [];},
  createElement(){return makeElement();}
};
global.window={addEventListener(){},dispatchEvent(){}};
global.Blob=function(){};
global.URL={createObjectURL(){return 'blob:smoke';},revokeObjectURL(){}};
global.FormData=function(){return {get(){return ''},getAll(){return []},has(){return false},entries(){return [][Symbol.iterator]()}}};

require(path.resolve(__dirname,'../js/core/admin-state.js'));
window.AdminUI={toast(){}};
require(path.resolve(__dirname,'../js/pages/reports-audit.js'));

const api=window.VoltDriveAdmin,state=api.getState();
if(userId==='USR-001'){
  if(String(elements.get('#kpi-reports')?.textContent)!==String(state.reportDefinitions.length)) throw new Error('Platform report KPI did not render all report definitions.');
}else if(userId==='USR-007'){
  const expected=state.reportDefinitions.filter(item=>api.reportInScope(item)).length;
  if(String(elements.get('#kpi-reports')?.textContent)!==String(expected)) throw new Error('Finance report KPI did not respect company scope.');
  if(expected>=state.reportDefinitions.length) throw new Error('Finance smoke did not actually exercise scoped report filtering.');
}
console.log(`OK: Reports & Audit render completed for ${userId}.`);
