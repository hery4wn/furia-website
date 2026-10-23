import fs from 'node:fs';
let h=fs.readFileSync('public/index.html','utf8');
h=h.replace('<link rel="stylesheet" href="style.css">','<link rel="stylesheet" href="style.css"><link rel="stylesheet" href="refinement.css">');
h=h.replace('<script src="community.js" defer></script>','<script src="motion.js" defer></script><script src="community.js" defer></script>');
h=h.replace('YOUR NEXT PLAYGROUND','YOUR EVERYDAY SPORTS CLUB');
fs.writeFileSync('public/index.html',h);
let s=fs.readFileSync('public/script.js','utf8');
s=s.replace(/if\('IntersectionObserver' in window\)\{document.body.classList.add\('motion-ready'\);.*?\r?\n/,'');
s=s.replace("document.querySelector('#motion-label').textContent=paused?'Aktifkan animasi':'Jeda animasi';","document.querySelector('#motion-label').textContent=paused?'Aktifkan animasi':'Jeda animasi';document.dispatchEvent(new CustomEvent('furia:motion',{detail:{paused}}));");
s=s.replace("function toggleMenu(open){menuPanel.hidden=!open;menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Tutup menu':'Buka menu');document.body.classList.toggle('menu-open',open);if(open)menuPanel.querySelector('a').focus();}",`let menuCloseTimer;
function toggleMenu(open){
 clearTimeout(menuCloseTimer);menuPanel.classList.remove('is-closing');
 menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Tutup menu':'Buka menu');
 document.querySelector('main').inert=open;document.querySelector('footer').inert=open;
 document.body.classList.toggle('menu-open',open);
 if(open){menuPanel.hidden=false;menuPanel.querySelector('a').focus();}
 else {menuToggle.focus();if(!motionPaused&&!menuPanel.hidden){menuPanel.classList.add('is-closing');menuPanel.inert=true;menuCloseTimer=setTimeout(()=>{menuPanel.hidden=true;menuPanel.inert=false;menuPanel.classList.remove('is-closing');},220);}else menuPanel.hidden=true;}
 if(open)menuPanel.inert=false;
}`);
s=s.replace("document.querySelector('#hero-sport-media').setAttribute('aria-labelledby',heroTabs[index].id);","document.querySelector('#hero-sport-media').setAttribute('aria-labelledby',heroTabs[index].id);document.querySelector('.hero-tabs').style.setProperty('--sport-index',index);if(!motionPaused){const label=document.querySelector('#hero-sport-name');label.getAnimations().forEach(a=>a.cancel());label.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.22,1,.36,1)'});}");
s=s.replace("media.append(clone);}","media.append(clone);if(!motionPaused)clone.animate([{opacity:.3,transform:'scale(1.025)'},{opacity:1,transform:'scale(1)'}],{duration:450,easing:'cubic-bezier(.22,1,.36,1)'});}");
fs.writeFileSync('public/script.js',s);
