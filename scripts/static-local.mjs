import fs from 'node:fs/promises';
import path from 'node:path';
export function createAssets(){return {async fetch(request){
 const url=new URL(typeof request==='string'?request:request.url);
 const root=path.resolve('public');const target=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
 if(!target.startsWith(root+path.sep))return new Response('Not found',{status:404});
 try{const data=await fs.readFile(target);const type={'.html':'text/html; charset=utf-8','.png':'image/png','.webp':'image/webp','.ico':'image/vnd.microsoft.icon','.js':'text/javascript','.css':'text/css','.jpg':'image/jpeg','.svg':'image/svg+xml'}[path.extname(target)]||'application/octet-stream';return new Response(request.method==='HEAD'?null:data,{headers:{'Content-Type':type}});}catch{return new Response('Not found',{status:404});}
}};}
