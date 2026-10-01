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

O módulo antes chamado Gastos, hoje o guarda-chuva do que é financeiro. Na
tela: resumo por período (gastos registrados, combustível e recarga, gasto por
km), lançamento de despesas e dois botões que levam a telas próprias —

- **Histórico de gastos**: um ano por vez, cada mês numa caixa que abre e
  fecha, com o total do mês e do ano, e filtro por categoria;
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

No Início, "Últimas corridas" mostra as corridas da jornada aberta e se recolhe
pela seta ao lado do título. Ao encerrar a jornada a lista zera, e o dia fica
guardado em **Jornadas**, o botão da tela de Corridas. Lá a lista é em dois
níveis: o mês ("out/2026", com quantas jornadas e o total) abre e, dentro dele,
cada dia ("Jornada 01/10", com as corridas, o tempo, a distância e o total)
abre por sua vez.

Enquanto a jornada está aberta, a distância do dia é o odômetro menos a
quilometragem de saída; ao encerrar, vale a leitura final.

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

### Painel de manutenção por tipo de motor

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
