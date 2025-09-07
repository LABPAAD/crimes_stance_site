# CrimesStanceWeb

Este repositório contém a aplicação web "Crimes Stance", uma interface em Angular para visualizar métricas, análises e vídeos relacionados a operações e insights de sentimento.

## Conteúdo
- Código front-end em Angular (versão 20.x).
- Visualizações e gráficos (Chart.js / PrimeNG).
- Dados de exemplo em `src/assets/data/`.

## Pré-requisitos
- Node.js (recomenda-se 18+)
- npm (recomenda-se 9+)
- Acesso ao repositório Git (para publicar no GitHub Pages)

## Instalação
1. Clone o repositório e entre na pasta do projeto:

```powershell
git clone <url-do-repo>
cd crimes-stance-web
```

2. Instale as dependências:

```powershell
npm install
```

3. (Opcional) se usar Windows PowerShell e houver problemas com permissões, rode o terminal como Administrador.

## Execução em desenvolvimento
Para iniciar a aplicação em modo de desenvolvimento (hot-reload):

```powershell
npm start
# ou
ng serve
```

Abra http://localhost:4200 no navegador.

## Build de produção
Para gerar uma versão otimizada de produção:

```powershell
npm run build
```

Os arquivos compilados serão emitidos em `dist/crimes-stance-web` (conforme `angular.json`).

## Deploy para GitHub Pages
Este projeto já possui um script npm para gerar o build em modo produção e publicar no branch `gh-pages` do repositório remoto.

1. Verifique que o `remote` do git aponta para o repositório correto (ex.: `origin`):

```powershell
git remote -v
```

2. Execute o script de deploy:

```powershell
npm run build:ghpages
```

O script faz o build em produção e em seguida chama `angular-cli-ghpages` para publicar o conteúdo da pasta `dist/crimes-stance-web` no branch `gh-pages`.

Observações / resolução de problemas comuns:
- Se ocorrer erro `ENOENT` sobre arquivos faltando em `dist`, garanta que o build executou com sucesso antes do deploy.
- Se o site não aparecer no GitHub Pages, confirme no repositório em Settings → Pages que a fonte está em `gh-pages` (branch) ou espere alguns minutos após o deploy automático.
- Se `angular-cli-ghpages` não estiver instalada globalmente, o script usa `npx` para executá-la localmente; certifique-se de ter rede no momento do deploy.

## Testes
Executar testes unitários:

```powershell
npm test
```

## Contribuição
Pull requests são bem-vindos. Antes de abrir PRs, rode os builds e testes localmente.

## Licença
Consulte o arquivo `LICENSE` (se presente) ou coordene com os mantenedores do projeto.