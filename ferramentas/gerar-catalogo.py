# -*- coding: utf-8 -*-
"""Gera o catálogo de veículos do LucroInDrive.

Base: o catálogo de combustão/híbridos do TMyCar (36 marcas), lido do HTML dele.
Acréscimo: as linhas elétricas e híbridas, que não existem no TMyCar e que hoje
rodam muito em aplicativo.

Uso:
    python3 ferramentas/gerar-catalogo.py caminho/para/Tmycar.html catalogo.json

Para acrescentar carros, edite o dicionário NOVOS abaixo, rode o script e cole o
JSON gerado dentro de <script id="catalogo"> no index.html.

Formato de saída: { "Marca": { "Modelo": [ versão, ... ] } }
  versão = { c: cilindrada|null, t: turbo, f: combustível, a0: ano inicial, a1: ano final }
"""
import json, re, collections, sys

SRC = sys.argv[1] if len(sys.argv) > 1 else 'Tmycar.html'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'catalogo.json'

src = open(SRC, encoding='utf-8').read()
tmycar = json.loads(re.search(r'<script id="cat" type="application/json">(.*?)</script>', src, re.S).group(1))
motores = tmycar['motores']

E, H, HP, G, D, F = 'Elétrico', 'Híbrido', 'Híbrido plug-in', 'Gasolina', 'Diesel', 'Flex'
# marcas importadas/premium: no Brasil chegam a gasolina, nao flex
SO_GASOLINA = {'Audi', 'BMW', 'Chrysler', 'Dodge', 'Jaguar', 'Land Rover', 'Lexus',
               'MINI', 'Mercedes-Benz', 'Porsche', 'Subaru', 'Volvo'}

cat = collections.OrderedDict()

def add(marca, modelo, versoes):
    cat.setdefault(marca, collections.OrderedDict()).setdefault(modelo, []).extend(versoes)

def v(c, t, f, a0, a1):
    return {'c': c, 't': bool(t), 'f': f, 'a0': a0, 'a1': a1}

# ---- 1. base de combustao herdada do TMyCar -------------------------------
for marca in sorted(tmycar['carros'], key=lambda s: s.lower()):
    for modelo in sorted(tmycar['carros'][marca], key=lambda s: s.lower()):
        for ver in tmycar['carros'][marca][modelo]:
            nome_motor = motores.get(ver.get('e'), {}).get('n', '')
            if re.search(r'diesel', nome_motor, re.I):
                comb = D
            elif marca in SO_GASOLINA:
                comb = G
            else:
                comb = F
            add(marca, modelo, [v(ver.get('c'), ver.get('t'), comb, ver.get('a0'), ver.get('a1'))])

# ---- 2. linhas eletricas e hibridas --------------------------------------
NOVOS = {
 'BYD': {
   'Dolphin Mini':  [v(None, 0, E, 2024, 2026)],
   'Dolphin':       [v(None, 0, E, 2023, 2026)],
   'Dolphin Plus':  [v(None, 0, E, 2024, 2026)],
   'Seal':          [v(None, 0, E, 2023, 2026)],
   'Yuan Plus':     [v(None, 0, E, 2023, 2026)],
   'Yuan Pro':      [v(None, 0, E, 2024, 2026)],
   'Han':           [v(None, 0, E, 2022, 2026)],
   'Tan':           [v(None, 0, E, 2022, 2026)],
   'Song Plus DM-i':[v(1.5, 0, HP, 2023, 2026)],
   'Song Pro DM-i': [v(1.5, 0, HP, 2024, 2026)],
   'King DM-i':     [v(1.5, 0, HP, 2023, 2026)],
   'Shark':         [v(1.5, 1, HP, 2024, 2026)],
 },
 'GWM': {
   'Ora 03':     [v(None, 0, E, 2023, 2026)],
   'Haval H6':   [v(1.5, 1, H, 2023, 2026), v(1.5, 1, HP, 2023, 2026)],
   'Haval H6 GT':[v(1.5, 1, HP, 2024, 2026)],
   'Poer P30':   [v(2.0, 1, D, 2025, 2026)],
 },
 'Tesla': {
   'Model 3': [v(None, 0, E, 2018, 2026)],
   'Model Y': [v(None, 0, E, 2021, 2026)],
 },
 'Omoda': {
   'Omoda 5': [v(1.5, 1, G, 2025, 2026)],
 },
 'Jaecoo': {
   'Jaecoo 5': [v(1.5, 1, G, 2025, 2026)],
   'Jaecoo 7': [v(1.6, 1, G, 2025, 2026), v(1.5, 1, HP, 2025, 2026)],
 },
 'Renault': {
   'Kwid E-Tech':   [v(None, 0, E, 2022, 2026)],
   'Megane E-Tech': [v(None, 0, E, 2024, 2026)],
   'Zoe':           [v(None, 0, E, 2019, 2023)],
 },
 'Nissan': {
   'Leaf':          [v(None, 0, E, 2019, 2026)],
   'Kicks e-Power': [v(1.2, 0, H, 2025, 2026)],
 },
 'Chevrolet': {
   'Bolt EV':   [v(None, 0, E, 2019, 2023)],
   'Bolt EUV':  [v(None, 0, E, 2022, 2025)],
   'Blazer EV': [v(None, 0, E, 2024, 2026)],
   'Spark EUV': [v(None, 0, E, 2024, 2026)],
 },
 'Volvo': {
   'EX30':           [v(None, 0, E, 2024, 2026)],
   'EX40':           [v(None, 0, E, 2025, 2026)],
   'EC40':           [v(None, 0, E, 2025, 2026)],
   'XC40 Recharge':  [v(None, 0, E, 2021, 2024)],
   'C40 Recharge':   [v(None, 0, E, 2022, 2025)],
   'XC60 Recharge':  [v(2.0, 1, HP, 2020, 2026)],
   'XC90 Recharge':  [v(2.0, 1, HP, 2020, 2026)],
 },
 'JAC': {
   'E-JS1':   [v(None, 0, E, 2021, 2026)],
   'E-JS4':   [v(None, 0, E, 2022, 2026)],
   'E-J7':    [v(None, 0, E, 2022, 2024)],
   'iEV330P': [v(None, 0, E, 2021, 2026)],
 },
 'Caoa Chery': {
   'iCar':            [v(None, 0, E, 2023, 2026)],
   'Tiggo 5X Hybrid': [v(1.5, 1, HP, 2024, 2026)],
   'Tiggo 7 Hybrid':  [v(1.5, 1, HP, 2023, 2026)],
   'Tiggo 8 Hybrid':  [v(1.5, 1, HP, 2023, 2026)],
 },
 'Fiat': {
   '500e':            [v(None, 0, E, 2022, 2026)],
   'Pulse Hybrid':    [v(1.0, 1, H, 2025, 2026)],
   'Fastback Hybrid': [v(1.0, 1, H, 2025, 2026)],
 },
 'Peugeot': {
   'e-208':  [v(None, 0, E, 2023, 2026)],
   'e-2008': [v(None, 0, E, 2023, 2026)],
 },
 'Citroën': {
   'ë-C3': [v(None, 0, E, 2025, 2026)],
 },
 'BMW': {
   'i3':  [v(None, 0, E, 2014, 2022)],
   'i4':  [v(None, 0, E, 2022, 2026)],
   'iX':  [v(None, 0, E, 2022, 2026)],
   'iX1': [v(None, 0, E, 2023, 2026)],
   'iX3': [v(None, 0, E, 2019, 2024)],
 },
 'Mercedes-Benz': {
   'EQA': [v(None, 0, E, 2022, 2026)],
   'EQB': [v(None, 0, E, 2022, 2026)],
   'EQE': [v(None, 0, E, 2023, 2026)],
   'EQS': [v(None, 0, E, 2022, 2026)],
 },
 'Audi': {
   'e-tron':     [v(None, 0, E, 2019, 2023)],
   'Q4 e-tron':  [v(None, 0, E, 2022, 2026)],
   'Q8 e-tron':  [v(None, 0, E, 2023, 2026)],
 },
 'Porsche': {
   'Taycan':             [v(None, 0, E, 2020, 2026)],
   'Cayenne E-Hybrid':   [v(3.0, 1, HP, 2019, 2026)],
   'Panamera E-Hybrid':  [v(2.9, 1, HP, 2018, 2026)],
 },
 'Kia': {
   'Niro EV':        [v(None, 0, E, 2019, 2026)],
   'EV5':            [v(None, 0, E, 2025, 2026)],
   'EV6':            [v(None, 0, E, 2022, 2026)],
   'Soul EV':        [v(None, 0, E, 2019, 2022)],
   'Sportage Hybrid':[v(1.6, 1, H, 2024, 2026)],
   'Carnival Hybrid':[v(1.6, 1, H, 2025, 2026)],
 },
 'Hyundai': {
   'Kona Electric': [v(None, 0, E, 2019, 2025)],
   'Ioniq 5':       [v(None, 0, E, 2023, 2026)],
   'Ioniq':         [v(1.6, 0, H, 2019, 2022)],
 },
 'Toyota': {
   'Corolla Hybrid':       [v(1.8, 0, H, 2020, 2026)],
   'Corolla Cross Hybrid': [v(1.8, 0, H, 2021, 2026)],
   'Yaris Cross Hybrid':   [v(1.5, 0, H, 2025, 2026)],
   'RAV4 Hybrid':          [v(2.5, 0, H, 2019, 2026)],
   'Prius':                [v(1.8, 0, H, 2013, 2022)],
   'bZ4X':                 [v(None, 0, E, 2024, 2026)],
 },
 'Honda': {
   'City Hybrid':   [v(1.5, 0, H, 2023, 2026)],
   'Accord Hybrid': [v(2.0, 0, H, 2023, 2026)],
   'CR-V Hybrid':   [v(2.0, 0, H, 2023, 2026)],
 },
 'Volkswagen': {
   'ID.4':    [v(None, 0, E, 2022, 2026)],
   'ID.Buzz': [v(None, 0, E, 2025, 2026)],
 },
 'Ford': {
   'Mustang Mach-E': [v(None, 0, E, 2022, 2026)],
 },
 'Mitsubishi': {
   'Outlander PHEV': [v(2.4, 0, HP, 2019, 2024)],
 },
 'Lexus': {
   'UX 300e': [v(None, 0, E, 2021, 2026)],
   'UX 250h': [v(2.0, 0, H, 2019, 2026)],
   'NX 350h': [v(2.5, 0, H, 2022, 2026)],
   'ES 300h': [v(2.5, 0, H, 2019, 2026)],
   'RX 500h': [v(2.4, 1, H, 2023, 2026)],
 },
 'Jeep': {
   'Compass 4xe': [v(1.3, 1, HP, 2022, 2024)],
 },
 'MINI': {
   'Cooper SE': [v(None, 0, E, 2020, 2026)],
 },
}
for marca, modelos in NOVOS.items():
    for modelo, versoes in modelos.items():
        add(marca, modelo, versoes)

# ---- 3. ordena marcas e modelos ------------------------------------------
final = collections.OrderedDict()
for marca in sorted(cat, key=lambda s: s.lower()):
    final[marca] = collections.OrderedDict(
        (m, cat[marca][m]) for m in sorted(cat[marca], key=lambda s: s.lower()))

with open(OUT, 'w', encoding='utf-8') as fh:
    json.dump(final, fh, ensure_ascii=False, separators=(',', ':'))

marcas = len(final)
modelos = sum(len(x) for x in final.values())
versoes = sum(len(y) for x in final.values() for y in x.values())
eletricos = sum(1 for x in final.values() for y in x.values() for z in y if z['f'] == E)
hibridos = sum(1 for x in final.values() for y in x.values() for z in y if z['f'] in (H, HP))
print(f'{OUT}: marcas={marcas} modelos={modelos} versoes={versoes} eletricas={eletricos} hibridas={hibridos}')
