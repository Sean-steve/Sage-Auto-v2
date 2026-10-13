"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const events={},storage=new Map(),messages=[],bodyAttrs={};
const root={innerHTML:"",insertAdjacentHTML(_where,markup){this.innerHTML+=markup}};
const document={
 title:"",activeElement:null,
 body:{
   setAttribute(key,val){bodyAttrs[key]=val},
   classList:{toggle(){}},
   appendChild(el){messages.push(el.innerHTML)}
 },
 addEventListener(kind,fn){events[kind]=fn},
 getElementById(id){return id==="app"?root:null},
 querySelector(){return null},
 querySelectorAll(){return []},
 createElement(){return {innerHTML:"",remove(){},setAttribute(){},className:""}}
};
const location={hash:"#company/Overview"},window={addEventListener(){},scrollTo(){}};
const sandbox={window,document,location,
 localStorage:{getItem(k){return storage.get(k)||null},setItem(k,v){storage.set(k,v)}},
 console,Math,Number,Date,JSON,Array,String,Set,parseInt,clearTimeout(){},setTimeout(){return 1},confirm(){return true}};
for(const name of ["company-detail.js","external-portals.js","gap-closure.js","premium-experience.js","app.js"]){
  const code=fs.readFileSync(name,"utf8");
  vm.runInNewContext(code,sandbox,{filename:name,timeout:3500});
}
function click(action,value,id){
 const node={getAttribute(k){return k==="data-action"?action:k==="data-value"?value:k==="data-id"?id:null}};
 events.click({target:{closest(){return node}},preventDefault(){}});
}
function here(phrase){assert.ok(root.innerHTML.includes(phrase),"Expected UI content: "+phrase)}
function absent(phrase){assert.ok(!root.innerHTML.includes(phrase),"Unexpected UI content: "+phrase)}
function screen(side,page){click("role",side);if(page)click("nav",page)}
assert.ok(window.SagePremiumV2,"premium module loaded");
here("p-command-hero");
here("Good afternoon");
here("Today&#39;s operations");
here("p-fleet-pulse");
here("A fleet worth looking at");
here('data-action="premium:queue:Pickups"');
here("Toyota Prado TX");
assert.equal(bodyAttrs["data-premium-portal"],"company");
const queueBefore=root.innerHTML;
click("premium:queue:Payments");here('aria-pressed="true">Payments</button>');
here("Grace Njeri");absent("Daniel Mwangi");
click("premium:queue:All");here("Daniel Mwangi");
click("premium:spotlight:1");here("02 / 05");
click("premium:spotlight:-1");here("01 / 05");
screen("company","Fleet");here("p-gallery");here("Every vehicle has a story.");here("Mercedes C200");
click("premium:fleetFilter:Service");here('aria-pressed="true">Service</button>');here("Toyota RAV4");absent("Toyota Prado TX");
click("premium:fleetFilter:All");
click("premium:fleetView:list");here('class="p-gallery is-list"');assert.ok(storage.has("sage-auto-v2-premium-pref"));
click("v2:asset",null,"V01");here("Vehicle asset profile");click("close");
screen("company","Bookings");here("RESERVATION INTELLIGENCE");here("Reservation register");
screen("renter","Overview");here("p-role-renter");here("Less time arranging.");here("Your current drive");
screen("owner","Overview");here("p-role-owner");here("Your vehicles. A clearer view.");
screen("driver","Overview");here("p-role-driver");here("Your next assignment starts here");
screen("corporate","Overview");here("p-role-corporate");
screen("agent","Overview");here("p-role-agent");
screen("service","Overview");here("p-role-service");
screen("platform","Overview");here("p-role-platform");here("The Sage Auto network");
screen("marketing","Home");here("p-public-cover");here("Built for the");here('id="main-content"');
click("premium:public-start");here("Everything a car hire business needs");
screen("branded","Explore vehicles");here("p-public-cover");here("Find the perfect");here("Request dates");
click("premium:checkout");here("RENTAL");
screen("marketplace","Discover");here("p-public-cover");here("Your next drive");
screen("company","Overview");here("p-command-hero");
console.log("P3-E PASS: premium dashboard + functional queue, spotlight, fleet filters/layout, preserved asset/booking flow, seven role homes, public/checkout and marketplace routes.");
