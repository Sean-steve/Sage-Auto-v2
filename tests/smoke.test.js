
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const script = fs.readFileSync("app.js", "utf8");
const events = {};
const root = {innerHTML:"",insertAdjacentHTML(position,html){this.innerHTML += html}};
const stored = new Map();
const inputs = {
  name:{value:"Ruth Kamau"},
  vehicle:{value:"V03"},
  days:{value:"2"},
  channel:{value:"Direct"}
};
const document = {
  title:"",
  body:{appendChild(){}},
  addEventListener(name,callback){events[name]=callback},
  getElementById(id){return id==="app"?root:null},
  querySelector(selector){if(selector!==".drawer")return null;return {querySelector(q){const m=q.match(/name="([^"]+)"/);return m?inputs[m[1]]:null}}},
  querySelectorAll(){return []},
  createElement(){return {innerHTML:"",className:"",remove(){}}}
};
const location={hash:"#company/Overview"};
const context={document,location,window:{scrollTo(){},addEventListener(){}},localStorage:{getItem(k){return stored.get(k)||null},setItem(k,v){stored.set(k,v)}},console,Math,Number,JSON,Array,String,RegExp,parseInt,clearTimeout(){},setTimeout(){return 1},confirm(){return true}};
vm.runInNewContext(script,context,{filename:"app.js",timeout:2500});
function click(action,value,id){
  const element={getAttribute(key){return key==="data-action"?action:key==="data-value"?value:key==="data-id"?id:null}};
  events.click({target:{closest(){return element}},preventDefault(){}});
}
function has(s){assert.ok(root.innerHTML.includes(s),"Expected UI output to include: "+s)}
has("Good afternoon");
has("Today&#39;s operations");
click("nav","Bookings");
has("Reservation register");
click("booking-action",null,"SA-1044");
has("BOOKING DETAIL");
click("advance",null,"SA-1044");
has("Confirmed");
click("booking-action",null,"SA-1044");
click("advance",null,"SA-1044");
has("Active");
click("booking-action",null,"SA-1044");
click("advance",null,"SA-1044");
has("Completed");
click("new-booking");
has("Create a booking");
click("booking-next");
click("booking-next");
click("booking-save");
has("Ruth Kamau");
has("Awaiting payment");
assert.ok(stored.has("sage-auto-v2-phase3-1"),"Demo state persists in localStorage");
click("switcher");
has("Platform control center");
click("role","owner");
has("Your assets are working for you");
click("switcher");
click("role","driver");
has("Ready for your next assignment");
click("switcher");
click("role","platform");
has("Platform at a glance");
click("switcher");
click("role","branded");
has("Find the perfect");
click("switcher");
click("role","marketplace");
has("Your next drive");
console.log("Sage Auto frontend smoke tests passed: navigation, booking payment/handover/return, sample persistence, new booking and portal switching.");
