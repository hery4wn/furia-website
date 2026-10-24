import fs from 'node:fs';
import path from 'node:path';
import {adminPage} from '../worker/admin.mjs';
let worker=fs.readFileSync('worker/index.mjs','utf8').replace("import { adminPage } from './admin.mjs';",'const adminPage='+JSON.stringify(adminPage)+';');
const mime={'.webp':'image/webp','.ico':'image/vnd.microsoft.icon','.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ttf':'font/ttf','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
const assets={};
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())walk(f);else{const uri='/'+path.relative('public',f).split(path.sep).join('/');assets[uri]={type:mime[path.extname(f)]||'application/octet-stream',data:fs.readFileSync(f).toString('base64')};}}}
if(!process.argv.includes('--external-assets'))walk('public');
worker=worker.replace('return serveAsset(path,req.method);','return serveAsset(path,req.method,env,req);');
worker=worker.replace("function serveAsset(path,method){return new Response('Not built',{status:503});}",`const ASSETS=${JSON.stringify(assets)};function serveAsset(path,method){let key=path==='/'?'/index.html':path==='/favicon.ico'?'/assets/furia-favicon.ico':path;const asset=ASSETS[key];if(!asset)return new Response('Halaman tidak ditemukan',{status:404});const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));return new Response(method==='HEAD'?null:bytes,{headers:{'Content-Type':asset.type,'Cache-Control':key.includes('/assets/')?'public,max-age=3600':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'}});}`);
// The build owns only these output files; source assets remain in public/.
worker=worker.replace('function serveAsset(path,method){','async function serveAsset(path,method,env,req){if(env.ASSETS){const url=new URL(req.url);if(path==="/favicon.ico")url.pathname="/assets/furia-favicon.ico";return env.ASSETS.fetch(new Request(url,req));}');
fs.mkdirSync('dist/server',{recursive:true});fs.mkdirSync('dist/.openai',{recursive:true});
fs.writeFileSync('dist/server/index.js',worker);fs.copyFileSync('.openai/hosting.json','dist/.openai/hosting.json');
console.log('Built existing Furia UI + persistent analytics/reviews Worker ('+Object.keys(assets).length+' assets).');
