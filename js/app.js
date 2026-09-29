const $=s=>document.querySelector(s),R=document.documentElement,rd=Math.round;
const cl=(x,a=0,b=1)=>Math.min(b,Math.max(a,x)),lp=(a,b,t)=>a+(b-a)*t;
const h2r=h=>{if(h.length==3)h=[...h].map(c=>c+c).join('');const n=parseInt(h,16);return[n>>16&255,n>>8&255,n&255]};
const r2h=c=>'#'+c.map(v=>rd(v).toString(16).padStart(2,'0')).join('');
const NAMES="aliceblue:f0f8ff;antiquewhite:faebd7;aquamarine:7fffd4;azure:f0ffff;beige:f5f5dc;bisque:ffe4c4;black:000000;blanchedalmond:ffebcd;blue:0000ff;blueviolet:8a2be2;brown:a52a2a;burlywood:deb887;cadetblue:5f9ea0;chartreuse:7fff00;chocolate:d2691e;coral:ff7f50;cornflowerblue:6495ed;cornsilk:fff8dc;crimson:dc143c;cyan:00ffff;darkblue:00008b;darkcyan:008b8b;darkgoldenrod:b8860b;darkgray:a9a9a9;darkgreen:006400;darkkhaki:bdb76b;darkmagenta:8b008b;darkolivegreen:556b2f;darkorange:ff8c00;darkorchid:9932cc;darkred:8b0000;darksalmon:e9967a;darkseagreen:8fbc8f;darkslateblue:483d8b;darkslategray:2f4f4f;darkturquoise:00ced1;darkviolet:9400d3;deeppink:ff1493;deepskyblue:00bfff;dimgray:696969;dodgerblue:1e90ff;firebrick:b22222;floralwhite:fffaf0;forestgreen:228b22;gainsboro:dcdcdc;ghostwhite:f8f8ff;gold:ffd700;goldenrod:daa520;gray:808080;green:008000;greenyellow:adff2f;honeydew:f0fff0;hotpink:ff69b4;indianred:cd5c5c;indigo:4b0082;ivory:fffff0;khaki:f0e68c;lavender:e6e6fa;lavenderblush:fff0f5;lawngreen:7cfc00;lemonchiffon:fffacd;lightblue:add8e6;lightcoral:f08080;lightcyan:e0ffff;lightgoldenrodyellow:fafad2;lightgray:d3d3d3;lightgreen:90ee90;lightpink:ffb6c1;lightsalmon:ffa07a;lightseagreen:20b2aa;lightskyblue:87cefa;lightslategray:778899;lightsteelblue:b0c4de;lightyellow:ffffe0;lime:00ff00;limegreen:32cd32;linen:faf0e6;magenta:ff00ff;maroon:800000;mediumaquamarine:66cdaa;mediumblue:0000cd;mediumorchid:ba55d3;mediumpurple:9370db;mediumseagreen:3cb371;mediumslateblue:7b68ee;mediumspringgreen:00fa9a;mediumturquoise:48d1cc;mediumvioletred:c71585;midnightblue:191970;mintcream:f5fffa;mistyrose:ffe4e1;moccasin:ffe4b5;navajowhite:ffdead;navy:000080;oldlace:fdf5e6;olive:808000;olivedrab:6b8e23;orange:ffa500;orangered:ff4500;orchid:da70d6;palegoldenrod:eee8aa;palegreen:98fb98;paleturquoise:afeeee;palevioletred:db7093;papayawhip:ffefd5;peachpuff:ffdab9;peru:cd853f;pink:ffc0cb;plum:dda0dd;powderblue:b0e0e6;purple:800080;rebeccapurple:663399;red:ff0000;rosybrown:bc8f8f;royalblue:4169e1;saddlebrown:8b4513;salmon:fa8072;sandybrown:f4a460;seagreen:2e8b57;seashell:fff5ee;sienna:a0522d;silver:c0c0c0;skyblue:87ceeb;slateblue:6a5acd;slategray:708090;snow:fffafa;springgreen:00ff7f;steelblue:4682b4;tan:d2b48c;teal:008080;thistle:d8bfd8;tomato:ff6347;turquoise:40e0d0;violet:ee82ee;wheat:f5deb3;white:ffffff;whitesmoke:f5f5f5;yellow:ffff00;yellowgreen:9acd32";
const N=NAMES.split(';').map(s=>{const[n,h]=s.split(':');return{n,c:h2r(h)}});

/* colour maths */
const hsv2rgb=(h,s,v)=>{const f=n=>{const k=(n+h/60)%6;return v-v*s*Math.max(0,Math.min(k,4-k,1))};return[f(5),f(3),f(1)].map(x=>rd(x*255))};
const rgb2hsv=([r,g,b],ph=0)=>{r/=255;g/=255;b/=255;const M=Math.max(r,g,b),m=Math.min(r,g,b),d=M-m;let h=ph;if(d){h=M==r?((g-b)/d)%6:M==g?(b-r)/d+2:(r-g)/d+4;h=(h*60+360)%360}return{h,s:M?d/M:0,v:M}};
const hsl=c=>{const p=rgb2hsv(c),l=p.v*(1-p.s/2);return[p.h,l&&l<1?(p.v-l)/Math.min(l,1-l):0,l]};
const lin=c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4};
const unlin=c=>255*(c<=.0031308?12.92*c:1.055*c**(1/2.4)-.055);
const toLab=([r,g,b])=>{r=lin(r);g=lin(g);b=lin(b);const l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b),m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b),s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);return[.2104542553*l+.793617785*m-.0040720468*s,1.9779984951*l-2.428592205*m+.4505937099*s,.0259040371*l+.7827717662*m-.808675766*s]};
const fromLab=([L,a,b])=>{const l=(L+.3963377774*a+.2158037573*b)**3,m=(L-.1055613458*a-.0638541728*b)**3,s=(L-.0894841775*a-1.291485548*b)**3;return[4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.707614701*s].map(x=>unlin(cl(x)))};
function mix(A,B,t,m){
  if(m=='rgb')return A.map((v,i)=>lp(v,B[i],t));
  if(m=='light')return A.map((v,i)=>unlin(lp(lin(v),lin(B[i]),t)));
  if(m=='oklab'){const p=toLab(A),q=toLab(B);return fromLab(p.map((v,i)=>lp(v,q[i],t)))}
  if(m=='paint'){const f=.06;return A.map((v,i)=>255*cl((Math.max(v/255,f)**(1-t)*Math.max(B[i]/255,f)**t-f)/(1-f)))}
  const p=rgb2hsv(A),q=rgb2hsv(B);let hp=p.h,hq=q.h;if(!p.s)hp=hq;if(!q.s)hq=hp;
  const d=((hq-hp+540)%360)-180;return hsv2rgb((hp+d*t+360)%360,lp(p.s,q.s,t),lp(p.v,q.v,t));
}
let NL;
function nearest(c){NL=NL||N.map(n=>toLab(n.c));const l=toLab(c);let bi=0,bd=9;NL.forEach((q,i)=>{const d=(q[0]-l[0])**2+(q[1]-l[1])**2+(q[2]-l[2])**2;if(d<bd){bd=d;bi=i}});return{n:N[bi].n,exact:bd<1e-6}}

/* state */
const S={a:{h:210,s:.72,v:.95},b:{h:38,s:.92,v:1},act:'a',mode:'oklab',t:.5,cm:[.5,.5]};
const MODES={oklab:'Perceptual',light:'Light',rgb:'sRGB',hue:'Hue arc',paint:'Paint'};
const HINT={oklab:'Smooth to the eye, built on OKLab.',light:'Overlapping beams of light.',rgb:'A plain channel average.',hue:'Travels around the colour wheel.',paint:'Subtractive, like blending pigments.'};
const rgbOf=k=>hsv2rgb(S[k].h,S[k].s,S[k].v);
const css=c=>`rgb(${c.map(rd)})`;
const ink=c=>c[0]*.299+c[1]*.587+c[2]*.114>150?'#08101f':'#fff';
const setRGB=c=>{S[S.act]=rgb2hsv(c,S[S.act].h);render()};

/* build controls */
$('#modes').innerHTML=Object.entries(MODES).map(([k,v])=>`<button data-m="${k}">${v}</button>`).join('');
$('#steps').innerHTML=Array.from({length:9},(_,i)=>`<button aria-label="Mix ${i*12.5}% of B"></button>`).join('');
const steps=[...$('#steps').children];
steps.forEach((b,i)=>b.onclick=()=>{S.t=i/8;render()});
const ch=['R','G','B'].map((n,i)=>{const d=document.createElement('div');d.className='ch';d.innerHTML=`<span>${n}</span><input type="range" min="0" max="255" aria-label="${n} channel"><output></output>`;$('#rgb').append(d);const e=d.querySelector('input');e.oninput=()=>{const c=rgbOf(S.act);c[i]=+e.value;setRGB(c)};return e});
$('#lib').innerHTML=N.map((n,i)=>`<button data-n="${i}"><i style="background:${r2h(n.c)}"></i><span>${n.n}</span></button>`).join('');

/* studio canvas */
const sv=$('#sv');
function drawSV(){
  const g=sv.getContext('2d'),w=sv.width,h=sv.height,k=S[S.act];
  g.fillStyle=`hsl(${k.h},100%,50%)`;g.fillRect(0,0,w,h);
  let l=g.createLinearGradient(0,0,w,0);l.addColorStop(0,'#fff');l.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=l;g.fillRect(0,0,w,h);
  l=g.createLinearGradient(0,0,0,h);l.addColorStop(0,'rgba(0,0,0,0)');l.addColorStop(1,'#000');g.fillStyle=l;g.fillRect(0,0,w,h);
  const x=k.s*w,y=(1-k.v)*h;g.lineWidth=3;g.strokeStyle='#fff';g.beginPath();g.arc(x,y,10,0,7);g.stroke();
  g.lineWidth=1;g.strokeStyle='rgba(0,0,0,.55)';g.beginPath();g.arc(x,y,12.5,0,7);g.stroke();
}
const pick=e=>{const r=sv.getBoundingClientRect(),k=S[S.act];k.s=cl((e.clientX-r.left)/r.width);k.v=1-cl((e.clientY-r.top)/r.height);render()};
sv.onpointerdown=e=>{sv.setPointerCapture(e.pointerId);pick(e);sv.onpointermove=pick};
sv.onpointerup=sv.onpointercancel=()=>sv.onpointermove=null;

/* render */
function render(){
  const A=rgbOf('a'),B=rgbOf('b'),M=mix(A,B,S.t,S.mode).map(v=>cl(rd(v),0,255));
  Object.assign(S,{A,B,M,T:[A,B,M,mix(A,M,.5,'rgb'),mix(B,M,.5,'rgb')]});
  R.style.setProperty('--a',css(A));R.style.setProperty('--b',css(B));R.style.setProperty('--m',css(M));
  $('#ha').textContent=r2h(A);$('#hb').textContent=r2h(B);$('#hm').textContent=r2h(M);$('#opm').textContent=MODES[S.mode];
  document.querySelectorAll('[data-s]').forEach(e=>e.classList.toggle('on',e.dataset.s==S.act));
  document.querySelectorAll('[data-m]').forEach(e=>e.classList.toggle('on',e.dataset.m==S.mode));
  $('#hint').textContent=HINT[S.mode];
  const c=rgbOf(S.act);
  $('#hue').value=S[S.act].h;
  if(document.activeElement!==$('#hex'))$('#hex').value=r2h(c);
  ch.forEach((e,i)=>{e.value=c[i];e.nextElementSibling.textContent=c[i];const lo=[...c],hi=[...c];lo[i]=0;hi[i]=255;e.style.setProperty('--trk',`linear-gradient(90deg,${css(lo)},${css(hi)})`)});
  drawSV();
  const p=rd(S.t*100);$('#t').value=p;$('#pa').textContent=100-p+'%';$('#pb').textContent=p+'%';
  $('#out').style.color=ink(M);$('#outhex').textContent=r2h(M);
  const nm=nearest(M);$('#outname').textContent=nm.exact?nm.n:'near '+nm.n;
  const [h,s,l]=hsl(M);$('#drgb').textContent=M.join(', ');$('#dhsl').textContent=`${rd(h)}°, ${rd(s*100)}%, ${rd(l*100)}%`;
  steps.forEach((b,i)=>b.style.background=css(mix(A,B,i/8,S.mode)));
  afterRender();
}

/* events */
document.querySelectorAll('[data-s]').forEach(e=>e.onclick=()=>{S.act=e.dataset.s;render()});
document.querySelectorAll('[data-m]').forEach(e=>e.onclick=()=>{S.mode=e.dataset.m;render()});
$('#hue').oninput=e=>{S[S.act].h=+e.target.value;render()};
$('#t').oninput=e=>{S.t=e.target.value/100;render()};
$('#hex').oninput=e=>{const v=e.target.value.trim().replace('#','');if(/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v))setRGB(h2r(v))};
$('#hex').onblur=render;
$('#rnd').onclick=()=>setRGB([0,0,0].map(()=>rd(Math.random()*255)));
$('#swap').onclick=()=>{[S.a,S.b]=[S.b,S.a];render()};
$('#toa').onclick=()=>{S.a=rgb2hsv(S.M,S.a.h);render()};
$('#tob').onclick=()=>{S.b=rgb2hsv(S.M,S.b.h);render()};
$('#copy').onclick=async()=>{const b=$('#copy');try{await navigator.clipboard.writeText(r2h(S.M));b.textContent='Copied'}catch(e){b.textContent='Copy blocked'}setTimeout(()=>b.textContent='Copy hex',1400)};
$('#lib').onclick=e=>{const b=e.target.closest('button');if(b)setRGB(N[b.dataset.n].c)};
$('#q').oninput=e=>{const v=e.target.value.toLowerCase().trim();[...$('#lib').children].forEach(b=>b.hidden=!N[b.dataset.n].n.includes(v))};
if(window.EyeDropper){$('#eye').hidden=false;$('#eye').onclick=async()=>{try{const r=await new EyeDropper().open();setRGB(h2r(r.sRGBHex.slice(1)))}catch(e){}}}

/* Backend: local (localStorage) so it works on static hosting. Swap this object for a remote API to share scores. */
const Backend=(()=>{const K='tidal-mixer:v1';let d={runs:[],plays:0};
  try{d={...d,...JSON.parse(localStorage.getItem(K)||'{}')}}catch(e){}
  const save=()=>{try{localStorage.setItem(K,JSON.stringify(d))}catch(e){}},day=()=>new Date().toISOString().slice(0,10);
  return{
    async submitScore(r){d.runs=[r,...d.runs].slice(0,100);d.plays++;save();return r},
    async leaderboard(m){return d.runs.filter(r=>r.mode==m).sort((a,b)=>b.score-a.score).slice(0,5)},
    async best(m){const s=d.runs.filter(r=>r.mode==m&&(m=='match'||r.date.startsWith(day()))).map(r=>r.score);return s.length?Math.max(...s):0},
    async stats(){return{plays:d.plays}},
    async reset(){d={runs:[],plays:0};save()}
  }})();

/* Game: match the target by choosing two tubes and a blend. Daily uses the UTC date as its seed. */
const G={m:'match',round:0,total:8,scores:[],tubes:[],target:[0,0,0],ans:[0,1,50],locked:0,ia:0,ib:1,rng:Math.random};
const pool=N.filter(n=>{const p=rgb2hsv(n.c);return(p.s>.55&&p.v>.55)||n.n=='white'||n.n=='black'});
const mulberry=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const shuffle=(a,r)=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const dE=(a,b)=>{const p=toLab(a),q=toLab(b);return Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2])};
const updBar=()=>{$('#rn').textContent=`${G.round+1} of ${G.total}`;$('#tot').textContent=G.scores.reduce((a,b)=>a+b,0)};
function afterRender(){if(G.m=='sandbox')return;[...$('#tb').children].forEach((b,i)=>b.classList.toggle('sel',i==G.ia||i==G.ib))}
function newRound(){
  const r=G.rng,k=4+Math.floor(G.round/3),t=shuffle(pool,r).slice(0,k),i=Math.floor(r()*k);let j=Math.floor(r()*(k-1));if(j>=i)j++;
  const p=(2+Math.floor(r()*17))*5;
  Object.assign(G,{tubes:t,ans:[i,j,p],locked:0,ia:0,ib:1,target:mix(t[i].c,t[j].c,p/100,'oklab').map(v=>cl(rd(v),0,255))});
  S.mode='oklab';S.t=.5;S.act='a';S.a=rgb2hsv(t[0].c);S.b=rgb2hsv(t[1].c);
  $('#tb').innerHTML=t.map((x,n)=>`<button data-i="${n}" style="--c:${r2h(x.c)}"><i></i><span>${x.n}</span></button>`).join('');
  const el=$('#tgt');el.style.setProperty('--t',css(G.target));el.style.color=ink(G.target);$('#tgtname').textContent='?';
  $('#fb').textContent='Pick two tubes, then set the blend and lock in.';$('#lock').textContent='Lock in';
  updBar();render();
}
function setMode(m){
  G.m=m;const play=m!='sandbox';
  $('#game').hidden=!play;$('#free').hidden=play;$('#tubes').hidden=!play;$('#toa').hidden=$('#tob').hidden=play;
  $('#modes').style.cssText=play?'opacity:.4;pointer-events:none':'';
  document.querySelectorAll('[data-g]').forEach(e=>e.classList.toggle('on',e.dataset.g==m));
  if(play){G.round=0;G.scores=[];G.rng=mulberry(m=='daily'?[...new Date().toISOString().slice(0,10)].reduce((h,c)=>h*31+c.charCodeAt(0)|0,7):Date.now());newRound()}else render();
  showRecords();
}
async function finish(){
  const tot=G.scores.reduce((a,b)=>a+b,0);G.locked=2;
  $('#fb').textContent=`Run complete: ${tot} of ${G.total*100}. `+(tot>=720?'Master mixer.':tot>=560?'Sharp eye.':tot>=360?'Solid palette.':'Keep practising.');
  $('#lock').textContent='Play again';
  await Backend.submitScore({mode:G.m,score:tot,date:new Date().toISOString(),scores:G.scores});showRecords();
}
async function showRecords(){
  const [bm,bd,st,top]=await Promise.all([Backend.best('match'),Backend.best('daily'),Backend.stats(),Backend.leaderboard('match')]);
  $('#recs').innerHTML=`<dt>Best Match run</dt><dd>${bm} of ${G.total*100}</dd><dt>Today's Daily</dt><dd>${bd||'not played yet'}</dd><dt>Runs played</dt><dd>${st.plays}</dd>`;
  $('#top').innerHTML=top.map(r=>`<li>${r.score} on ${r.date.slice(0,10)}</li>`).join('')||'<li>No runs yet. Play a Match to start the board.</li>';
  $('#best').textContent=G.m=='daily'?bd:bm;
}
$('#lock').onclick=()=>{
  if(G.locked==2)return setMode(G.m);
  if(G.locked==1){if(G.round+1<G.total){G.round++;newRound()}else finish();return}
  const d=dE(S.M,G.target),sc=Math.round(100*Math.max(0,1-d/.25)**1.5),[i,j,p]=G.ans;
  G.scores.push(sc);G.locked=1;
  $('#fb').textContent=`${sc} points. ${sc>=95?'Spot on.':sc>=80?'Very close.':sc>=55?'Getting there.':'Off the mark.'} It was ${G.tubes[i].n} with ${p}% ${G.tubes[j].n}.`;
  $('#tgtname').textContent=r2h(G.target);$('#lock').textContent=G.round+1<G.total?'Next round':'See results';updBar();
};
$('#tb').onclick=e=>{const b=e.target.closest('button');if(!b||G.locked)return;const i=+b.dataset.i;G['i'+S.act]=i;S[S.act]=rgb2hsv(G.tubes[i].c);S.act=S.act=='a'?'b':'a';render()};
$('#reset').onclick=async()=>{await Backend.reset();showRecords()};
document.querySelectorAll('[data-g]').forEach(e=>e.onclick=()=>setMode(e.dataset.g));

/* background: three bodies orbiting a drifting well, ripples radiating from it */
const cv=$('#bg'),g=cv.getContext('2d');let W,H;
const size=()=>{W=cv.width=Math.ceil(innerWidth/2);H=cv.height=Math.ceil(innerHeight/2)};size();addEventListener('resize',size);
const GR=.01,P={x:.5,y:.5,on:0};
addEventListener('pointermove',e=>{P.x=e.clientX/innerWidth;P.y=e.clientY/innerHeight;P.on=1});
const bl=[0,1,2,3,4].map(i=>{const a=i*1.2566,r=.18+.05*i,v=Math.sqrt(GR/r)*(i%2?.8:1.05);return{x:.5+Math.cos(a)*r,y:.5+Math.sin(a)*r,vx:-Math.sin(a)*v,vy:Math.cos(a)*v,r:.34+.06*(i%3),c:[5,10,20]}});
function step(dt,T){
  const cx=.5+.06*Math.sin(T*.31),cy=.5+.05*Math.cos(T*.23);S.cm=[cx,cy];
  for(const b of bl){
    let dx=cx-b.x,dy=cy-b.y,q=dx*dx+dy*dy+.02,f=GR/(q*Math.sqrt(q))+.02;b.vx+=dx*f*dt;b.vy+=dy*f*dt;
    for(const o of bl)if(o!==b){dx=o.x-b.x;dy=o.y-b.y;q=dx*dx+dy*dy+.03;f=.0012/(q*Math.sqrt(q));b.vx+=dx*f*dt;b.vy+=dy*f*dt}
    if(P.on){dx=P.x-b.x;dy=P.y-b.y;q=dx*dx+dy*dy+.03;f=.004*P.on/(q*Math.sqrt(q));b.vx+=dx*f*dt;b.vy+=dy*f*dt}
  }
  for(const b of bl){b.x+=b.vx*dt;b.y+=b.vy*dt}
}
const bub=Array.from({length:16},()=>({x:Math.random(),y:Math.random(),r:.008+Math.random()*.02,s:.015+Math.random()*.03,p:Math.random()*6}));
function draw(T){
  const m=Math.max(W,H),sw=Math.sin(T*.2);
  g.globalCompositeOperation='source-over';
  const L=g.createLinearGradient(W*(.1+.1*sw),0,W*(.9-.1*sw),H);
  ['#00c2e0','#2f6bff','#8a3dff','#ff3fbf'].forEach((c,i)=>L.addColorStop(i/3,c));
  g.fillStyle=L;g.fillRect(0,0,W,H);
  bl.forEach((b,i)=>{const t=S.T[i];if(!b.i){b.c=[...t];b.i=1}for(let k=0;k<3;k++)b.c[k]+=(t[k]-b.c[k])*.05;
    const x=b.x*W,y=b.y*H,r=b.r*m,c=b.c.map(rd).join(),gr=g.createRadialGradient(x,y,0,x,y,r);
    gr.addColorStop(0,`rgba(${c},.5)`);gr.addColorStop(1,`rgba(${c},0)`);g.fillStyle=gr;g.fillRect(x-r,y-r,2*r,2*r)});
  g.globalCompositeOperation='lighter';g.lineWidth=m*.005;
  for(let i=0;i<6;i++){g.strokeStyle=`rgba(255,255,255,${.05+.025*(i%3)})`;g.beginPath();for(let k=0;k<=24;k++){const x=W*k/24,y=H*(i+.5)/6+Math.sin(k/4+T*.5+i*1.7)*H*.05+Math.sin(k/2.2-T*.35+i)*H*.02;k?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}
  g.lineWidth=1.5;
  for(let i=0;i<4;i++){const p=(T*.07+i/4)%1;g.strokeStyle=`rgba(255,255,255,${.22*(1-p)})`;g.beginPath();g.arc(S.cm[0]*W,S.cm[1]*H,p*m*.7,0,7);g.stroke()}
  g.globalCompositeOperation='source-over';
  [[.25,.3,.5,.34,-.25],[.72,.65,.42,.5,.18],[.5,.92,.6,.3,.05]].forEach(([x,y,w,h,a],i)=>{
    g.save();g.translate((x+.04*Math.sin(T*.13+i))*W,(y+.03*Math.cos(T*.17+i*2))*H);g.rotate(a+.05*Math.sin(T*.1+i));
    const pw=w*W,ph=h*H,gr=g.createLinearGradient(-pw/2,-ph/2,pw/2,ph/2);
    gr.addColorStop(0,'rgba(255,255,255,.22)');gr.addColorStop(.5,'rgba(255,255,255,.03)');gr.addColorStop(1,'rgba(255,255,255,.14)');
    g.fillStyle=gr;g.strokeStyle='rgba(255,255,255,.32)';g.lineWidth=1.5;g.beginPath();
    g.roundRect?g.roundRect(-pw/2,-ph/2,pw,ph,m*.05):g.rect(-pw/2,-ph/2,pw,ph);g.fill();g.stroke();g.restore()});
  bub.forEach(b=>{const x=(b.x+.02*Math.sin(T*.5+b.p))*W,y=(((b.y-T*b.s)%1+1)%1)*H,r=b.r*m,gr=g.createRadialGradient(x,y,r*.2,x,y,r);
    gr.addColorStop(0,'rgba(255,255,255,.02)');gr.addColorStop(.8,'rgba(255,255,255,.12)');gr.addColorStop(1,'rgba(255,255,255,.5)');
    g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,7);g.fill();g.fillStyle='rgba(255,255,255,.7)';g.beginPath();g.arc(x-r*.35,y-r*.4,r*.15,0,7);g.fill()});
}
setMode('match');
const slow=matchMedia('(prefers-reduced-motion:reduce)').matches?.3:1;
let last=performance.now(),T=0;
(function f(n){const dt=Math.min(.05,(n-last)/1000)*slow;last=n;T+=dt;P.on=Math.max(0,P.on-dt*.25);step(dt,T);draw(T);requestAnimationFrame(f)})(last);
