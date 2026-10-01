# Ícones do LucroInDrive

Tudo sai da arte original pelo script `ferramentas/gerar-icones.py`. Para
refazer depois de mexer na arte:

```sh
python3 ferramentas/gerar-icones.py caminho/para/a-arte.png
```

O script recorta o quadrado arredondado, separa o volante do fundo verde e
grava cada formato abaixo.

## Google Play

| Arquivo | Onde entra |
|---|---|
| `play-store/icone-512.png` | campo **Ícone do app** no Play Console |

É 512 × 512, PNG de 32 bits, **quadrado cheio e sem cantos arredondados** — de
propósito. O Play arredonda o ícone sozinho; mandar já arredondado faz o canto
ser cortado duas vezes e aparecer uma borda esquisita.

O Play também pede uma **imagem de destaque** de 1024 × 500 e capturas de tela
da loja. Essas são peças de divulgação, não ícone, e ainda não estão aqui.

## Android (dentro do aparelho)

| Arquivo | Onde entra |
|---|---|
| `android/ic_launcher_foreground.png` | `res/mipmap-xxxhdpi/` — o volante |
| `android/ic_launcher_background.png` | `res/mipmap-xxxhdpi/` — só o verde |
| `android/ic_launcher.xml` | `res/mipmap-anydpi-v26/ic_launcher.xml` |
| `android/mipmap-*/ic_launcher.png` | Android 7 e anteriores, uma por densidade |

O ícone adaptativo (Android 8 em diante) é desenhado em duas camadas, porque a
tela inicial move uma sobre a outra e recorta no formato que o aparelho usa —
círculo, quadrado arredondado ou squircle. Por isso o volante **não** aparece
no fundo: se estivesse nas duas camadas, apareceria dobrado.

A tela são 108 dp (432 px aqui) e só os 72 dp do meio ficam visíveis; o volante
foi posto dentro do círculo seguro de 66 dp, então nenhum formato de recorte
corta o desenho.

## Web / tela de início

| Arquivo | Onde entra |
|---|---|
| `web/icone-192.png` | atalho e favicon |
| `web/icone-512.png` | `purpose: any` no manifesto |
| `web/icone-maskable-512.png` | `purpose: maskable` — o volante menor, porque o sistema corta até 20% de cada lado |

O `index.html` não depende desses arquivos: ele traz o ícone embutido em WebP
de 192 px na variável `--icon-app` do CSS e monta o manifesto em memória. Os
PNG daqui entram quando a pasta é publicada junto com a página.
