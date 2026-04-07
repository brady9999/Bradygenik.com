
let topZ = 200;

function openWin(id){
  const w=document.getElementById(id);
  if(!w)return;
  w.classList.add('open');focusWin(id);updateDock();
}
function closeWin(id){
  const w=document.getElementById(id);
  if(w){w.classList.remove('open','focus');}updateDock();
}
function focusWin(id){
  document.querySelectorAll('.win').forEach(w=>w.classList.remove('focus'));
  const w=document.getElementById(id);
  if(w){w.classList.add('focus');w.style.zIndex=++topZ;}
}

document.addEventListener('DOMContentLoaded', () => {
const tHist  = document.getElementById('t-hist');
const tInput = document.getElementById('ti');
const tBody  = document.getElementById('trm-body');
let tCmdHist = [];
let tIdx = -1;

let nTimer;
function notif(icon, title, body) {
  document.getElementById('ni-icon').textContent = icon;
  document.getElementById('ni-title').textContent = title;
  document.getElementById('ni-body').textContent = body;
  const el = document.getElementById('notif-el');
  el.classList.add('show');
  clearTimeout(nTimer);
  nTimer = setTimeout(() => el.classList.remove('show'), 3500);
}

/* Clock */
function tick(){
  const n=new Date(),D=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    M=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  document.getElementById('pclock').textContent=
    `${D[n.getDay()]} ${String(n.getDate()).padStart(2,'0')} ${M[n.getMonth()]}, ${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
}
tick(); setInterval(tick,10000);


/* Window */
let topZ=200;
function focusWin(id){
  document.querySelectorAll('.win').forEach(w=>w.classList.remove('focus'));
  const w=document.getElementById(id);
  if(w){w.classList.add('focus');w.style.zIndex=++topZ;}
}
function openWin(id){
  const w=document.getElementById(id);
  if(!w)return;
  w.classList.add('open');focusWin(id);updateDock();
}
function closeWin(id){
  const w=document.getElementById(id);
  if(w){w.classList.remove('open','focus');}updateDock();
}
function updateDock(){
  [['w-files','di-files'],['w-term','di-term']].forEach(([w,d])=>{
    const el=document.getElementById(d);
    if(el)el.classList.toggle('run',document.getElementById(w).classList.contains('open'));
  });
}

// Close dots
document.querySelectorAll('.wd.cl').forEach(b=>{
  b.addEventListener('click',e=>{e.stopPropagation();closeWin(b.dataset.cl);});
});
// Focus on click
document.querySelectorAll('.win').forEach(w=>{
  w.addEventListener('mousedown',()=>focusWin(w.id));
});

/* Drag Windows */
document.querySelectorAll('.whdr').forEach(hdr=>{
  const win=document.getElementById(hdr.dataset.w);
  let drag=false,ox=0,oy=0;
  hdr.addEventListener('mousedown',e=>{
    if(e.target.classList.contains('wd'))return;
    drag=true;
    const r=win.getBoundingClientRect();
    ox=e.clientX-r.left; oy=e.clientY-r.top;
    focusWin(win.id); e.preventDefault();
  });
  document.addEventListener('mousemove',e=>{
    if(!drag)return;
    win.style.left=Math.max(0,Math.min(window.innerWidth-win.offsetWidth,e.clientX-ox))+'px';
    win.style.top=Math.max(32,Math.min(window.innerHeight-win.offsetHeight,e.clientY-oy))+'px';
  });
  document.addEventListener('mouseup',()=>{drag=false;});
});

/* Resize Windows */
document.querySelectorAll('.wrsz').forEach(h=>{
  const win=h.closest('.win');
  let r=false,sx=0,sy=0,sw=0,sh=0;
  h.addEventListener('mousedown',e=>{r=true;sx=e.clientX;sy=e.clientY;sw=win.offsetWidth;sh=win.offsetHeight;e.preventDefault();e.stopPropagation();});
  document.addEventListener('mousemove',e=>{if(!r)return;win.style.width=Math.max(320,sw+(e.clientX-sx))+'px';win.style.height=Math.max(180,sh+(e.clientY-sy))+'px';});
  document.addEventListener('mouseup',()=>{r=false;});
});



/* Desktop icons */
const DESK_ICONS=[
  {lbl:'files',          ico:'🗂️',bg:'linear-gradient(135deg,#5c9bd6,#3a7abf)', action:()=>openWin('w-files')},
  {lbl:'bradygenik.conf',     ico:'📄',bg:'linear-gradient(135deg,#1565c0,#0d47a1)',action:()=>openWin('w-conf')},
  {lbl:'brady.ascii',    ico:'🖼️',bg:'linear-gradient(135deg,#2e7d32,#1b5e20)', action:()=>openWin('w-ascii')},
  {lbl:'Malicious.sh',   ico:'⚠️', bg:'linear-gradient(135deg,#ff0000,#8b0000)', action:()=>openWin('w-malicious')},
  {lbl:'Trash', ico:'🗑️', bg:'linear-gradient(135deg,#4a4a4a,#2a2a2a)'},
];
const di=document.getElementById('desk-icons');
DESK_ICONS.forEach(ic=>{
  const el=document.createElement('div');
  el.className='icon';
  el.innerHTML=`<div class="icon-img" style="background:${ic.bg}">${ic.ico}</div><div class="icon-lbl">${ic.lbl}</div>`;
  let clicks=0;
  el.addEventListener('click',e=>{
    e.stopPropagation();
    document.querySelectorAll('.icon').forEach(d=>d.classList.remove('sel'));
    el.classList.add('sel'); clicks++;
    setTimeout(()=>{if(clicks>=2)ic.action();clicks=0;},260);
  });
  di.appendChild(el);
});
document.getElementById('desktop').addEventListener('click',()=>{
  document.querySelectorAll('.icon').forEach(d=>d.classList.remove('sel'));
});

/* File Manager */
const FOLDERS = {
  home: {
    path: '/home/brady',
    title: "Files - brady's Home",
    files: [
      {n:'projects',        ico:'🗂️', bg:'linear-gradient(135deg,#f9a825,#f57c00)', a:()=>navigateFolder('projects')},
      {n:'brady.conf',      ico:'📄', bg:'linear-gradient(135deg,#1565c0,#0d47a1)', a:()=>openWin('w-conf')},
      {n:'brady.ascii',     ico:'🖼️', bg:'linear-gradient(135deg,#2e7d32,#1b5e20)', a:()=>openWin('w-ascii')},
      {n:'.hidden',         ico:'🔒', bg:'linear-gradient(135deg,#6a1b9a,#4a148c)', a:()=>{openWin('w-hidden')}},
    ]
  },
  desktop: {
    path: '/home/brady/Desktop',
    title: 'Files - Desktop',
    files: [
      {n:'projects',        ico:'🗂️', bg:'linear-gradient(135deg,#f9a825,#f57c00)', a:()=>navigateFolder('projects')},
      {n:'brady.conf',      ico:'📄', bg:'linear-gradient(135deg,#1565c0,#0d47a1)', a:()=>openWin('w-conf')},
      {n:'brady.ascii',     ico:'🖼️', bg:'linear-gradient(135deg,#2e7d32,#1b5e20)', a:()=>openWin('w-ascii')},
      {n:'.hidden',         ico:'🔒', bg:'linear-gradient(135deg,#6a1b9a,#4a148c)', a:()=>{openWin('w-hidden')}},
      {n:'Malicious.sh',   ico:'⚠️', bg:'linear-gradient(135deg,#ff0000,#8b0000)', a:()=>{openWin('w-malicious')}},
    ]
  },
  downloads: {
    path: '/home/brady/Downloads',
    title: 'Files - Downloads',
    files: [
      {n:'resume.pdf',   ico:'📑', bg:'linear-gradient(135deg,#b71c1c,#880e0e)'},
      {n:'genik-os.iso', ico:'💿', bg:'linear-gradient(135deg,#E95420,#bf360c)'},
    ]
  },
  documents: {
    path: '/home/brady/Documents',
    title: 'Files - Documents',
    files: [
      {n:'notes.txt',     ico:'📝', bg:'linear-gradient(135deg,#455a64,#263238)'},
      {n:'cert_cloud.pdf',ico:'📜', bg:'linear-gradient(135deg,#1a237e,#0d47a1)'},
    ]
  },
  projects: {
    path: '/home/brady/projects',
    title: 'Files - Projects',
    files: [
      {n:'Apollo',       ico:'🎵', bg:'linear-gradient(135deg,#1565c0,#0d47a1)', a:()=>window.open('https://github.com/brady9999/Apollo','_blank')},
      {n:'Wrangler Dash',ico:'📊', bg:'linear-gradient(135deg,#2e7d32,#1b5e20)', a:()=>window.open('https://github.com/brady9999/Wrangler-Dashboard','_blank')},
      {n:'Athena',       ico:'🦉', bg:'linear-gradient(135deg,#6a1b9a,#4a148c)', a:()=>window.open('https://github.com/brady9999/Athena','_blank')},
      {n:'Hermes',       ico:'📝', bg:'linear-gradient(135deg,#e65100,#bf360c)', a:()=>window.open('https://github.com/brady9999/Hermes','_blank')},
      {n:'Hephaestus',   ico:'🎨', bg:'linear-gradient(135deg,#558b2f,#33691e)', a:()=>window.open('https://github.com/brady9999/Hephaestus','_blank')},
      {n:'???.zip',      ico:'❓', bg:'linear-gradient(135deg,#37474f,#263238)', a:()=>notif('','')},
    ]
  },
};

let fmHistory = ['home'], fmHistIdx = 0;

function renderFolder(key) {
  const folder = FOLDERS[key];
  if (!folder) return;
  document.querySelectorAll('.fm-sbi[data-folder]').forEach(el => {
    el.classList.toggle('act', el.dataset.folder === key);
  });
  document.getElementById('fm-path').textContent = folder.path;
  document.getElementById('fm-title').textContent = folder.title;
  const fg = document.getElementById('fm-grid');
  fg.innerHTML = '';
  folder.files.forEach(f => {
    const el = document.createElement('div');
    el.className = 'fm-f';
    el.innerHTML = `<div class="fm-fi" style="background:${f.bg}">${f.ico}</div><div class="fm-fn">${f.n}</div>`;
    let clicks = 0;
    el.addEventListener('click', e => {
      document.querySelectorAll('.fm-f').forEach(ff => ff.classList.remove('sel'));
      el.classList.add('sel'); clicks++;
      setTimeout(() => { if (clicks >= 2) f.a(); clicks = 0; }, 260);
      e.stopPropagation();
    });
    fg.appendChild(el);
  });
}

function navigateFolder(key) {
  fmHistory = fmHistory.slice(0, fmHistIdx + 1);
  fmHistory.push(key);
  fmHistIdx = fmHistory.length - 1;
  renderFolder(key);
}

document.querySelectorAll('.fm-sbi[data-folder]').forEach(el => {
  el.addEventListener('click', () => navigateFolder(el.dataset.folder));
});

// back / forward / up buttons (assumes they're the first 3 .fmb buttons in #w-files)
const fmBtns = document.querySelectorAll('#w-files .fmb');
fmBtns[0].addEventListener('click', () => { if (fmHistIdx > 0) { fmHistIdx--; renderFolder(fmHistory[fmHistIdx]); } });
fmBtns[1].addEventListener('click', () => { if (fmHistIdx < fmHistory.length - 1) { fmHistIdx++; renderFolder(fmHistory[fmHistIdx]); } });
fmBtns[2].addEventListener('click', () => navigateFolder('home'));

renderFolder('home');

const diM = document.getElementById('w-malicious');
if (diM) {
  diM.addEventListener('click', () => MaliciousScript());
} else {
  console.warn('di-settings not found - check your dock HTML has id="di-settings"');
}

const diSettings = document.getElementById('di-settings');
if (diSettings) {
  diSettings.addEventListener('click', () => virusScan());
} else {
  console.warn('di-settings not found - check your dock HTML has id="di-settings"');
}

function virusScan() {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;inset:0;background:#0a0a0a;z-index:9999;
    display:flex;flex-direction:column;padding:40px;
    font-family:var(--mono,monospace);font-size:13px;line-height:1.8;
    overflow:hidden;cursor:pointer;
  `;

  const lines = [
    { text:'[ SCAN ]  Initializing GENIK-AV v1.3.3.7...', color:'#f0f0f0', delay:0 },
    { text:'[ OK   ]  Signature database loaded (last updated: never)', color:'#4CAF50', delay:300 },
    { text:'[ SCAN ]  Scanning /home/brady...', color:'#f0f0f0', delay:700 },
    { text:'[ OK   ]  /home/brady/projects - clean', color:'#4CAF50', delay:1100 },
    { text:'[ OK   ]  /home/brady/resume.pdf - clean (still a placeholder tho)', color:'#4CAF50', delay:1500 },
    { text:'[ WARN ]  /home/brady/.hidden - suspicious but intentional', color:'#FFB000', delay:1900 },
    { text:'[ SCAN ]  Scanning system processes...', color:'#f0f0f0', delay:2400 },
    { text:'[ OK   ]  portfolio.service - clean', color:'#4CAF50', delay:2800 },
    { text:'[ OK   ]  terminal.service - clean', color:'#4CAF50', delay:3100 },
    { text:'[ SCAN ]  Deep scanning brady_genik.conf...', color:'#f0f0f0', delay:3500 },
    { text:'[ !!!  ]  THREAT DETECTED: too_much_ambition.exe', color:'#FF4444', delay:4100 },
    { text:'[ !!!  ]  THREAT DETECTED: caffeine_dependency.ko', color:'#FF4444', delay:4400 },
    { text:'[ !!!  ]  THREAT DETECTED: sleep_schedule_missing.dll', color:'#FF4444', delay:4700 },
    { text:'[ WARN ]  THREAT DETECTED: 47 unfinished_side_projects.zip', color:'#FFB000', delay:5000 },
    { text:' ', color:'#555', delay:5400 },
    { text:'[ DONE ]  Scan complete. 3 critical threats found.', color:'#f0f0f0', delay:5800 },
    { text:'[ INFO ]  Recommended action: touch grass, get some sleep', color:'#4DA6FF', delay:6200 },
    { text:'[ INFO ]  Quarantine failed - threats are core personality traits', color:'#4DA6FF', delay:6600 },
    { text:' ', color:'#555', delay:7000 },
    { text:'[ EXIT ]  Click anywhere to dismiss...', color:'#555', delay:7400 },
  ];

  const content = document.createElement('div');
  content.style.cssText = `pointer-events:none;`;

  lines.forEach(l => {
    const el = document.createElement('div');
    el.textContent = l.text;
    el.style.cssText = `opacity:0;white-space:pre;color:${l.color};`;
    setTimeout(() => { el.style.opacity = '1'; }, l.delay);
    content.appendChild(el);
  });

  const barRow = document.createElement('div');
  barRow.style.cssText = `display:flex;align-items:center;gap:12px;opacity:0;margin-top:8px;pointer-events:none;`;
  barRow.innerHTML = `
    <span style="color:#4CAF50;font-size:13px;">[ PROG ] </span>
    <div style="height:6px;width:280px;background:#2a2a2a;border-radius:1px;overflow:hidden;">
      <div id="av-fill" style="height:100%;width:0%;background:#FF4444;box-shadow:0 0 10px #FF4444;"></div>
    </div>
    <span id="av-pct" style="color:#FF4444;font-size:13px;">0%</span>
  `;
  content.appendChild(barRow);
  overlay.appendChild(content);
  document.body.appendChild(overlay);

  setTimeout(() => {
    barRow.style.opacity = '1';
    const fill = document.getElementById('av-fill');
    const pct = document.getElementById('av-pct');
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 4 + 1;
      if (p >= 100) { p = 100; clearInterval(iv); }
      fill.style.width = p + '%';
      pct.textContent = Math.floor(p) + '%';
    }, 120);
  }, 800);

  let canDismiss = false;
  setTimeout(() => { canDismiss = true; }, 7500);

  overlay.addEventListener('click', () => {
    if (!canDismiss) return;
    overlay.style.transition = 'opacity 0.4s';
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();

      notif();

      const kris = document.createElement('img');
      kris.src = '/Images/krissed.gif';
      kris.style.cssText = `
        position:fixed;
        top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:70vw;max-width:800px;
        border-radius:12px;z-index:9999;
        box-shadow:0 16px 64px rgba(0,0,0,.8);
        border:3px solid #333;
      `;
      document.body.appendChild(kris);

      const closeBtn = document.createElement('div');
      closeBtn.textContent = '✕';
      closeBtn.style.cssText = `
        position:fixed;
        top:calc(50% - 35vw / 1.5);
        right:calc(50% - 35vw - 12px);
        background:#333;color:#fff;border-radius:50%;
        width:28px;height:28px;display:flex;align-items:center;
        justify-content:center;font-size:14px;cursor:pointer;
        z-index:10000;box-shadow:0 2px 8px rgba(0,0,0,.6);
      `;
      closeBtn.addEventListener('click', () => { kris.remove(); closeBtn.remove(); });
      document.body.appendChild(closeBtn);

    }, 400);
  });
}

function MaliciousScript() {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;inset:0;background:#0a0a0a;z-index:9999;
    display:flex;flex-direction:column;padding:40px;
    font-family:var(--mono,monospace);font-size:13px;line-height:1.8;
    overflow:hidden;cursor:pointer;
  `;

  const lines = [
    { text:'[ SCAN ]  Initializing malicious script...', color:'#f0f0f0', delay:0 },
    { text:'[ OK   ]  Signature database loaded (last updated: never)', color:'#4CAF50', delay:300 },
    { text:'[ SCAN ]  Scanning /home/brady...', color:'#f0f0f0', delay:700 },
    { text:'[ WARN ]  /home/brady/.hidden - suspicious but intentional', color:'#FFB000', delay:1900 },
    { text:'[ SCAN ]  Scanning system processes...', color:'#f0f0f0', delay:2400 },
    { text:'[ OK   ]  portfolio.service - clean', color:'#4CAF50', delay:2800 },
    { text:'[ OK   ]  terminal.service - clean', color:'#4CAF50', delay:3100 },
    { text:'[ SCAN ]  Deep scanning Malicious.sh...', color:'#f0f0f0', delay:3500 },
    { text:'[ !!!  ]  THREAT DETECTED: SCARY.exe', color:'#FF4444', delay:4100 },
    { text:'[ !!!  ]  THREAT DETECTED: SCRIPT.ko', color:'#FF4444', delay:4400 },
    { text:'[ !!!  ]  THREAT DETECTED: BEE MOVIE.dll', color:'#FF4444', delay:4700 },
    { text:'[ WARN ]  THREAT DETECTED: YOU LIKE JAZZ.zip', color:'#FFB000', delay:5000 },
    { text:' ', color:'#555', delay:5400 },
    { text:'[ DONE ]  Scan complete. 3 critical threats found.', color:'#f0f0f0', delay:5800 },
    { text:'[ INFO ]  Recommended action: Grab your popcorn and sit back', color:'#4DA6FF', delay:6200 },
    { text:'[ INFO ]  Quarantine failed - threat is the greatest movie to exist', color:'#4DA6FF', delay:6600 },
    { text:' ', color:'#555', delay:7000 },
    { text:'[ EXIT ]  Click anywhere to dismiss...', color:'#555', delay:7400 },
  ];

  const content = document.createElement('div');
  content.style.cssText = `pointer-events:none;`;

  lines.forEach(l => {
    const el = document.createElement('div');
    el.textContent = l.text;
    el.style.cssText = `opacity:0;white-space:pre;color:${l.color};`;
    setTimeout(() => { el.style.opacity = '1'; }, l.delay);
    content.appendChild(el);
  });

  const barRow = document.createElement('div');
  barRow.style.cssText = `display:flex;align-items:center;gap:12px;opacity:0;margin-top:8px;pointer-events:none;`;
  barRow.innerHTML = `
    <span style="color:#4CAF50;font-size:13px;">[ PROG ] </span>
    <div style="height:6px;width:280px;background:#2a2a2a;border-radius:1px;overflow:hidden;">
      <div id="av-fill" style="height:100%;width:0%;background:#FF4444;box-shadow:0 0 10px #FF4444;"></div>
    </div>
    <span id="av-pct" style="color:#FF4444;font-size:13px;">0%</span>
  `;
  content.appendChild(barRow);
  overlay.appendChild(content);
  document.body.appendChild(overlay);

  setTimeout(() => {
    barRow.style.opacity = '1';
    const fill = document.getElementById('av-fill');
    const pct = document.getElementById('av-pct');
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 4 + 1;
      if (p >= 100) { p = 100; clearInterval(iv); }
      fill.style.width = p + '%';
      pct.textContent = Math.floor(p) + '%';
    }, 120);
  }, 800);

  let canDismiss = false;
  setTimeout(() => { canDismiss = true; }, 7500);

  overlay.addEventListener('click', () => {
    if (!canDismiss) return;
    overlay.style.transition = 'opacity 0.4s';
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();

      notif();

      const malicious = document.createElement('img');
      malicious.src = '/Images/malicious.gif';
      malicious.style.cssText = `
        position:fixed;
        top:50%;left:50%;
        transform:translate(-50%,-50%);
        width:70vw;max-width:800px;
        border-radius:12px;z-index:9999;
        box-shadow:0 16px 64px rgba(0,0,0,.8);
        border:3px solid #333;
      `;
      document.body.appendChild(malicious);

      const closeBtn = document.createElement('div');
      closeBtn.textContent = '✕';
      closeBtn.style.cssText = `
        position:fixed;
        top:calc(50% - 35vw / 1.5);
        right:calc(50% - 35vw - 12px);
        background:#333;color:#fff;border-radius:50%;
        width:28px;height:28px;display:flex;align-items:center;
        justify-content:center;font-size:14px;cursor:pointer;
        z-index:10000;box-shadow:0 2px 8px rgba(0,0,0,.6);
      `;
      closeBtn.addEventListener('click', () => { malicious.remove(); closeBtn.remove(); });
      document.body.appendChild(closeBtn);

    }, 400);
  });
}

/* Project Details */
const PROJS={
  apollo:{t:'Apollo - AI Music Tool',b:`<span class="tc"># apollo/README.md</span>

<span class="tk">status</span> = <span style="color:#5c9bd6">in_progress</span>
<span class="tk">type</span>   = <span class="tv2">"AI Music Tool"</span>
<span class="tk">stack</span>  = [<span class="tv2">"Python"</span>, <span class="tv2">"AI"</span>]

<span class="tc"># A musician's best friend.
# Helps artists write, structure and create music.</span>

<span class="tk">github</span> = <span class="tv2">"github.com/brady9999/Apollo"</span>
<span class="tk">github</span> = <span class="tv2">"https://apollo.bradygenik.com/"</span>`},
  wrangler:{t:'Wrangler Dash - Dashboard',b:`<span class="tc"># wrangler-dash/README.md</span>

<span class="tk">status</span> = <span class="tg">done</span>
<span class="tk">type</span>   = <span class="tv2">"Error Dashboard"</span>

<span class="tc"># Modular dashboard for managing
# errors and warnings from Wranglers.</span>

<span class="tk">github</span> = <span class="tv2">"github.com/brady9999/Wrangler-Dashboard"</span>`},
  athena:{t:'Athena - AI Assistant',b:`<span class="tc"># athena/README.md</span>

<span class="tk">status</span> = <span style="color:#FFB000">paused</span>
<span class="tk">type</span>   = <span class="tv2">"AI Assistant"</span>

<span class="tc"># Brutally honest AI.
# Calls you out on dumb questions.</span>

<span class="tk">github</span> = <span class="tv2">"github.com/brady9999/Athena"</span>
<span class="tk">url</span>    = <span class="tv2">"athena.bradygenik.com"</span>`},
  hermes:{t:'Hermes - Notes',b:`<span class="tc"># hermes/README.md</span>

<span class="tk">status</span> = <span style="color:#5c9bd6">in_progress</span>
<span class="tk">type</span>   = <span class="tv2">"Note-taking App"</span>

<span class="tc"># Because I had opinions about
# how a notes app should work.</span>

<span class="tk">github</span> = <span class="tv2">"github.com/brady9999/Hermes"</span>`},
  hephaestus:{t:'Hephaestus - Art Studio',b:`<span class="tc"># hephaestus/README.md</span>

<span class="tk">status</span> = <span class="tg">done</span>
<span class="tk">type</span>   = <span class="tv2">"Creative Tool"</span>

<span class="tc"># Your art studio in the browser.</span>

<span class="tk">github</span> = <span class="tv2">"github.com/brady9999/Hephaestus"</span>`}
};
function openProj(k){
  const p=PROJS[k];if(!p)return;
  document.getElementById('proj-ttl').textContent=p.t+' - Text Editor';
  document.getElementById('proj-body').innerHTML=p.b;
  openWin('w-proj');
}


function tExec(raw){
  const lc=raw.trim().toLowerCase();
  tCmdHist.unshift(raw); tIdx=-1;
  const bl=document.createElement('div');
  bl.style.marginBottom='4px';
  const cl=document.createElement('div');
  cl.className='tl';
  cl.innerHTML=`<span class="tps1">brady<span style="color:#fff">@</span><span class="th">genik</span><span style="color:#fff">:</span><span class="tp">~</span><span style="color:#fff">$ </span></span>${esc(raw)}`;
  bl.appendChild(cl);
  let out=null;
  if(TCMDS[lc]) out=TCMDS[lc]();
  else if(lc) out=`<span style="color:#FF5F57">bash: ${esc(raw.split(' ')[0])}: command not found</span>`;
  if(out!==null){
    const od=document.createElement('div');
    od.className='tl'; od.style.marginBottom='4px'; od.innerHTML=out;
    bl.appendChild(od);
  }
  tHist.appendChild(bl);
  tBody.scrollTop=tBody.scrollHeight;
}
if (tInput) {
  tInput.addEventListener('keydown', e => {
    if(e.key==='Enter'){tExec(tInput.value);tInput.value='';}
    if(e.key==='ArrowUp'){e.preventDefault();if(tIdx<tCmdHist.length-1)tIdx++;tInput.value=tCmdHist[tIdx]||'';}
    if(e.key==='ArrowDown'){e.preventDefault();if(tIdx>0)tIdx--;else{tIdx=-1;tInput.value='';return;}tInput.value=tCmdHist[tIdx]||'';}
    if(e.key==='Tab'){e.preventDefault();const p=tInput.value.toLowerCase();const m=Object.keys(TCMDS).find(k=>k.startsWith(p));if(m)tInput.value=m;}
  });
}
document.getElementById('w-term').addEventListener('click',()=>tInput.focus());

/* Context Menu */
const ctx=document.getElementById('ctx');
document.getElementById('desktop').addEventListener('contextmenu',e=>{
  e.preventDefault();
  if(e.target.closest('.win')||e.target.closest('#dock')||e.target.closest('#panel'))return;
  ctx.style.left=Math.min(e.clientX,window.innerWidth-210)+'px';
  ctx.style.top=Math.min(e.clientY,window.innerHeight-260)+'px';
  ctx.classList.add('open');
});
document.addEventListener('click',()=>ctx.classList.remove('open'));
document.getElementById('ctx-term').addEventListener('click',()=>openWin('w-term'));
document.getElementById('ctx-wall').addEventListener('click');
document.getElementById('ctx-disp').addEventListener('click');
document.getElementById('ctx-about').addEventListener('click',()=>openWin('w-about'));
document.getElementById('ctx-new-folder').addEventListener('click');
document.getElementById('ctx-new-file').addEventListener('click');

function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

/* Boot */
window.addEventListener('load',()=>{
  setTimeout(()=>{
    openWin('w-files');
  },300);
});

});