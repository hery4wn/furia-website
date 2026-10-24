from pathlib import Path
from html.parser import HTMLParser
import re,struct,zlib
p=Path('public')
class Check(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.refs=[];self.files=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  for key in ('src','href'):
   v=a.get(key,'')
   if v.startswith('#'):self.refs.append(v[1:])
   elif v and v != '/privacy' and not re.match(r'(https?:|mailto:|tel:)',v):self.files.append(v)
c=Check();h=(p/'index.html').read_text(encoding='utf-8');c.feed(h)
assert len(c.ids)==len(set(c.ids)), 'duplicate IDs'
assert all(x in c.ids for x in c.refs), 'missing anchors'
assert all((p/x.lstrip('/')).is_file() for x in c.files), 'missing assets'
assert 'owner' not in h.lower()
assert h.count('assets/furia-logo-transparent.png')==2
assert [x for x in re.findall('data-sport="([^"]+)"',h)]==['Badminton','Padel','Gym']
css=(p/'style.css').read_text(encoding='utf-8');assert css.count('{')==css.count('}')
logo=(p/'assets/furia-logo-transparent.png').read_bytes();w,hh,depth,color=struct.unpack('>IIBB',logo[16:26]);assert color==6,'PNG must have alpha'
print(f'PASS: anchors, local assets, unique IDs, owner removed, three sports ordered, CSS braces. Logo {w}x{hh}, RGBA.')


