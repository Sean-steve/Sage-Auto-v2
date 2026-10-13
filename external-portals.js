/* Sage Auto V2 · P3-C · External experience prototypes. All data is fictional and browser-local. */
(function(){"use strict";
var M={},SIDES=["platform","renter","owner","driver","corporate","agent","service","marketing","branded","marketplace"];
var ORIGINAL={
tenants:[{id:"T-101",name:"Nairobi Drive",region:"Nairobi",plan:"Growth",status:"Active",fleet:5,contact:"operations@example.test"},{id:"T-102",name:"Safari Trails Rentals",region:"Nakuru",plan:"Starter",status:"Needs review",fleet:12,contact:"safari@example.test"},{id:"T-103",name:"Coastal Executive Cars",region:"Mombasa",plan:"Pro",status:"Active",fleet:16,contact:"coastal@example.test"},{id:"T-104",name:"Summit Mobility",region:"Kisumu",plan:"Starter",status:"Needs review",fleet:8,contact:"summit@example.test"}],
support:[{id:"SUP-01",from:"Safari Trails Rentals",topic:"Document verification review",priority:"Normal",status:"Open"},{id:"SUP-02",from:"Nairobi Drive",topic:"Website domain setup question",priority:"Low",status:"In progress"}],
requests:[{id:"RQ-01",customer:"Amina Wanjiku",booking:"SA-1042",type:"Rental extension",detail:"Request 1 extra day",status:"Pending review"}],
driverJobs:[{id:"DA-01",booking:"SA-1043",driver:"James Kiptoo",start:"13 Oct · 11:00",pickup:"Westlands Office",dropoff:"Nairobi CBD",status:"Assigned"},{id:"DA-02",booking:"SA-1045",driver:"James Kiptoo",start:"14 Oct · 08:30",pickup:"JKIA Terminal 1",dropoff:"Karen",status:"Assigned"}],
travel:[{id:"TR-101",employee:"Sarah Kamau",trip:"Client visit · Nairobi CBD",start:"2026-10-18",category:"SUV",cost:14500,status:"Awaiting approval"},{id:"TR-102",employee:"Paul Mutiso",trip:"Airport transfer",start:"2026-10-19",category:"Sedan",cost:12000,status:"Approved"}],
corporatePeople:[{id:"EMP-01",name:"Sarah Kamau",department:"Sales",status:"Active"},{id:"EMP-02",name:"Paul Mutiso",department:"Finance",status:"Active"},{id:"EMP-03",name:"Evelyn Muriuki",department:"Field Operations",status:"Active"}],
referrals:[{id:"RF-101",customer:"Asha M.",request:"Weekend SUV rental",operator:"Nairobi Drive",status:"Referred",commission:1800,lead:"L-02"},{id:"RF-102",customer:"Bright Logistics",request:"2 vehicles · 4 days",operator:"Nairobi Drive",status:"Confirmed",commission:3800,lead:"L-01"}],
serviceUpdates:[{id:"UP-01",work:"WO-014",stage:"Assigned",notes:"Awaiting workshop acceptance",evidence:[]}],
publicEnquiries:[],
savedVehicles:["V01"],
renterProfile:{name:"Amina Wanjiku",email:"amina@example.test",phone:"+254 700 210 100",notifications:true},
driverProfile:{name:"James Kiptoo",onDuty:true,verified:"Demo reviewed"},
supportDrafts:[],
operatorAlerts:[{id:"AL-01",company:"Nairobi Drive",title:"Website provisioning review",status:"Open"}],
portalAudit:[]
};
function seed(db){Object.keys(ORIGINAL).forEach(function(k){if(db[k]===undefined)db[k]=JSON.parse(JSON.stringify(ORIGINAL[k]))});}
function h(c,v){return c.esc(v)}
function ic(c,name){return c.ic(name,18)}
function money(c,n){return c.money(Number(n||0))}
function pill(c,text){return c.tag(text)}
function action(c,title,name,id,kind){return '<button type="button" class="button '+(kind||"secondary")+'" data-action="p3c:'+name+'" '+(id?'data-id="'+h(c,id)+'"':'')+'>'+title+'</button>'}
function mini(c,title,name,id){return '<button type="button" class="mini-action" data-action="p3c:'+name+'" data-id="'+h(c,id||"")+'">'+h(c,title)+' →</button>'}
function section(title,subtitle,body){return '<section class="card section-block"><div class="card-header"><div><h2>'+title+'</h2><p>'+subtitle+'</p></div></div>'+body+'</section>'}
function rows(headers,bodies){return '<div class="table-wrap"><table><thead><tr>'+headers.map(function(a){return '<th>'+a+'</th>'}).join("")+'</tr></thead><tbody>'+bodies.join("")+'</tbody></table></div>'}
function row(tds){return '<tr>'+tds.map(function(x){return '<td>'+x+'</td>'}).join("")+'</tr>'}
function metric(c,title,value,sub,icon){return c.stat(title,String(value),sub,icon||"grid")}
function counts(c,values){return '<div class="grid kpis">'+values.map(function(a){return metric(c,a[0],a[1],a[2],a[3])}).join("")+'</div>'}
function normal(c,title,subtitle,contents,primary,act){return c.header(title,subtitle,primary||"Explore work","p3c:"+(act||"explore"))+c.demo()+contents}
function head(c,title,sub){return '<div class="section-lead"><div><h2>'+h(c,title)+'</h2><p>'+h(c,sub)+'</p></div></div>'}
function notice(c,title,sub){return '<div class="notice">'+ic(c,"info")+'<div><strong>'+h(c,title)+'</strong><p>'+h(c,sub)+'</p></div></div>'}
function asset(c,v){return '<article class="vehicle-card"><div class="vehicle-visual green">'+c.vehicleSvg(v.color)+'</div><div class="detail-flex"><h3>'+h(c,v.name)+'</h3>'+pill(c,v.status)+'</div><div class="vehicle-meta">'+h(c,v.type)+' · '+h(c,v.location)+' · '+h(c,v.plate)+'</div><div class="detail-flex"><strong>'+money(c,v.rate)+' <small class="muted">/ day</small></strong>'+mini(c,"View car","open-car",v.id)+'</div></article>'}
function veh(c,id){return c.db.vehicles.find(function(v){return v.id===id})}
function linkedBookings(c){return c.db.bookings.filter(function(b){return b.customer==="Amina Wanjiku"})}
function ob(c){var ids=c.db.owners.filter(function(o){return o.name==="Mary Wambui"}).map(function(o){return o.vehicle});return c.db.vehicles.filter(function(v){return ids.indexOf(v.id)!==-1})}
function dates(c){return 'Example date · October 2026'}
function audit(c,type,detail){c.db.portalAudit.push({id:"AUD-"+Date.now(),side:c.state.portal,type,detail,time:"13 Oct 2026 · demo"})}
function persist(c,msg){c.save();c.state.modal=null;c.render();c.showToast(msg)}
function displayStates(c,items,label){return '<div class="flow-steps">'+items.map(function(s,i){return '<div class="flow-step"><span class="flow-number">'+String(i+1).padStart(2,"0")+'</span><div><strong>'+h(c,s[0])+'</strong><p>'+h(c,s[1])+'</p></div></div>'}).join("")+'</div>'}
function review(c,title,sub){return '<div class="detail-banner"><span class="eyebrow">CONNECTED EXPERIENCE</span><h2>'+h(c,title)+'</h2><p>'+h(c,sub)+'</p></div>'}
function field(c,label,name,placeholder,type,required){return '<div class="field"><label for="x-'+h(c,name)+'">'+h(c,label)+'</label><input id="x-'+h(c,name)+'" type="'+(type||"text")+'" name="'+h(c,name)+'" placeholder="'+h(c,placeholder||"")+'" '+(required?'required':"")+'></div>'}
function choice(c,label,name,values){return '<div class="field"><label for="x-'+h(c,name)+'">'+h(c,label)+'</label><select id="x-'+h(c,name)+'" name="'+h(c,name)+'">'+values.map(function(v){var pair=Array.isArray(v)?v:[v,v];return '<option value="'+h(c,pair[0])+'">'+h(c,pair[1])+'</option>'}).join("")+'</select></div>'}
function textarea(c,label,name,ph){return '<div class="field full"><label for="x-'+h(c,name)+'">'+h(c,label)+'</label><textarea id="x-'+h(c,name)+'" name="'+h(c,name)+'" rows="3" placeholder="'+h(c,ph)+'"></textarea></div>'}
function pane(c,title,subtitle,body,foot){return '<div class="modal-backdrop" data-action="close-outside"><section class="drawer" role="dialog" aria-modal="true" aria-label="'+h(c,title)+'"><div class="drawer-header"><div><div class="eyebrow">SAGE AUTO · INTERACTIVE DEMO</div><h2>'+h(c,title)+'</h2><p class="muted">'+h(c,subtitle)+'</p></div><button class="icon-button" data-action="close" aria-label="Close">'+ic(c,"close")+'</button></div><div class="drawer-body">'+body+'</div><div class="drawer-footer">'+action(c,"Close","close")+foot+'</div></section></div>'}
function data(c,name,details){return '<div class="task-row"><span class="muted">'+h(c,name)+'</span><strong style="margin-left:auto;text-align:right">'+h(c,details)+'</strong></div>'}
function isOverview(c){return c.state.page==="Overview"}
function relatedTable(c,items,headers,mapper){return rows(headers,items.map(mapper))}
function empty(c,label,text){return '<div class="empty-state">'+ic(c,"file")+'<strong>'+h(c,label)+'</strong><p>'+h(c,text)+'</p></div>'}

/* RENTER: review live mock booking records from shared company store, never expose other customers. */
function renter(c){var page=c.state.page,bookings=linkedBookings(c),active=bookings.filter(function(b){return b.status==="Active"}),pending=c.db.requests.filter(function(r){return r.customer===c.db.renterProfile.name});
if(page==="Overview")return normal(c,"Good to see you, Amina","Your rental journey, documents and next steps are all here.",
counts(c,[["My bookings",bookings.length,"Your example reservations","calendar"],["Vehicle in my care",active.length,"Rental handover completed","car"],["Requests under review",pending.filter(function(r){return r.status==="Pending review"}).length,"Operator follow-ups","clock"],["Saved vehicles",c.db.savedVehicles.length,"Compare later","shield"]])+
'<div class="grid two-columns">'+section("Your current drive","Every key detail, without a phone call",
active.length?active.map(function(b){var v=veh(c,b.vehicle);return '<div class="trip-highlight"><div class="vehicle-visual green">'+c.vehicleSvg(v.color)+'</div><h2>'+h(c,v.name)+'</h2><p class="muted">'+h(c,v.plate)+' · '+h(c,b.id)+'</p>'+data(c,"Rental status",b.status)+data(c,"Pickup",b.date)+data(c,"Example rental",money(c,b.total))+'<div class="row-actions">'+action(c,"Rental details","booking",b.id,"primary")+action(c,"Request extension","extend",b.id)+'</div></div>'}).join(""):empty(c,"No active drive","Your next reservation will appear here once handed over."))+
section("Next steps","What happens before and after the rental",displayStates(c,[["Confirm reservation","Operator verifies payment and booking."],["Pick up vehicle","Check contract, driver details and inspection."],["Drive confidently","See your rental, support and time remaining."],["Return & finalize","Review charges, deposit and completed documents."]]))+'</div>'+
head(c,"My reservations","Only records linked to this example renter are visible.")+renterBookings(c,bookings);
if(page==="My bookings")return normal(c,"My bookings","Track outstanding requirements and confirmed reservations.",renterBookings(c,bookings)+notice(c,"Booking statuses are distinct","Awaiting payment, Confirmed, Active and Completed all mean different things. A request for an extension never modifies a rental until approved."),"Explore vehicles","page:Explore vehicles");
if(page==="My rentals")return normal(c,"Rental details","Vehicles handed over and the next actions required.",
renterBookings(c,bookings.filter(function(b){return b.status==="Active"||b.status==="Completed"}))+
section("Rental assistance","Make a request without changing the rental directly",'<div class="quick-actions">'+action(c,"Request extension","extend",active[0]?.id||bookings[0]?.id)+action(c,"Send support message","message")+action(c,"Review documents","page:Documents")+'</div>'),"Contact operator","message");
if(page==="Explore vehicles")return normal(c,"Explore vehicles","Compare eligible example vehicles and save favourites.",
'<div class="grid listing-grid">'+c.db.vehicles.filter(function(v){return v.status==="Available"&&v.compliant}).map(asset.bind(null,c)).join("")+'</div><div class="quick-actions">'+action(c,"View saved vehicles","page:My bookings")+'</div>'+
notice(c,"Booking request, not guaranteed availability","An enquiry will be delivered to the demo operator pipeline. No vehicle is automatically reserved by opening the catalogue."),"Request a booking","request-car");
if(page==="Documents")return normal(c,"My documents","Contracts, verification, inspections and rental records in one place.",
section("Rental documents","Example read-only documents — not signed originals",relatedTable(c,bookings,["Reference","Document","Status","Action"],function(b){return row([h(c,b.id),"Rental terms & condition report",pill(c,b.status==="Active"?"View available":"Preview only"),mini(c,"View summary","booking",b.id)])}))+notice(c,"Personal data and signatures","PDF contracts, signed checklists and identity files will be secured and delivered by the production backend."),"My bookings","page:My bookings");
if(page==="Payments")return normal(c,"Payments & deposits","Review the amounts attached to your own rental.",
relatedTable(c,bookings,["Booking","Rental amount","Recorded receipt","Deposit","State"],function(b){var r=c.db.ledger.filter(function(x){return x.booking===b.id}).reduce(function(s,x){return s+x.amount},0),d=c.db.deposits.find(function(x){return x.booking===b.id});return row([h(c,b.id),money(c,b.total),money(c,r),d?money(c,d.amount)+" · "+h(c,d.status):"Not recorded",pill(c,b.status)])})+
notice(c,"No payment initiation","The renter prototype displays operator-side mock ledger entries. It does not collect money, card details or M-Pesa PINs."),"Ask about a payment","message");
if(page==="Messages")return normal(c,"Messages","Requests and updates in one place.",
communications(c,"renter")+section("Send a request","Questions go into the demo message log.",'<div class="quick-actions">'+action(c,"Message operator","message",null,"primary")+action(c,"Request extension","extend",active[0]?.id||bookings[0]?.id)+'</div>'),"Write message","message");
if(page==="Profile")return normal(c,"My profile","Personal preferences and verification status.",
section("Account profile","This account is fictional. No authentication is connected.",'<div class="pad-22">'+data(c,"Name",c.db.renterProfile.name)+data(c,"Email",c.db.renterProfile.email)+data(c,"Phone",c.db.renterProfile.phone)+data(c,"Notification preference",c.db.renterProfile.notifications?"Enabled":"Paused")+action(c,"Toggle demo notifications","notification")+'</div>')+notice(c,"Account security","Real document verification, session security and data privacy are part of the backend reconciliation phase."),"Browse vehicles","page:Explore vehicles");
return fallback(c,"renter")}
function renterBookings(c,arr){return section("My rental history","Details and next steps from the operator's shared sample records",
arr.length?relatedTable(c,arr,["Reservation","Vehicle","Dates","Price","State","Action"],function(b){var v=veh(c,b.vehicle);return row(['<strong>'+h(c,b.id)+'</strong><div class="row-secondary">'+h(c,b.channel)+'</div>',h(c,v?.name||"Vehicle"),h(c,b.date)+" · "+h(c,b.days)+" days",money(c,b.total),pill(c,b.status),mini(c,"Details","booking",b.id)])}):empty(c,"No bookings yet","Send your first enquiry through a branded storefront."))}
function communications(c,side){var notes=c.db.portalAudit.filter(function(a){return a.side===side&&/message|request|reply|extension/i.test(a.type)}).slice(-8).reverse();
return section("Communication history","Sample requests and recorded actions",
notes.length?'<div class="activity-list">'+notes.map(function(a){return '<div class="task-row"><div class="task-details"><strong>'+h(c,a.type)+'</strong><small>'+h(c,a.detail)+' · '+h(c,a.time)+'</small></div>'+pill(c,"Demo logged")+'</div>'}).join("")+'</div>':empty(c,"Nothing new to read","Start a mock conversation to see the request appear here."))}
function owner(c){var page=c.state.page,owned=ob(c),owner=c.db.owners.find(function(x){return x.name==="Mary Wambui"}),payouts=c.db.payouts.filter(function(x){return x.owner===owner?.name}),rents=c.db.bookings.filter(function(b){return owned.some(function(v){return v.id===b.vehicle})});
if(page==="Overview")return normal(c,"Your vehicles. A clearer view.","See how your managed vehicles are being used and what is owed to you.",
counts(c,[["Managed vehicles",owned.length,"Under your agreement","car"],["Active rentals",rents.filter(function(b){return b.status==="Active"}).length,"In operator possession cycle","calendar"],["Pending owner due",money(c,payouts.filter(function(p){return p.status==="Pending"}).reduce(function(s,p){return s+p.amount},0)),"Example settlement","wallet"],["Owner share",owner?.share+"%","Example contract terms","file"]])+
'<div class="grid two-columns">'+section("Your assets","Restricted to this example owner's assigned vehicles",'<div class="pad-22">'+owned.map(function(v){return '<div class="task-row"><span class="task-initial">'+ic(c,"car")+'</span><div class="task-details"><strong>'+h(c,v.name)+'</strong><small>'+h(c,v.plate)+" · "+h(c,v.location)+'</small></div>'+pill(c,v.status)+mini(c,"View","owner-car",v.id)+'</div>'}).join("")+'</div>')+
section("Money and agreements","Your contract and payout visibility",'<div class="pad-22">'+data(c,"Current owner share",owner?.share+"%")+data(c,"Agreement",owner?.agreement||"Not found")+data(c,"Payouts in history",String(payouts.length))+'<div class="quick-actions">'+action(c,"Review settlements","page:Statements",null,"primary")+action(c,"See agreement","page:Agreements")+'</div></div>')+'</div>',
"View statements","page:Statements");
if(page==="My vehicles")return normal(c,"My vehicles","Review only the vehicles covered by your ownership agreement.",'<div class="grid listing-grid">'+owned.map(asset.bind(null,c)).join("")+'</div>'+notice(c,"Owner versus operator","The car hire company controls commercial availability, handover and compliance. Vehicle owners see permitted records but do not bypass company workflow."),"See activity","page:Rental activity");
if(page==="Rental activity")return normal(c,"Rental activity","A transparent record of bookings involving your vehicle.",section("Bookings affecting your assets","Sample activity linked to your owner agreement",relatedTable(c,rents,["Booking","Vehicle","Rental state","Gross rent","Action"],function(b){return row([h(c,b.id),h(c,veh(c,b.vehicle)?.name),pill(c,b.status),money(c,b.total),mini(c,"Review","owner-booking",b.id)])})),"Statements","page:Statements");
if(page==="Earnings"||page==="Statements")return normal(c,page==="Earnings"?"Owner earnings":"Settlement statements","Review calculations, agreement share and payout state.",
counts(c,[["Payout entries",payouts.length,"Example statements","file"],["Pending",money(c,payouts.filter(function(p){return p.status==="Pending"}).reduce(function(s,p){return s+p.amount},0)),"Not yet paid","clock"],["Recorded paid",money(c,payouts.filter(function(p){return p.status==="Paid"}).reduce(function(s,p){return s+p.amount},0)),"Demo status only","wallet"],["Agreement share",owner?.share+"%","Not a payout formula","shield"]])+
section("My statements","Read-only operator payout records",relatedTable(c,payouts,["Statement","Asset","Amount","Status","Action"],function(p){return row([h(c,p.id),h(c,p.vehicle),money(c,p.amount),pill(c,p.status),mini(c,"View","statement",p.id)])}))+notice(c,"Settlement transparency","Payment records are operator-generated. Approval and actual payout are distinct from viewing an owner's statement."),"See agreement","page:Agreements");
if(page==="Agreements")return normal(c,"Vehicle agreement","Know the rights, obligations and commercial terms for each asset.",
section("Owner agreement · example",'<div class="pad-22">'+data(c,"Owner",owner?.name)+data(c,"Managed car",h(c,veh(c,owner?.vehicle)?.name||"Vehicle"))+data(c,"Owner revenue share",(owner?.share||0)+"%")+data(c,"Operator revenue share",(100-(owner?.share||0))+"%")+data(c,"Agreement status",owner?.agreement||"Unavailable")+'</div>')+
notice(c,"Formal contracts","This display is not a legally executed agreement, a contract amendment or guaranteed net earnings."),"View earnings","page:Earnings");
if(page==="Service updates")return normal(c,"Service & readiness","Maintenance events affecting your own assets.",section("Work affecting managed vehicles","Read-only partner service information",
c.db.works.filter(function(w){return owned.some(function(v){return v.id===w.vehicle})}).length?relatedTable(c,c.db.works.filter(function(w){return owned.some(function(v){return v.id===w.vehicle})}),["Vehicle","Service","Status","Provider"],function(w){return row([h(c,veh(c,w.vehicle)?.name),h(c,w.task),pill(c,w.status),h(c,w.supplier)])}):empty(c,"No new service updates","Your vehicles have no recorded maintenance jobs in this demonstration.")),"My vehicles","page:My vehicles");
if(page==="Profile")return normal(c,"Owner profile","Your approved relationship with the operating company.",section("Account details","Read-only sample identity",'<div class="pad-22">'+data(c,"Owner",owner?.name)+data(c,"Phone",owner?.phone)+data(c,"Email",owner?.email)+data(c,"Agreement",owner?.agreement)+'</div>')+notice(c,"Only permitted data","Production owner access will be secured by vehicle-owner associations, tenant boundaries and explicit permissions."),"Agreements","page:Agreements");
return fallback(c,"owner")}

/* DRIVER: professional mobile-friendly work queue; operator remains handover authority. */
function driver(c){var p=c.state.page,jobs=c.db.driverJobs.filter(function(x){return x.driver===c.db.driverProfile.name}),today=jobs.filter(function(x){return x.status!=="Completed"});
var listing=section("Assigned journeys","Pickup, route and next instructions",relatedTable(c,jobs,["Assignment","Customer / vehicle","Pickup","Progress","Action"],function(j){var b=c.db.bookings.find(function(x){return x.id===j.booking});return row(['<strong>'+h(c,j.id)+'</strong>',h(c,b?.customer||"Customer")+"<div class='row-secondary'>"+h(c,veh(c,b?.vehicle)?.name||"Vehicle")+"</div>",h(c,j.start)+"<div class='row-secondary'>"+h(c,j.pickup)+"</div>",pill(c,j.status),mini(c,"Review","driver-job",j.id)])}));
if(p==="Overview")return normal(c,"Your next assignment starts here","Get pickup details, know what to do, and keep your operator updated.",
counts(c,[["Assigned trips",today.length,"Open work items","calendar"],["On duty",c.db.driverProfile.onDuty?"Yes":"No","Your example availability","clock"],["Completed jobs",jobs.filter(function(j){return j.status==="Completed"}).length,"Trip history","car"],["Demo status",c.db.driverProfile.verified,"No real credential checks","shield"]])+
review(c,"Be prepared before every pickup","Confirm vehicle, location, contact instructions and the company handover process before a trip.")+
listing,"Open assignments","page:Assignments");
if(p==="Assignments"||p==="Trip details")return normal(c,p,"All trips and status updates in one organized queue.",listing+
notice(c,"Assignment updates are not vehicle transfers","Accepting a driver's task does not confirm customer identity, sign contracts or change the rental's possession state."),"Update availability","page:Availability");
if(p==="Vehicle handover")return normal(c,"Pickup & handover","Checklist responsibilities and the correct escalation path.",
displayStates(c,[["Receive assignment","See assigned car, pickup and operator instructions."],["Check vehicle condition","Record fuel, photos and existing issues."],["Confirm operator release","Company controls verified handover and rental state."],["Report completion","Provide status and raise any discrepancy."]])+
section("Pickup queue","Driver cannot override company checks",relatedTable(c,jobs.filter(function(j){return j.status!=="Completed"}),["Assignment","Pickup","Status","Action"],function(j){return row([h(c,j.id),h(c,j.pickup),pill(c,j.status),mini(c,"Open checklist","driver-job",j.id)])})),"See assignments","page:Assignments");
if(p==="Availability")return normal(c,"Driver availability","Make your working availability visible to dispatch.",
section("Duty status","A mock toggle to demonstrate driver scheduling",'<div class="pad-22">'+data(c,"Currently on duty",c.db.driverProfile.onDuty?"Available for assignments":"Off duty")+action(c,c.db.driverProfile.onDuty?"Go off duty":"Go on duty","duty",null,"primary")+'</div>')+
notice(c,"Dispatch rules","Production dispatch needs validated working hours, licence eligibility, conflicts, rest periods and service-area boundaries."),"Assignments","page:Assignments");
if(p==="Documents")return normal(c,"Driver documents","Licence verification, assignments and necessary operator records.",
section("Driver verification","Demo only",'<div class="pad-22">'+data(c,"Driver",c.db.driverProfile.name)+data(c,"Verification",c.db.driverProfile.verified)+data(c,"Assigned jobs",String(jobs.length))+'</div>')+
notice(c,"Verification cannot be self-approved","Driver licence, insurance coverage and legal eligibility must be assessed by authorized operator staff."),"My trips","page:Assignments");
if(p==="Earnings")return normal(c,"Earnings & allowances","Driver compensation is separate from rental revenue.",
section("Job-based compensation","No payroll or driver payout integration",relatedTable(c,jobs,["Trip","Date","Job","Allowance","Payment"],function(j){return row([h(c,j.id),h(c,j.start),h(c,j.pickup)+" → "+h(c,j.dropoff),money(c,j.allowance||0),pill(c,(j.allowance||0)?"Estimated":"Not configured")])}))+
notice(c,"No wage inference","A completed rental does not imply a driver was paid; payroll and allowances require separate agreements."),"Assignments","page:Assignments");
if(p==="Messages")return normal(c,"Dispatch messages","Keep an accountable channel for vehicle and trip updates.",communications(c,"driver")+
'<div class="quick-actions">'+action(c,"Send dispatch update","message",null,"primary")+'</div>',"Message dispatcher","message");
return fallback(c,"driver")}
/* CORPORATE: employee requests first; approval isn't a rental booking. */
function corporate(c){var p=c.state.page,travel=c.db.travel,waiting=travel.filter(function(x){return x.status==="Awaiting approval"}),approved=travel.filter(function(x){return x.status==="Approved"});
var requests=section("Business travel requests","Employee, dates, approval and operator follow-through",
relatedTable(c,travel,["Request","Employee","Purpose","Date","Estimate","State","Action"],function(t){return row([h(c,t.id),h(c,t.employee),h(c,t.trip),h(c,t.start),money(c,t.cost),pill(c,t.status),t.status==="Awaiting approval"?mini(c,"Review","travel",t.id):mini(c,"Details","travel",t.id)])}));
if(p==="Overview")return normal(c,"Business mobility, made simple","Control team requests, approvals, reservations and consolidated billing.",
counts(c,[["Pending approvals",waiting.length,"Need your decision","alert"],["Approved travel",approved.length,"Awaiting operator fulfilment","calendar"],["Linked employees",c.db.corporatePeople.length,"Mock business directory","users"],["Approved estimates",money(c,approved.reduce(function(a,b){return a+b.cost},0)),"Not an invoice","wallet"]])+
'<div class="grid two-columns">'+requests+section("Your travel policy","Approval happens before operator booking",displayStates(c,[["Employee request","Choose destination, category and date."],["Company approval","Manager approves internal travel spend."],["Operator reservation","Actual fleet confirmation and contract follow."],["Company reporting","Invoices and travel history become visible."]]))+'</div>',"New request","travel-new");
if(p==="Travel requests"||p==="Approvals")return normal(c,p==="Approvals"?"Travel approvals":"Employee travel requests",
"Requests need clear authority before they reach the operator.",
requests+notice(c,"Important separation","Corporate approval does not guarantee the car, price or reservation. A demo lead is sent to the operator pipeline only after approval."),p==="Approvals"?"New request":"Create travel request","travel-new");
if(p==="Reservations")return normal(c,"Corporate reservations","Track approved requests and their actual operator fulfilment state.",
section("Approved corporate requests","Approval does not mean an issued vehicle contract",relatedTable(c,approved,["Employee","Request","Category","Date","Operator status"],function(t){return row([h(c,t.employee),h(c,t.id),h(c,t.category),h(c,t.start),pill(c,"Awaiting reservation")])}))+
notice(c,"Operator handoff","When we marry the backend, confirmed fleet allocations and invoices will link to the original company approval request."),"New travel request","travel-new");
if(p==="Employees")return normal(c,"Employees & travellers","Staff accounts, departments and travel permissions.",
section("Corporate traveller directory","Sample employee records",relatedTable(c,c.db.corporatePeople,["Employee","Department","Account","Action"],function(x){return row([h(c,x.name),h(c,x.department),pill(c,x.status),mini(c,"View","corporate-person",x.id)])}))+
'<div class="quick-actions">'+action(c,"Add employee","employee-new",null,"primary")+'</div>',"Add employee","employee-new");
if(p==="Invoices")return normal(c,"Corporate invoices","Separate expected rental spend from actual financial documents.",
section("Expense overview","Approved travel estimates — not invoices",relatedTable(c,approved,["Request","Purpose","Estimated amount","Invoice status"],function(t){return row([h(c,t.id),h(c,t.trip),money(c,t.cost),pill(c,"Not issued")])}))+
notice(c,"No fabricated invoices","Invoices must be generated from the operator's actual finance system after correct booking and tax validation."),"Travel reports","page:Reports");
if(p==="Reports")return normal(c,"Corporate travel insights","Department and request status reporting based on mock records.",
counts(c,[["Total requests",travel.length,"Sample entries","calendar"],["Pending",waiting.length,"Needs approval","clock"],["Approved",approved.length,"Awaiting operator","shield"],["Estimated total",money(c,travel.reduce(function(s,t){return s+t.cost},0)),"Not actual spend","wallet"]])+
section("Travel categories","Requests grouped by requested vehicle",'<div class="quick-actions">'+["SUV","Sedan","Van"].map(function(cat){return '<span class="pill">'+cat+' · '+travel.filter(function(t){return t.category===cat}).length+'</span>'}).join("")+'</div>'),"Travel requests","page:Travel requests");
if(p==="Account settings")return normal(c,"Corporate account","Business account roles, travel policy and billing contacts.",
section("Example account","A single corporate account workspace",'<div class="pad-22">'+data(c,"Company","Acacia Holdings Ltd (demo)")+data(c,"Approvals",String(waiting.length)+" outstanding")+data(c,"Policy","Approval required")+data(c,"Billing","Operator invoice after fulfilment")+'</div>')+
notice(c,"Authorization","Approvers must have real corporate permissions. No user can grant their own production booking approval by changing a browser value."),"Approvals","page:Approvals");
return fallback(c,"corporate")}
/* AGENTS: referral belongs to agent; operator lead remains independent. */
function agent(c){var p=c.state.page,ref=c.db.referrals,outstanding=ref.filter(function(r){return r.status!=="Paid"}),commission=ref.reduce(function(a,r){return a+Number(r.commission||0)},0);
var reg=section("Referral register","Operator attribution, next status and example commission",relatedTable(c,ref,["Referral","Client","Request","Operator","State","Commission","Action"],function(x){return row([h(c,x.id),h(c,x.customer),h(c,x.request),h(c,x.operator),pill(c,x.status),money(c,x.commission),mini(c,"Review","referral",x.id)])}));
if(p==="Overview")return normal(c,"Your business, connected","Manage agent-generated demand and commission without losing attribution.",
counts(c,[["Client referrals",ref.length,"Sample agent opportunities","users"],["Confirmed leads",ref.filter(function(x){return x.status==="Confirmed"}).length,"Needs operator settlement","shield"],["Example commission",money(c,commission),"Not earned cash","wallet"],["Partner operators",1,"Illustrative operator network","briefcase"]])+
reg,"Create a referral","referral-new");
if(p==="New referral")return normal(c,"Create referral","Submit an enquiry to the operator, without inventing a confirmed booking.",
review(c,"Capture what matters","Customer, service request, operator and source attribution stay linked.")+
section("Referral action","A new lead will appear on the company Leads & enquiries screen.",'<div class="pad-22">'+action(c,"Start referral","referral-new",null,"primary")+'</div>'),"Start referral","referral-new");
if(p==="Leads"||p==="Reservations")return normal(c,p,"Track linked referrals from enquiry to operator confirmation.",
reg+notice(c,"Lead ≠ booking","An agent referral remains an enquiry until the operator verifies vehicle availability, price, customer and payment."),"New referral","referral-new");
if(p==="Commissions"||p==="Payouts")return normal(c,p,"See expected compensation and payout requirements.",
counts(c,[["Referral value",money(c,commission),"Illustrative agreed commission","wallet"],["Confirmed referrals",ref.filter(function(x){return x.status==="Confirmed"}).length,"Not automatically payable","shield"],["Outstanding entries",outstanding.length,"No money was sent","clock"],["Payment provider","Disconnected","No real payout rail","alert"]])+
reg+notice(c,"Attribution is not settlement","Real agent payout requires contract entitlement, completed eligible rentals, accounting and authorized disbursement."),"Referrals","page:Leads");
if(p==="Partners")return normal(c,"Partner operators","Rental operators that accept agent-sourced enquiries.",
section("Connected demo company","No production partner onboarding performed",'<div class="pad-22">'+data(c,"Operator","Nairobi Drive")+data(c,"Region","Nairobi, Kenya")+data(c,"Agent access","Illustrative only")+action(c,"Submit referral","referral-new",null,"primary")+'</div>'),"New referral","referral-new");
if(p==="Profile")return normal(c,"Agent profile","Identity, channel, commercial agreement and commission terms.",
section("Agency account","Sample partner profile",'<div class="pad-22">'+data(c,"Agency","Peak Travel Partners (demo)")+data(c,"Primary market","Kenya")+data(c,"Commission","Per approved referral agreement")+data(c,"Verification","No live KYC connected")+'</div>')+
notice(c,"Privacy","Agent users will only see their own leads, attribution and commissions once server-side access policies are implemented."),"Referrals","page:Leads");
return fallback(c,"agent")}
/* SERVICE: workshop progress is not the operator's maintenance approval. */
function partner(c){var p=c.state.page,work=c.db.works.filter(function(w){return w.supplier==="City Auto Care"}),updates=c.db.serviceUpdates,open=work.filter(function(w){return w.status!=="Completed"});
var jobs=section("Service jobs","Track acceptance, evidence and operator close-out",relatedTable(c,work,["Work order","Vehicle","Requested work","Due","Operator state","Partner action"],function(w){var up=updates.find(function(x){return x.work===w.id});return row([h(c,w.id),h(c,veh(c,w.vehicle)?.name),h(c,w.task),h(c,w.due),pill(c,w.status),mini(c,up?.stage||"Open","service-job",w.id)])}));
if(p==="Overview")return normal(c,"Today's service desk","Your assigned jobs, due dates and evidence in one view.",
counts(c,[["Jobs assigned",work.length,"From demo operators","wrench"],["Open work orders",open.length,"Need progress updates","clock"],["Awaiting evidence",work.filter(function(w){return !(updates.find(function(u){return u.work===w.id})?.evidence||[]).length}).length,"Attach service proof","file"],["Estimated work value",money(c,work.reduce(function(a,b){return a+Number(b.cost||0)},0)),"Not a paid invoice","wallet"]])+
jobs,"View jobs","page:Assigned jobs");
if(p==="Assigned jobs"||p==="Work orders")return normal(c,p,"Only jobs assigned to this example workshop are visible.",
jobs+notice(c,"Ownership of approval","The workshop may submit an update or evidence; only the rental operator should accept the repairs and restore full rental readiness."),"Upload evidence","page:Job evidence");
if(p==="Inspections")return normal(c,"Service inspections","Attach service condition evidence without altering a rental inspection.",
section("Assigned vehicle reviews","Open the related service job",relatedTable(c,work,["Vehicle","Work order","Description","Action"],function(w){return row([h(c,veh(c,w.vehicle)?.name),h(c,w.id),h(c,w.task),mini(c,"Record evidence","service-job",w.id)])})),"Work orders","page:Work orders");
if(p==="Job evidence")return normal(c,"Job evidence","Record findings, reference filenames and follow-up.",
section("Evidence attached to work orders","Metadata only; no file bytes saved",relatedTable(c,work,["Work","Service progress","Evidence references","Action"],function(w){var up=updates.find(function(x){return x.work===w.id});return row([h(c,w.id),pill(c,up?.stage||"Assigned"),String(up?.evidence?.length||0),mini(c,"Update job","service-job",w.id)])}))+
notice(c,"Media security","Production requires safe document uploads, signed storage URLs, file scanning, tenant restrictions and audit logs."),"Assigned jobs","page:Assigned jobs");
if(p==="Invoices")return normal(c,"Service invoices","Review estimated work and submit supporting charges to the operator.",
section("Work order estimates","Not approved invoices or cash received",relatedTable(c,work,["Work","Description","Estimate","State"],function(w){return row([h(c,w.id),h(c,w.task),money(c,w.cost),pill(c,w.status)])}))+
notice(c,"Invoice approval","The operator owns expense approval and invoice reconciliation. This prototype cannot pay a supplier."),"View work orders","page:Work orders");
if(p==="Messages")return normal(c,"Operator communication","Ask questions and document job status.",communications(c,"service")+
'<div class="quick-actions">'+action(c,"Send service update","message",null,"primary")+'</div>',"Send message","message");
return fallback(c,"service")}
/* __CONTINUE__ */


})();