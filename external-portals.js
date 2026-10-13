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
/* __CONTINUE__ */
})();