/* Sage Auto V2 · Phase P3-D.2 gap closure workbench.
 * Strictly browser-local prototype. No live accounts, payments, RBAC, email or fleet reservations.
 */
(function(){"use strict";
var G={};
var SEED={
 signup:{email:"",company:"",contact:"",region:"Nairobi",plan:"Growth",step:1,emailVerified:false,accountCreated:false},
 onboarding:{branch:false,team:false,fleet:false,pricing:false,website:false},
 tenantTasks:[{id:"PR-01",company:"Safari Trails Rentals",status:"Awaiting review",requestedPlan:"Growth",notes:"Manual tenant provisioning preview"}],
 eventHealth:[{id:"EV-101",name:"BookingCreated",service:"Operations event bus",status:"Healthy",lastSeen:"13 Oct · 16:24"},{id:"EV-102",name:"PaymentReconciled",service:"Finance worker",status:"Needs review",lastSeen:"13 Oct · 11:30"},{id:"EV-103",name:"Notifications",service:"Communication worker",status:"Not connected",lastSeen:"—"}],
 platformEvents:[{id:"INC-OPS-01",subject:"Example delayed payment reconciliation",severity:"Medium",status:"Open"}],
 platformRoles:[{id:"ADM-01",name:"Platform Administrator",scope:"SaaS accounts & billing",access:"Administrator"},{id:"ADM-02",name:"Support Specialist",scope:"Support tickets only",access:"Restricted"}],
 supportAccess:[{id:"SAR-01",tenant:"Nairobi Drive",reason:"Example support session",status:"Not granted",expiry:"Never"}],
 policyEntries:[{id:"POL-01",name:"Tenant isolation",state:"Must enforce server-side",type:"Security"},{id:"POL-02",name:"Payment idempotency",state:"Backend required",type:"Payments"},{id:"POL-03",name:"Evidence retention",state:"Governance review",type:"Compliance"}],
 platformNotices:[{id:"PN-01",type:"Billing anomaly",details:"Example reconciliation worker review",status:"Unread"}],
 availabilityPolicy:{bufferHours:3,minLeadHours:2,maxDays:45},
 offers:[{id:"OF-01",code:"WEEKEND10",type:"Percent",amount:10,status:"Draft",expires:"2026-12-31"}],
 bookingChanges:[],
 cancellationQuotes:[],
 dispatch:[{id:"ASG-01",booking:"SA-1045",driver:"James Kiptoo",status:"Proposed"}],
 quoteRequests:[],
 checkout:{step:1,vehicle:"V01",pickup:"2026-10-23",days:2,customer:"",contact:"",consent:false},
 refundReviews:[],
 invoiceReviews:[]
};
function seed(db){for(var k in SEED)if(db[k]===undefined)db[k]=JSON.parse(JSON.stringify(SEED[k]));}
function h(c,v){return c.esc(v==null?"":v)}
function money(c,v){return c.money(Number(v||0))}
function ic(c,x){return c.ic(x,17)}
function tag(c,x){return c.tag(x)}
function btn(c,txt,action,id,style){return '<button type="button" class="button '+(style||"secondary")+'" data-action="p3d2:'+action+'" '+(id?'data-id="'+h(c,id)+'"':'')+'>'+txt+'</button>'}
function small(c,txt,action,id){return '<button type="button" class="mini-action" data-action="p3d2:'+action+'" '+(id?'data-id="'+h(c,id)+'"':'')+'>'+h(c,txt)+' →</button>'}
function info(c,title,desc){return '<div class="notice">'+ic(c,"info")+'<div><strong>'+h(c,title)+'</strong><p>'+h(c,desc)+'</p></div></div>'}
function header(c,title,desc,cta,action){return c.header(title,desc,cta||"See details","p3d2:"+(action||"guide"))+c.demo()}
function section(title,desc,inner){return '<section class="card section-block"><div class="card-header"><div><h2>'+title+'</h2><p>'+desc+'</p></div></div>'+inner+'</section>'}
function tbl(head,rows){return '<div class="table-wrap"><table><thead><tr>'+head.map(x=>'<th>'+x+'</th>').join("")+'</tr></thead><tbody>'+rows.join("")+'</tbody></table></div>'}
function row(c,arr){return '<tr>'+arr.map(x=>'<td>'+x+'</td>').join("")+'</tr>'}
function data(c,title,value){return '<div class="task-row"><span class="muted">'+h(c,title)+'</span><strong style="margin-left:auto;text-align:right">'+h(c,value)+'</strong></div>'}
function formField(c,label,name,type,value,required){return '<div class="field"><label for="d2-'+h(c,name)+'">'+h(c,label)+'</label><input id="d2-'+h(c,name)+'" name="'+h(c,name)+'" type="'+(type||"text")+'" value="'+h(c,value||"")+'" '+(required?'required':"")+'></div>'}
function select(c,label,name,opts,value){return '<div class="field"><label for="d2-'+h(c,name)+'">'+h(c,label)+'</label><select id="d2-'+h(c,name)+'" name="'+h(c,name)+'">'+opts.map(function(o){var v=Array.isArray(o)?o[0]:o,cap=Array.isArray(o)?o[1]:o;return '<option value="'+h(c,v)+'" '+(v===value?"selected":"")+'>'+h(c,cap)+'</option>'}).join("")+'</select></div>'}
function textArea(c,label,name,ph){return '<div class="field full"><label for="d2-'+h(c,name)+'">'+h(c,label)+'</label><textarea rows="3" name="'+h(c,name)+'" id="d2-'+h(c,name)+'" placeholder="'+h(c,ph)+'"></textarea></div>'}
function stat(c,things){return '<div class="grid kpis">'+things.map(x=>c.stat(x[0],x[1],x[2],x[3])).join("")+'</div>'}
function stepper(c,current,names){return '<div class="d2-stepper">'+names.map(function(name,i){return '<div class="d2-step '+(i+1===current?"current":i+1<current?"done":"")+'"><span>'+String(i+1).padStart(2,"0")+'</span><b>'+h(c,name)+'</b></div>'}).join("")+'</div>'}
function card(c,label,description,icon,action){return '<button class="surface-card" data-action="p3d2:'+action+'"><span class="surface-icon">'+ic(c,icon)+'</span><strong>'+h(c,label)+'</strong><span>'+h(c,description)+'</span><footer>Open experience →</footer></button>'}
function menu(c,items){return '<div class="surface-grid">'+items.map(x=>card(c,...x)).join("")+'</div>'}
function save(c,msg){c.save();c.state.modal=null;c.render();c.showToast(msg)}
function advance(c,page){c.navigate(c.state.portal,page)}
function vehicle(c,id){return c.db.vehicles.find(x=>x.id===id)}
function demoDate(date){return /^\d{4}-\d{2}-\d{2}$/.test(date)&&Number.isFinite(Date.parse(date+"T12:00:00"))}
function businessName(c,id){var b=c.db.bookings.find(x=>x.id===id);return b?b.customer:"Renter"}
function outstanding(c,book){var entries=c.db.ledger.filter(x=>x.booking===book.id).reduce((s,x)=>s+Number(x.amount||0),0);return Math.max(0,book.total-entries)}
function quote(c,id,days){var v=vehicle(c,id);return v?v.rate*days:0}
function companyPage(c){seed(c.db);var p=c.state.page;
if(p==="Booking changes")return bookingChanges(c);
if(p==="Dispatch & assignments")return dispatch(c);
if(p==="Availability policy")return availabilityPolicy(c);
if(p==="Offers & promotions")return offers(c);
if(p==="Refund approvals")return refunds(c);
if(p==="Invoice detail")return invoices(c);
if(p==="Company launch checklist")return companyLaunch(c);
return null}
function platformPage(c){seed(c.db);var p=c.state.page, map={
"Tenant provisioning":provision,"Entitlement review":entitlements,"Integration health":health,"Jobs & events":jobs,
"Platform incidents":platformIncident,"Platform roles":platformRoles,"Support access":supportAccess,
"Compliance policies":policies,"Platform notifications":platformNotifications};
return map[p]?map[p](c):null}
function publicPage(c){seed(c.db);if(c.state.portal==="marketing"&&["Tour & setup","Verify email","Business setup","Choose plan","First-run setup","Sign in & recovery"].includes(c.state.page))return marketing(c);
if(c.state.portal==="branded"&&c.state.page==="Checkout & review")return checkout(c);
return null}
/* __CONTINUE__ */
})();