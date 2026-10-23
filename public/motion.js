'use strict';
(()=>{
 const paused=()=>document.body.classList.contains('no-motion');
 const hero=document.querySelector('.hero');
 const header=document.querySelector('.header');
 const story=document.querySelector('.story-image');
 const desktop=window.matchMedia('(min-width: 761px)');
 document.querySelectorAll('.menu-panel nav a').forEach((link,i)=>link.style.setProperty('--menu-order',i));
 // Observe each element once. A paused animation never hides essential content.
 document.querySelectorAll('.story-image,.gallery-item,.instagram-frame,.map-frame').forEach(el=>el.classList.add('image-reveal'));
 document.querySelectorAll('.venue-facts>div,.sports-grid,.rules-list').forEach(group=>{
  [...group.children].filter(el=>el.classList.contains('reveal')).forEach((el,i)=>el.style.setProperty('--delay',Math.min(i*65,195)+'ms'));
 });
 if('IntersectionObserver' in window){
  document.body.classList.add('motion-ready');
  const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('in-view');reveal.unobserve(entry.target);}
  }),{threshold:.06,rootMargin:'0px 0px -24px 0px'});
  document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el));
  const navLinks=[...document.querySelectorAll('.desktop-nav a')];
  const sections=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const current=new IntersectionObserver(()=>{
   let active=null;
   for(const section of sections){const r=section.getBoundingClientRect();if(r.top<innerHeight*.5&&r.bottom>100)active=section.id;}
   navLinks.forEach(a=>{if(a.hash==='#'+active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
  },{rootMargin:'-15% 0px -45% 0px',threshold:[0,.1,.5]});
  sections.forEach(el=>current.observe(el));
 }
 // Native scrolling remains in control. Update decorative drift only when needed.
 let queued=false;
 function render(){
  queued=false;header.classList.toggle('is-scrolled',scrollY>24);
  if(paused()||!desktop.matches){hero.style.removeProperty('--hero-drift');story.style.removeProperty('--story-drift');return;}
  const hr=hero.getBoundingClientRect(),sr=story.getBoundingClientRect();
  if(hr.bottom>0)hero.style.setProperty('--hero-drift',Math.min(scrollY,300)*.08+'px');
  if(sr.top<innerHeight&&sr.bottom>0){const offset=(innerHeight/2-sr.top-sr.height/2)*.018;story.style.setProperty('--story-drift',Math.max(-12,Math.min(12,offset))+'px');}
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(render);}}
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule);
 document.addEventListener('furia:motion',()=>{
  if(paused())document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in-view'));
  schedule();
 });
 document.querySelectorAll('.faq details').forEach(detail=>detail.addEventListener('toggle',()=>{
  if(detail.open&&!paused()){const p=detail.querySelector('p');p.getAnimations().forEach(a=>a.cancel());p.animate([{opacity:0,transform:'translateY(-6px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,easing:'ease-out'});}
 }));
 render();
})();
