import fs from 'node:fs';
let c=fs.readFileSync('public/community.js','utf8');
c=c.replace("if(r.date){const t=",`if(r.source==='google'){
 const safe=v=>{try{return new URL(v).protocol==='https:';}catch{return false;}};
 if(safe(r.avatar)){const avatar=document.createElement('img');avatar.src=r.avatar;avatar.alt='Avatar '+r.name;avatar.width=32;avatar.height=32;avatar.loading='lazy';avatar.style.borderRadius='50%';header.prepend(avatar);}
 if(safe(r.authorUrl)){const a=document.createElement('a');a.href=r.authorUrl;a.target='_blank';a.rel='noopener noreferrer';a.textContent=r.name;name.replaceChildren(a);}
 if(safe(r.url)){const a=document.createElement('a');a.href=r.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Lihat ulasan di Google Maps ↗';a.className='underlined';article.append(a);}
 }if(r.date){const t=`);
c=c.replace("fetch('/api/reviews').then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{reviews=data.reviews||[];render();})",`Promise.all([fetch('/api/reviews').then(r=>{if(!r.ok)throw Error();return r.json();}),fetch('/api/google-reviews').then(r=>r.ok?r.json():{reviews:[]}).catch(()=>({reviews:[]}))]).then(([local,google])=>{reviews=[...(local.reviews||[]),...(google.reviews||[])];render();if(google.configured&&google.reviews?.length){document.querySelector('.google-review-link p').textContent='Ulasan Google Maps dipilih berdasarkan relevansi oleh Google. Rating Google dan rating website dihitung terpisah.';}})`);
fs.writeFileSync('public/community.js',c);
let h=fs.readFileSync('public/index.html','utf8').replace('<span>MADE FOR MOVEMENT ↗</span>','<a href="/privacy">Privasi pengunjung ↗</a>');fs.writeFileSync('public/index.html',h);
let w=fs.readFileSync('worker/index.mjs','utf8').replace("if(!d.consent||",'if(d.consent!==true||');
w=w.replace("const google=await fetch(","if(!await limit(req,env,'google',40))return json({configured:true,unavailable:true,reviews:[]});\n    const google=await fetch(");
fs.writeFileSync('worker/index.mjs',w);
