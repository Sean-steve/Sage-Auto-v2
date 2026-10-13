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

/* Company gap closures */
function bookingChanges(c){var bookings=c.db.bookings.filter(b=>["Awaiting payment","Confirmed","Active"].includes(b.status)),history=c.db.bookingChanges;return header(c,"Booking changes & cancellations","Manage amendments with explicit outcomes, not a silent edit.","New change request","open:amend")+
stat(c,[["Open bookings",String(bookings.length),"Eligible for change review","calendar"],["Requests",String(history.length),"Change audit","file"],["Approved in principle",String(history.filter(x=>x.status==="Approved in principle").length),"Not applied to rental","clock"],["Cancelled demo",String(c.db.bookings.filter(x=>x.status==="Cancelled").length),"No refunds executed","shield"]])+
section("Reservations and amendments","Booking state controls the available next action",tbl(["Reservation","Renter","Vehicle","State","Change control"],bookings.map(b=>row(c,[h(c,b.id),h(c,b.customer),h(c,vehicle(c,b.vehicle)?.name),tag(c,b.status),small(c,"Request change","open:amend",b.id)]))))+
section("Amendment trail","Approval in principle never mutates the rental schedule",history.length?tbl(["Reference","Booking","Request","Decision","Action"],history.map(x=>row(c,[h(c,x.id),h(c,x.booking),h(c,x.reason),tag(c,x.status),small(c,"Review","open:amend-review",x.id)]))):'<div class="empty-state">No amendment requests yet. Request a booking change to see the approval path.</div>')+
info(c,"Cancellations and live payments are separate","A cancellation needs policy evaluation and a refund ledger. This prototype only updates mock reservation state for unpaid/confirmed bookings; no payment reversal occurs.")}
function dispatch(c){var jobs=c.db.driverJobs||[],d=c.db.dispatch;return header(c,"Dispatch & assignments","Assign chauffeurs with a clear distinction between dispatch and vehicle handover.","New assignment","open:dispatch")+
stat(c,[["Driver jobs",String(jobs.length),"Driver-visible assignments","car"],["Awaiting acceptance",String(jobs.filter(x=>x.status==="Assigned").length),"Needs driver action","clock"],["Proposed assignments",String(d.filter(x=>x.status==="Proposed").length),"Not yet dispatched","file"],["Available drivers",String(c.db.drivers.filter(x=>x.verified).length),"Mock verified flag","shield"]])+
section("Professional driver assignments","A driver receives an assignment; rental possession remains company-controlled",tbl(["Assignment","Booking","Driver","Pickup","State","Action"],jobs.map(x=>row(c,[h(c,x.id),h(c,x.booking),h(c,x.driver),h(c,x.pickup),tag(c,x.status),small(c,"Review","open:dispatch-detail",x.id)]))))+
section("Proposals for dispatcher review","No automatic allocation or passenger confirmation",tbl(["Proposal","Booking","Driver","Status"],d.map(x=>row(c,[h(c,x.id),h(c,x.booking),h(c,x.driver),tag(c,x.status)]))))+
info(c,"Dispatch rules still need the backend","Prevent driver and vehicle overlaps, validate licence/insurance and implement dispatch changes atomically.")}
function availabilityPolicy(c){var x=c.db.availabilityPolicy;return header(c,"Availability policy","Manage booking buffers and advance-booking limits for your branch.","Edit rules","open:availability-policy")+
stat(c,[["Booking buffer",x.bufferHours+"h","Between rentals","clock"],["Lead time",x.minLeadHours+"h","Minimum notice","calendar"],["Max duration",x.maxDays+" days","Policy cap","shield"],["Fleet assets",String(c.db.vehicles.length),"Illustrative availability","car"]])+
section("Policy snapshot","Mock rules displayed before staff change availability",'<div class="pad-22">'+data(c,"Minimum turnaround buffer",x.bufferHours+" hours")+data(c,"Minimum advance notice",x.minLeadHours+" hours")+data(c,"Maximum rental duration",x.maxDays+" days")+
btn(c,"Edit operating policy","open:availability-policy",null,"primary")+'</div>')+
info(c,"Policy is only visual","Production bookings must enforce these rules server-side at quote, allocation, extension and handover; policy changes need versioning and effective dates.")}
function offers(c){var offers=c.db.offers;return header(c,"Offers & promotions","Create explicit validity windows and review discounts before checkout.","New promotion","open:offer")+
stat(c,[["Offers in draft",String(offers.filter(x=>x.status==="Draft").length),"Not publicly active","tag"],["Example promotions",String(offers.length),"Browser-local records","file"],["Active codes",String(offers.filter(x=>x.status==="Active").length),"Demo only","shield"],["Pricing source","Vehicle rate","No real discounts applied","wallet"]])+
section("Offer catalogue","Preview scope and status without changing historical invoices",tbl(["Code","Type","Discount","Expiry","Status","Action"],offers.map(x=>row(c,[h(c,x.code),h(c,x.type),x.type==="Percent"?x.amount+"%":money(c,x.amount),h(c,x.expires),tag(c,x.status),small(c,x.status==="Draft"?"Activate preview":"Return to draft","offer-toggle",x.id)]))))+
info(c,"Discount authority","These codes are examples; checkout does not automatically apply them. Real coupon validation, caps, exclusions and abuse rules remain backend responsibilities.")}
function refunds(c){var deposits=c.db.deposits,reviews=c.db.refundReviews;return header(c,"Refund approvals","Separate deposit eligibility, approval, reconciliation and actual refund transfer.","Open deposits","company:Deposits & refunds")+
stat(c,[["Held deposits",String(deposits.filter(x=>x.status==="Held (demo)").length),"Eligible for review only","wallet"],["Under review",String(reviews.filter(x=>x.status==="Awaiting approval").length),"Reviewer decision needed","clock"],["Approved requests",String(reviews.filter(x=>x.status==="Approved").length),"Not transferred","shield"],["Live refund provider","Offline","No money moves","alert"]])+
section("Deposit records","Review a deposit without pretending it has been refunded",tbl(["Deposit","Booking","Amount","State","Next step"],deposits.map(d=>row(c,[h(c,d.id),h(c,d.booking),money(c,d.amount),tag(c,d.status),small(c,"Review eligibility","open:refund",d.id)]))))+
section("Refund decision queue","A decision isn't the provider's transfer confirmation",reviews.length?tbl(["Request","Deposit","Amount","Status","Action"],reviews.map(r=>row(c,[h(c,r.id),h(c,r.deposit),money(c,r.amount),tag(c,r.status),r.status==="Awaiting approval"?small(c,"Decide","open:refund-decision",r.id):"Recorded"]))):'<div class="empty-state">No refund decisions yet.</div>')+
info(c,"Refunds never execute here","No M-Pesa reversal, bank payout, card refund or settlement has been made. A paid state requires verified provider reconciliation.")}
function invoices(c){var bookings=c.db.bookings;return header(c,"Invoice detail & payment history","See line items, partial receipts, unpaid balances and final charges.","Review payments","company:Finance & payments")+
section("Booking invoices · mock", "Select a reservation to inspect its financial composition",tbl(["Booking","Renter","Base","Final charges","Outstanding","Action"],bookings.map(b=>row(c,[h(c,b.id),h(c,b.customer),money(c,b.total),money(c,b.returnCharge||0),money(c,outstanding(c,b)+Number(b.returnCharge||0)),small(c,"Review invoice","open:invoice",b.id)]))))+
info(c,"Never equate booking totals with issued invoices","The prototype supports line-item exploration. Real invoice numbers, tax documents, adjustments, provider receipts and ledger allocation will be audited in P4.")}
function companyLaunch(c){var names=[["branch","Set operating branches","At least one pickup/return location"],["fleet","Register and review fleet","All vehicles need compliance checks"],["pricing","Configure base rates","Avoid publishing unpriced vehicles"],["team","Invite an operations team","Permissions by role and branch"],["website","Preview branded website","Control which vehicles are public"]];var count=names.filter(x=>c.db.onboarding[x[0]]).length;return header(c,"Company launch checklist","A first-run operating guide to get a tenant ready to accept rental enquiries.","Continue setup","open:launch")+
stat(c,[["Ready steps",count+" / 5","Browser-local checklist","check"],["Fleet",String(c.db.vehicles.length),"Review eligibility","car"],["Locations",String(c.db.branches.length),"Sample branches","globe"],["Website",c.db.site.published?"Preview published":"Draft","Not a live site","file"]])+
section("Launch your company","Complete the remaining configuration steps intentionally",'<div class="d2-launch-list">'+names.map(function(x){return '<div class="d2-launch-row">'+tag(c,c.db.onboarding[x[0]]?"Done":"Pending")+'<div><strong>'+x[1]+'</strong><p>'+x[2]+'</p></div>'+btn(c,c.db.onboarding[x[0]]?"Reopen":"Mark reviewed","launch-toggle",x[0])+'</div>'}).join("")+'</div>')+
info(c,"Onboarding flags are a demonstration","Marking a step done does not verify company legal information, activate subscription entitlements, or publish a tenant website.")}

/* __CONTINUE__ */
})();