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

## Financeiro

O módulo antes chamado Gastos. Hoje reúne o resumo por período (gastos
registrados, combustível e recarga, gasto por km), o lançamento de despesas e o
**Histórico de gastos**, que fica numa tela própria: um ano por vez, cada mês
numa caixa que abre e fecha, com o total do mês e do ano, e filtro por
categoria. É a tela onde entra o que for financeiro daqui para frente.

## Corridas

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

### Painel de manutenção por tipo de motor

| Motor | Itens |
|---|---|
| Combustão | óleo do motor, fluido de freio, filtros, arrefecimento, pneus |
| Híbrido | os de combustão + bateria de tração |
| Elétrico | fluido de freio, filtro do ar-condicionado, arrefecimento da bateria, óleo do redutor, bateria de tração, pneus |

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
