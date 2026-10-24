import {createAssets} from './static-local.mjs';
import http from 'node:http';
import worker from '../dist/server/index.js';
import {createDB} from './sqlite-local.mjs';
const DB=createDB();
http.createServer(async(req,res)=>{try{const chunks=[];for await(const chunk of req)chunks.push(chunk);const headers=new Headers();for(const [k,v] of Object.entries(req.headers))if(v)headers.set(k,Array.isArray(v)?v.join(','):v);const pathname=new URL(req.url,'http://127.0.0.1:4174').pathname;if(pathname.startsWith('/admin')||pathname.startsWith('/api/admin/'))headers.set('oai-authenticated-user-email','heriyawan25032004@gmail.com');const body=Buffer.concat(chunks);const request=new Request('http://127.0.0.1:4174'+req.url,{method:req.method,headers,...(body.length?{body,duplex:'half'}:{})});const result=await worker.fetch(request,{DB,ASSETS:createAssets()},{});res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));}catch{res.writeHead(500);res.end('Preview error');}}).listen(4174,'127.0.0.1',()=>console.log('http://127.0.0.1:4174 — local isolated preview DB; /admin enabled only by local adapter'));
