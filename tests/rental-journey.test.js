"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const scripts=["rental-core.js","rental-journey.js"].map(p=>fs.readFileSync(p,"utf8"));
const handlers={};
const document={addEventListener(type,cb){(handlers[type]||(handlers[type]=[])).push(cb)},getElementById(){return null}};
const window={};
const state={portal:"company",page:"Availability",modal:null};
let saves=0,renders=0,lastNav=null,lastToast="";
const db={
 vehicles:[
  {id:"V01",name:"Toyota Harrier",plate:"KDA 101A",status:"Available",compliant:true,location:"Nairobi",rate:11000},
  {id:"V02",name:"Nissan XTrail",plate:"KDA 102A",status:"Available",compliant:true,location:"Nakuru",rate:9000}
 ],
 bookings:[
  {id:"SA-1",vehicle:"V01",customer:"Amina Wanjiku",date:"16 Oct",days:3,total:33000,status:"Confirmed"},
  {id:"SA-2",vehicle:"V02",customer:"Amina Wanjiku",date:"05 Oct",days:2,total:18000,status:"Completed",returnCharge:2000},
  {id:"SA-3",vehicle:"V02",customer:"Other Driver",date:"11 Oct",days:1,total:9000,status:"Active"}
 ],
 holds:[],ledger:[{id:"TX-1",booking:"SA-1",ref:"DEMO1",amount:13000,status:"Recorded (demo)"}],
 deposits:[{id:"DP-1",booking:"SA-2",amount:7000,status:"Refund review"}],
 owners:[{id:"O1",name:"Mary Wambui",vehicle:"V01",share:60}],
 payouts:[{id:"PY-1",owner:"Mary Wambui",vehicle:"V01",status:"Pending",amount:19800}],
 bookingChanges:[{id:"CH-1",booking:"SA-1",changeType:"Extend rental",date:"2026-10-16",days:5,status:"Pending review"}],
 renterProfile:{name:"Amina Wanjiku"}
};
const ctx={
 db,state,render(){renders++},navigate(p,page){lastNav=[p,page];state.portal=p;state.page=page},
 save(){saves++},showToast(m){lastToast=m},
 money:n=>"KES "+Number(n).toLocaleString("en-KE"),esc:x=>String(x),tag:x=>String(x)
};
const context={window,document,Date,Math,Number,String,Array,Set,confirm:()=>true};
for(const s of scripts)vm.runInNewContext(s,context,{timeout:3000});
const api=window.SageRentalJourneyV2,core=window.SageRentalCoreV2;
assert.ok(api&&core);
function renderPage(page){
 state.portal="company";state.page=page;
 const result=api.decorateCompany(ctx,'<div id="existing-module">Legacy '+page+' form and actions</div>');
 assert.ok(result.includes('id="existing-module"'),"Existing page not removed: "+page);
 assert.ok(result.includes("Complete existing "+page.replace(/&/g,"&amp;")+" tools"),"Existing controls remain findable");
 assert.ok(result.includes('data-action="journey:goto:Finance &amp; payments"')||result.includes('data-action="journey:goto:Finance & payments"'));
 return result;
}
assert.match(renderPage("Availability"),/Vehicle eligibility/);
assert.match(renderPage("Availability"),/No demo conflict|reserved during those dates/);
assert.match(renderPage("Bookings"),/payment|recorded/i);
assert.match(renderPage("Booking changes"),/Original vs proposed terms/);
assert.match(renderPage("Contracts & handover"),/12 inspection/);
assert.match(renderPage("Rentals"),/Vehicle possession ledger/);
assert.match(renderPage("Returns & charges"),/Return ≠ financial closure/);
assert.match(renderPage("Finance & payments"),/Payment allocation and invoice review/);
assert.match(renderPage("Owner settlements"),/Owner share and payout lifecycle/);
assert.match(renderPage("Deposits & refunds"),/Payment allocation and invoice review/);
state.portal="company";state.page="Fleet";
assert.equal(api.decorateCompany(ctx,"original"),"original","Unrelated screen remains unmodified");
const node=id=>({getAttribute(k){return k==="data-id"?id:null}});
assert.equal(api.action("journey:goto:Availability",node(null),ctx),true);
assert.deepEqual(lastNav,["company","Availability"]);
assert.equal(api.action("journey:existingHandover",node("SA-1"),ctx),true);
assert.equal(state.modal,"v2:handover:SA-1");
assert.equal(api.action("journey:existingReturn",node("SA-3"),ctx),true);
assert.equal(state.modal,"v2:return:SA-3");
assert.equal(api.action("journey:existingPayment",node("SA-1"),ctx),true);
assert.equal(state.modal,"v2:payment:SA-1");
assert.equal(api.action("journey:compare",node("SA-1"),ctx),true);
assert.match(api.drawer(ctx),/Contract unchanged/);
assert.equal(api.action("journey:returnReview",node("SA-2"),ctx),true);
assert.match(api.drawer(ctx),/No money is actually held or refunded/);
assert.equal(api.action("journey:reviewInvoice:Reviewed",node("SA-2"),ctx),true);
assert.match(lastToast,/Review the return charges/);
assert.equal(api.action("journey:reviewReturn:Reviewed",node("SA-2"),ctx),true);
assert.equal(api.action("journey:reviewInvoice:Reviewed",node("SA-2"),ctx),true);
assert.ok(db.rentalJourney.invoices["SA-2"]);
assert.equal(db.bookings[1].status,"Completed");
assert.equal(api.action("journey:settlement",node("PY-1"),ctx),true);
assert.match(api.drawer(ctx),/Owner settlement waterfall/);
assert.equal(api.action("journey:payout:Approved (demo)",node("PY-1"),ctx),true);
assert.equal(db.payouts[0].status,"Pending");
assert.equal(api.action("journey:payout:Sent for simulation",node("PY-1"),ctx),true);
assert.equal(api.action("journey:payout:Transfer confirmed (demo)",node("PY-1"),ctx),true);
assert.equal(db.payouts[0].status,"Pending");
assert.ok(saves>2&&renders>2);
state.portal="renter";state.page="Overview";
let result=api.decorateExternal(ctx,"<div>Renter home</div>");
assert.match(result,/in your possession/);
assert.match(result,/Renter home/);
state.portal="owner";result=api.decorateExternal(ctx,"<div>Owner home</div>");
assert.match(result,/No actual funds transferred/);
state.portal="branded";state.page="Checkout & review";
result=api.decorateCheckout(ctx,"<main><div>Legacy checkout form</div></main>");
assert.match(result,/no live reservation held|Sample conflict/i);
assert.match(result,/Legacy checkout form/);
assert.match(result,/does not reserve a car or process/i);
assert.equal(api.checkoutGuard(ctx,{vehicle:"V01",pickup:"2026-10-16",days:2}).ok,false);
console.log("CH-003..010 UI wiring PASS: all 10 workspaces, legacy content, original dialogs, evidence states, renter and owner views, branded checkout.");
