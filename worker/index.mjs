import { adminPage } from './admin.mjs';
const OWNER_EMAIL='heriyawan25032004@gmail.com';
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const dayNow=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Makassar'}).format(new Date());
const uuid=v=>typeof v==='string'&&/^[0-9a-f-]{36}$/i.test(v);
function isAdmin(req){return req.headers.get('oai-authenticated-user-email')?.toLowerCase()===OWNER_EMAIL;}
function sameOrigin(req){try{return new URL(req.headers.get('origin')).origin===new URL(req.url).origin;}catch{return false;}}
async function body(req){if(Number(req.headers.get('content-length'))>6000)throw Error('size');const text=await req.text();if(text.length>6000)throw Error('size');return JSON.parse(text);}
async function limit(req,env,kind,max){
 const day=dayNow(),ip=req.headers.get('cf-connecting-ip')||'unknown';
 const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(day+':furia:'+ip));
 const fp=Array.from(new Uint8Array(hash),v=>v.toString(16).padStart(2,'0')).join('');
 const r=await env.DB.prepare('INSERT INTO rate_limits(fingerprint,day,kind,count) VALUES(?,?,?,1) ON CONFLICT(fingerprint,day,kind) DO UPDATE SET count=count+1 RETURNING count').bind(fp,day,kind).first();
 return r.count<=max;
}
async function metrics(env,days){
 const start=new Date(Date.now()-(days-1)*864e5);const from=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Makassar'}).format(start);
 const totals=await env.DB.prepare("SELECT SUM(CASE WHEN type='page_view' THEN 1 ELSE 0 END) page_views,SUM(CASE WHEN type='booking_click' THEN 1 ELSE 0 END) booking_clicks,COUNT(DISTINCT CASE WHEN type='page_view' THEN day||visitor END) visitor_days,COUNT(DISTINCT CASE WHEN type='page_view' THEN session END) sessions,COUNT(DISTINCT CASE WHEN type='booking_click' THEN session END) booking_sessions FROM events WHERE day>=?").bind(from).first();
 const daily=await env.DB.prepare("SELECT day,SUM(CASE WHEN type='page_view' THEN 1 ELSE 0 END) page_views,COUNT(DISTINCT CASE WHEN type='page_view' THEN visitor END) visitors,SUM(CASE WHEN type='booking_click' THEN 1 ELSE 0 END) booking_clicks FROM events WHERE day>=? GROUP BY day ORDER BY day DESC").bind(from).all();
 const conversion=await env.DB.prepare("SELECT COUNT(DISTINCT a.session) n FROM events a WHERE a.type='page_view' AND a.day>=? AND EXISTS(SELECT 1 FROM events b WHERE b.session=a.session AND b.type='booking_click' AND b.day>=?)").bind(from,from).first();
 return {days,from,timezone:'Asia/Makassar',totals:{...totals,booking_sessions:conversion.n,click_rate:totals.sessions?Number((conversion.n/totals.sessions*100).toFixed(2)):0},daily:daily.results};
}
export default {
 async fetch(req,env,ctx){
  const url=new URL(req.url),path=url.pathname;
  try{
   if(path==='/admin'){
    if(!isAdmin(req))return new Response('<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Admin Furia</title><body style="font-family:Arial;padding:10vw;background:#112923;color:#f2f0e9"><h1>Admin Furia</h1><p>Halaman ini khusus pengembang/pengelola yang berwenang.</p><a style="color:#f2f0e9" href="/signin-with-chatgpt?return_to=%2Fadmin" target="_top">Masuk dengan akun ChatGPT pemilik ↗</a><p><a style="color:#f2f0e9" href="/">Kembali ke Furia</a></p></body></html>',{status:403,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
    return new Response(adminPage,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
   }
   if(path.startsWith('/api/admin/')){
    if(!isAdmin(req))return json({error:'Akses khusus pemilik.'},403);
    if(!env.DB)return json({error:'Penyimpanan belum tersedia.'},503);
    if(path==='/api/admin/metrics'&&req.method==='GET')return json(await metrics(env,Math.max(1,Math.min(90,Number(url.searchParams.get('days'))||30))));
    if(path==='/api/admin/reviews'&&req.method==='GET'){const rows=await env.DB.prepare('SELECT * FROM reviews ORDER BY created_at DESC LIMIT 100').all();return json({reviews:rows.results});}
    if(path==='/api/admin/reviews'&&req.method==='POST'){
     if(!sameOrigin(req))return json({error:'Origin tidak valid.'},403);
     const data=await body(req);if(!uuid(data.id)||!['approved','rejected','pending'].includes(data.status))return json({error:'Data tidak valid.'},400);
     const updated=await env.DB.prepare('UPDATE reviews SET status=? WHERE id=?').bind(data.status,data.id).run();return json({ok:true,changed:updated.meta.changes});
    }
    return json({error:'Tidak ditemukan.'},404);
   }
   if(path==='/api/events'&&req.method==='POST'){
    if(!sameOrigin(req))return json({error:'Origin tidak valid.'},403);
    if(!env.DB)return json({error:'Penyimpanan belum tersedia.'},503);
    if(/bot|crawler|spider|headless/i.test(req.headers.get('user-agent')||''))return json({ok:true,ignored:true});
    const e=await body(req);if(!uuid(e.id)||!uuid(e.visitor)||!uuid(e.session)||!['page_view','booking_click'].includes(e.type))return json({error:'Data tidak valid.'},400);
    if(!await limit(req,env,'events',500))return json({error:'Terlalu banyak permintaan.'},429);
    await env.DB.prepare('INSERT OR IGNORE INTO events(id,type,visitor,session,day,created_at) VALUES(?,?,?,?,?,?)').bind(e.id,e.type,e.visitor,e.session,dayNow(),new Date().toISOString()).run();
    if(ctx?.waitUntil)ctx.waitUntil(env.DB.prepare("DELETE FROM rate_limits WHERE day<date('now','-2 day')").run());
    return json({ok:true},202);
   }
   if(path==='/api/reviews'){
    if(!env.DB)return json({error:'Penyimpanan belum tersedia.'},503);
    if(req.method==='GET'){const rows=await env.DB.prepare("SELECT id,name,rating,comment,created_at date FROM reviews WHERE status='approved' ORDER BY created_at DESC LIMIT 50").all();return json({reviews:rows.results.map(r=>({...r,source:'website'}))});}
    if(req.method==='POST'){
     if(!sameOrigin(req))return json({error:'Origin tidak valid.'},403);
     const d=await body(req);const name=String(d.name||'').trim(),comment=String(d.comment||'').trim();
     if(d.website)return json({error:'Permintaan tidak valid.'},400);
     if(d.consent!==true||name.length<2||name.length>50||comment.length<15||comment.length>1000||!Number.isInteger(d.rating)||d.rating<1||d.rating>5)return json({error:'Lengkapi nama, rating, cerita minimal 15 karakter, dan persetujuan.'},400);
     if(!await limit(req,env,'reviews',3))return json({error:'Batas tiga ulasan per hari tercapai. Coba lagi besok.'},429);
     const id=crypto.randomUUID();await env.DB.prepare('INSERT INTO reviews(id,name,rating,comment,status,created_at) VALUES(?,?,?,?,?,?)').bind(id,name,d.rating,comment,'pending',new Date().toISOString()).run();
     return json({ok:true,status:'pending'},201);
    }
   }
   if(path==='/api/google-reviews'&&req.method==='GET'){
    if(!env.GOOGLE_PLACES_API_KEY||!env.GOOGLE_PLACE_ID)return json({configured:false,reviews:[]});
    if(!await limit(req,env,'google',40))return json({configured:true,unavailable:true,reviews:[]});
    const google=await fetch('https://places.googleapis.com/v1/places/'+encodeURIComponent(env.GOOGLE_PLACE_ID)+'?languageCode=id',{headers:{'X-Goog-Api-Key':env.GOOGLE_PLACES_API_KEY,'X-Goog-FieldMask':'reviews,googleMapsUri,rating,userRatingCount'}});
    if(!google.ok)return json({configured:true,unavailable:true,reviews:[]});
    const d=await google.json();return json({configured:true,rating:d.rating,count:d.userRatingCount,url:d.googleMapsUri,reviews:(d.reviews||[]).map(r=>({source:'google',name:r.authorAttribution?.displayName||'Pengguna Google',avatar:r.authorAttribution?.photoUri,authorUrl:r.authorAttribution?.uri,rating:r.rating,comment:r.text?.text||'',date:r.publishTime,url:r.googleMapsUri}))});
   }
   if(path.startsWith('/api/'))return json({error:'Tidak ditemukan.'},404);
   if(req.method!=='GET'&&req.method!=='HEAD')return new Response('Method not allowed',{status:405});
   if(path==='/privacy')return new Response('<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Privasi — Furia</title><body style="max-width:720px;margin:60px auto;padding:24px;font:16px/1.8 Arial;background:#f2f0e9;color:#112923"><h1>Privasi pengunjung</h1><p>Website mencatat halaman yang dibuka dan klik menuju AYO dengan identitas browser acak. Identitas pengunjung diperbarui setiap hari; statistik tidak membuktikan identitas seseorang atau reservasi yang selesai. Tidak ada nama, email, atau alamat IP mentah dalam statistik. Do Not Track dihormati.</p><p>Penyimpanan lokal dipakai untuk preferensi gerak serta identitas acak statistik. Penanda jaringan yang di-hash per hari dipakai untuk membatasi spam dan dibersihkan setelah dua hari. Statistik disimpan selama diperlukan untuk evaluasi website.</p><p>Ulasan website menyimpan nama tampilan, rating, dan cerita yang dikirim. Ulasan baru ditinjau sebelum ditampilkan dan dapat disembunyikan oleh pengelola. Hindari menyertakan nomor telepon, email, atau data pribadi lain.</p><p>Google Maps, ulasan Google bila integrasinya aktif, dan AYO adalah layanan pihak ketiga dengan kebijakan masing-masing.</p><a href="/">← Kembali ke Furia</a></body></html>',{headers:{'Content-Type':'text/html; charset=utf-8'}});
   return serveAsset(path,req.method);
  }catch(e){return json({error:'Layanan belum dapat memproses permintaan. Silakan coba lagi.'},500);}
 }
};
// Replaced by the build with assets from public/. No external asset host is needed.
function serveAsset(path,method){return new Response('Not built',{status:503});}
