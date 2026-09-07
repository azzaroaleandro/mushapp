import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root=resolve(process.env.SITE_DIR??'.');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.json':'application/json'};
createServer(async(req,res)=>{
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const path=resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));
  if(!path.startsWith(root+sep)){res.writeHead(403).end();return;}
  if(!(await stat(path)).isFile()){res.writeHead(404).end();return;}
  res.writeHead(200,{'Content-Type':types[extname(path)]??'application/octet-stream','Cache-Control':'no-store'});res.end(await readFile(path));
 }catch{res.writeHead(404).end('Not found');}
}).listen(Number(process.env.PORT??4173),'0.0.0.0',()=>console.log('Mushapp server ready'));
