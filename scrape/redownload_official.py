import json,sys,io,time,urllib.request,re
sys.stdout.reconfigure(encoding='utf-8')
from pathlib import Path
from PIL import Image
KEY=[l.split('=',1)[-1].strip() for l in open('scrape/.api_key') if l.strip()][0]
UA={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36'}
def fetch(u):
    return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=20).read()
def imgs(q):
    req=urllib.request.Request('https://google.serper.dev/images',data=json.dumps({'q':q,'gl':'tr','hl':'tr','num':15}).encode(),headers={'X-API-KEY':KEY,'Content-Type':'application/json'})
    return json.load(urllib.request.urlopen(req,timeout=15)).get('images',[])
def save_webp(b,slug):
    im=Image.open(io.BytesIO(b));im.load()
    if im.width<200:return None
    im=im.convert('RGB')
    if im.width>900:im.thumbnail((900,900))
    Path(f'public/products/natura/{slug}.webp').write_bytes(b if len(b)<90000 else b'')
    im.save(f'public/products/natura/{slug}.webp','WEBP',quality=85)
    return im.size
def try_paths(ean):
    for suf in ['-1','_1','','_2','-2']:
        for dim in ['-860x860','-800x800','-768x768','-700x700','-430x430','']:
            u=f'https://naturapetfood.com/wp-content/uploads/2023/09/{ean}{suf}{dim}.jpg'
            try:
                b=fetch(u)
                Image.open(io.BytesIO(b)).verify()
                return u,b
            except Exception:continue
    return None,None
d=json.load(open('scrape/natura_products.json',encoding='utf-8'))
sm=json.load(open('scrape/_natura_slugmap.json',encoding='utf-8'))
off=json.load(open('scrape/_natura_official.json',encoding='utf-8'))
ok=fail=0
for p in d['products']:
    slug=p['slug'];s=str(p.get('img_source',''))
    url=None
    if 'http' in s:
        path=re.search(r'wp-content/uploads/.*\.(?:jpg|png|jpeg)',s)
        if path:url='https://naturapetfood.com/'+path.group(0)
    if not url and s.startswith('official-img:') and s.split(':')[1].isdigit():
        u,b=try_paths(s.split(':')[1])
        if u:url=u
    if not url and slug in sm and sm[slug] in off:
        path=re.search(r'wp-content/uploads/.*\.(?:jpg|png|jpeg)',off[sm[slug]])
        if path:url='https://naturapetfood.com/'+path.group(0)
    if not url:
        # refacem cautarea pt URL oficial
        q=p.get('search_query') or slug.replace('natura-','').replace('-',' ')
        try:
            for r in imgs(q+' naturapetfood'):
                iu=r.get('imageUrl','')
                if 'naturapetfood.com' in iu:url=iu;break
            if not url:
                for r in imgs(q):
                    iu=r.get('imageUrl','')
                    if 'naturapetfood.com' in iu:url=iu;break
        except Exception as e:print('serper x',e)
        time.sleep(1.2)
    if not url:print('NOURL',slug);fail+=1;continue
    # descarca live: original, apoi variante de dimensiune
    got=False
    base=re.sub(r'-\d+x\d+(?=\.(jpg|png|jpeg)$)','',url)
    for u in [base,url,re.sub(r'\.(jpg|png|jpeg)$',r'-430x430.\1',base)]:
        try:
            b=fetch(u)
            sz=save_webp(b,slug)
            if sz:
                p['img_source']='official-img:'+u
                print('OK',slug,sz);ok+=1;got=True;break
        except Exception:continue
    if not got:print('DLFAIL',slug,url[:90]);fail+=1
    time.sleep(0.4)
json.dump(d,open('scrape/natura_products.json','w',encoding='utf-8'),ensure_ascii=False,indent=2)
print('gata:',ok,'ok |',fail,'fail')
