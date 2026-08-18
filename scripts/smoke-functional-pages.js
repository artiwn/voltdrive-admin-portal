const path=require('path');
const cp=require('child_process');
if(process.argv.length===2){
  for(const page of ['payments','accounting'])for(const user of ['USR-001','USR-007'])cp.execFileSync(process.execPath,[__filename,page,user],{stdio:'inherit'});
  console.log('OK: Payments and Accounting page-level render smoke passed for Platform Admin and Finance.');
  process.exit(0);
}
const page=process.argv[2],userId=process.argv[3];
const store=new Map([['voltdrive_admin_v1',JSON.stringify({currentSession:{userId}})]]);
global.localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k),clear:()=>store.clear()};
const elements=new Map();
function makeElement(selector=''){
  const isSelect=/status|country|risk/.test(selector);
  return {selector,textContent:'',innerHTML:'',hidden:false,value:isSelect?'all':'',disabled:false,title:'',dataset:{},options:[],
    classList:{add(){},remove(){},toggle(){}},addEventListener(){},removeEventListener(){},setAttribute(){},removeAttribute(){},appendChild(){},insertAdjacentHTML(){},click(){},closest(){return null;},reportValidity(){return true;},
    set oninput(v){this._oninput=v},set onchange(v){this._onchange=v},set onclick(v){this._onclick=v},get onclick(){return this._onclick}
  };
}
global.document={querySelector(sel){if(!elements.has(sel))elements.set(sel,makeElement(sel));return elements.get(sel)},querySelectorAll(){return []},createElement(){return makeElement()}};
global.window={addEventListener(){},dispatchEvent(){}};
global.Blob=function(){};global.URL={createObjectURL(){return 'blob:smoke'},revokeObjectURL(){}};
global.FormData=function(){return {get(){return ''},getAll(){return []},has(){return false},entries(){return [][Symbol.iterator]()},[Symbol.iterator](){return [][Symbol.iterator]()}}};
require(path.resolve(__dirname,'../js/core/admin-state.js'));
window.AdminUI={toast(){}};
require(path.resolve(__dirname,`../js/pages/${page}.js`));
const api=window.VoltDriveAdmin,state=api.getState();
const assert=(c,m)=>{if(!c)throw new Error(m)};
if(page==='accounting'){
  const expected=state.accountingEntries.filter(x=>api.companyInScope(x.companyId)).length;
  assert(String(elements.get('#acc-kpi-entries')?.textContent)===String(expected),`Accounting KPI scope mismatch for ${userId}.`);
  if(userId==='USR-007')assert(expected<state.accountingEntries.length,'Finance Accounting smoke must exercise company scope.');
}
if(page==='payments'){
  const expected=state.paymentTransactions.filter(x=>api.companyInScope(x.companyId)).length;
  assert(String(elements.get('#transaction-count')?.textContent).startsWith(String(expected)),`Payment transaction scope mismatch for ${userId}.`);
  if(userId==='USR-007')assert(expected<state.paymentTransactions.length,'Finance Payments smoke must exercise company scope.');
}
console.log(`OK: ${page} render completed for ${userId}.`);
