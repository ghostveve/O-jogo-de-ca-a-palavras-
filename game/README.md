# Palavrinha

Jogo diário de palavras temáticas para crianças e jovens. A aplicação usa React, TypeScript e Vite; as partidas e estatísticas ficam no navegador.

## Requisitos

- Node.js 22 ou superior
- npm

## Desenvolvimento

```sh
npm install
npm run dev
```

Abra `http://localhost:5173/` para jogar. Abra `http://localhost:5173/?prototypes=1` para comparar Caderno, Feira e Rota. A experiência normal usa Caderno.

## Verificações

```sh
npm test
npm run lint
npm run build
```

## Publicação de prévia

O build estático fica em `dist/`. Para criar uma URL temporária de revisão sem alterar o canal `live`:

```sh
npm run build
firebase hosting:channel:deploy palavrinha-preview --project apprecomendacao-leticia --expires 7d
```

O projeto Firebase configurado também hospeda outro produto; por isso, não use `firebase deploy` sem confirmar que deseja substituir o site de produção.