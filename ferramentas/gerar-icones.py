# -*- coding: utf-8 -*-
"""Gera os ícones do LucroInDrive a partir da arte original.

Saídas (em icones/):
  play-store/icone-512.png     o campo "Ícone do app" do Play Console: quadrado
                               cheio, sem transparência — o Play arredonda sozinho
  android/                     ícone adaptativo (fundo + frente) e os mipmaps
  web/                         PWA: 192, 512 e a versão maskable

Uso: python3 ferramentas/gerar-icones.py [arte.png]
Sem argumento, usa icones/arte-original.webp. Precisa de pillow, numpy e scipy.
O que o LEIAME de icones/ explica sobre cada formato vale como referência.
"""
import os, sys
from PIL import Image, ImageFilter
import numpy as np
from scipy import ndimage

RAIZ=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAIDA=os.path.join(RAIZ,'icones')
ORIGEM=sys.argv[1] if len(sys.argv)>1 else os.path.join(SAIDA,'arte-original.webp')

def pasta(*p):
    d=os.path.join(SAIDA,*p); os.makedirs(d,exist_ok=True); return d

src=Image.open(ORIGEM).convert('RGB')
w,h=src.size
a=np.asarray(src).astype(np.float32)

# ---- 1. recortar o quadrado arredondado: fora dele a arte é branca ----
branco=(a[:,:,0]>246)&(a[:,:,1]>246)&(a[:,:,2]>246)
dentro=np.zeros((h,w),bool)
for y in range(h):
    xs=np.flatnonzero(~branco[y])
    if xs.size: dentro[y,xs[0]:xs[-1]+1]=True
dentro=ndimage.binary_erosion(dentro,np.ones((7,7)))        # tira a franja clara da borda

# ---- 2. preencher os cantos para a versão quadrada cheia ----
#   o Play arredonda o ícone por conta própria: mandar já arredondado dobra o canto
idx=ndimage.distance_transform_edt(~dentro,return_distances=False,return_indices=True)
cheio=a[idx[0],idx[1]]
#   esticar o pixel mais próximo deixa riscos radiais no canto: borrar só o que
#   foi inventado e manter a arte original onde ela existe
suave=np.asarray(Image.fromarray(cheio.astype(np.uint8),'RGB').filter(ImageFilter.GaussianBlur(26))).astype(np.float32)
peso=dentro[:,:,None].astype(np.float32)
cheio=a*peso+suave*(1-peso)

arredondado=Image.fromarray(np.dstack([a,np.where(dentro,255,0)]).astype(np.uint8),'RGBA')
quadrado=Image.fromarray(cheio.astype(np.uint8),'RGB')

# ---- 3. separar o volante do fundo verde, pela luminância ----
#   o anel vive entre 0 e 90 de luz; o verde, acima de 160
L=(0.299*a[:,:,0]+0.587*a[:,:,1]+0.114*a[:,:,2])
alfa=np.clip((150.0-L)/80.0,0,1)*dentro
cinza=np.clip(L*0.85,0,95)                                   # sem verde nas bordas do traço
volante=Image.fromarray(np.dstack([cinza,cinza,cinza,alfa*255]).astype(np.uint8),'RGBA')
#   a arte tem uma sombra fraca sob o volante: medir a caixa pelo traço firme,
#   senão o desenho sobe quando é centralizado
firme=Image.fromarray((np.asarray(volante)[:,:,3]>60).astype(np.uint8)*255)
volante=volante.crop(firme.getbbox())
print('volante recortado em',volante.size,'de',(w,h))

# ---- 4. o verde sozinho, sem o volante ----
#   o ícone adaptativo mostra fundo e frente em camadas separadas: se o volante
#   ficasse nas duas, apareceria dobrado quando a tela mexe no ícone
conhecido=dentro&(alfa<0.02)
conhecido=ndimage.binary_erosion(conhecido,np.ones((9,9)))   # longe do traço
#   começar pelo verde conhecido mais próximo e depois espalhar: partir do
#   próprio volante deixaria um halo escuro no lugar dele
j=ndimage.distance_transform_edt(~conhecido,return_distances=False,return_indices=True)
verde=cheio[j[0],j[1]]
for sigma,voltas in ((30,25),(12,15),(5,10)):
    for _ in range(voltas):
        verde=ndimage.gaussian_filter(verde,sigma=(sigma,sigma,0))
        verde[conhecido]=cheio[conhecido]
verde=Image.fromarray(np.clip(verde,0,255).astype(np.uint8),'RGB')

def sobre(fundo,frente,largura):
    """Centraliza a frente com a largura pedida sobre o fundo."""
    base=fundo.copy().convert('RGBA')
    lado=base.size[0]
    f=frente.copy()
    f.thumbnail((largura,largura),Image.LANCZOS)
    base.alpha_composite(f,((lado-f.size[0])//2,(lado-f.size[1])//2))
    return base

def png(im,tam,*caminho):
    im.resize((tam,tam),Image.LANCZOS).save(os.path.join(*caminho),optimize=True)

# ---- Play Store: 512, quadrado cheio, 32 bits ----
png(quadrado.convert('RGBA'),512,pasta('play-store'),'icone-512.png')

# ---- ícone adaptativo: 432 px (108dp em xxxhdpi), zona segura de 288 ----
verde.resize((432,432),Image.LANCZOS).convert('RGBA').save(
    os.path.join(pasta('android'),'ic_launcher_background.png'),optimize=True)
frente=Image.new('RGBA',(432,432),(0,0,0,0))
#   a zona segura do ícone adaptativo é um círculo de 66dp nos 108dp da tela
v=volante.copy(); v.thumbnail((224,224),Image.LANCZOS)
frente.alpha_composite(v,((432-v.size[0])//2,(432-v.size[1])//2))
frente.save(os.path.join(pasta('android'),'ic_launcher_foreground.png'),optimize=True)
open(os.path.join(pasta('android'),'ic_launcher.xml'),'w',encoding='utf-8').write(
"""<?xml version="1.0" encoding="utf-8"?>
<!-- res/mipmap-anydpi-v26/ic_launcher.xml -->
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
""")

# ---- mipmaps antigos: já saem com o canto arredondado ----
for nome,tam in [('mdpi',48),('hdpi',72),('xhdpi',96),('xxhdpi',144),('xxxhdpi',192)]:
    png(arredondado,tam,pasta('android','mipmap-'+nome),'ic_launcher.png')

# ---- web / PWA ----
png(arredondado,192,pasta('web'),'icone-192.png')
png(arredondado,512,pasta('web'),'icone-512.png')
#   maskable: o sistema recorta até 20% de cada lado, então o volante encolhe
sobre(verde.resize((512,512),Image.LANCZOS),volante,300).save(
    os.path.join(pasta('web'),'icone-maskable-512.png'),optimize=True)

for raiz,_,arquivos in sorted(os.walk(SAIDA)):
    for f in sorted(arquivos):
        c=os.path.join(raiz,f)
        print(f'{os.path.getsize(c):>8}  {os.path.relpath(c,SAIDA)}')
