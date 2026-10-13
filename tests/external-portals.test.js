"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const events={},store=new Map(),messages=[],root={innerHTML:"",insertAdjacentHTML(_,html){this.innerHTML+=html}};
let fields={};
const fieldForm={querySelector(q){const m=q.match(/\[name="([^"]+)"\]/);if(!m||fields[m[1]]===undefined)return null;return {value:String(fields[m[1]])}}};
const document={title:"",body:{appendChild(el){messages.push(el.innerHTML)}},getElementById(id){return id==="app"?root:id==="p3c-form"?fieldForm:null},querySelector(){return fieldForm},querySelectorAll(){return []},createElement(){return {innerHTML:"",remove(){}}},addEventListener(k,fn){events[k]=fn}};
const location={hash:"#company/Overview"},window={addEventListener(){},scrollTo(){}};
const sandbox={window,document,location,localStorage:{getItem(k){return store.get(k)||null},setItem(k,v){store.set(k,v)}},Math,Number,Date,Array,String,Set,JSON,console,parseInt,clearTimeout(){},setTimeout(){return 1},confirm(){return true}};
vm.runInNewContext(fs.readFileSync("company-detail.js","utf8"),sandbox);
vm.runInNewContext(fs.readFileSync("external-portals.js","utf8"),sandbox);
vm.runInNewContext(fs.readFileSync("app.js","utf8"),sandbox);
function click(action,value,id){const el={getAttribute(k){return k==="data-action"?action:k==="data-value"?value:k==="data-id"?id:null}};events.click({target:{closest(){return el}},preventDefault(){}})}
function role(r,page){click("role",r);if(page)click("nav",page)}
function submit(kind,values,id){fields={...values};click("p3c:submit:"+kind+(id?":"+id:""))}
function state(){return JSON.parse(store.get("sage-auto-v2-phase3-1")||"{}")}
function contains(q){assert.ok(root.innerHTML.includes(q),"Expected text "+q)}
function noBookingChange(id,status){assert.equal(state().bookings.find(b=>b.id===id).status,status)}
const map={platform:["Overview","Companies","Subscriptions","Approvals","Revenue","Usage insights","Support","Security & audit","Configuration"],renter:["Overview","My bookings","My rentals","Explore vehicles","Documents","Payments","Messages","Profile"],owner:["Overview","My vehicles","Rental activity","Earnings","Statements","Agreements","Service updates","Profile"],driver:["Overview","Assignments","Trip details","Vehicle handover","Availability","Documents","Earnings","Messages"],corporate:["Overview","Travel requests","Reservations","Employees","Approvals","Invoices","Reports","Account settings"],agent:["Overview","New referral","Leads","Reservations","Commissions","Payouts","Partners","Profile"],service:["Overview","Assigned jobs","Inspections","Work orders","Job evidence","Invoices","Messages"],marketing:["Home","Why Sage Auto","Features","Pricing","Get started"],branded:["Explore vehicles","Find my booking","Our services","Contact us"],marketplace:["Discover","Browse cars","Saved vehicles","Trips","Help"]};
let count=0;for(const [r,pages] of Object.entries(map))for(const page of pages){role(r,page);assert.ok(root.innerHTML.length>750,r+"/"+page+" did not render");count++}
assert.equal(count,70);
role("renter","My bookings");contains("SA-1042");assert.ok(!root.innerHTML.includes("Grace Njeri"),"renter must not see another customer");
click("p3c:extend",undefined,"SA-1042");contains("Request a rental extension");submit("extend",{days:"2",notes:"Meeting changed"},"SA-1042");assert.equal(state().requests[0].status,"Pending review");noBookingChange("SA-1042","Active");
role("owner","My vehicles");contains("Toyota Prado TX");assert.ok(!root.innerHTML.includes("Mercedes C200"),"owner must see only assigned car");
role("driver","Assignments");click("p3c:driver-job",undefined,"DA-01");contains("Assigned trip DA-01");click("p3c:job-accept",undefined,"DA-01");assert.equal(state().driverJobs[0].status,"Accepted");noBookingChange("SA-1043","Confirmed");
role("corporate","Travel requests");click("p3c:travel-new");submit("travel-new",{employee:"Sarah Kamau",trip:"Field visit",start:"2026-10-21",category:"SUV",cost:"17000"});let travel=state().travel[0];assert.equal(travel.status,"Awaiting approval");click("p3c:travel",undefined,travel.id);click("p3c:travel-approve",undefined,travel.id);assert.equal(state().travel[0].status,"Approved");assert.ok(state().leads.some(x=>x.id===state().travel[0].operatorLead));assert.ok(!state().bookings.some(b=>b.customer==="Sarah Kamau"),"approval cannot automatically create booking");
role("agent","New referral");click("p3c:referral-new");submit("referral-new",{customer:"Brighter Ltd",request:"SUV weekend",operator:"Nairobi Drive",commission:"1200"});assert.equal(state().referrals[0].customer,"Brighter Ltd");assert.ok(state().leads.some(x=>x.id===state().referrals[0].lead));
role("service","Work orders");click("p3c:service-job",undefined,"WO-014");click("p3c:service-accept",undefined,"WO-014");assert.equal(state().serviceUpdates[0].stage,"Accepted");click("p3c:service-evidence",undefined,"WO-014");submit("service-evidence",{reference:"brake-photo.jpg",notes:"Work completed"},"WO-014");assert.ok(state().serviceUpdates[0].evidence.includes("brake-photo.jpg"));assert.equal(state().works.find(w=>w.id==="WO-014").status,"In progress","supplier cannot close operator work order");
role("platform","Approvals");click("p3c:tenant",undefined,"T-102");click("p3c:tenant-approve",undefined,"T-102");assert.equal(state().tenants.find(t=>t.id==="T-102").status,"Active");
role("branded","Explore vehicles");click("p3c:request-car",undefined,"V03");contains("Request a vehicle");submit("request-car",{name:"Visitor One",contact:"visitor@example.test",vehicle:"V03",pickup:"2026-10-25",days:"2",message:"Airport pickup"});assert.equal(state().publicEnquiries[0].status,"New enquiry");assert.ok(state().leads.some(x=>x.name.includes("Visitor One")));assert.ok(!state().bookings.some(x=>x.customer==="Visitor One"));
role("marketing","Get started");click("p3c:sign-up");submit("sign-up",{name:"Roadstar Mobility",contact:"hello@example.test",message:"Need a company account"});assert.equal(state().publicEnquiries[0].source,"sign-up");assert.ok(!state().tenants.some(x=>x.name==="Roadstar Mobility"),"signup enquiry must not provision real tenant");
role("marketplace","Saved vehicles");contains("Toyota Prado TX");
role("company","Leads & enquiries");contains("Visitor One");contains("Brighter Ltd");
console.log("P3-C PASS: 70 routes; renter privacy; extension; owner scoping; driver assignment; corporate approval; agent attribution; partner evidence; tenant review; public enquiry and cross-portal lead pipeline.");
