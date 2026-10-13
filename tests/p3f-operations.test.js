"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const events={},storage=new Map(),toasts=[],bodyAttrs={},root={innerHTML:"",insertAdjacentHTML(_k,x){this.innerHTML+=x}};
const formValues={},doc={title:"",activeElement:null,body:{setAttribute(k,v){bodyAttrs[k]=v},classList:{add(){},toggle(){}},appendChild(e){toasts.push(e.innerHTML)}},
getElementById(k){return k==="app"?root:null},createElement(){return {remove(){},setAttribute(){},innerHTML:"",className:""}},
addEventListener(k,fn){(events[k]||(events[k]=[])).push(fn)},querySelector(){return null},querySelectorAll(){return []}};
const win={addEventListener(){},scrollTo(){}},location={hash:"#company/Overview"};
const ctx={window:win,document:doc,location,localStorage:{getItem(k){return storage.get(k)||null},setItem(k,v){storage.set(k,v)}},Date,Math,Number,JSON,Array,Set,String,parseInt,console,clearTimeout(){},setTimeout(){return 1},confirm(){return true}};
for(const file of ["company-detail.js","external-portals.js","gap-closure.js","reference-experience.js","motion-studio.js","ops-hardening.js","premium-experience.js","app.js"])vm.runInNewContext(fs.readFileSync(file,"utf8"),ctx,{filename:file,timeout:4000});
function click(name,value,id){const el={getAttribute(k){return k==="data-action"?name:k==="data-value"?value:k==="data-id"?id:null}};for(const fn of events.click||[])fn({target:{closest(){return el}},preventDefault(){}})}
function change(id,value,selected){const target={id,value,checked:selected,matches(q){return q==="[data-ops-select-all]"&&id==="ops-all"},getAttribute(k){return k==="data-ops-select"&&id==="ops-item"?value:null}};for(const fn of events.change||[])fn({target})}
function key(key,altKey){let prevented=false;for(const fn of events.keydown||[])fn({key,altKey:!!altKey,ctrlKey:false,metaKey:false,shiftKey:false,target:{tagName:"BODY"},preventDefault(){prevented=true}});return prevented}
function has(s){assert.ok(root.innerHTML.includes(s),"Expected "+s)}
function missing(s){assert.ok(!root.innerHTML.includes(s),"Unexpected "+s)}
function reset(){click("role","company")}
function data(){return JSON.parse(storage.get("sage-auto-v2-phase3-1")||"{}")}
assert.ok(win.SageOpsV2);
has("op-workspace");has("Departure Board");has("Payments to review");missing("sx-cockpit");
has('data-action="ops:group:WORKSPACE"');has('data-action="ops:group:BUSINESS"');has("op-nav-badge");
const src=data(),original=JSON.stringify(src.bookings);
const prefs=win.SageOpsV2.prefs;
assert.equal(prefs.mode,"work");
click("ops:metric:payments");has("rx-bookings");has("Awaiting payment");assert.equal(win.SageReferenceV2.ui.bookingStage,"Awaiting payment");
reset();
click("ops:metric:handover");assert.equal(win.SageReferenceV2.ui.bookingStage,"Confirmed");
reset();
click("ops:lane:Confirmed");has('data-action="ops:lane:Confirmed"');missing("Grace Njeri");
click("ops:lane:All");has("Grace Njeri");
change("ops-item","SA-1044",true);has('1 selected');has('data-action="ops:flag"');
click("ops:flag");has('op-flag');assert.ok(win.SageOpsV2.prefs.marked.includes("SA-1044"));
assert.equal(JSON.stringify(data().bookings),original,"Flagging cannot change bookings");
change("ops-item","SA-1044",true);click("ops:review");has("Grace Njeri");click("close");
click("ops:mode");has("op-welcome");has("Make every");click("ops:mode");missing("op-welcome");
click("ops:density");assert.equal(prefs.density,"comfortable");click("ops:density");assert.equal(prefs.density,"compact");
change("ops-focus","Finance");assert.equal(prefs.focus,"Finance");assert.equal(prefs.lane,"Awaiting payment");
change("ops-focus","Operations");change("ops-branch","Karen");has("Mercedes C200");missing("Toyota Prado TX");
change("ops-branch","All");has("Toyota Prado TX");
click("ops:group:BUSINESS");assert.equal(prefs.groups.BUSINESS,true);has('data-value="Finance &amp; payments"')===false;
click("ops:sidebar");assert.equal(prefs.sidebarMini,true);click("ops:sidebar");assert.equal(prefs.sidebarMini,false);
click("ops:help");has("Keyboard shortcuts");click("ops:help");
assert.ok(key("2",true));has("rx-bookings");
assert.ok(key("1",true));has("op-workspace");
assert.ok(key("/",false));has("Quick navigation");click("close");
click("role","renter");has("sx-role-apricot");click("role","company");has("op-workspace");
assert.equal(JSON.stringify(data().bookings),original,"Navigational updates cannot alter domain state");
assert.ok(storage.has("sage-auto-v2-p3f"),"workspace preferences persisted");
console.log("P3-F PASS: urgency, branch context, focused queue, personal flags, nav groups, compact mode, first-visit welcome, shortcuts, preference persistence and canonical state invariance.");
