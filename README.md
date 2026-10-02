# LucroInDrive

Esboço interativo do LucroInDrive: corridas, gastos, jornadas, metas e cuidado
com o carro, para quem roda em aplicativo.

É uma página única — `index.html`, sem build e sem dependências. Para abrir,
basta um duplo clique no arquivo ou um servidor local:

```sh
npx http-server . -p 8080   # depois abra http://localhost:8080
```

Os lançamentos ficam no `localStorage` do navegador. Não há backend, conta real
nem backup online.

As telas são feitas para caber no celular: as caixas trabalham com espaçamento
curto e entrelinha controlada nos números grandes, que de outro modo herdam
quase meia linha de ar cada um. Mexer em espaçamento aqui é mexer em uma lista
de regras que se sobrescrevem — vale conferir qual é a última que vale para o
seletor antes de mudar um valor.

## Ícone

O volante com o gráfico em alta é o ícone do app, não um enfeite das telas: o
topo de cada módulo mostra só o nome LucroInDrive. Ele aparece no login, na aba
do navegador e, principalmente, como o atalho na tela do celular.

Para "Adicionar à tela de início" funcionar, a página traz o manifesto (nome,
abertura em tela cheia, cor da barra de status) e as marcações do iPhone. O
manifesto é montado pelo próprio script para reaproveitar a imagem que já está
embutida — um WebP de 192 px na variável `--icon-app` do CSS —, em vez de gravar
a mesma imagem duas vezes no arquivo.

Os formatos para publicar ficam em [`icones/`](icones/LEIAME.md): o PNG de
512 px do Play Console, o ícone adaptativo do Android em duas camadas, os
mipmaps antigos e os PNG do PWA. Todos saem da arte original por
`ferramentas/gerar-icones.py`, que também está no repositório.

## Financeiro

O módulo antes chamado Gastos, hoje o guarda-chuva do que é financeiro. Na
tela: resumo por período (gastos registrados, combustível e recarga, gasto por
km), lançamento de despesas e dois botões que levam a telas próprias —

- **Histórico de gastos**: o título "Lançamentos" centralizado e, logo abaixo,
  os dois seletores centralizados lado a lado — ano e categoria — e cada
  mês numa caixa que abre e fecha, com o total do mês e do ano. Cada lançamento
  mostra a descrição, a data entre ela e o valor — em fonte menor, a mesma do
  histórico de corridas — e o valor. O ano corrente está sempre na lista, tenha
  lançamento ou não, então ele aparece sozinho quando o ano vira;
- **Relatórios**: resultado do período, por hora e por km, ganhos por
  plataforma e onde você gastou.

As duas ficam fora da barra de baixo: a aba Financeiro segue marcada enquanto
elas estão abertas, e a seta no alto à esquerda volta para a tela-mãe. Essa
seta é a mesma em todo o app — aparece só nas sub-telas, e o nome LucroInDrive
fica centralizado no topo para ela não encostar nele.

## Início

Mostra o dia, e só o dia — sem seletor de período. O resultado, a meta, a
jornada e as últimas corridas são sempre de hoje. O seletor de Hoje / 7 dias /
Mês continua nas telas onde comparar períodos faz sentido: Corridas, Financeiro
e Relatórios.

## Corridas e jornadas

Uma **jornada por dia**: começar uma quando o dia já tem jornada é recusado. A
data é o que liga a corrida à jornada dela, então não há lançamento órfão nem
carimbo em cada corrida.

O **Histórico de corridas** é um botão da tela de Corridas, no mesmo molde do
histórico de gastos: seletor de ano e de plataforma, total do ano e uma caixa
por mês que abre e fecha. Cada corrida mostra a plataforma, a data entre ela e o valor — em
fonte menor, para caber — e, ao lado do valor, um botão de comprovante — ele abre a tela de gerar comprovante já com o valor e a data
daquela corrida preenchidos; o trajeto fica para o motorista, que é a parte que
só ele sabe. A tela de Corridas em si ficou com o resumo do período e os três
atalhos: histórico, Jornadas e gerar comprovante.

O dia encerrado fica guardado em **Jornadas**: um seletor escolhe o ano e mostra
os ganhos dele; abaixo a lista é em dois níveis, o mês ("out/2026", com quantas
jornadas e o total) abre e, dentro dele, cada dia ("Jornada 01/10", com as
corridas, o tempo, a distância e o total) abre por sua vez. Essa tela continua
no endereço `#corridas-jornadas`, mas **não tem mais botão** que leve a ela: o
atalho saiu da tela de Corridas.

Enquanto a jornada está aberta, a distância do dia é o odômetro menos a
quilometragem de saída; ao encerrar, vale a leitura final.

### Pausar e continuar

Em "Sua jornada", no Início, a jornada vai de **iniciar** a **pausar** e
**continuar**, quantas vezes o motorista quiser — almoço, espera, uma volta em
casa. Em pausa o relógio simplesmente não anda: a jornada guarda os minutos já
contados e só volta a somar quando ela continua, então pausar e voltar dez
vezes não infla nem zera o tempo.

Ninguém precisa lembrar de encerrar. **Ao virar o dia a jornada se fecha
sozinha**, com o tempo contado até a meia-noite daquele dia — nada de uma
jornada esquecida varar a madrugada e marcar 30 horas — e com a quilometragem
conhecida. Ela aparece em Jornadas marcada como *Encerrada na virada do dia*, e
o dia novo já pode começar a sua.

O fechamento acontece ao abrir o app e a cada minuto com ele aberto. Como é uma
página sem servidor, não há nada rodando com o app fechado: quem fecha a
jornada esquecida é a primeira abertura do dia seguinte.

### Comprovante de corrida

Em Corridas, **Gerar comprovante** abre uma tela com o texto já pronto e os
campos que o motorista preenche: carro (vem preenchido do cadastro, quando
existe), local de saída, local de chegada, valor pago e data. A prévia do que o
passageiro vai receber acompanha a digitação.

Ao gerar, o comprovante fica salvo em **Comprovantes gerados** e pode ser
enviado de três formas: link do WhatsApp, o compartilhamento do próprio
aparelho (é de onde saem Bluetooth e os demais aplicativos) e cópia do texto.
A lixeira no alto de cada caixa exclui o comprovante, com confirmação.

As plataformas não são fixas. Além de Uber, 99 e Particular, o motorista
acrescenta as que rodam na cidade dele (DriveIn, InDrive, uma cooperativa
local) pelo botão **Plataformas**, na tela de Corridas. Elas passam a aparecer
ao registrar uma corrida, no filtro do histórico e nos relatórios, e ganham um
crachá com as iniciais e uma cor fixa. São até 12; uma plataforma que já tem
corridas registradas não pode ser removida, para não deixar lançamentos órfãos.

## Meu carro

O cadastro do carro é **opcional**: corridas, gastos e jornadas funcionam sem
ele. Ele existe por três motivos:

- consultar o valor de referência na **Tabela FIPE**;
- montar o **painel de manutenção** conforme o motor;
- manter quilometragem e prazos de revisão no lugar.

O formulário do carro é centralizado: cada rótulo fica em verde, no meio da sua
caixa, e o que é digitado também sai centralizado. Um **\*** verde ao lado do
rótulo marca o que é obrigatório, no app todo; o login é a exceção, onde e-mail
e senha são obrigatórios mas sem a marca. A
marca vem do próprio `required` do campo, então não dá para o rótulo dizer uma
coisa e a validação outra; o asterisco é decorativo (`aria-hidden`), porque
quem usa leitor de tela já ouve a obrigatoriedade pelo campo. No cadastro do
carro, isso é marca e modelo — o resto é opcional.

A caixa do veículo traz o cadastro e a quilometragem, com o lápis e a lixeira
no alto à direita — editar e remover ficam na própria caixa, não em botões
soltos acima dela. Enquanto não há carro, o topo mostra **Cadastrar carro**.

**Atualizar km aceita número menor que o atual.** Ler o computador de bordo
errado acontece, e travar o campo obrigaria a conviver com o erro. Mas não
passa em silêncio: enquanto se digita um número abaixo do atual, um aviso diz
de quanto para quanto o odômetro volta, lembra de conferir o computador de
bordo (os prazos das revisões saem desse número) e, se houver jornada aberta
que começou acima do novo valor, avisa que a distância do dia volta a zero. Ao
salvar, o recado repete os dois números.

O **Painel de Manutenção** fica numa tela própria, aberta pelo botão em Meu
carro. O botão leva só o nome: o estado de cada item já está na tela, em cada
cartão.

**Adicionar manutenção** é o botão ao lado dele, para o serviço que não está na
lista de revisões: pastilha de freio, amortecedor, embreagem, o que for. Em cada
lançamento vão o que foi feito, o valor, a quilometragem, a data e, se quiser, a
oficina — assim dá para saber depois com quantos km a pastilha foi trocada.

A lista fica na mesma tela, organizada como as jornadas: um seletor de ano, o
total do ano e uma caixa por mês (`out/2026`) que abre e mostra as manutenções
daquele mês. Cada manutenção é outra caixa, com a descrição, o km e a data à
vista, uma lixeira ao lado e, ao abrir, a oficina e o gasto que ela gerou.

Todo lançamento de manutenção entra nos gastos do Financeiro na categoria
**Manutenção**, pela data informada, exatamente como um gasto do dia a dia:
conta nos resumos do período, no histórico e nos relatórios. Excluir a
manutenção também tira o gasto. A quilometragem informada atualiza o odômetro
quando é maior que a registrada.

### Painel de Manutenção por tipo de motor

| Motor | Itens |
|---|---|
| Combustão | óleo do motor, filtro de óleo, filtro de ar do motor, filtro de combustível, filtro de cabine, fluido de freio, arrefecimento, pneus |
| Híbrido | os de combustão + bateria de tração |
| Elétrico | filtro de cabine, fluido de freio, arrefecimento da bateria, óleo do redutor, bateria de tração, pneus |

Cada filtro é um item próprio, com seu registro e seu prazo. O de cabine é o
único que todo carro tem; os de óleo, de ar do motor e de combustível dependem
de motor a combustão e somem do painel num carro elétrico.

Carro elétrico não troca óleo de motor nem filtro de combustível, e o painel já
sai sem esses itens. Trocar o tipo de motor no cadastro remonta o painel e
preserva o que já havia sido registrado nos itens que continuam.

### Tabela FIPE

A consulta é real, pela API pública `fipe.parallelum.com.br` (v2, carros). Com
marca, modelo e ano do cadastro, o app procura a versão sozinho; quando não
acha, dá para escolher a versão na lista da FIPE ou anotar o valor à mão. Só
marca, modelo e ano saem do aparelho — a placa nunca é enviada.

Sem token, a API aceita cerca de 500 requisições por dia por origem. Se um dia
for preciso mais, o caminho é um servidor intermediário que guarde o token: o
app passa a apontar `FIPE_API` para ele.

## Catálogo de veículos

Marcas, modelos e versões ficam embutidos no `index.html`, em
`<script id="catalogo" type="application/json">`. São 41 marcas, 334 modelos e
562 versões — as famílias a combustão vêm do catálogo do TMyCar, e as linhas
elétricas e híbridas foram acrescentadas aqui (BYD, GWM, Tesla, Ora, Leaf,
Kwid E-Tech, e-JS1, Dolphin Mini, os híbridos de Toyota, Honda, Caoa Chery e
outros). Quem não encontrar o próprio carro pode digitar marca, modelo e versão
à mão — nada no cadastro depende da lista.

Para acrescentar carros, edite o dicionário `NOVOS` em
`ferramentas/gerar-catalogo.py`, rode o script e cole o JSON gerado de volta no
`index.html`:

```sh
python3 ferramentas/gerar-catalogo.py caminho/para/Tmycar.html catalogo.json
```
