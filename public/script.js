'use strict';
const config=window.FURIA_CONFIG||{};
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused=reducedMotion.matches;
try{motionPaused=motionPaused||localStorage.getItem('furia-motion')==='paused';}catch{}
const motionButton=document.querySelector('#motion-toggle');
function setMotion(paused){motionPaused=paused;document.body.classList.toggle('no-motion',paused);motionButton.setAttribute('aria-pressed',String(paused));document.querySelector('#motion-label').textContent=paused?'Aktifkan animasi':'Jeda animasi';document.dispatchEvent(new CustomEvent('furia:motion',{detail:{paused}}));}
setMotion(motionPaused);
motionButton.addEventListener('click',()=>{setMotion(!motionPaused);try{localStorage.setItem('furia-motion',motionPaused?'paused':'active');}catch{}});
reducedMotion.addEventListener('change',e=>setMotion(e.matches));
const menuToggle=document.querySelector('#menu-toggle'),menuPanel=document.querySelector('#menu-panel');
let menuCloseTimer;
function toggleMenu(open){
 clearTimeout(menuCloseTimer);menuPanel.classList.remove('is-closing');
 menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Tutup menu':'Buka menu');
 document.querySelector('main').inert=open;document.querySelector('footer').inert=open;
 document.body.classList.toggle('menu-open',open);
 if(open){menuPanel.hidden=false;menuPanel.querySelector('a').focus();}
 else {menuToggle.focus();if(!motionPaused&&!menuPanel.hidden){menuPanel.classList.add('is-closing');menuPanel.inert=true;menuCloseTimer=setTimeout(()=>{menuPanel.hidden=true;menuPanel.inert=false;menuPanel.classList.remove('is-closing');},220);}else menuPanel.hidden=true;}
 if(open)menuPanel.inert=false;
}
menuToggle.addEventListener('click',()=>toggleMenu(menuToggle.getAttribute('aria-expanded')!=='true'));
menuPanel.addEventListener('click',e=>{if(e.target.closest('a'))toggleMenu(false);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menuPanel.hidden){toggleMenu(false);menuToggle.focus();}if(e.key==='Tab'&&!menuPanel.hidden){const last=menuPanel.querySelector('nav a:last-child');if(!e.shiftKey&&document.activeElement===last){e.preventDefault();menuToggle.focus();}else if(e.shiftKey&&document.activeElement===menuToggle){e.preventDefault();last.focus();}}});
const heroTabs=[...document.querySelectorAll('[data-hero-tab]')];
function changeSport(index){heroTabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});document.querySelectorAll('[data-hero-image]').forEach((img,i)=>{img.classList.toggle('active',i===index);img.setAttribute('aria-hidden',String(i!==index));});document.querySelector('#hero-sport-name').textContent=['BADMINTON','PADEL','GYM'][index];document.querySelector('#hero-sport-count').textContent=`0${index+1} / 03`;document.querySelector('#hero-sport-media').setAttribute('aria-labelledby',heroTabs[index].id);document.querySelector('.hero-tabs').style.setProperty('--sport-index',index);if(!motionPaused){const label=document.querySelector('#hero-sport-name');label.getAnimations().forEach(a=>a.cancel());label.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.22,1,.36,1)'});}}
heroTabs.forEach((tab,i)=>{tab.addEventListener('click',()=>changeSport(i));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%3;if(e.key==='ArrowLeft')next=(i+2)%3;if(e.key==='Home')next=0;if(e.key==='End')next=2;if(next!==undefined){e.preventDefault();changeSport(next);heroTabs[next].focus();}});});
const track=document.querySelector('#facility-track');
function moveFacilities(direction){const card=track.querySelector('.facility-card');const gap=parseFloat(getComputedStyle(track).gap)||0;track.scrollBy({left:direction*(card.getBoundingClientRect().width+gap),behavior:motionPaused?'instant':'smooth'});}
document.querySelector('#fac-prev').addEventListener('click',()=>moveFacilities(-1));document.querySelector('#fac-next').addEventListener('click',()=>moveFacilities(1));
track.addEventListener('keydown',e=>{if(e.target===track&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();moveFacilities(e.key==='ArrowLeft'?-1:1);}});
const dialog=document.querySelector('#detail-dialog'),media=document.querySelector('#dialog-media'),title=document.querySelector('#dialog-title'),description=document.querySelector('#dialog-description'),actions=document.querySelector('#dialog-actions');
let galleryIndex=null;
function showDialog(heading,text,image){galleryIndex=null;title.textContent=heading;description.textContent=text;media.replaceChildren();actions.replaceChildren();if(image){const clone=image.cloneNode(true);clone.removeAttribute('loading');if(clone.dataset.fullSrc)clone.src=clone.dataset.fullSrc;media.append(clone);if(!motionPaused)clone.animate([{opacity:.3,transform:'scale(1.025)'},{opacity:1,transform:'scale(1)'}],{duration:450,easing:'cubic-bezier(.22,1,.36,1)'});}if(!dialog.open){dialog.showModal();document.body.classList.add('modal-open');}}
function addButton(label,handler,kind='outline'){const button=document.createElement('button');button.className='btn '+kind;button.textContent=label;button.addEventListener('click',handler);actions.append(button);}
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');galleryIndex=null;});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
function reserve(kind){if(kind==='ayo'&&/^https:\/\//.test(config.ayoUrl||'')){window.furiaTrackBooking?.();window.open(config.ayoUrl,'_blank','noopener,noreferrer');return;}if(kind==='whatsapp'&&/^\d{9,15}$/.test(config.whatsappNumber||'')){window.open('https://wa.me/'+config.whatsappNumber+'?text='+encodeURIComponent(config.whatsappMessage||'Halo Furia'),'_blank','noopener,noreferrer');return;}showDialog(kind==='ayo'?'Booking Padel di AYO':'Booking lewat WA',kind==='ayo'?'Tautan booking venue Furia belum tersedia pada pratinjau ini. Tombol ini akan langsung membuka halaman Furia di AYO setelah tautan resminya ditambahkan.':'Kontak resmi untuk badminton dan gym serta jam operasional sedang dikonfirmasi. Booking padel tersedia melalui AYO. Silakan cek kembali sebelum merencanakan kunjungan.');addButton('Mengerti',()=>dialog.close());}
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>reserve(button.dataset.action)));
document.querySelectorAll('[data-sport]').forEach(button=>button.addEventListener('click',()=>{showDialog(button.dataset.sport,button.dataset.detail,button.querySelector('.photo'));addButton('Booking Padel di AYO',()=>reserve('ayo'),'ayo');addButton('Booking lewat WA',()=>reserve('whatsapp'),'whatsapp');}));
const gallery=[...document.querySelectorAll('.gallery-item')];
function showGallery(index){const i=(index+gallery.length)%gallery.length;const item=gallery[i];showDialog(item.dataset.gallery,'Dokumentasi asli Furia Sports Center.',item.querySelector('.photo'));galleryIndex=i;addButton('← Sebelumnya',()=>showGallery(i-1));addButton('Berikutnya →',()=>showGallery(i+1));}
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{if(button.classList.contains('gallery-item'))showGallery(gallery.indexOf(button));else showDialog(button.dataset.gallery,'Dokumentasi asli fasilitas Furia Sports Center.',button.querySelector('.photo'));}));
document.querySelector('#gallery-all').addEventListener('click',()=>showGallery(0));
dialog.addEventListener('keydown',e=>{if(galleryIndex!==null&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();showGallery(galleryIndex+(e.key==='ArrowLeft'?-1:1));}});
const faq=document.querySelector('.faq');faq.querySelectorAll('details').forEach(detail=>detail.addEventListener('toggle',()=>{if(detail.open)faq.querySelectorAll('details').forEach(other=>{if(other!==detail)other.open=false;});}));
if(config.openingHours){document.querySelector('#opening-hours').textContent=config.openingHours;document.querySelector('#opening-hours').nextElementSibling.textContent='Jadwalkan kunjunganmu.';}
const dock=document.querySelector('.mobile-dock');const heroActions=document.querySelector('.hero-actions');const progress=document.querySelector('.scroll-progress');let scrollQueued=false;
function updateScroll(){const doc=document.documentElement;const max=doc.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?Math.min(1,scrollY/max):0})`;dock.classList.toggle('visible',heroActions.getBoundingClientRect().bottom<0);scrollQueued=false;}
window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateScroll);}},{passive:true});window.addEventListener('resize',updateScroll);updateScroll();
