/* Sage Auto V2 / P3-F · operational UX, mock-only state. */
(function(){"use strict";
const M={},KEY="sage-auto-v2-p3f",defaults={mode:"work",density:"compact",focus:"Operations",branch:"All",lane:"All",sidebarMini:false,groups:{"WORKSPACE":true,"OPERATIONS":true,"BUSINESS":false,"MANAGE":false},marked:[],selected:[],help:false};
const p=JSON.parse(JSON.stringify(defaults));
const h=(c,x)=>c.esc(String(x??"")),icon=(c,n)=>c.ic(n,16);
const btn=(a,s,cl="op-btn",id)=>'<button type="button" class="'+cl+'" data-action="'+a+'"'+(id?' data-id="'+id+'"':'')+'>'+s+'</button>';
const money=(c,x)=>c.money(Number(x||0)),vehicle=(c,id)=>c.db.vehicles.find(v=>v.id===id);
function load(){try{let x=JSON.parse(localStorage.getItem(KEY)||"null");if(x&&typeof x==="object"){for(let k of ["mode","density","focus","branch","lane","sidebarMini","groups","marked"])if(k in x)p[k]=x[k]}}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify({mode:p.mode,density:p.density,focus:p.focus,branch:p.branch,lane:p.lane,sidebarMini:p.sidebarMini,groups:p.groups,marked:p.marked}))}catch(e){}}
function scoped(c){const vehicles=c.db.vehicles.filter(v=>p.branch==="All"||v.location===p.branch),ids=new Set(vehicles.map(v=>v.id));
const bookings=c.db.bookings.filter(b=>ids.has(b.vehicle));
const related=e=>{if(p.branch==="All")return true;const b=c.db.bookings.find(x=>x.id===(e.booking||e.reference));return !!b&&ids.has(b.vehicle)};
const incidents=(c.db.incidents||[]).filter(related),requests=(c.db.requests||[]).filter(related);
return {vehicles,bookings,incidents,requests,unpaid:bookings.filter(b=>b.status==="Awaiting payment").length,confirmed:bookings.filter(b=>b.status==="Confirmed").length,active:bookings.filter(b=>b.status==="Active").length,ready:vehicles.filter(v=>v.status==="Available"&&v.compliant).length,maintenance:vehicles.filter(v=>v.status==="Maintenance"||!v.compliant).length,incOpen:incidents.filter(e=>e.status==="Open").length,requestOpen:requests.filter(e=>e.status==="Pending review").length}}
function navigation(c,portal){if(c.state.portal!=="company")return null;
const k=scoped(c),badges={"Bookings":k.unpaid,"Customer requests":k.requestOpen,"Incidents & assistance":k.incOpen,"Finance & payments":k.unpaid,"Contracts & handover":k.confirmed,"Returns & charges":k.active,"Maintenance":k.maintenance};
const icons={"Overview":"layout","Bookings":"calendar","Customer requests":"clock","Incidents & assistance":"alert","Finance & payments":"wallet","Contracts & handover":"shield","Returns & charges":"car","Maintenance":"wrench","Fleet":"car","Availability":"calendar"};
const pins=window.SageStudioV2?.prefs?.favourites||[];
return '<div class="op-nav-super">'+btn("ops:sidebar",icon(c,"layers")+'<span class="op-nav-label">'+(p.sidebarMini?"Expand":"Collapse")+" sidebar</span>","op-nav-size")+'</div>'+
(pins.length?'<div class="op-nav-pinned"><span class="op-nav-pinned-title">PINNED</span>'+pins.filter(x=>portal.nav.some(g=>g[1].includes(x))).slice(0,5).map(x=>'<button type="button" class="nav-item '+(c.state.page===x?"active":"")+'" data-action="nav" data-value="'+h(c,x)+'" title="'+h(c,x)+'">'+icon(c,icons[x]||"layers")+'<span class="op-nav-label">'+h(c,x)+'</span></button>').join("")+'</div>':"")+
portal.nav.map(([group,pages])=>{const expanded=p.groups[group]!==false;return '<section class="op-nav-group">'+btn("ops:group:"+group,'<span class="op-group-label">'+h(c,group)+'</span><span aria-hidden="true">'+(expanded?"−":"+")+'</span>',"op-nav-group-trigger")+'<div class="op-nav-items" '+(expanded?"":"hidden")+'>'+pages.map(x=>{const n=badges[x]||0;return '<button type="button" class="nav-item '+(c.state.page===x?"active":"")+'" data-action="nav" data-value="'+h(c,x)+'" title="'+h(c,x)+'" aria-label="'+h(c,x)+(n?", "+n+" need attention":"")+'">'+icon(c,icons[x]||"layers")+'<span class="op-nav-label">'+h(c,x)+'</span>'+(n?'<span class="op-nav-badge">'+n+'</span>':"")+'</button>'}).join("")+'</div></section>'}).join("")}
function toolbar(c,html){if(c.state.portal!=="company")return html;const k=scoped(c),urgent=k.unpaid+k.incOpen+k.requestOpen;
return html.replace('<main class="page" id="main-content">','<main class="page" id="main-content"><div class="op-toolbar"><span><i aria-hidden="true">✳</i> '+h(c,c.state.page)+' <small>· Company workspace</small></span><div>'+ (urgent?btn("ops:attention",urgent+" items need review","op-alert-nav"):"")+btn("new-booking","＋ Create booking","op-top-cta")+btn("studio:theme","Theme","op-top-theme")+'</div></div>')}
function header(c){const branches=["All",...new Set(c.db.vehicles.map(v=>v.location))];
return '<header class="op-header"><div><span class="op-eyebrow">SAGE AUTO / BUSINESS OPERATIONS</span><h1>Today’s priorities<span>, in focus.</span></h1><p>Reservations and operational exceptions—with a clear next action.</p></div><div class="op-header-controls"><label>Location<select id="ops-branch" aria-label="Branch scope">'+branches.map(x=>'<option value="'+h(c,x)+'" '+(p.branch===x?"selected":"")+'>'+h(c,x==="All"?"All locations":x)+'</option>').join("")+'</select></label><label>Focus <small>(preview only)</small><select id="ops-focus" aria-label="Workspace focus">'+["Operations","Finance","Fleet"].map(x=>'<option value="'+x+'" '+(p.focus===x?"selected":"")+'>'+x+'</option>').join("")+'</select></label>'+btn("ops:mode",p.mode==="work"?"Welcome":"Work mode","op-head-btn")+btn("ops:density",p.density==="compact"?"Comfortable":"Compact","op-head-btn")+'</div></header>'}
function metric(c,k){let list=[["payments",k.unpaid,"Payments to review","Waiting on reconciliation","wallet"],["handover",k.confirmed,"Upcoming handovers","Confirmed collections","car"],["incidents",k.incOpen,"Open incidents","Requires triage","alert"],["requests",k.requestOpen,"Customer requests","Changes awaiting review","clock"],["ready",k.ready,"Fleet ready","Available and compliant","shield"]];
if(p.focus==="Finance")list.sort((a,b)=>Number(b[0]==="payments")-Number(a[0]==="payments"));
if(p.focus==="Fleet")list.sort((a,b)=>Number(b[0]==="ready")-Number(a[0]==="ready"));
return '<section class="op-metrics" aria-label="Clickable operational KPIs">'+list.map(([id,n,title,sub,ico])=>btn("ops:metric:"+id,'<span class="op-metric-icon">'+icon(c,ico)+'<i>↗</i></span><strong>'+n+'</strong><span class="op-metric-name">'+title+'</span><small>'+sub+'</small>',"op-metric op-"+id)).join("")+'</section>'}
function workboard(c,k){let stages=["All","Awaiting payment","Confirmed","Active","Completed"],bks=k.bookings.filter(b=>p.lane==="All"||b.status===p.lane);const rank={"Awaiting payment":0,"Confirmed":1,"Active":2,"Completed":3};
bks=bks.slice().sort((a,b)=>(rank[a.status]||0)-(rank[b.status]||0));
const selected=p.selected.filter(x=>bks.some(b=>b.id===x));
const filters=stages.map(x=>btn("ops:lane:"+x,x==="All"?"All":x==="Awaiting payment"?"Needs payment":x==="Confirmed"?"Pickup due":x==="Active"?"On rental":"Completed","op-filter"+(p.lane===x?" active":""))).join("");
const rows=bks.map(b=>{const v=vehicle(c,b.vehicle),on=p.selected.includes(b.id),flag=p.marked.includes(b.id),next=b.status==="Awaiting payment"?"Review payment":b.status==="Confirmed"?"Prepare pickup":b.status==="Active"?"Review rental":"Open record";
return '<div class="op-board-row '+(on?"selected":"")+'" role="group" aria-label="'+h(c,b.customer)+" "+h(c,b.status)+'"><label class="op-row-check"><input type="checkbox" data-ops-select="'+h(c,b.id)+'" '+(on?"checked":"")+' aria-label="Select '+h(c,b.id)+'"></label><div class="op-booking-name">'+btn("booking-action",h(c,b.customer)+(flag?' <span class="op-flag">★</span>':""),"op-booking-link",h(c,b.id))+'<small>'+h(c,v?.name||"Vehicle")+' · '+h(c,b.id)+'</small></div><div class="op-date"><strong>'+h(c,b.date)+'</strong><small>'+h(c,b.days)+' days</small></div><span class="op-state op-state-'+(b.status==="Awaiting payment"?"warn":b.status==="Confirmed"?"due":b.status==="Active"?"live":"done")+'">'+h(c,b.status)+'</span>'+btn("booking-action",next+" →","op-next",h(c,b.id))+'</div>'}).join("");
return '<section class="op-workboard" id="op-workboard"><div class="op-board-header"><div><span class="op-eyebrow">PRIMARY WORK SURFACE</span><h2>Departure Board <small>'+bks.length+'</small></h2><p>Highest-priority reservations first. Select a record to take action.</p></div>'+btn("ops:go:Bookings","Full register →","op-head-btn")+'</div><div class="op-filters"><div class="op-filter-tabs" role="group" aria-label="Filter reservations">'+filters+'</div><div>'+btn("ops:help","⌨ Shortcuts","op-minor")+btn("ops:go:Availability","Availability →","op-minor")+'</div></div>'+
(selected.length?'<div class="op-selected" role="status">'+selected.length+' selected '+btn("ops:flag","Flag for follow-up","op-head-btn")+btn("ops:review","Review first","op-next")+btn("ops:clear","Clear","op-minor")+'<small>Personal demo flags only; no booking state is changed.</small></div>':"")+
'<div class="op-board-cols"><label><input type="checkbox" data-ops-select-all '+(bks.length&&selected.length===bks.length?"checked ":"")+(!bks.length?"disabled":"")+' aria-label="Select all visible bookings"></label><span>RENTER / VEHICLE</span><span>START</span><span>STATUS</span><span>NEXT ACTION</span></div>'+
(rows||'<div class="op-empty">No records in this stage. Choose another filter or create a booking.</div>')+
'<footer class="op-board-footer">'+bks.length+' of '+k.bookings.length+' sample reservations · '+h(c,p.branch==="All"?"All branches":p.branch)+' <span>Tab to navigate actions.</span></footer></section>'}
function attention(c,k){const tasks=[
["incidents",k.incOpen,"Incident reports","Review safety and assistance requests","alert"],
["payments",k.unpaid,"Pending payments","Follow up before confirmation","wallet"],
["handover",k.confirmed,"Upcoming handovers","Prepare checklists and contracts","car"],
["requests",k.requestOpen,"Customer requests","Extensions and changes await review","clock"],
["maintenance",k.maintenance,"Maintenance & compliance","Unavailable vehicles require action","wrench"]
].filter(x=>x[1]>0);
return '<section class="op-attention" id="op-attention"><div class="op-panel-heading"><span class="op-eyebrow">URGENT WORK</span><h2>Needs attention <small>'+tasks.reduce((s,x)=>s+x[1],0)+'</small></h2></div>'+
(tasks.length?tasks.map(([id,n,title,sub,ico])=>btn("ops:metric:"+id,'<span class="op-alert-icon">'+icon(c,ico)+'</span><span><strong>'+title+'</strong><small>'+sub+'</small></span><b>'+n+'</b>',"op-alert-row")).join(""):'<p class="op-no-alerts">No urgent demo tasks at this location.</p>')+'</section>'}
function fleet(c,k){return '<section class="op-fleet"><div class="op-panel-heading"><span class="op-eyebrow">SECONDARY CONTEXT</span><h2>Fleet readiness</h2>'+btn("ops:go:Fleet","All fleet →","op-minor")+'</div>'+k.vehicles.slice(0,4).map(v=>btn("ops:asset:"+v.id,'<span class="op-car-svg">'+c.vehicleSvg(v.color)+'</span><span><strong>'+h(c,v.name)+'</strong><small>'+h(c,v.plate)+' · '+h(c,v.location)+'</small></span><i class="op-fleet-pill">'+h(c,v.status==="Maintenance"?"Service":v.compliant?v.status:"Review")+'</i>',"op-fleet-row")).join("")+'</section>'}
function analytics(c,k){const statuses=["Awaiting payment","Confirmed","Active","Completed"];const max=Math.max(1,...statuses.map(s=>k.bookings.filter(b=>b.status===s).length));
return '<details class="op-analytics"><summary>'+icon(c,"chart")+' Optional analytics <small>Show sample reservation breakdown</small></summary><div class="op-chart">'+statuses.map(x=>{const n=k.bookings.filter(b=>b.status===x).length;return '<div>'+btn("ops:lane:"+x,'<span style="height:'+Math.max(8,n/max*100)+'%" class="op-chart-bar"></span><strong>'+n+'</strong>',"op-chart-button")+'<small>'+h(c,x)+'</small></div>'}).join("")+'</div><p>Counts use fictional bookings, not live financial activity.</p></details>'}
function welcome(c){return '<section class="op-welcome"><span class="op-eyebrow">THE SAGE AUTO WELCOME EXPERIENCE</span><h2>Make every <em>journey count.</em></h2><p>A more expressive introduction, available when you want it. Work mode keeps your priorities first.</p>'+btn("ops:mode","Back to Work mode →","op-next")+'</section>'}
function company(c){if(c.state.portal!=="company"||!["Overview","Today's operations"].includes(c.state.page))return null;const k=scoped(c);
return '<div class="op-workspace op-'+p.density+'">'+header(c)+(p.mode==="welcome"?welcome(c):"")+metric(c,k)+'<div class="op-work-layout">'+workboard(c,k)+'<aside class="op-work-rail" aria-label="Urgent context">'+attention(c,k)+fleet(c,k)+'</aside></div>'+analytics(c,k)+(p.help?'<div class="op-help" role="region" aria-label="Keyboard help"><strong>Keyboard shortcuts</strong><p>Alt+1 Overview · Alt+2 Bookings · Alt+3 Fleet · Alt+4 Availability · / Quick search</p>'+btn("ops:help","Close ×","op-minor")+'</div>':"")+'<p class="op-demo-note">Prototype only · focus lens and follow-up flags are browser-local preferences, not staff permissions.</p></div>'}
function metricGo(c,id){if(id==="payments"||id==="handover"){if(window.SageReferenceV2?.ui)window.SageReferenceV2.ui.bookingStage=id==="payments"?"Awaiting payment":"Confirmed";c.navigate("company","Bookings")}else c.navigate("company",{"incidents":"Incidents & assistance","requests":"Customer requests","ready":"Fleet","maintenance":"Maintenance"}[id]||"Overview");return true}
function action(action,node,c){if(!action.startsWith("ops:"))return false;const x=action.slice(4);
if(x==="sidebar"){p.sidebarMini=!p.sidebarMini;save();c.render();return true}
if(x.startsWith("group:")){const key=x.slice(6);p.groups[key]=p.groups[key]===false;save();c.render();return true}
if(x==="mode"){p.mode=p.mode==="work"?"welcome":"work";save();c.render();return true}
if(x==="density"){p.density=p.density==="compact"?"comfortable":"compact";save();c.render();return true}
if(x==="help"){p.help=!p.help;c.render();return true}
if(x==="attention"){let el=document.getElementById?.("op-attention");if(el?.scrollIntoView)el.scrollIntoView({block:"start",behavior:"smooth"});else c.navigate("company","Overview");return true}
if(x.startsWith("go:")){c.navigate("company",x.slice(3));return true}
if(x.startsWith("lane:")){p.lane=x.slice(5);p.selected=[];c.render();return true}
if(x.startsWith("metric:"))return metricGo(c,x.slice(7));
if(x.startsWith("asset:")){c.navigate("company","Fleet");return true}
if(x==="clear"){p.selected=[];c.render();return true}
if(x==="flag"){p.marked=[...new Set([...p.marked,...p.selected])];p.selected=[];save();c.render();c.showToast("Personal follow-up flags saved in this browser.");return true}
if(x==="review"){const id=p.selected[0];if(id){c.state.modal="detail:"+id;c.render()}return true}
return false}
function shell(c){try{document.body.classList.toggle("ops-mini",c.state.portal==="company"&&p.sidebarMini);document.body.classList.toggle("ops-active",c.state.portal==="company")}catch(e){}}
function wire(){if(!document.addEventListener)return;
document.addEventListener("change",e=>{let t=e.target,c=M._ctx;if(!t||!c||c.state.portal!=="company")return;
if(t.id==="ops-branch"){p.branch=t.value;p.selected=[];save();c.render();return}
if(t.id==="ops-focus"){p.focus=t.value;p.lane=p.focus==="Finance"?"Awaiting payment":p.focus==="Fleet"?"Active":"All";save();c.render();return}
if(t.matches?.("[data-ops-select-all]")){const ids=scoped(c).bookings.filter(b=>p.lane==="All"||b.status===p.lane).map(b=>b.id);p.selected=t.checked?ids:[];c.render();return}
const id=t.getAttribute?.("data-ops-select");if(id){p.selected=t.checked?[...new Set([...p.selected,id])]:p.selected.filter(v=>v!==id);c.render();}
});
document.addEventListener("keydown",e=>{const c=M._ctx,t=e.target;if(!c||c.state.portal!=="company"||e.ctrlKey||e.metaKey||["INPUT","TEXTAREA","SELECT"].includes(t?.tagName)||t?.isContentEditable)return;
if(e.altKey&&["1","2","3","4"].includes(e.key)){e.preventDefault();c.navigate("company",{"1":"Overview","2":"Bookings","3":"Fleet","4":"Availability"}[e.key]);return}
if(e.key==="/"&&!e.altKey&&!e.shiftKey){e.preventDefault();c.state.command="nav";c.render();}
})}
M.company=company;M.navigation=navigation;M.toolbar=toolbar;M.action=action;M.shell=shell;M.connect=c=>M._ctx=c;M.prefs=p;M.metrics=scoped;
load();wire();window.SageOpsV2=M;
})();