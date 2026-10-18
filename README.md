# Mesa Oral UNR — MVP

Este projeto é um protótipo funcional de um simulador oral para Crecimiento y Desarrollo.

## O que já funciona
- 12 UPs como estrutura inicial.
- Pergunta gerada por IA.
- Pergunta falada por TTS.
- Resposta gravada pelo microfone do navegador.
- Transcrição da resposta.
- Correção e nota por IA.
- Perfis de examinador podem ser expandidos.

## Importante
Os nomes, objetivos e conteúdos oficiais das 12 UPs NÃO foram inventados neste protótipo. A próxima etapa é inserir a Guía de Aprendizaje e os materiais oficiais fornecidos por você. Isso permitirá que a IA faça perguntas e correções baseadas no conteúdo real.

## Rodar no computador
1. Instale Node.js 24+.
2. Abra o terminal nesta pasta.
3. Rode `npm install`.
4. Copie `.env.example` para `.env.local`.
5. Coloque sua chave em `OPENAI_API_KEY`.
6. Rode `npm run dev`.
7. Abra `http://localhost:3000`.

Nunca coloque OPENAI_API_KEY em uma variável `NEXT_PUBLIC_*`: isso exporia a chave no navegador.
