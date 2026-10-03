# LucroInDrive — publicação da versão de testes

Preparado em 03/10/2026. Projeto Firebase: **lucroindrive**. Contato: **lucroindrive@gmail.com**.

## O que está integrado

- Cadastro e login por e-mail/senha, recuperação de senha e confirmação do e-mail.
- Entrada com Google, mediante provedor habilitado no Firebase.
- Primeiro acesso condicionado à declaração de 18 anos ou mais e aceite da versão atual dos documentos.
- Corridas, gastos, jornadas, carro e manutenção salvos no Firestore por conta.
- Avisos de sincronização, cópia local das alterações pendentes quando o navegador permite e detecção de alterações conflitantes entre acessos.
- Exportação JSON e exclusão da conta com confirmação da identidade. Exclusão interrompida permite tentar concluir.
- Configuração do Hosting voltada ao site e projeto lucroindrive.

O arquivo original está preservado em `reference/index-18.html`. A aplicação integrada usa vários arquivos; abra pelo servidor local ou Hosting, não por duplo clique no HTML.

## 1. Entrar no Firebase pelo PowerShell

Abra o PowerShell nesta pasta. Na localização atual, execute:

```powershell
Set-Location -LiteralPath 'C:\Users\Bruno Lima\Documents\Codex\2026-09-27\vou-iniciar-esse-chat-ja-pra\outputs\LucroInDrive-web'
firebase.cmd login
```

No navegador, escolha a conta Google que administra o projeto **lucroindrive**. Se a CLI já estiver conectada, confira os projetos:

```powershell
firebase.cmd projects:list
```

O projeto `lucroindrive` precisa aparecer. Se não aparecer, entre com a conta correta antes de publicar. Node.js e Firebase CLI já foram encontrados neste computador; não há dependências npm do projeto para instalar.

## 2. Publicar

Com o acesso confirmado, execute:

```powershell
npm.cmd run deploy
```

Esse comando roda os testes, gera `dist` e publica somente o Hosting no projeto `lucroindrive`. Os arquivos `firebase.json` e `.firebaserc` já estão preparados; não é necessário executar `firebase init`.

O terminal deve terminar com **Deploy complete!** e informar o endereço publicado. Para o site configurado, o endereço esperado é **https://lucroindrive.web.app**.

As regras do Firestore já publicadas por você devem coincidir com `firestore.rules`. O comando de publicação acima não altera regras. Se precisar reaplicar o arquivo preparado, use, nesta mesma pasta:

```powershell
firebase.cmd deploy --only firestore:rules --project lucroindrive
```

Referência: [primeira publicação no Firebase Hosting](https://firebase.google.com/docs/hosting/quickstart).

## 3. Validar o site publicado

Use uma conta de teste sua e dados fictícios:

1. Crie a conta por e-mail. Antes da confirmação, o painel deve permanecer bloqueado.
2. Abra o link recebido por e-mail e toque em **Já confirmei meu e-mail**.
3. Confira que **Entrar no app** fica desabilitado antes da declaração e do aceite. Faça você mesmo o aceite após ler os documentos.
4. Registre uma corrida e um gasto. Aguarde a indicação de que estão salvos, recarregue e confira os valores.
5. Saia e entre novamente: os registros devem voltar e o aceite da mesma versão não deve reaparecer.
6. Entre com outra conta: ela deve começar sem os registros da primeira.
7. Teste a recuperação de senha e a entrada com Google.
8. Na conta de teste descartável, teste exportação e exclusão, inclusive a confirmação de identidade.

Se aparecer “acesso ainda não foi habilitado neste endereço”, confira em **Authentication → Settings → Authorized domains** o domínio aberto. Para testar Google ou retorno de e-mail localmente, pode ser necessário incluir `localhost` ou `127.0.0.1` conforme o endereço utilizado.

## 4. Domínio próprio

O domínio ainda precisa ser escolhido e registrado por você. Depois:

1. No projeto **lucroindrive**, abra **Hosting → Adicionar domínio personalizado**.
2. Informe o domínio registrado.
3. No serviço onde comprou o domínio, adicione exatamente os registros DNS apresentados pelo Firebase.
4. Aguarde a verificação e o certificado HTTPS no console.
5. Inclua o domínio em **Authentication → Settings → Authorized domains** e teste novamente Google, confirmação de e-mail e recuperação de senha nesse endereço.

Não há registros DNS genéricos neste pacote: os valores devem vir do assistente do seu domínio. Referência: [conectar domínio próprio](https://firebase.google.com/docs/hosting/custom-domain).

## Estado da validação e limites desta entrega

- **18 testes automatizados locais passaram** e o build foi gerado. Cobrem separação entre contas, filas de gravação, falhas de conexão, conflitos, aceite, serialização e exclusão interrompida, usando serviços simulados.
- O SDK real inicializou em uma verificação anterior. A última tentativa de abrir a prévia nesta sessão foi bloqueada pela conexão local do ambiente.
- **Ainda não houve teste completo com contas reais, envio de e-mails, regras em emulador ou gravação no Firestore real.** A validação da etapa 3 continua pendente.
- **Nenhuma publicação ou compra de domínio foi feita pelo assistente.**
- Os documentos de termos e privacidade estão identificados como versão de testes. A identificação completa do responsável e os documentos definitivos ainda precisam ser definidos antes da abertura ao público.
- O aceite e a declaração de idade são controles do aplicativo; as regras atuais do banco exigem conta dona dos dados e e-mail confirmado. Não fazem comprovação documental de idade nem impõem o aceite no servidor.
- Não há pagamento ou ativação de assinatura. As contas permanecem no plano grátis. FIPE e comprovantes continuam sujeitos à restrição de plano herdada do arquivo original; a liberação comercial precisa de uma etapa própria.
- A exportação gera JSON; não há importação automática desse arquivo. Em conflito, baixe a cópia pendente antes de carregar os registros do servidor.
- As alterações pendentes ficam neste navegador quando o armazenamento local está disponível. Não limpe os dados do navegador antes de sincronizar ou exportar.

## Arquivos e manutenção

- `src/`: código e estilos editáveis.
- `public/`: HTML, configuração pública do Firebase e manifesto.
- `dist/`: somente os arquivos enviados ao Hosting.
- `tests/`: testes locais; não são publicados.
- `reference/`: original preservado; não é publicado.
- `firebase.json`, `.firebaserc`, `firestore.rules`: configuração do projeto.

Para desenvolver localmente:

```powershell
npm.cmd run build
npm.cmd start
```

Abra `http://127.0.0.1:4180`. Esse servidor utiliza a configuração real do Firebase. A simulação isolada para desenvolvimento fica em `scripts/serve-fixture.mjs`, porta 4181, e não integra o build.

Após alterar o código, rode novamente `npm.cmd run deploy` para testar, gerar e publicar a atualização.
