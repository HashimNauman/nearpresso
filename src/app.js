const $ = selector => document.querySelector(selector);
const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const espressoPinIcon = '<svg class="icon" aria-hidden="true"><use href="#i-espresso-glass"/><use class="pin-steam" href="#i-espresso-steam"/></svg>';
const escapeHtml = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const reviewDialog = $('#review-dialog'), reviewForm = $('#review-form'), reviewNote = $('#review-note');
let reviewingCafeId = null;
const storageKey = 'findespresso.trail.v1';
const status = new Map();
try {
  const records=JSON.parse(localStorage.getItem(storageKey)||'[]');
  for (const [id,value] of records) {
    if (!value) continue;
    const rating = value.review?.rating;
    const review = Number.isInteger(rating) && rating >= 1 && rating <= 5
      ? {rating, note:typeof value.review.note === 'string' ? value.review.note.slice(0,reviewNote.maxLength) : ''}
      : null;
    if (value.saved || value.tried || review) status.set(id,{saved:!!value.saved,tried:!!value.tried,review});
  }
} catch {}
const state = {city:'all',query:'',trail:false,trailFilter:'all',selected:cafes[0].id,cluster:null};
const cafeById = new Map(cafes.map(c=>[c.id,c]));
const rows=$('#rows'), detail=$('#detail'), pins=$('#pins'), search=$('#search');
const mapSection=$('#atlas-map');
const selected = () => cafeById.get(state.selected);
const normal = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function visibleCafes() {
  const words=normal(state.query).trim().split(/\s+/);
  return cafes.filter(c => {
    if (c.trailOnly && !state.trail) return false;
    if (state.city!=='all' && c.city!==state.city) return false;
    const s=status.get(c.id);
    if (state.trail && (!s || (state.trailFilter!=='all' && !s[state.trailFilter]))) return false;
    const haystack=normal([c.name,c.area,c.city,c.kind].join(' '));
    return words.every(word=>haystack.includes(word));
  });
}
function writeStatus(id,current) {
  if(current.saved||current.tried||current.review) status.set(id,current);
  else status.delete(id);
  try {localStorage.setItem(storageKey,JSON.stringify([...status]));}
  catch {
    $('#storage-note').textContent='Browser storage is unavailable. Your trail will last until this tab closes.';
    $('#review-privacy').textContent='Browser storage is unavailable. Your review will last until this tab closes.';
  }
  if (state.trail && !visibleCafes().some(c=>c.id===state.selected)) state.selected=null;
  update();
}
function saveStatus(id,field) {
  const current = status.get(id) || {};
  writeStatus(id,{...current,[field]:!current[field]});
}
function openReview(cafe) {
  const review = status.get(cafe.id)?.review;
  reviewingCafeId = cafe.id;
  reviewForm.reset();
  $('#review-title').textContent = review ? 'Edit your review' : 'Review this café';
  $('#review-place').textContent = cafe.name;
  $('#review-cancel').textContent = review ? 'Cancel' : 'Skip for now';
  if (review) {
    reviewForm.elements.rating.value = String(review.rating);
    reviewNote.value = review.note;
  }
  reviewDialog.showModal();
  const firstRating = reviewForm.querySelector('input:checked') || reviewForm.querySelector('input[name="rating"]');
  firstRating.focus({preventScroll:true});
}
function renderRows(list) {
  const active = document.activeElement;
  const rowFocus = rows.contains(active) ? [active.dataset.id,active.className] : null;
  if (!list.length) {
    const copy=state.query?'No stops match that search. Try a café name or neighbourhood.':state.trail?'Your trail is empty here. Save a stop or mark one as tried.':'No coffee stops in this area.';
    rows.innerHTML=`<p class="empty">${copy}</p>`;
    return;
  }
  rows.innerHTML=list.map(c=>{
    const s=status.get(c.id)||{};
    const id=escapeHtml(c.id);
    const sub=[c.area,c.city,c.trailOnly?c.kind:'',s.tried?'Tried':'',s.review?`Reviewed ${s.review.rating}/5`:''].filter(Boolean).join(' · ');
    return `<div class="row${c.id===state.selected?' active':''}">
      <button type="button" class="row-open" data-id="${id}" aria-pressed="${c.id===state.selected}">
        <span class="row-no" aria-hidden="true">${c.no}</span><span><span class="row-name">${escapeHtml(c.name)}</span><span class="row-sub">${escapeHtml(sub)}</span></span>
      </button><button type="button" class="row-save" data-id="${id}" aria-label="Save ${escapeHtml(c.name)}" title="Save ${escapeHtml(c.name)}" aria-pressed="${!!s.saved}">${icon('bookmark')}</button>
    </div>`;
  }).join('');
  if (rowFocus) {
    const [id,className]=rowFocus;
    [...rows.querySelectorAll('button')].find(b=>b.dataset.id===id && b.className===className)?.focus({preventScroll:true});
  }
}
function renderDetail() {
  const previousAction=detail.contains(document.activeElement)?document.activeElement.dataset.action:null;
  const cafe=selected();
  if(state.cluster) {
    detail.hidden=false;
    detail.innerHTML=`<div class="detail-top"><span class="mono">Nearby stops</span><button type="button" data-action="close" aria-label="Close nearby stops">${icon('close')}</button></div>
    <h2>${state.cluster.length} cafés here</h2>
    <div class="cluster-list">${state.cluster.map(c=>`<button type="button" data-cafe="${escapeHtml(c.id)}">${escapeHtml(c.name)} · ${escapeHtml(c.area)}</button>`).join('')}</div>`;
  } else if(cafe) {
    const s=status.get(cafe.id)||{};
    detail.hidden=false;
    detail.innerHTML=`<div class="detail-top"><span class="mono">Stop ${cafe.no} / ${escapeHtml(cafe.kind)}</span><button type="button" data-action="close" aria-label="Close café details">${icon('close')}</button></div>
    <h2>${escapeHtml(cafe.name)}</h2>
    <p class="location">${escapeHtml(cafe.area)} · ${escapeHtml(cafe.city)}</p>
    <p class="note">${escapeHtml(cafe.note)}</p>
    ${s.review?`<div class="cafe-review"><span class="mono">Your review</span>
      <span class="review-rating" role="img" aria-label="${s.review.rating} out of 5 stars">${'★'.repeat(s.review.rating)}${'☆'.repeat(5-s.review.rating)}</span>
      ${s.review.note?`<p class="review-text">${escapeHtml(s.review.note)}</p>`:''}</div>`:''}
    <div class="detail-actions"><a class="maps-link" href="${escapeHtml(cafe.url)}" target="_blank" rel="noopener">Google Maps ${icon('arrow')}</a>
    <button type="button" data-action="saved" aria-label="Save café" aria-pressed="${!!s.saved}">${icon('bookmark')}${s.saved?'Saved':'Save'}</button>
    <button type="button" data-action="tried" aria-label="Mark café as tried" aria-pressed="${!!s.tried}">${icon('check')}${s.tried?'Tried':'Mark tried'}</button>
    ${s.tried||s.review?`<button type="button" data-action="review">${s.review?'Edit review':'Review'}</button>`:''}</div>`;
  } else {
    detail.hidden=true;
    detail.replaceChildren();
  }
  if (previousAction) [...detail.querySelectorAll('button')].find(b=>b.dataset.action===previousAction)?.focus({preventScroll:true});
}
function update() {
  const list=visibleCafes();
  $('#clear').hidden=!state.query;
  $('#trail').setAttribute('aria-pressed',state.trail);
  $('#trail-count').textContent=status.size;
  $('#trail-filters').hidden=!state.trail;
  $('#list-title').textContent=state.trail?'My trail':'Coffee stops';
  $('#count').textContent=`${list.length} ${list.length===1?'stop':'stops'}${state.city==='all'&&!state.query&&!state.trail?' · 3 cities':''}`;
  $('#map-name').textContent=state.city==='all'?'Klang Valley':state.city;
  for(const b of document.querySelectorAll('[data-city]')) b.setAttribute('aria-pressed',b.dataset.city===state.city);
  for(const b of document.querySelectorAll('[data-trail]')) b.setAttribute('aria-pressed',b.dataset.trail===state.trailFilter);
  const activeMode = googleRequested ? 'google' : view.mode;
  for(const b of document.querySelectorAll('[data-mode]')) b.setAttribute('aria-pressed',b.dataset.mode===activeMode);
  renderRows(list);renderDetail();
  if (googleRequested && googleScene) renderGooglePins(list);
  else requestPaint();
}
function refilter() {
  state.cluster=null;
  if(!visibleCafes().some(c=>c.id===state.selected)) state.selected=null;
  rows.scrollTop=0;
  update();
  if (googleRequested && googleScene) fitGoogleCafes();
  else fitCafes();
}
function openCafe(cafe,{move=true,scroll=false,focus=false}={}) {
  if (!cafe) return;
  state.selected=cafe.id;
  state.cluster=null;
  if (move) {
    if (googleRequested && googleScene) moveGoogleTo(cafe);
    else pointMap(cafe,2.15);
  }
  update();
  if(scroll && matchMedia('(max-width: 800px)').matches) {
    $('.map').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
  if (focus) detail.querySelector('[data-action="close"]')?.focus({preventScroll:true});
}
function renderPins() {
  const next=[];
  for (const cafe of visibleCafes()) {
    const [x,y]=ground(...world(cafe.lng,cafe.lat));
    if(x<13||x>width-13||y<70||y>height-58) continue;
    const current=cafe.id===state.selected;
    const neighbour=!current && next.find(g=>!g.current && g.cafes[0].city===cafe.city && Math.hypot(g.x-x,g.y-y)<(view.zoom>6?24:34));
    if(neighbour) {
      const n=neighbour.cafes.length;
      neighbour.x=(neighbour.x*n+x)/(n+1);
      neighbour.y=(neighbour.y*n+y)/(n+1);
      neighbour.cafes.push(cafe);
    } else {
      next.push({x,y,current,cafes:[cafe]});
    }
  }
  // Keep the selected pin on its coordinate and nudge overlapping markers aside.
  for(const g of next) {g.pinX=g.x;g.pinY=g.y;}
  const radius=g=>g.current?16.5:g.cafes.length>1?14.5:11;
  for(let pass=0;pass<3;pass++) {
    for(let i=0;i<next.length;i++) for(let j=i+1;j<next.length;j++) {
      const a=next[i], b=next[j];
      const dx=b.pinX-a.pinX, dy=b.pinY-a.pinY;
      const span=Math.hypot(dx,dy), gap=radius(a)+radius(b)+3-span;
      if(gap<=0) continue;
      const ux=span>.1?dx/span:1, uy=span>.1?dy/span:0;
      if(!a.current){const move=b.current?gap:gap/2;a.pinX-=ux*move;a.pinY-=uy*move;}
      if(!b.current){const move=a.current?gap:gap/2;b.pinX+=ux*move;b.pinY+=uy*move;}
    }
  }
  for(const g of next) {
    if(Math.hypot(g.pinX-g.x,g.pinY-g.y)>3) poly([[g.x,g.y],[g.pinX,g.pinY]],null,'#e96a45b0',1);
  }
  groups=next;
  const signature=next.map(g=>g.cafes.map(c=>c.id).join('~')+(g.current?'!':'')).join('|');
  if(signature!==pinSignature) {
    pinSignature=signature;
    pins.innerHTML=next.map((g,i)=>{
      const count=g.cafes.length;
      const label=count===1?g.cafes[0].name:`${count} cafés near ${g.cafes[0].area}`;
      return `<button type="button" class="map-pin ${count===1?'single':''} ${g.current?'current':''}" data-pin="${i}" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}" aria-pressed="${g.current}">${count===1?espressoPinIcon:count}</button>`;
    }).join('');
  }
  for(let i=0;i<next.length;i++) {
    pins.children[i].style.left=next[i].pinX+'px';
    pins.children[i].style.top=next[i].pinY+'px';
  }
}
rows.addEventListener('click',e=>{
  const b=e.target.closest('button[data-id]');
  if(!b) return;
  if(b.classList.contains('row-save')) saveStatus(b.dataset.id,'saved');
  else openCafe(cafeById.get(b.dataset.id),{scroll:true});
});
pins.addEventListener('click',e=>{
  const b=e.target.closest('[data-pin]');
  if(!b) return;
  const group=groups[+b.dataset.pin];
  if(group.cafes.length===1) {
    openCafe(group.cafes[0],{move:false,focus:e.detail===0});
  } else {
    const center=screenToWorld(group.x,group.y);
    view.x=center[0];view.y=center[1];
    view.zoom=Math.min(12,Math.max(2.9,view.zoom*1.5));
    state.selected=null;
    state.cluster=group.cafes;
    update();
    detail.querySelector('[data-cafe]')?.focus({preventScroll:true});
  }
});
detail.addEventListener('click',e=>{
  const b=e.target.closest('button');
  if(!b) return;
  if(b.dataset.cafe) openCafe(cafeById.get(b.dataset.cafe),{focus:true});
  else if(b.dataset.action==='close') {
    state.selected=null;state.cluster=null;update();
    const target = googleRequested && googleScene ? $('[data-mode="google"]') : canvas;
    target.focus({preventScroll:true});
  } else if(state.selected) {
    const cafe = selected();
    if (b.dataset.action==='review') openReview(cafe);
    else {
      const justTried = b.dataset.action==='tried' && !status.get(cafe.id)?.tried;
      saveStatus(cafe.id,b.dataset.action);
      if (justTried) openReview(cafe);
    }
  }
});
reviewForm.addEventListener('submit', event => {
  event.preventDefault();
  const id = reviewingCafeId;
  const rating = Number(reviewForm.elements.rating.value);
  if (!id || !Number.isInteger(rating) || rating < 1 || rating > 5) return;
  const note = reviewNote.value.trim().slice(0,reviewNote.maxLength);
  writeStatus(id,{...status.get(id),review:{rating,note}});
  reviewDialog.close();
});
for (const button of reviewForm.querySelectorAll('[data-review-close]')) {
  button.addEventListener('click', () => reviewDialog.close());
}
reviewDialog.addEventListener('close', () => {
  if (state.selected===reviewingCafeId) {
    detail.querySelector('[data-action="review"]')?.focus({preventScroll:true});
  }
  reviewingCafeId = null;
});
search.addEventListener('input',()=>{state.query=search.value;refilter();});
$('#clear').addEventListener('click',()=>{state.query=search.value='';refilter();search.focus();});
$('#filters').addEventListener('click',e=>{
  const b=e.target.closest('[data-city]');
  if(b){state.city=b.dataset.city;refilter();}
});
$('#trail').addEventListener('click',()=>{
  state.trail=!state.trail;state.trailFilter='all';
  state.city='all';state.query=search.value='';refilter();
});
$('#trail-filters').addEventListener('click',e=>{
  const b=e.target.closest('[data-trail]');
  if(b){state.trailFilter=b.dataset.trail;refilter();}
});
$('.brand').addEventListener('click',e=>{
  e.preventDefault();
  leaveGoogleView();
  Object.assign(state,{city:'all',query:'',trail:false,trailFilter:'all',selected:cafes[0].id,cluster:null});
  search.value='';view.mode='3d';view.angle=.58;refilter();
});
$('.modes').addEventListener('click',e=>{
  const b=e.target.closest('[data-mode]');
  if(!b) return;
  if (b.dataset.mode==='google') {
    selectGoogleView();
    return;
  }
  const returning = googleRequested;
  leaveGoogleView();
  if (b.dataset.mode===view.mode) {
    if (returning) update();
    return;
  }
  view.mode=b.dataset.mode;
  view.angle=view.mode==='3d'?.58:0;
  update();
  if(view.zoom>1.5 && selected()) pointMap(selected(),0);
  else fitCafes();
});
$('#rotate').addEventListener('click',()=>{view.angle=(view.angle+Math.PI/6)%(Math.PI*2);requestPaint();});
$('#zoom-in').addEventListener('click',()=>zoomMap(1.29));
$('#zoom-out').addEventListener('click',()=>zoomMap(1/1.29));
$('#fit').addEventListener('click',fitCafes);
const mobileLayout=matchMedia('(max-width: 800px)');
$('#mobile-pan').addEventListener('click',()=>{
  const enabled=mapSection.classList.toggle('pan-enabled');
  $('#mobile-pan').setAttribute('aria-pressed',enabled);
  $('#mobile-pan').textContent=enabled?'Done':'Pan';
});
for(const link of document.querySelectorAll('.mobile-jump')) link.addEventListener('click',e=>{
  e.preventDefault();
  $(link.hash).scrollIntoView({block:'start',behavior:'instant'});
});
$('#about-open').addEventListener('click',()=>$('#about').showModal());
$('#about-edition').textContent=`November 2026 edition · ${cafes.filter(c=>!c.trailOnly).length} places across Kuala Lumpur, Cyberjaya and Putrajaya. This is a handpicked directory with roasters, bars and neighbourhood cafés.`;
$('#about-map').innerHTML='Selected roads and waterways in the offline atlas were traced from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>. Terrain and buildings are stylised. The atlas, directory and trail work offline. The Google map and listing links need a connection.';
canvas.addEventListener('wheel',e=>{
  if (mobileLayout.matches && !mapSection.classList.contains('pan-enabled')) return;
  e.preventDefault();
  const box=canvas.getBoundingClientRect();
  zoomMap(Math.exp(Math.max(-90,Math.min(90,-e.deltaY))*.003),e.clientX-box.left,e.clientY-box.top);
},{passive:false});
const pointers=new Map();
const pointerXY=e=>{
  const box=canvas.getBoundingClientRect();
  return [e.clientX-box.left,e.clientY-box.top];
};
const midpoint=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
function panPixels(from,to) {
  const a=screenToWorld(...from),b=screenToWorld(...to);
  view.x+=a[0]-b[0];view.y+=a[1]-b[1];
  requestPaint();
}
canvas.addEventListener('pointerdown',e=>{
  if(e.button!==0||pointers.size===2) return;
  if(e.pointerType==='touch' && mobileLayout.matches && !mapSection.classList.contains('pan-enabled')) return;
  canvas.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId,pointerXY(e));
  canvas.classList.add('dragging');
});
canvas.addEventListener('pointermove',e=>{
  if(!pointers.has(e.pointerId)) return;
  const old=pointers.get(e.pointerId), next=pointerXY(e);
  if(pointers.size===2) {
    const other=[...pointers].find(([id])=>id!==e.pointerId)[1];
    const from=midpoint(old,other), to=midpoint(next,other);
    panPixels(from,to);
    const before=distance(old,other);
    if(before>2) zoomMap(distance(next,other)/before,...to);
  } else panPixels(old,next);
  pointers.set(e.pointerId,next);
});
for(const event of ['pointerup','pointercancel','lostpointercapture']) canvas.addEventListener(event,e=>{
  pointers.delete(e.pointerId);
  if(!pointers.size) canvas.classList.remove('dragging');
});
canvas.addEventListener('keydown',e=>{
  const shifts={ArrowLeft:[38,0],ArrowRight:[-38,0],ArrowUp:[0,38],ArrowDown:[0,-38]};
  if(shifts[e.key]) panPixels([0,0],shifts[e.key]);
  else if(e.key==='+'||e.key==='=') zoomMap(1.25);
  else if(e.key==='-') zoomMap(.8);
  else if(e.key==='Escape'){state.selected=null;state.cluster=null;update();}
  else return;
  e.preventDefault();
});
resize();
new ResizeObserver(resize).observe(canvas);
update();
