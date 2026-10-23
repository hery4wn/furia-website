'use strict';
(()=>{
 const config=window.FURIA_CONFIG||{};
 let visitor='',session='',testMode=false;
 try{
  testMode=new URLSearchParams(location.search).has('preview')||location.hostname==='localhost'||location.hostname==='127.0.0.1';
  const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Makassar'}).format(new Date());
  let stored=JSON.parse(localStorage.getItem('furia-visitor')||'null');
  if(!stored||stored.day!==day){stored={day,id:crypto.randomUUID()};localStorage.setItem('furia-visitor',JSON.stringify(stored));}
  visitor=stored.id;session=sessionStorage.getItem('furia-session')||crypto.randomUUID();sessionStorage.setItem('furia-session',session);
 }catch{visitor=crypto.randomUUID();session=crypto.randomUUID();}
 function sendEvent(type){
  if(testMode||navigator.doNotTrack==='1')return;
  const payload=JSON.stringify({id:crypto.randomUUID(),type,visitor,session});
  fetch('/api/events',{method:'POST',headers:{'Content-Type':'application/json'},body:payload,keepalive:true}).catch(()=>{});
 }
 window.furiaTrackBooking=()=>sendEvent('booking_click');
 sendEvent('page_view');
 const form=document.querySelector('#review-form'),list=document.querySelector('#review-list'),status=document.querySelector('#review-status');
 let reviews=[],filter='all';
 function node(tag,text,cls){const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;}
 function render(){
  list.replaceChildren();
  const items=reviews.filter(r=>filter==='all'||r.source===filter);
  if(!items.length){list.append(node('p',filter==='google'?'Ulasan Google dapat dibaca melalui tautan di bawah.':'Belum ada ulasan yang diterbitkan. Jadi yang pertama membagikan pengalamanmu di Furia.','review-empty'));return;}
  items.forEach(r=>{const article=node('article',null,'review-entry'),header=node('header'),name=node('h3',r.name);header.append(name,node('span',r.source==='google'?'Google Maps':'Website Furia'));article.append(header,node('div','★'.repeat(r.rating)+'☆'.repeat(5-r.rating),'review-stars'),node('p',r.comment));if(r.source==='google'){
 const safe=v=>{try{return new URL(v).protocol==='https:';}catch{return false;}};
 if(safe(r.avatar)){const avatar=document.createElement('img');avatar.src=r.avatar;avatar.alt='Avatar '+r.name;avatar.width=32;avatar.height=32;avatar.loading='lazy';avatar.style.borderRadius='50%';header.prepend(avatar);}
 if(safe(r.authorUrl)){const a=document.createElement('a');a.href=r.authorUrl;a.target='_blank';a.rel='noopener noreferrer';a.textContent=r.name;name.replaceChildren(a);}
 if(safe(r.url)){const a=document.createElement('a');a.href=r.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Lihat ulasan di Google Maps ↗';a.className='underlined';article.append(a);}
 }if(r.date){const t=node('time',new Intl.DateTimeFormat('id-ID',{dateStyle:'medium'}).format(new Date(r.date)));t.dateTime=r.date;article.append(t);}list.append(article);});
 }
 Promise.all([fetch('/api/reviews').then(r=>{if(!r.ok)throw Error();return r.json();}),fetch('/api/google-reviews').then(r=>r.ok?r.json():{reviews:[]}).catch(()=>({reviews:[]}))]).then(([local,google])=>{reviews=[...(local.reviews||[]),...(google.reviews||[])];render();if(google.configured&&google.reviews?.length){document.querySelector('.google-review-link p').textContent='Ulasan Google Maps dipilih berdasarkan relevansi oleh Google. Rating Google dan rating website dihitung terpisah.';}}).catch(()=>{list.replaceChildren(node('p','Ulasan belum dapat dimuat. Coba kembali sebentar lagi.','review-empty'));});
 document.querySelectorAll('[data-review-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.reviewFilter;document.querySelectorAll('[data-review-filter]').forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));});render();}));
 form.addEventListener('submit',async e=>{
  e.preventDefault();const b=form.querySelector('button[type=submit]');b.disabled=true;status.textContent='Mengirim ulasan…';
  const data=new FormData(form);
  try{const r=await fetch('/api/reviews',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:data.get('name'),rating:Number(data.get('rating')),comment:data.get('comment'),website:data.get('website'),consent:data.get('consent')==='on'})});const d=await r.json();if(!r.ok)throw Error(d.error||'Ulasan belum terkirim.');status.textContent='Terima kasih! Ulasanmu tersimpan dan akan tampil setelah ditinjau.';form.reset();}catch(err){status.textContent=err.message||'Tidak dapat terhubung. Silakan coba lagi.';}finally{b.disabled=false;}
 });
 if(/^https:\/\//.test(config.developerUrl||'')){document.querySelectorAll('[data-developer]').forEach(a=>{a.href=config.developerUrl;a.target='_blank';a.rel='noopener noreferrer';});document.querySelector('#developer-profile-note').replaceChildren(Object.assign(document.createElement('a'),{href:config.developerUrl,textContent:'Lihat portofolio Hery ↗',target:'_blank',rel:'noopener noreferrer'}));}
})();
