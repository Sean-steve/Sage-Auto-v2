/* Sage Auto V2 · Phase P3-D.2 gap closure workbench.
 * Strictly browser-local prototype. No live accounts, payments, RBAC, email or fleet reservations.
 */
(function(){"use strict";
var G={};
var SEED={
 signup:{email:"",company:"",contact:"",region:"Nairobi",plan:"Growth",step:1,emailVerified:false,accountCreated:false},
 subscriptionRecovery:{company:"Nairobi Drive",state:"Active",graceUntil:"2026-11-01",history:[]},
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
if(p==="Subscription status")return subscriptionCompany(c);
return null}
function platformPage(c){seed(c.db);var p=c.state.page, map={
"Tenant provisioning":provision,"Entitlement review":entitlements,"Integration health":health,"Jobs & events":jobs,
"Platform incidents":platformIncident,"Platform roles":platformRoles,"Support access":supportAccess,
"Compliance policies":policies,"Platform notifications":platformNotifications,"Subscription recovery":subscriptionPlatform};
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


function subscriptionCompany(c){var x=c.db.subscriptionRecovery,blocked=x.state==="Suspended";return header(c,"Subscription status","Know what is available if a SaaS subscription payment is late.","Platform billing preview","company:Subscription & billing")+
stat(c,[["Account state",x.state,"Design simulation","shield"],["Grace review date",x.graceUntil,"Example only","calendar"],["Fleet records",String(c.db.vehicles.length),"Never erased on lapse","car"],["Payment integration","Disconnected","No actual billing","wallet"]])+
section("Your operating access","Use explicit communication and a safe recovery path",'<div class="pad-22">'+data(c,"Subscription",x.state)+data(c,"Core business data","Retained during a lapse")+data(c,"Access to invoices and support",blocked?"Should remain readable":"Normal demonstration")+data(c,"New rental operations",blocked?"Would be restricted server-side":"Available in prototype")+
btn(c,"Contact SaaS support (demo)","subscription-support",null,"primary")+'</div>')+
info(c,"Service cut-off requires careful rules","No actual feature entitlements are enforced in this browser. Customers' active rentals, audit history and invoices must not disappear when a plan lapses.")}
function subscriptionPlatform(c){var x=c.db.subscriptionRecovery;return header(c,"Subscription lifecycle & recovery","Show grace, restriction and reactivation as separate deliberate states.","Review tenant plans","page:Subscriptions")+
stat(c,[["Example company",x.company,"Tenant billing account","briefcase"],["Current phase",x.state,"Browser-local state","shield"],["Grace target",x.graceUntil,"Illustrative notification","calendar"],["Billing provider","Not connected","No real dues","wallet"]])+
section("Operator access lifecycle","Change example status to inspect company-side recovery UI",'<div class="pad-22">'+data(c,"Tenant",x.company)+data(c,"Lifecycle phase",x.state)+data(c,"Business records","Retained and readable where required")+
'<div class="quick-actions">'+btn(c,"Mark past due","subscription-set","Past due")+btn(c,"Enter grace","subscription-set","Grace period")+btn(c,"Preview restricted","subscription-set","Suspended","danger")+btn(c,"Restore preview","subscription-set","Active","primary")+'</div></div>')+
section("Lifecycle history","Audit-style mock updates",x.history.length?tbl(["Event","State","Explanation"],x.history.map(x=>row(c,[h(c,x.id),h(c,x.state),h(c,x.notes)]))):'<div class="empty-state">No lifecycle updates recorded.</div>')+
info(c,"No subscription is actually suspended","Entitlement checks, payment provider webhooks, user communications, grace periods and safe read-only access must be enforced and tested by the production backend.")}

/* Platform governance surfaces */
function provision(c){var x=c.db.tenantTasks;return header(c,"Tenant provisioning","Review company readiness, subscriptions and setup before granting access.","New provisioning review","open:provision")+
stat(c,[["Provisioning reviews",String(x.length),"Demo request records","briefcase"],["Awaiting action",String(x.filter(y=>y.status==="Awaiting review").length),"Needs human review","clock"],["Active SaaS tenants",String(c.db.tenants.filter(y=>y.status==="Active").length),"Mock registry","users"],["Provisioning engine","Offline","No real creation","alert"]])+
section("Provisioning requests","A request and a provisioned tenant are separate entities",tbl(["Reference","Company","Plan","Status","Action"],x.map(t=>row(c,[h(c,t.id),h(c,t.company),h(c,t.requestedPlan),tag(c,t.status),small(c,"Review","open:provision-detail",t.id)]))))+
info(c,"Provisioning is disabled in this prototype","Real creation must allocate tenant database records, RBAC bootstrap, plan entitlement, website namespace, audit and integration defaults.")}
function entitlements(c){var caps=[["Starter",5,1,3],["Growth",50,5,20],["Pro",200,25,100]];return header(c,"Entitlement review","Make subscription limits explicit before a plan change reaches enforcement.","Review tenant plans","company:Subscription & billing")+
section("Illustrative entitlement matrix","No limit is enforced by this frontend",tbl(["Plan","Vehicles","Branches","Team members","Action"],caps.map(x=>row(c,[x[0],String(x[1]),String(x[2]),String(x[3]),small(c,"Review","open:entitlement",x[0])]))))+
section("Tenant plan requests","A proposed plan is not a paid upgrade",tbl(["Company","Plan","Account state","Action"],c.db.tenants.map(t=>row(c,[h(c,t.name),h(c,t.plan),tag(c,t.status),small(c,"Change request","open:tenant-plan",t.id)]))))+
info(c,"Entitlement engine needs backend enforcement","Features, branch and usage limits must be checked server-side on every operation; subscription lapse requires grace and recovery UX.")}
function health(c){var v=c.db.eventHealth;return header(c,"Integration health","Know which services can deliver, reconcile and recover.","Jobs & events","page:Jobs & events")+
stat(c,[["Healthy",String(v.filter(x=>x.status==="Healthy").length),"Demo service signals","check"],["Needs review",String(v.filter(x=>x.status==="Needs review").length),"Attention required","alert"],["Disconnected",String(v.filter(x=>x.status==="Not connected").length),"Do not assume delivery","clock"],["Retries","Not configured","No real queues","wrench"]])+
section("Integration availability","A transparent mock services inventory",tbl(["Service","Component","Signal","Last event","Action"],v.map(e=>row(c,[h(c,e.name),h(c,e.service),tag(c,e.status),h(c,e.lastSeen),small(c,"Detail","open:event",e.id)]))))+
info(c,"Do not mistake these for real system health","No M-Pesa, email, worker, webhook or database connection has been checked. Signals are fictional design examples.")}
function jobs(c){return header(c,"Jobs & event monitor","Trace asynchronous operations, failures and retry requirements.","Integration health","page:Integration health")+
section("Event and worker overview","Illustrative worker signals; no queue backend running",tbl(["Event","Worker group","Last signal","Status","Action"],c.db.eventHealth.map(e=>row(c,[h(c,e.name),h(c,e.service),h(c,e.lastSeen),tag(c,e.status),small(c,"Inspect","open:event",e.id)]))))+
info(c,"Canonical jobs require robust handling","Show retry attempts, dead letters, idempotency keys, event correlation IDs and safe manual reprocessing only after the real backend audit.")}
function platformIncident(c){return header(c,"Platform incidents","Track SaaS-wide operational incidents independently of renter incident reports.","Report platform incident","open:platform-incident")+
section("SaaS incident command queue","System operations rather than end-user emergencies",tbl(["Incident","Subject","Severity","Status","Action"],c.db.platformEvents.map(x=>row(c,[h(c,x.id),h(c,x.subject),tag(c,x.severity),tag(c,x.status),small(c,"Review","open:platform-incident-detail",x.id)]))))+
info(c,"Incident communications are disconnected","Escalations, status-page updates and notifications must use verified channels when production integrations are added.")}
function platformRoles(c){return header(c,"Platform identities & roles","Explicitly distinguish SaaS-level operators from tenant workers.","View audit history","page:Security & audit")+
section("Staff role scopes","Read-only preview of access boundaries",tbl(["Role","Allowed scope","Authorization note"],c.db.platformRoles.map(x=>row(c,[h(c,x.name),h(c,x.scope),tag(c,x.access)]))))+
info(c,"Real access is not implemented","Platform users must not gain arbitrary tenant access. Require session controls, justified support access, expiration, and immutable audit.")}
function supportAccess(c){var access=c.db.supportAccess;return header(c,"Approved support access","Just-in-time tenant access proposal for authorized support.","Request access review","open:support-request")+
section("Support session approvals","Requests never impersonate customers or bypass permissions",tbl(["Request","Company","Reason","State","Expiry","Action"],access.map(x=>row(c,[h(c,x.id),h(c,x.tenant),h(c,x.reason),tag(c,x.status),h(c,x.expiry),small(c,"Review","open:support-detail",x.id)]))))+
info(c,"Access grants disabled by design","Production access requires a named approver, specific role, least privilege, expiration, scope and audit; this prototype cannot grant it.")}
function policies(c){return header(c,"Compliance & platform policies","Separate security and regulatory controls from visual settings.","Security audit","page:Security & audit")+
section("Control register","Reference obligations for product implementation",tbl(["Control","Category","Requirement","Action"],c.db.policyEntries.map(x=>row(c,[h(c,x.name),h(c,x.type),h(c,x.state),small(c,"Read control","open:policy",x.id)]))))+
info(c,"Regulatory analysis needed","Retention, local data protection obligations, payments and tax compliance must be assessed for each market before production.")}
function platformNotifications(c){return header(c,"Platform notifications","Operator communications and service notices with explicit delivery status.","Integration health","page:Integration health")+
section("Notifications inbox","Platform messages are not tenant email deliveries",tbl(["Notice","Topic","Summary","State","Action"],c.db.platformNotices.map(x=>row(c,[h(c,x.id),h(c,x.type),h(c,x.details),tag(c,x.status),small(c,"Mark read","notice-read",x.id)]))))+
info(c,"Delivery not connected","Real operator emails, webhooks, SMS and system notifications require templates, preferences, retries and delivery monitoring.")}
function publicBase(c,title,desc,content){return '<div class="public-shell"><div class="public-nav"><div class="public-brand"><span class="brand-mark">'+ic(c,"car")+'</span>sageauto</div><div class="row-actions">'+btn(c,"Explore Sage Auto","page:Home")+btn(c,"Company workspace","to-company",null,"primary")+'</div></div><main id="main-content" class="d2-public-main"><span class="eyebrow">SAGE AUTO · BUSINESS SETUP PREVIEW</span><h1>'+h(c,title)+'</h1><p class="muted">'+h(c,desc)+'</p>'+content+'</main><footer class="public-footer">No real authentication, email delivery, provisioning or billing performed. · Design prototype</footer></div>'}
function marketing(c){var p=c.state.page,u=c.db.signup,names=["Account","Verify","Business","Plan","Launch"],step=p==="Tour & setup"?1:p==="Verify email"?2:p==="Business setup"?3:p==="Choose plan"?4:p==="First-run setup"?5:1;
var body="";
if(p==="Tour & setup"){body=stepper(c,1,names)+section("What your business will gain","A guided journey from new account to launch-ready fleet",'<div class="d2-public-grid">'+card(c,"Create an account","Use a work email and basic contact","user","open:register")+card(c,"Prepare your company","Branch, fleet and staffing setup","briefcase","page:Business setup")+card(c,"Choose a plan","Limits and sample billing, not a purchase","wallet","page:Choose plan")+'</div>')+info(c,"Preview only","Registration does not send emails or provision a tenant.")+btn(c,"Start demo account setup","open:register",null,"primary")}
if(p==="Verify email"){body=stepper(c,2,names)+section("Confirm your email","A sample 6-digit code for visual validation only",'<div class="pad-22">'+data(c,"Account email",u.email||"Not entered")+
formField(c,"Demo code","verification","text","","")+
btn(c,"Verify demo code","verify-demo",null,"primary")+'<p class="form-help" style="margin-top:10px">Enter 123456. This is not a real verification email or identity check.</p></div>')+
info(c,"Not secure verification","No OTP is generated or delivered, and the demo value must never be used in production.")}
if(p==="Business setup"){body=stepper(c,3,names)+section("Business profile","Name, region and primary contact",'<div class="pad-22"><div class="form-grid">'+formField(c,"Registered business name","company","text",u.company,true)+formField(c,"Contact telephone","contact","tel",u.contact,true)+select(c,"Primary location","region",["Nairobi","Mombasa","Kisumu","Nakuru"],u.region)+'</div><div class="quick-actions">'+btn(c,"Save demo company profile","save-business",null,"primary")+'</div></div>')+
info(c,"Legal verification pending","Business registration, tax identifiers and owner identity remain real onboarding requirements.")}
if(p==="Choose plan"){body=stepper(c,4,names)+section("Compare operating plans","Illustrative figures and limits only — no payment collected",'<div class="d2-plan-grid">'+[["Starter",5,"KES 4,999"],["Growth",50,"KES 9,999"],["Pro",200,"KES 19,999"]].map(x=>'<button class="d2-plan '+(x[0]===u.plan?"chosen":"")+'" data-action="p3d2:plan-select" data-id="'+x[0]+'"><span class="eyebrow">'+x[0]+'</span><h2>'+x[2]+'</h2><p>'+x[1]+' sample vehicles</p><small>'+(x[0]===u.plan?"Selected ✓":"Select plan")+'</small></button>').join("")+'</div><div class="pad-22">'+btn(c,"Continue to setup checklist","page:First-run setup",null,"primary")+'</div>')+
info(c,"No checkout transaction","Plan selection only saves browser-local preference. Subscription enforcement and payment checkout require real services.")}
if(p==="First-run setup"){body=stepper(c,5,names)+section("Your first launch checklist","Review what the company workspace will require",'<div class="d2-launch-list">'+[["Branches","Plan pickup and return locations"],["Fleet","Register vehicles and compliance"],["Pricing","Set rates, fees and deposits"],["Employees","Invite the appropriate roles"],["Website","Preview branded inventory"]].map((x,i)=>'<div class="d2-launch-row">'+tag(c,"Pending")+'<div><strong>'+x[0]+'</strong><p>'+x[1]+'</p></div></div>').join("")+'</div>')+
'<div class="quick-actions">'+btn(c,"Open company setup workspace","company:Company launch checklist",null,"primary")+'</div>'+info(c,"No tenant was provisioned","This page is a visual first-run journey. Only the backend can create a company securely.")}
if(p==="Sign in & recovery"){body=section("Access your Sage Auto workspace","Design for sign-in and account recovery; no real login",'<div class="pad-22"><div class="form-grid">'+formField(c,"Work email","email","email",u.email,true)+formField(c,"Password","password","password","",true)+'</div><div class="quick-actions">'+btn(c,"Preview sign-in","auth-preview",null,"primary")+btn(c,"Preview recovery","auth-recovery")+'</div></div>')+
info(c,"Authentication does not exist in this prototype","Never enter real passwords, API keys, or personal account credentials here.")}
if(window.SageOnboardingContinuity)body=window.SageOnboardingContinuity.decorate(c,p,body);
return publicBase(c,p,p==="Sign in & recovery"?"Account access and recovery states":"Step "+step+" of 5 · Guided SaaS onboarding",body)}
function checkout(c){var x=c.db.checkout,v=vehicle(c,x.vehicle)||c.db.vehicles[0],total=quote(c,v.id,x.days);var content=stepper(c,x.step,["Vehicle","Details","Review","Request"]),box='';
if(x.step===1)box=section("Select dates and a vehicle","Pricing and eligibility are examples only",'<div class="pad-22"><div class="form-grid">'+select(c,"Vehicle","vehicle",c.db.vehicles.filter(z=>z.status==="Available"&&z.compliant).map(z=>[z.id,z.name+" · "+money(c,z.rate)+"/day"]),x.vehicle)+
formField(c,"Pickup date","pickup","date",x.pickup,true)+select(c,"Rental days","days",["1","2","3","5","7","14"].map(z=>[z,z+" day(s)"]),String(x.days))+'</div><div class="quick-actions">'+btn(c,"Review customer details","checkout-next",null,"primary")+'</div></div>');
if(x.step===2)box=section("Your booking details","A request cannot be confirmed before the operator verifies availability",'<div class="pad-22"><div class="form-grid">'+formField(c,"Your name","customer","text",x.customer,true)+formField(c,"Email or phone","contact","text",x.contact,true)+'</div><div class="quick-actions">'+btn(c,"Back","checkout-back")+btn(c,"Review booking request","checkout-next",null,"primary")+'</div></div>');
if(x.step===3)box=section("Review your enquiry","Transparency before submitting, not a payment request",'<div class="pad-22">'+data(c,"Vehicle",v.name)+data(c,"Pickup",x.pickup)+data(c,"Duration",x.days+" day(s)")+data(c,"Illustrative rental value",money(c,total))+
'<label class="checkline"><input id="d2-consent" type="checkbox" '+(x.consent?"checked":"")+'> I understand this is a non-binding sample enquiry and no booking or payment is made.</label><div class="quick-actions">'+btn(c,"Back","checkout-back")+btn(c,"Send booking enquiry","checkout-submit",null,"primary")+'</div></div>');
if(x.step===4)box=section("Request recorded","An operator must still verify and confirm",'<div class="pad-22"><h2>Enquiry sent for review</h2><p>We have created a sample lead in the operator workspace. No payment or vehicle hold has occurred.</p><div class="quick-actions">'+btn(c,"Explore more vehicles","page:Explore vehicles",null,"primary")+btn(c,"View renter portal","to-renter")+'</div></div>');
return '<div class="public-shell"><nav class="public-nav"><div class="public-brand"><span class="brand-mark">'+ic(c,"car")+'</span>'+h(c,c.db.site.brand||"Nairobi Drive")+'</div>'+btn(c,"Browse vehicles","page:Explore vehicles")+'</nav><main id="main-content" class="d2-public-main"><span class="eyebrow">RENTAL REQUEST · DEMO</span><h1>Make your next booking effortless</h1><p class="muted">Review every detail before submitting your rental enquiry.</p>'+content+box+info(c,"No payment is processed","Real M-Pesa/card payment, formal checkout and booking confirmation come after backend reconciliation.")+'</main></div>'}


/* Contextual panels for unresolved domain contracts */
function drawer(c){if(!c.state.modal||!c.state.modal.startsWith("p3d2:"))return "";seed(c.db);
var key=c.state.modal.slice(5),split=key.split(":"),mode=split[0],id=split.slice(1).join(":"),db=c.db,content="",title="",cta="",extra="";
var b=db.bookings.find(x=>x.id===id),v=vehicle(c,b?.vehicle),owner=db.owners[0];
switch(mode){
case "amend":title="Change or cancel a booking";content='<div class="form-grid">'+
select(c,"Reservation","booking",db.bookings.filter(x=>["Awaiting payment","Confirmed","Active"].includes(x.status)).map(x=>[x.id,x.id+" · "+x.customer]),id||"SA-1043")+
select(c,"Change requested","changeType",["New pickup date","Extend rental","Cancel reservation"],"New pickup date")+
formField(c,"Proposed date (if relevant)","date","date","2026-10-25")+
select(c,"Proposed rental length","days",["1","2","3","5","7","14"],"2")+
textArea(c,"Reason","reason","Customer preference, vehicle substitution, or operator changes")+'</div>'+info(c,"Review is not execution","Changing the dates needs conflict checks, repricing and customer acceptance. A cancellation must not silently refund a payment.");cta="Save change request";break;
case "amend-review":{var x=db.bookingChanges.find(z=>z.id===id);if(!x)return "";title="Review booking change";content=data(c,"Reservation",x.booking)+data(c,"Request",x.changeType)+data(c,"Date",x.date)+data(c,"Reason",x.reason)+data(c,"Current state",x.status)+info(c,"Approval in principle only","Rental and allocation remain unchanged until the canonical backend validates it.");extra=btn(c,"Approve in principle","amend-approve",id,"primary")+btn(c,"Decline","amend-decline",id);break}
case "dispatch":title="Assign professional chauffeur";content='<div class="form-grid">'+select(c,"Booking","booking",db.bookings.filter(b=>["Confirmed","Active"].includes(b.status)).map(x=>[x.id,x.id+" · "+x.customer]),"SA-1045")+
select(c,"Driver","driver",db.drivers.filter(d=>d.verified).map(d=>[d.name,d.name+" · "+d.branch]),"James Kiptoo")+
formField(c,"Pickup instructions","pickup","text","JKIA Terminal 1",true)+formField(c,"Drop-off destination","dropoff","text","Karen",true)+'</div>'+info(c,"Driver assignment ≠ handover","The booking remains controlled by contract, verification, inspection and possession workflows.");cta="Create demo assignment";break;
case "dispatch-detail":{var x=db.driverJobs.find(z=>z.id===id);if(!x)return "";title="Chauffeur assignment";content=data(c,"Booking",x.booking)+data(c,"Driver",x.driver)+data(c,"Pickup",x.pickup)+data(c,"Destination",x.dropoff)+data(c,"Status",x.status)+info(c,"Assigned trips are driver-visible","Only the driver can update duty/arrival progress in their preview.");break}
case "availability-policy":title="Update availability policy";var policy=db.availabilityPolicy;content='<div class="form-grid">'+formField(c,"Turnaround buffer (hours)","bufferHours","number",String(policy.bufferHours),true)+formField(c,"Minimum lead time (hours)","minLeadHours","number",String(policy.minLeadHours),true)+formField(c,"Maximum rental days","maxDays","number",String(policy.maxDays),true)+'</div>'+info(c,"Policy change is not yet enforced","The backend must revalidate every new quote, hold and extension against the active policy version.");cta="Save demo policy";break;
case "offer":title="Create promotional offer";content='<div class="form-grid">'+formField(c,"Offer code","code","text","WEEKEND10",true)+select(c,"Type","type",["Percent","Fixed KES"],"Percent")+formField(c,"Discount amount","amount","number","10",true)+formField(c,"Expiry","expires","date","2026-12-31",true)+'</div>'+info(c,"Offer remains in draft","Real validation requires eligible car classes, stacking rules, budget and legal restrictions.");cta="Create draft offer";break;
case "refund":{var d=db.deposits.find(z=>z.id===id);if(!d)return "";title="Refund eligibility";content=data(c,"Deposit",d.id)+data(c,"Booking",d.booking)+data(c,"Amount held (mock)",money(c,d.amount))+
'<div class="form-grid">'+formField(c,"Proposed refund amount · KES","amount","number",String(d.amount),true)+textArea(c,"Reason and deduction details","reason","Inspect return report, late fees or unresolved damage")+'</div>'+info(c,"Refund review, not transfer","Do not mark a deposit as sent without provider reconciliation.");cta="Create refund review";break}
case "refund-decision":{var x=db.refundReviews.find(z=>z.id===id);if(!x)return "";title="Refund approval";content=data(c,"Review",x.id)+data(c,"Deposit",x.deposit)+data(c,"Proposed",money(c,x.amount))+data(c,"Reason",x.reason)+data(c,"State",x.status)+info(c,"Authorization does not execute a refund","A separate payout/reversal step remains necessary.");extra=btn(c,"Approve review","refund-approve",id,"primary")+btn(c,"Reject review","refund-reject",id);break}
case "invoice":{if(!b)return "";title="Invoice detail · "+id;var entries=db.ledger.filter(x=>x.booking===id);content=data(c,"Customer",b.customer)+data(c,"Base rental",money(c,b.total))+data(c,"Return extras",money(c,b.returnCharge||0))+data(c,"Recorded receipts",money(c,entries.reduce((s,x)=>s+Number(x.amount||0),0)))+data(c,"Remaining balance",money(c,outstanding(c,b)+Number(b.returnCharge||0)))+
section("Recorded payment references","All records are fictional",entries.length?tbl(["Receipt","Channel","Amount"],entries.map(x=>row(c,[h(c,x.ref),h(c,x.method),money(c,x.amount)]))):'<div class="empty-state">No sample payment records.</div>')+
info(c,"Not a legal invoice","No invoice number, VAT calculation, payment gateway reconciliation or tax receipt generated.");break}
case "register":title="Start demo business account";content='<div class="form-grid">'+formField(c,"Work email","email","email",db.signup.email,true)+formField(c,"Contact person's name","contact","text",db.signup.contact,true)+'</div>'+info(c,"No real account is created","Do not enter real passwords here. This preview simply remembers the onboarding steps.");cta="Continue to email review";break;
case "provision":title="Tenant provisioning review";content='<div class="form-grid">'+select(c,"Company","company",db.tenants.map(t=>t.name),db.tenants[0].name)+
select(c,"Requested plan","plan",["Starter","Growth","Pro"],"Growth")+textArea(c,"Admin review notes","notes","Reason and required readiness checks")+'</div>'+info(c,"Manual request only","This does not create tenant records, domains, billing or permissions.");cta="Create provisioning request";break;
case "provision-detail":{var x=db.tenantTasks.find(t=>t.id===id);if(!x)return "";title="Provisioning review "+id;content=data(c,"Company",x.company)+data(c,"Plan",x.requestedPlan)+data(c,"Status",x.status)+data(c,"Notes",x.notes)+info(c,"No provisioning performed","The backend onboarding pipeline must atomically provision and audit resources.");extra=btn(c,"Mark preview reviewed","provision-reviewed",id,"primary");break}
case "entitlement":title="Entitlement preview";content=data(c,"Plan",id)+data(c,"Scope","Vehicles, branches and staff limits")+info(c,"No live enforcement","Only a server-side entitlement service can restrict operations and handle subscription grace.");break;
case "tenant-plan":{var x=db.tenants.find(t=>t.id===id);if(!x)return "";title="Tenant plan change request";content=data(c,"Company",x.name)+data(c,"Current plan",x.plan)+select(c,"Requested tier","plan",["Starter","Growth","Pro"],x.plan)+info(c,"Plan request only","No billing or usage limits will change.");cta="Save plan review";break}
case "event":{var x=db.eventHealth.find(t=>t.id===id);if(!x)return "";title=x.name;content=data(c,"Component",x.service)+data(c,"Last signal",x.lastSeen)+data(c,"State",x.status)+info(c,"Example health signal","No worker or real event bus was inspected.");break}
case "platform-incident":title="Log platform incident";content='<div class="form-grid">'+formField(c,"Incident summary","subject","text","Slow notification processing",true)+select(c,"Severity","severity",["Low","Medium","High"],"Medium")+textArea(c,"Operational context","notes","Scope, impact and intended action")+'</div>';cta="Create example incident";break;
case "platform-incident-detail":{var x=db.platformEvents.find(t=>t.id===id);if(!x)return "";title=x.subject;content=data(c,"Severity",x.severity)+data(c,"Status",x.status)+info(c,"Incident resolution requires evidence","The demo state does not alert customers or a status page.");extra=btn(c,"Move to review","platform-review",id,"primary");break}
case "support-request":title="Request support access";content='<div class="form-grid">'+select(c,"Tenant","tenant",db.tenants.map(t=>t.name),db.tenants[0].name)+textArea(c,"Business justification","reason","Why support assistance is required")+'</div>'+info(c,"Never grants permission","Real approval needs a named reviewer, scope, expiry and immutable audit.");cta="Submit access review";break;
case "support-detail":{var x=db.supportAccess.find(t=>t.id===id);if(!x)return "";title="Support access request";content=data(c,"Tenant",x.tenant)+data(c,"Reason",x.reason)+data(c,"Status",x.status)+data(c,"Expiry",x.expiry)+info(c,"Grant disabled","No account access or impersonation is possible.");break}
case "policy":{var x=db.policyEntries.find(t=>t.id===id);if(!x)return "";title=x.name;content=data(c,"Control domain",x.type)+data(c,"Implementation need",x.state)+info(c,"Governance evidence","A security/compliance team must validate the control against actual backend behavior.");break}
default:return ""}
if(!title)return "";
return '<div class="modal-backdrop" data-action="close-outside"><section class="drawer" role="dialog" aria-modal="true" aria-label="'+h(c,title)+'"><div class="drawer-header"><div><span class="eyebrow">PHASE 3-D.2 · FRONTEND-ONLY</span><h2>'+h(c,title)+'</h2><p class="muted">Sample records · no live services connected</p></div><button class="icon-button" aria-label="Close" data-action="close">'+ic(c,"close")+'</button></div><div class="drawer-body"><form id="d2-form">'+content+'</form></div><div class="drawer-footer">'+btn(c,"Close","close")+(cta?btn(c,cta,"submit:"+mode+":"+id,null,"primary"):extra)+'</div></section></div>'}

/* Action engine: records only preview intentions; no real transaction/authorization */
function val(name){var root=document.getElementById("d2-form")||document,el=root.querySelector&&root.querySelector('[name="'+name+'"]');return el?String(el.value||"").trim():""}
function positive(v){return Number.isFinite(Number(v))&&Number(v)>0}
function act(action,node,c){if(!action.startsWith("p3d2:"))return false;seed(c.db);if(window.SageOnboardingContinuity&&window.SageOnboardingContinuity.action(action,node,c))return true;var cmd=action.slice(5),id=node.getAttribute("data-id")||"",db=c.db,side=c.state.portal,p=cmd.split(":"),type=p[0],rest=p.slice(1).join(":"),x,b;
if(type==="open"){c.state.modal="p3d2:"+rest+":"+(id||"");c.render();return true}
if(type==="close"){c.state.modal=null;c.render();return true}
if(type==="page"){c.navigate(side,rest);return true}
if(type==="company"){c.navigate("company",rest);return true}
if(type==="to-company"){c.navigate("company","Overview");return true}
if(type==="to-renter"){c.navigate("renter","Overview");return true}
if(type==="guide"){c.showToast("This is a frontend preview; review the contract status and next steps.");return true}
if(type==="subscription-set"){if(side!=="platform")return true;var states=["Active","Past due","Grace period","Suspended"];if(!states.includes(id))return true;db.subscriptionRecovery.state=id;db.subscriptionRecovery.history.unshift({id:"SC-"+Date.now(),state:id,notes:"Browser-only subscription lifecycle preview"});return save(c,"Demo subscription state updated; no account access changed.")}
if(type==="subscription-support"){db.platformNotices.unshift({id:"PN-"+Date.now(),type:"Account support request",details:"Demo company requested subscription assistance",status:"Unread"});return save(c,"Demo support notice saved; no message delivered.")}
if(type==="launch-toggle"){if(!(id in db.onboarding))return true;db.onboarding[id]=!db.onboarding[id];return save(c,"Demo readiness step updated.");}
if(type==="notice-read"){x=db.platformNotices.find(t=>t.id===id);if(x){x.status="Read";return save(c,"Platform notice marked read in preview.")}return true}
if(type==="amend-approve"||type==="amend-decline"){x=db.bookingChanges.find(t=>t.id===id&&t.status==="Pending review");if(!x)return true;x.status=type==="amend-approve"?"Approved in principle":"Declined";return save(c,"Change decision stored; rental dates and amounts remain unchanged.")}
if(type==="offer-toggle"){x=db.offers.find(t=>t.id===id);if(x){x.status=x.status==="Draft"?"Active":"Draft";return save(c,"Offer visibility changed in demo; checkout discounts unaffected.")}return true}
if(type==="refund-approve"||type==="refund-reject"){x=db.refundReviews.find(t=>t.id===id&&t.status==="Awaiting approval");if(!x)return true;x.status=type==="refund-approve"?"Approved":"Rejected";return save(c,"Refund review decision stored; no funds moved.")}
if(type==="provision-reviewed"){x=db.tenantTasks.find(t=>t.id===id);if(x){x.status="Reviewed; not provisioned";return save(c,"Provisioning request reviewed; no tenant created.")}return true}
if(type==="platform-review"){x=db.platformEvents.find(t=>t.id===id);if(x){x.status="In review";return save(c,"Incident triage saved in demo.")}return true}
if(type==="auth-preview"||type==="auth-recovery"){c.showToast("Authentication is not connected. Do not enter real account credentials.");return true}
if(type==="plan-select"){db.signup.plan=id;return save(c,"Demo plan preference selected; no charge made.")}
if(type==="verify-demo"){if(val("verification")!=="123456"){c.showToast("Enter the example verification code shown on this screen.");return true}db.signup.emailVerified=true;c.save();c.navigate("marketing","Business setup");c.showToast("Demo code accepted; no real email verification performed.");return true}
if(type==="save-business"){if(!val("company")||!val("contact")){c.showToast("Enter the company name and contact before continuing.");return true}db.signup.company=val("company");db.signup.contact=val("contact");db.signup.region=val("region");c.save();c.navigate("marketing","Choose plan");return true}
if(type==="go-checkout"){db.checkout.step=1;c.save();c.navigate("branded","Checkout & review");return true}
if(type==="checkout-vehicle"){var selected=vehicle(c,id);if(!selected||selected.status!=="Available"||!selected.compliant){c.showToast("This car is not ready for enquiries.");return true}db.checkout.vehicle=id;db.checkout.step=1;c.save();c.navigate("branded","Checkout & review");return true}
if(type==="checkout-back"){db.checkout.step=Math.max(1,db.checkout.step-1);return save(c,"Returned to previous review step.")}
if(type==="checkout-next"){var step=db.checkout.step;if(step===1){var v=val("vehicle")||db.checkout.vehicle,start=val("pickup")||db.checkout.pickup,days=+(val("days")||db.checkout.days);if(!demoDate(start)||start<"2026-10-13"||!positive(days)){c.showToast("Choose a valid pickup date and rental duration.");return true}var veh=vehicle(c,v);if(!veh||veh.status!=="Available"||!veh.compliant){c.showToast("That example car is unavailable. Choose a different vehicle.");return true}db.checkout.vehicle=v;db.checkout.pickup=start;db.checkout.days=days}
if(step===2){if(!val("customer")||!val("contact")){c.showToast("Enter your name and contact for the enquiry.");return true}db.checkout.customer=val("customer");db.checkout.contact=val("contact")}
db.checkout.step=Math.min(3,step+1);return save(c,"Review next step of rental enquiry.")}
if(type==="checkout-submit"){var check=document.getElementById("d2-consent");if(!check||!check.checked){c.showToast("Acknowledge this is a non-binding rental request.");return true}var q=db.checkout,v=vehicle(c,q.vehicle);if(!v||v.status!=="Available"||!v.compliant){c.showToast("Vehicle readiness changed. Choose another car.");return true}
if(!q.customer||!q.contact||!demoDate(q.pickup)){c.showToast("The enquiry is incomplete.");return true}
var record={id:"WEB-"+Date.now(),name:q.customer,contact:q.contact,vehicle:q.vehicle,pickup:q.pickup,days:q.days,source:"Branded checkout demo",status:"Awaiting operator review",quotedAmount:quote(c,q.vehicle,q.days)};
db.quoteRequests.unshift(record);db.publicEnquiries.unshift(record);db.leads.unshift({id:"L-"+Date.now(),name:q.customer+" · "+v.name,source:"Website checkout enquiry",status:"New"});db.checkout.step=4;return save(c,"Quote enquiry saved for operator review; no booking or payment made.")}
if(type==="submit"){var mode=rest.split(":")[0],key=rest.split(":").slice(1).join(":"),t=Date.now();var change,amount;
if(mode==="register"){if(!val("email")||!val("contact")||!val("email").includes("@")){c.showToast("Enter a valid demo work email and contact name.");return true}db.signup.email=val("email");db.signup.contact=val("contact");db.signup.accountCreated=true;c.save();c.state.modal=null;c.navigate("marketing","Verify email");return true}
if(mode==="amend"){b=db.bookings.find(x=>x.id===val("booking"));if(!b){c.showToast("Choose an existing reservation.");return true}change=val("changeType");if(!change||!val("reason")){c.showToast("Choose a change and describe the reason.");return true}if(change!=="Cancel reservation"&&!demoDate(val("date"))){c.showToast("Choose a valid requested date.");return true}
if(db.bookingChanges.some(x=>x.booking===b.id&&x.status==="Pending review")){c.showToast("A change request is already pending for "+b.customer+".");return true}
db.bookingChanges.unshift({id:"CH-"+t,booking:b.id,changeType:change,date:val("date"),days:Number(val("days")||2),reason:val("reason"),status:"Pending review"});return save(c,"Change request saved; booking has not been modified.")}
if(mode==="dispatch"){b=db.bookings.find(x=>x.id===val("booking"));var driver=val("driver");if(!b||!driver||!val("pickup")||!val("dropoff")){c.showToast("Complete the booking, driver and route details.");return true}
if(db.driverJobs.some(x=>x.booking===b.id&&x.driver===driver&&x.status!=="Completed")){c.showToast("An active assignment already exists for this driver and booking.");return true}
db.driverJobs.unshift({id:"DA-"+t,booking:b.id,driver,start:b.date,pickup:val("pickup"),dropoff:val("dropoff"),status:"Assigned"});db.dispatch.unshift({id:"ASG-"+t,booking:b.id,driver,status:"Dispatched"});return save(c,"Chauffeur assigned in demo; no rental handover triggered.")}
if(mode==="availability-policy"){var nums=["bufferHours","minLeadHours","maxDays"].map(n=>Number(val(n)));if(nums.some(n=>!Number.isFinite(n)||n<0)||nums[2]<1||nums[2]>365){c.showToast("Enter valid hours and a maximum duration of 1–365 days.");return true}
db.availabilityPolicy={bufferHours:nums[0],minLeadHours:nums[1],maxDays:nums[2]};return save(c,"Demo availability policy updated; not enforced by backend.")}
if(mode==="offer"){amount=Number(val("amount"));if(!val("code")||!positive(amount)||!demoDate(val("expires"))){c.showToast("Enter a code, positive discount and valid expiry.");return true}if(val("type")==="Percent"&&amount>100){c.showToast("A percentage discount cannot exceed 100%.");return true}
if(db.offers.some(x=>x.code.toLowerCase()===val("code").toLowerCase())){c.showToast("That offer code already exists.");return true}
db.offers.unshift({id:"OF-"+t,code:val("code").toUpperCase(),type:val("type"),amount,status:"Draft",expires:val("expires")});return save(c,"Draft offer created; not applied to checkout.")}
if(mode==="refund"){var dep=db.deposits.find(x=>x.id===key);amount=Number(val("amount"));if(!dep||!positive(amount)||amount>dep.amount||!val("reason")){c.showToast("Enter an eligible deposit amount and reason.");return true}
if(db.refundReviews.some(x=>x.deposit===dep.id&&x.status!=="Rejected")){c.showToast("A refund review is already attached to this deposit.");return true}
db.refundReviews.unshift({id:"RR-"+t,deposit:dep.id,amount,reason:val("reason"),status:"Awaiting approval"});dep.status="Refund review";return save(c,"Refund decision requested; no payment was sent.")}
if(mode==="provision"){db.tenantTasks.unshift({id:"PR-"+t,company:val("company"),requestedPlan:val("plan"),notes:val("notes"),status:"Awaiting review"});return save(c,"Demo provisioning request created; no actual tenant.");}
if(mode==="tenant-plan"){x=db.tenants.find(z=>z.id===key);if(!x)return true;db.tenantTasks.unshift({id:"PR-"+t,company:x.name,requestedPlan:val("plan"),notes:"Subscription change review; currently "+x.plan,status:"Awaiting review"});return save(c,"Plan review created; current plan and billing unchanged.")}
if(mode==="platform-incident"){if(!val("subject")){c.showToast("Enter a platform incident summary.");return true}db.platformEvents.unshift({id:"INC-OPS-"+t,subject:val("subject"),severity:val("severity"),notes:val("notes"),status:"Open"});return save(c,"Example platform incident saved.")}
if(mode==="support-request"){if(!val("reason")){c.showToast("Support access must include a justification.");return true}db.supportAccess.unshift({id:"SAR-"+t,tenant:val("tenant"),reason:val("reason"),status:"Requested; no access",expiry:"Not granted"});return save(c,"Access request recorded; access NOT granted.")}
return true}
return false}
G.seed=seed;G.companyPage=companyPage;G.platformPage=platformPage;G.publicPage=publicPage;G.drawer=drawer;G.action=act;
window.SageGapV2=G;


/* __CONTINUE__ */
})();