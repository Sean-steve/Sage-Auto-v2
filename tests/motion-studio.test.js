"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const events={},mem=new Map(),bodyAttrs={},root={innerHTML:"",insertAdjacentHTML(_k,html){this.innerHTML+=html}};
const document={title:"",activeElement:null,
 body:{setAttribute(k,v){bodyAttrs[k]=v},classList:{add(){},toggle(){}},appendChild(){}},
 getElementById(k){return k==="app"?root:null},
 addEventListener(k,fn){(events[k]||(events[k]=[])).push(fn)},
 querySelector(){return null},querySelectorAll(){return []},
 createElement(){return {setAttribute(){},remove(){},innerHTML:"",className:""}}
};
const window={addEventListener(){},scrollTo(){}},location={hash:"#company/Overview"};
const sandbox={window,document,location,localStorage:{getItem(k){return mem.get(k)||null},setItem(k,v){mem.set(k,v)}},JSON,Date,Math,Number,Array,String,Set,parseInt,console,clearTimeout(){},setTimeout(){return 1},confirm(){return true}};
for(const f of ["company-detail.js","external-portals.js","gap-closure.js","reference-experience.js","motion-studio.js","premium-experience.js","app.js"])vm.runInNewContext(fs.readFileSync(f,"utf8"),sandbox,{filename:f});
function click(action,value,id){const el={getAttribute(k){return k==="data-action"?action:k==="data-value"?value:k==="data-id"?id:null}};for(const fn of events.click||[])fn({target:{closest(){return el}},preventDefault(){}})}
function change(id,value){for(const fn of events.change||[])fn({target:{id,value},preventDefault(){}})}
function has(v){assert.ok(root.innerHTML.includes(v),"Missing rendered phrase: "+v)}
const db=()=>JSON.parse(mem.get("sage-auto-v2-phase3-1")||"{}");
has("sx-cockpit");has("Make every");has("journey count.");has("THE DEPARTURE BOARD");has("THE COMMERCIAL PICTURE");has("p-surface")===false;
has("Grace Njeri");has("SA-1044");
click("studio:lane:Confirmed");has('sx-filter-tab active');assert.ok(!root.innerHTML.includes('class="sx-journey-person"><span class="sx-order">01</span><div><strong>Grace Njeri'));
click("studio:lane:All");has("Grace Njeri");
click("studio:range:30 days");has("30 days lens");assert.ok(mem.has("sage-auto-studio-prefs-v1"));
change("studio-branch","Karen");has("Mercedes C200");assert.ok(!root.innerHTML.includes('sx-fleet-pill" data-action="vehicle" data-id="V01"'));
change("studio-branch","All");has("Toyota Prado TX");
click("studio:theme");assert.equal(bodyAttrs["data-studio-theme"],"night");click("studio:theme");assert.equal(bodyAttrs["data-studio-theme"],"light");
click("new-booking");has("p-booking-preview");click("close");
click("role","renter");has("sx-role-apricot");has("Your next chapter");
click("role","owner");has("sx-role-lavender");has("Better perspective");
click("role","driver");has("sx-role-sky");has("Next stop");
click("role","corporate");has("sx-role-steel");
click("role","agent");has("sx-role-lime");
click("role","service");has("sx-role-coral");
click("role","platform");has("sx-role-purple");
click("role","marketing");has("sx-public-stage");has("Less admin.");
click("role","branded");has("sx-public-stage");has("Your next drive");
click("role","company");has("sx-cockpit");
click("nav","Availability");has("rx-allocation-grid");click("nav","Bookings");has("rx-lanes");click("nav","Finance & payments");has("rx-finance-overview");
console.log("Motion Studio PASS — task dashboard, stateful lanes/ranges/branches, Night Shift, role homes, public sites and retained operational views.");
