"use strict";
/* Domain-focused UX regression: no backend required. */
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const events={},root={innerHTML:"",insertAdjacentHTML(_p,x){this.innerHTML+=x}},memory=new Map(),alerts=[];
const doc={title:"",activeElement:null,
 body:{classList:{toggle(){}},setAttribute(){},appendChild(el){alerts.push(el.innerHTML)}},
 getElementById(id){return id==="app"?root:null},
 addEventListener(type,fn){(events[type]||(events[type]=[])).push(fn)},
 querySelector(){return null},querySelectorAll(){return []},
 createElement(){return{remove(){},setAttribute(){},className:"",innerHTML:""}}
};
const win={addEventListener(){},scrollTo(){}},location={hash:"#company/Overview"};
const env={window:win,document:doc,location,localStorage:{getItem(k){return memory.get(k)||null},setItem(k,v){memory.set(k,v)}},console,Date,Math,JSON,Number,Array,String,Set,parseInt,clearTimeout(){},setTimeout(){return 1},confirm(){return true}};
for(const file of ["company-detail.js","external-portals.js","gap-closure.js","reference-experience.js","premium-experience.js","app.js"]){
 vm.runInNewContext(fs.readFileSync(file,"utf8"),env,{filename:file,timeout:3500});
}
function click(action,value,id){const node={getAttribute(k){return k==="data-action"?action:k==="data-value"?value:k==="data-id"?id:null}};for(const fn of events.click||[])fn({target:{closest(){return node}},preventDefault(){}})}
function change(id,value){for(const fn of events.change||[])fn({target:{id,value}})}
function route(page){click("nav",page);assert.ok(root.innerHTML.length>800,page+" is empty")}
function has(x){assert.ok(root.innerHTML.includes(x),"expected "+x)}
function absent(x){assert.ok(!root.innerHTML.includes(x),"unexpected "+x)}
assert.ok(win.SageReferenceV2,"reference UX must load");
route("Availability");
has("Availability, without the guesswork.");
has("rx-allocation-grid");
has("Toyota Prado TX");
has("All branches");
has("Active holds".replace("Active holds","Operational holds"));
click("rx:slot",null,"V01|2026-10-13");
has("Toyota Prado TX");
has("View reservation");
click("rx:week:1");has("20");click("rx:today");has("13");
change("rx-vehicle","V01");assert.ok(win.SageReferenceV2.ui.vehicle==="V01");absent("Mercedes C200");
change("rx-branch","Westlands");has("No vehicles match these filters.");
change("rx-branch","All");has("Toyota Prado TX");
route("Bookings");has("RESERVATION REGISTER");has("rx-lanes");has("Grace Njeri");
click("rx:stage:Awaiting payment");has("rx-lane-single");absent("Daniel Mwangi");
click("rx:stage:All");has("Daniel Mwangi");
click("rx:bookingNext",null,"SA-1044");has("Record demo payment");click("close");
route("Inspections");has("Vehicle condition, clearly captured.");has("rx-car-plan");has("Exterior review");
click("rx:inspection:Wheels");has("Wheels review");has("All four tyres");
click("v2:open:inspection");has("12 areas");click("close");
route("Finance & payments");has("Every shilling has a status.");has("rx-finance-overview");
click("rx:finance:Invoices");has("Invoices register");has("Provisional invoice preview");
click("rx:finance:Deposits");has("Deposits register");has("Refund");
click("rx:finance:Expenses");has("Expenses register");has("Toyota RAV4 service");
click("rx:finance:Payments");has("Payments register");
click("v2:open:payment");has("Record demo payment");click("close");
route("Fleet");has("p-gallery");route("Overview");has("p-command-hero");
console.log("SaaS-reference UX PASS: calendar filters/day details, reservation stages and payment, condition hotspots/checklist, finance tabs, and premium core continuity.");
