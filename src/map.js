// A compact, schematic basemap traced from OpenStreetMap. The relief and city
// silhouettes are illustrative. Café positions come from their place listings.
const origin = [101.675, 3.04];
const world = (lng, lat) => [(lng - origin[0]) * 111, (origin[1] - lat) * 111];
const fromTrace = (points, lng, lat, degreePerPixel) =>
  points.map(([x,y]) => world(lng + (x - 640) * degreePerPixel, lat - (y - 388) * degreePerPixel));
const regionalTrace = points => fromTrace(points,101.68,3.04,360 / 524288);
const lakeTrace = points => fromTrace(points,101.689,2.923,360 / 2097152);
const slab = [[-23,-22],[-18,-25],[12,-25],[24,-17],[24,12],[17,22],[4,25],[-18,23],[-24,17],[-24,-13]];
const highways = [
  [[403,56],[420,100],[493,155],[501,201],[517,225],[523,258],[501,291],[475,305],[436,309],[375,312],[350,325]],
  [[465,60],[491,104],[490,151],[520,163],[549,162],[573,177],[615,167],[640,173],[668,172],[690,179],[721,175],[747,185],[755,201],[746,227],[768,244],[787,244],[819,219],[836,246],[841,290]],
  [[388,217],[422,210],[445,222],[472,227],[504,214],[550,208],[581,207],[612,196],[647,190],[682,205],[717,208],[750,211]],
  [[528,358],[551,358],[567,343],[590,342],[612,326],[641,327],[664,322],[685,302],[709,279],[726,263],[736,239],[739,223]],
  [[491,460],[491,430],[484,403],[473,378],[474,353],[487,333],[503,321],[523,320],[543,324],[566,324],[592,323],[615,309],[624,284],[612,268],[599,250],[604,223],[615,207],[620,182],[613,161],[618,135],[627,116],[622,85],[622,57]],
  [[411,556],[473,535],[525,531],[550,521],[557,498],[581,479],[609,478],[649,483],[693,479],[726,472],[758,472],[789,489],[811,478],[839,477],[865,464]],
  [[497,392],[538,395],[545,414],[543,449],[556,467],[581,478],[596,491],[589,518],[569,533],[562,560],[573,582],[599,601],[611,632],[610,673],[629,716]],
  [[650,480],[646,454],[650,431],[649,407],[653,385],[657,360],[650,335],[657,311],[669,288],[685,271],[696,253],[693,226],[681,211]],
  [[515,529],[535,570],[550,606],[576,634],[608,655],[634,666],[665,660],[692,677],[720,664],[749,657],[780,663],[797,670],[821,659],[842,654],[865,659],[891,670]],
  [[684,322],[692,345],[690,368],[695,398],[708,420],[716,440],[731,456],[737,478],[746,504],[747,535],[761,554],[782,586],[792,613],[794,641],[800,673],[799,709]],
  [[674,337],[713,321],[746,326],[775,321],[801,308],[827,308],[839,324],[840,352],[833,377],[835,398],[845,411],[835,429],[851,444],[863,463],[866,488],[850,508],[845,534],[852,554],[861,582],[856,604],[858,629],[864,657],[862,682],[873,716]],
  [[704,407],[725,403],[751,401],[773,390],[798,393],[820,400],[836,412]],
].map(regionalTrace);
const connectors = [
  [[417,256],[460,274],[490,264],[518,259],[547,262],[568,254],[590,257],[615,255],[644,251],[677,242],[711,247],[747,243]],
  [[527,302],[548,283],[572,279],[597,274],[621,271],[647,267],[665,260],[693,261],[724,278],[755,286],[778,270]],
  [[502,366],[529,369],[565,365],[599,365],[619,377],[641,379],[659,369],[685,375],[703,390]],
  [[547,428],[578,433],[609,424],[635,427],[655,423],[676,427],[699,447],[727,452]],
  [[546,513],[574,510],[601,509],[634,510],[662,514],[700,510],[726,507],[750,509],[778,518]],
  [[556,550],[577,551],[600,560],[626,557],[650,553],[671,561],[691,553],[722,558],[754,556]],
  [[583,582],[604,574],[630,574],[658,585],[677,574],[700,578],[727,585],[759,585]],
  [[645,149],[641,173],[643,199],[640,231],[630,251],[629,282],[631,301],[637,330],[633,355],[630,383]],
  [[690,144],[680,167],[681,201],[684,228],[669,249],[671,276],[673,298],[684,323],[682,350]],
  [[740,163],[756,152],[780,156],[803,158],[831,178],[854,189],[886,181]],
  [[512,140],[553,132],[596,141],[635,136],[671,144],[705,133],[742,137],[774,145]],
].map(regionalTrace);
const putrajayaRoads = [
  [[487,273],[528,252],[559,260],[590,235],[613,200],[632,190],[674,191],[710,196],[748,178],[772,184],[789,206],[785,239],[797,275],[789,314],[769,340],[739,355],[724,374],[713,412],[706,447],[681,470],[649,478],[615,460],[598,470],[584,507],[569,535],[526,546],[485,538],[470,524]],
  [[553,416],[561,389],[561,355],[573,325],[585,299],[599,275],[612,250],[626,225],[645,212],[665,213],[685,232],[706,252],[725,269]],
  [[491,351],[517,357],[546,373],[566,402],[590,423],[620,432],[648,430],[683,414],[716,402]],
  [[588,508],[606,470],[619,434],[633,399],[642,359],[653,317]],
  [[484,555],[510,578],[535,593],[567,596],[609,586],[644,568],[670,555],[706,558],[747,546],[785,528],[806,503],[796,466],[789,425],[769,384],[755,349]],
].map(lakeTrace);
const lakes = [
  [[627,276],[638,255],[654,241],[661,220],[680,220],[678,235],[691,238],[696,250],[682,256],[675,276],[670,294],[661,304],[643,308],[635,324],[643,336],[631,353],[624,373],[617,383],[610,378],[600,400],[596,416],[584,431],[576,420],[583,403],[585,382],[599,370],[601,347],[613,326],[618,306]],
  [[589,432],[586,452],[576,468],[570,484],[567,507],[552,515],[528,508],[514,496],[496,486],[496,474],[509,466],[526,460],[544,447],[552,429],[562,425],[569,433],[562,448],[568,451],[578,432]],
  [[613,517],[629,507],[642,505],[644,497],[638,485],[648,475],[658,468],[660,458],[682,449],[696,440],[698,449],[686,462],[672,469],[664,480],[651,489],[656,504],[649,517],[632,525],[616,527]],
  [[700,334],[715,331],[724,318],[739,313],[753,315],[749,323],[735,326],[730,339],[712,341]],
  [[568,561],[579,554],[591,562],[589,574],[578,579],[566,570]],
].map(lakeTrace);
const river = regionalTrace([[575,61],[569,89],[583,110],[599,119],[611,144],[606,164],[613,193],[629,215],[636,229],[645,243],[648,259],[633,275],[620,280],[607,292],[588,297],[563,305],[541,310],[508,303],[487,299],[470,285],[445,291],[417,286],[385,299],[350,296]]);
const landmarks = [
  [101.71165,3.15788,'Petronas Twin Towers','twin'],
  [101.70378,3.15280,'KL Tower','spire'],
  [101.70066,3.14187,'Merdeka 118','merdeka'],
  [101.68878,2.93605,'Putra Mosque','mosque'],
].map(([lng,lat,label,type]) => ({xy:world(lng,lat),label,type}));
const cityLabels = [
  {name:'Kuala Lumpur', xy:world(101.715,3.175), direction:1, num:'01'},
  {name:'Cyberjaya', xy:world(101.612,2.923), direction:-1, num:'02'},
  {name:'Putrajaya', xy:world(101.755,2.897), direction:1, num:'03'},
];
const terrain = (x,y) => {
  const hill = (a,b,rx,ry,h) => h * Math.exp(-(((x-a)/rx)**2 + ((y-b)/ry)**2));
  const ridge = hill(15,-15,6,12,3.0) + hill(19,0,5,13,1.8) + hill(-16,1,5,5,1.2)
    + hill(-10,-15,7,9,.75) + hill(-20,14,4,8,.48) + hill(5,20,7,5,.55);
  return .065 + ridge * (.89 + .10 * Math.sin(x*1.64+y*.7) + .1 * Math.cos(y*1.24-x*.75));
};
const rng = (() => {
  let value = 335641;
  return () => ((value = (Math.imul(value,1664525) + 1013904223) >>> 0) / 4294967296);
})();
const cityBlocks = [];
function addBlocks(lng,lat,count,sx,sy,maxHeight) {
  const [cx,cy] = world(lng,lat);
  for (let i=0;i<count;i++) {
    const angle = rng()*Math.PI*2;
    const range = Math.sqrt(rng());
    const x = cx + Math.cos(angle)*range*sx;
    const y = cy + Math.sin(angle)*range*sy;
    if (landmarks.some(m => Math.hypot(m.xy[0]-x,m.xy[1]-y) < .43)) continue;
    const footprint = .095 + rng()*.27;
    cityBlocks.push({x,y,w:footprint,d:footprint*(.6+rng()*.9),h:.05+maxHeight*(1-range*.75)*rng()**2});
  }
}
addBlocks(101.699,3.151,370,8.2,6.7,1.18);
addBlocks(101.663,3.12,185,10,8.3,.67);
addBlocks(101.707,3.085,134,8.5,8,.61);
addBlocks(101.65,2.921,88,3.5,2.0,.44);
addBlocks(101.701,2.939,100,4.6,2.4,.37);
addBlocks(101.64,3.005,126,8,5,.4);
for (const {xy:[x,y],type} of landmarks) {
  if (type==='twin') {
    for (const offset of [-.21,.21]) {
      cityBlocks.push({x:x+offset,y,w:.30,d:.38,h:2.02,hero:true,cap:.51});
      cityBlocks.push({x:x+offset,y,w:.22,d:.24,h:2.26,start:2.02,hero:true,cap:.29});
    }
    cityBlocks.push({x,y,w:.45,d:.085,h:1.12,start:1.03,hero:true});
  } else if (type==='spire') {
    cityBlocks.push({x,y,w:.11,d:.13,h:1.67,hero:true,cap:.47});
    cityBlocks.push({x,y,w:.32,d:.30,h:1.68,start:1.48,hero:true});
  } else if (type==='merdeka') {
    cityBlocks.push({x,y,w:.31,d:.35,h:2.17,hero:true,cap:.69});
    cityBlocks.push({x,y,w:.23,d:.25,h:2.33,start:2.17,hero:true});
  } else {
    cityBlocks.push({x,y,w:.26,d:.26,h:.39,hero:true,cap:.19});
    cityBlocks.push({x:x-.22,y:y+.14,w:.08,d:.08,h:.70,hero:true,cap:.18});
  }
}

const canvas = document.querySelector('#map');
const ctx = canvas.getContext('2d',{alpha:false});
const view = {x:0,y:0,zoom:1,angle:.58,mode:'3d'};
let width=1, height=1, dpr=1, baseScale=1, repaint=0;
let groups = [];
let pinSignature = '';
const shadeCache = new Map();
const scale = () => view.zoom * baseScale;
const pivot = () => [width*.5,height*(width<600 ? .407 : .445)];
function rotated(x,y) {
  const c=Math.cos(view.angle), s=Math.sin(view.angle);
  return [x*c-y*s,x*s+y*c];
}
function projection(x,y,z=0) {
  const [u,v] = rotated(x-view.x,y-view.y);
  const [ox,oy] = pivot();
  return view.mode==='3d' ? [ox+u*scale(),oy+(v*.61-z*.79)*scale()] : [ox+u*scale(),oy+v*scale()];
}
function screenToWorld(px,py) {
  const [ox,oy] = pivot();
  const dx = (px-ox)/scale();
  const dy = (py-oy)/(scale()*(view.mode==='3d'?.61:1));
  const c=Math.cos(view.angle), s=Math.sin(view.angle);
  return [view.x+dx*c+dy*s,view.y-dx*s+dy*c];
}
function poly(points,fill,stroke,lineWidth=1) {
  if (points.length<2) return;
  ctx.beginPath();
  points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));
  if (fill) {ctx.closePath();ctx.fillStyle=fill;ctx.fill();}
  if (stroke) {ctx.strokeStyle=stroke;ctx.lineWidth=lineWidth;ctx.stroke();}
}
const ground = (x,y) => projection(x,y,view.mode==='3d' ? terrain(x,y):0);
const mesh = [];
for (let y=-27;y<26;y+=.88) for (let x=-25;x<25;x+=.88) {
  const a=[x,y,terrain(x,y)], b=[x+.88,y,terrain(x+.88,y)];
  const c=[x+.88,y+.88,terrain(x+.88,y+.88)], d=[x,y+.88,terrain(x,y+.88)];
  const tone = (p,q,r) => {
    const level = (p[2]+q[2]+r[2])/3;
    return Math.round(24 + level*5 + (p[2]-r[2])*20 + rng()*6);
  };
  mesh.push([a,b,d,tone(a,b,d)],[b,c,d,tone(b,c,d)]);
}
function terrainColor(shade) {
  if (!shadeCache.has(shade)) shadeCache.set(shade,`rgb(${shade+1},${shade},${shade+7})`);
  return shadeCache.get(shade);
}
function drawBackground() {
  const halo=ctx.createRadialGradient(width*.53,height*.40,0,width*.53,height*.46,Math.max(width,height)*.71);
  halo.addColorStop(0,'#211923'); halo.addColorStop(.62,'#110e15'); halo.addColorStop(1,'#09080b');
  ctx.fillStyle=halo;ctx.fillRect(0,0,width,height);
  if(view.mode==='3d') {
    for(let i=-100;i<=100;i+=4){
      const color=i%20===0?'#51425055':'#493d4c33';
      poly([projection(-100,i,-1.8),projection(100,i,-1.8)],null,color,.8);
      poly([projection(i,-100,-1.8),projection(i,100,-1.8)],null,color,.8);
    }
  }
}
function drawGlassSides(outline) {
  const bottom = slab.map(([x,y])=>projection(x,y,-1.65));
  ctx.save();
  ctx.lineJoin='round';
  ctx.shadowColor='#f74b0190';
  ctx.shadowBlur=16*dpr;
  poly(bottom,'#09070b38','#f74b014c',1.3);
  ctx.restore();

  for (let i=0;i<outline.length;i++) {
    const j=(i+1)%outline.length;
    const [x,y]=outline[i], [nextX,nextY]=outline[j];
    const dx=nextX-x, dy=nextY-y;
    if (dx>=0) continue;
    const depth=((bottom[i][1]-y)+(bottom[j][1]-nextY))/2;
    const normalScale=dx*depth/(dx*dx+dy*dy);
    const midX=(x+nextX)/2, midY=(y+nextY)/2;
    // Shade across the thickness of the glass, perpendicular to each edge.
    const tint=ctx.createLinearGradient(midX,midY,midX-dy*normalScale,midY+dx*normalScale);
    tint.addColorStop(0,'#a29da955');
    tint.addColorStop(.26,'#3a323e9c');
    tint.addColorStop(.77,'#151017a0');
    tint.addColorStop(1,'#74311881');
    poly([outline[i],outline[j],bottom[j],bottom[i]],tint);
    poly([bottom[i],bottom[j]],null,'#e66a365d',.9);
  }
}
function drawLand() {
  const outline=slab.map(([x,y])=>ground(x,y));
  const isGlass=view.mode==='3d';
  const slabX=outline.map(p=>p[0]), slabY=outline.map(p=>p[1]);
  const minX=Math.min(...slabX), maxX=Math.max(...slabX);
  const minY=Math.min(...slabY), maxY=Math.max(...slabY);
  if (isGlass) drawGlassSides(outline);

  ctx.save();
  ctx.beginPath();outline.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.clip();
  if (isGlass) {
    const smoke=ctx.createLinearGradient(minX,minY,maxX,maxY);
    smoke.addColorStop(0,'#54525da6');
    smoke.addColorStop(.45,'#282530aa');
    smoke.addColorStop(1,'#17131bc9');
    ctx.fillStyle=smoke;
    ctx.fillRect(minX,minY,maxX-minX,maxY-minY);
    ctx.globalAlpha=.48;
  }
  const bounds = [[0,0],[width,0],[0,height],[width,height]].map(p=>screenToWorld(...p));
  const xs=bounds.map(p=>p[0]), ys=bounds.map(p=>p[1]);
  const left=Math.min(...xs)-6, right=Math.max(...xs)+6, top=Math.min(...ys)-6, bottom=Math.max(...ys)+6;
  for (const [a,b,c,tone] of mesh) {
    if (a[0]<left||a[0]>right||a[1]<top||a[1]>bottom) continue;
    const points=[a,b,c].map(([x,y,z])=>projection(x,y,isGlass?z:0));
    const color=terrainColor(tone);
    poly(points,color,isGlass?null:color,.75);
  }
  if (isGlass) {
    ctx.globalAlpha=1;
    const sheen=ctx.createLinearGradient(minX,maxY,maxX,minY);
    sheen.addColorStop(0,'#cbcfd200');
    sheen.addColorStop(.32,'#cbcfd209');
    sheen.addColorStop(.53,'#cbcfd226');
    sheen.addColorStop(.72,'#cbcfd204');
    sheen.addColorStop(1,'#cbcfd218');
    ctx.fillStyle=sheen;
    ctx.fillRect(minX,minY,maxX-minX,maxY-minY);
    ctx.lineJoin='round';
    for (let y=-24;y<=24;y+=1.55) {
      const ridge=[];
      for(let x=-24;x<25;x+=.65) ridge.push(ground(x,y));
      poly(ridge,null,'#bfb1c21c',.6);
    }
  }
  for (const shape of lakes) {
    const shapePoints=shape.map(p=>ground(...p));
    poly([...shapePoints,shapePoints[0]],'#101b24','#617583',1.1);
  }
  poly(river.map(p=>ground(...p)),null,'#425867',1.25);
  ctx.lineJoin='round';ctx.lineCap='round';
  for(const street of connectors) poly(street.map(p=>ground(...p)),null,'#92889569',Math.min(1.3,.60+view.zoom*.1));
  for(const street of putrajayaRoads) poly(street.map(p=>ground(...p)),null,'#b2a3a17a',Math.min(1.65,.7+view.zoom*.15));
  for(const street of highways) {
    const path=street.map(p=>ground(...p));
    poly(path,null,isGlass?'#171319ba':'#171319',2.55);
    poly(path,null,isGlass?'#b9b4c294':'#aaa0ae83',Math.min(1.65,.85+view.zoom*.11));
  }
  ctx.restore();
  const rim=[...outline,outline[0]];
  if (isGlass) {
    const edge=ctx.createLinearGradient(minX,maxY,maxX,minY);
    edge.addColorStop(0,'#f87845d4');
    edge.addColorStop(.34,'#d66b4498');
    edge.addColorStop(.64,'#a98c959b');
    edge.addColorStop(1,'#f08a67ad');
    ctx.save();
    ctx.lineJoin='round';
    ctx.shadowColor='#f74b01a0';
    ctx.shadowBlur=11*dpr;
    poly(rim,null,edge,1.3);
    ctx.restore();
  } else poly(rim,null,'#766776',1.15);
}
function drawBuildings() {
  if (view.mode!=='3d') return;
  const ordered=cityBlocks.map(b=>[b,rotated(b.x,b.y)[1]]).sort((a,b)=>a[1]-b[1]);
  for(const [b] of ordered) {
    const {x,y,w,d,h,hero,start=0,cap=0}=b;
    const base=terrain(x,y);
    const corners=[[x-w/2,y-d/2],[x+w/2,y-d/2],[x+w/2,y+d/2],[x-w/2,y+d/2]];
    const top=corners.map(p=>projection(...p,base+h));
    const low=corners.map(p=>projection(...p,base+start));
    const faces=corners.map(([cx,cy],i)=>({i, depth:rotated((cx+corners[(i+1)%4][0])/2,(cy+corners[(i+1)%4][1])/2)[1]}));
    for (const {i} of faces.sort((a,b)=>a.depth-b.depth)) {
      const j=(i+1)%4;
      poly([top[i],top[j],low[j],low[i]],hero?(i%2?'#a39396':'#66575f'):(i%2?'#4b424e':'#34303b'),hero?'#b4a0a1':null,.45);
    }
    poly(top,hero?'#e6d9d7':'#665d6b',hero?'#e6d9d7':null,.5);
    if (cap) poly([projection(x,y,base+h),projection(x,y,base+h+cap)],null,'#f9dad0',1);
  }
}
function drawCompass() {
  const x=width-43,y=100,r=19;
  if(width<420) return;
  const [nx,ny]=rotated(0,-1);
  const a=Math.atan2(ny*(view.mode==='3d'?.61:1),nx);
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.strokeStyle='#7d6e7d87';ctx.lineWidth=1;ctx.stroke();
  ctx.save();ctx.translate(x,y);ctx.rotate(a);
  poly([[11,0],[-5,3.5],[-2,0],[-5,-3.5]],'#f77542');
  ctx.restore();
  ctx.font='10px ui-monospace, monospace';ctx.fillStyle='#bbb1bc';ctx.textAlign='center';ctx.fillText('N',x,y+r+15);
}
function drawLabels() {
  const visible = cityLabels.filter(l=>state.city==='all'||state.city===l.name);
  for(const {xy,name,direction,num} of visible) {
    const [x,y]=ground(...xy);
    const offset=direction*(width<600?7:14);
    const lx=x+offset, ly=y-14;
    const size=width<500?13:16;
    ctx.textAlign=direction<0?'right':'left';
    ctx.font=`750 ${size}px "Helvetica Neue",Arial,sans-serif`;
    const length=ctx.measureText(name).width;
    if(lx+(direction<0?-length:0)<8||lx+(direction>0?length:0)>width-8||ly<63||ly>height-58) continue;
    ctx.lineWidth=4;ctx.strokeStyle='#161018';ctx.strokeText(name,lx,ly);
    ctx.fillStyle='#ded7df';ctx.fillText(name,lx,ly);
    ctx.font='600 8px ui-monospace, monospace';ctx.fillStyle='#ff8c66';ctx.fillText(num,lx,ly-17);
    poly([[x,y],[lx,y-9]],null,'#d5806a89',.9);
  }
  if (view.zoom>3.4 && view.mode==='3d') {
    ctx.textAlign='left';ctx.font='600 9px ui-monospace, monospace';
    for (const {xy,label,type} of landmarks) {
      const labelHeight=type==='mosque'?.9:type==='spire'?2.2:2.85;
      const [x,y]=projection(...xy,terrain(...xy)+labelHeight);
      ctx.lineWidth=3;ctx.strokeStyle='#130e17';ctx.strokeText(label,x+5,y-3);
      ctx.fillStyle='#c7b7c7';ctx.fillText(label,x+5,y-3);
    }
  }
}
function drawScale() {
  const available=width<520?64:100;
  const km=[.1,.2,.5,1,2,5,10,20].filter(k=>k*scale()<=available).at(-1) || .1;
  const x=width<520?width-available-16:width-available-34;
  const y=width<520?77:height-52;
  const end=x+km*scale();
  ctx.font='600 9px ui-monospace, monospace';ctx.textAlign='left';ctx.fillStyle='#bdb2c0';
  ctx.fillText(km<1?`${km*1000} m`:`${km} km`,x,y-6);
  poly([[x,y-3],[x,y],[end,y],[end,y-3]],null,'#bdb2c0',1);
}
function renderMap() {
  repaint=0;
  if (canvas.hidden) return;
  ctx.setTransform(dpr,0,0,dpr,0,0);
  drawBackground(); drawLand(); drawBuildings(); drawLabels(); drawCompass(); drawScale(); renderPins();
}
function requestPaint() {
  if(!repaint) repaint=requestAnimationFrame(renderMap);
}
function resize() {
  if (canvas.hidden) return;
  const box=canvas.getBoundingClientRect();
  width=box.width; height=box.height; dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.max(1,Math.round(width*dpr)); canvas.height=Math.max(1,Math.round(height*dpr));
  baseScale=Math.min((width-26)/57,(height-140)/38);
  baseScale=Math.max(3,baseScale);
  requestPaint();
}
function fitCafes() {
  const list=visibleCafes();
  if(state.city==='all' && !state.query && !state.trail || !list.length) {
    Object.assign(view,{x:0,y:0,zoom:view.mode==='3d'?1:.97});
  } else {
    const rotatedPoints=list.map(c=>rotated(...world(c.lng,c.lat)));
    const us=rotatedPoints.map(p=>p[0]), vs=rotatedPoints.map(p=>p[1]);
    const a=Math.min(...us), b=Math.max(...us), c=Math.min(...vs), d=Math.max(...vs);
    const u=(a+b)/2, v=(c+d)/2, cos=Math.cos(view.angle), sin=Math.sin(view.angle);
    view.x=u*cos+v*sin;
    view.y=v*cos-u*sin;
    const span=Math.max(7,b-a);
    const tall=Math.max(5,(d-c)*(view.mode==='3d'?.61:1));
    view.zoom=Math.min(5,Math.max(1,Math.min((width-115)/(span*baseScale),(height-210)/(tall*baseScale))));
  }
  requestPaint();
}
function zoomMap(factor,px,py) {
  const next=Math.max(.65,Math.min(14,view.zoom*factor));
  if(px!==undefined) {
    const target=screenToWorld(px,py);
    view.zoom=next;
    const actual=screenToWorld(px,py);
    view.x+=target[0]-actual[0];view.y+=target[1]-actual[1];
  } else view.zoom=next;
  requestPaint();
}
function pointMap(cafe,amount=0) {
  const [x,y]=world(cafe.lng,cafe.lat);
  view.x=x;view.y=y;view.zoom=Math.max(amount,view.zoom);requestPaint();
}
