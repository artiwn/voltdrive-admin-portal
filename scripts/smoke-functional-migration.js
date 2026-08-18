const path=require('path');
const legacy={
  currentSession:{userId:'USR-007'},
  roles:[
    {id:'ROLE-FINANCE',name:'Finance',description:'Legacy finance role',type:'system',privileged:true,scopeModel:'Company',permissions:['admin.portal.view','payments.view','payments.refund','tariffs.view','taxes.view','taxes.manage','settlements.view','settlements.manage','integrations.view','audit.view','reports.manage'],users:12}
  ],
  permissionCatalog:[{group:'Commercial',items:[{id:'payments.view',label:'View payments'}]}]
};
const store=new Map([['voltdrive_admin_v1',JSON.stringify(legacy)]]);
global.localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k),clear:()=>store.clear()};
global.window={};
require(path.resolve(__dirname,'../js/core/admin-state.js'));
const api=window.VoltDriveAdmin,state=api.getState();
const finance=state.roles.find(r=>r.id==='ROLE-FINANCE');
if(!finance?.permissions.includes('accounting.view')||!finance.permissions.includes('accounting.manage'))throw new Error('Legacy Finance role did not receive new Accounting permissions.');
const commercial=state.permissionCatalog.find(g=>g.group==='Commercial');
if(!commercial?.items.some(x=>x.id==='accounting.view')||!commercial.items.some(x=>x.id==='accounting.manage'))throw new Error('Legacy permission catalog did not receive Accounting permissions.');
if(!Array.isArray(state.accountingEntries)||!Array.isArray(state.paymentTransactions)||!Array.isArray(state.subscriptionPlans))throw new Error('New functional state arrays were not seeded for legacy localStorage.');
console.log('OK: functional-gap legacy localStorage migration passed.');
