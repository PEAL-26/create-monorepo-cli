# 📦 create-monorepo-turbo

CLI para criação de monorepositórios modernos com suporte a múltiplos aplicativos (Next.js, Expo, NestJS) e pacotes compartilhados já pré-configurados (eslint, prettier, tsconfig, jest, ui, hooks, helpers, etc.).

Com um único comando, você pode gerar um novo monorepo baseado no [monorepo-template](https://github.com/peal-26/monorepo-template), escolhendo quais apps deseja manter e quantos de cada tipo.

---

## 🚀 Instalação e uso

Você não precisa instalar globalmente, basta rodar via **npx**:

```bash
npx create-monorepo
```

---

## ⚙️ Fluxo

1. Informe o nome do monorepo.
2. Escolha os tipos de aplicativos que deseja criar (Next.js, Expo, NestJS).
3. Defina quantas instâncias de cada tipo deseja (ex.: `web-admin`, `web-client`, `api-auth`, `api-payments`).
4. O CLI copia os apps e pacotes do template e remove o que não foi selecionado.

---

## 📂 Estrutura gerada

Exemplo de monorepo após rodar o CLI:

```
meu-projeto/
├─ apps/
│  ├─ web-admin/     (Next.js)
│  ├─ web-client/    (Next.js)
│  ├─ api-auth/      (NestJS)
│  └─ mobile/        (Expo)
├─ packages/
│  ├─ @config-eslint/
│  ├─ @config-jest/
│  ├─ @config-nextjs/
│  ├─ @config-prettier/
│  ├─ @config-typescript/
│  ├─ assets/
│  ├─ constants/
│  ├─ helpers/
│  ├─ hooks/
│  └─ ui/
├─ package.json
└─ turbo.json
```

---

## 🛠️ Tecnologias usadas

- **Node.js** (CLI)
- **Inquirer.js** (prompt interativo)
- **execa** (execução de comandos)
- **fs-extra** (manipulação de arquivos e diretórios)
- **Turborepo / Workspaces** para gerenciamento do monorepo

---

## 📝 Licença

Este projeto está sob a licença **MIT**.
