#!/usr/bin/env node
import inquirer from "inquirer";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";
import { sanitizeAppName } from "./utils.js";

const FOLDER_BASE = "__base";

async function main() {
  console.log("🚀 Criador de Monorepo");

  // Nome do monorepo
  const { monorepoNameInput } = await inquirer.prompt([
    { type: "input", name: "monorepoNameInput", message: "Nome do monorepo:" },
  ]);

  const monorepoName = sanitizeAppName(monorepoNameInput);

  const rootDir = path.join(process.cwd(), monorepoName);

  console.log("📦 Clonando template base...");
  await execa("git", [
    "clone",
    "--depth",
    "1",
    "https://github.com/peal-26/monorepo-template.git",
    rootDir,
  ]);

  fs.removeSync(path.join(rootDir, ".git"));

  const appsDir = path.join(rootDir, "apps");
  const baseDir = path.join(appsDir, FOLDER_BASE);

  for (const dir of ["api", "mobile", "web"]) {
    const folderSource = path.join(appsDir, dir);
    const folderDest = path.join(baseDir, dir);
    if (!fs.existsSync(folderSource)) continue;

    fs.moveSync(folderSource, folderDest, { overwrite: true });
  }

  // Tipos de apps disponíveis
  const appTypes = [
    { name: "Next.js (web)", value: "web" },
    { name: "Expo (mobile)", value: "mobile" },
    { name: "NestJS (api)", value: "api" },
  ];

  const { selectedTypes } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedTypes",
      message: "Quais tipos de apps deseja criar?",
      choices: appTypes,
    },
  ]);

  const createdApps = [];

  for (const type of selectedTypes) {
    const { count } = await inquirer.prompt([
      {
        type: "number",
        name: "count",
        message: `Quantos apps do tipo ${type} deseja criar?`,
        default: 1,
      },
    ]);

    for (let i = 0; i < count; i++) {
      const { appNameInput } = await inquirer.prompt([
        {
          type: "input",
          name: "appNameInput",
          message: `Nome do app #${i + 1} (${type}):`,
        },
      ]);

      const appName = sanitizeAppName(appNameInput);
      const src = path.join(baseDir, type);
      const dest = path.join(appsDir, appName);

      console.log(`📂 Criando app ${appName} a partir de ${type}...`);
      fs.copySync(src, dest);

      const pkgPath = path.join(dest, "package.json");
      const pkg = fs.readJsonSync(pkgPath);
      pkg.name = appName;
      fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
      
      createdApps.push(appName);
    }
  }

  fs.removeSync(baseDir);

  const pkgPath = path.join(rootDir, "package.json");
  const pkg = fs.readJsonSync(pkgPath);

  pkg.name = monorepoName;

  if (!pkg.scripts) pkg.scripts = {};

  for (const app of createdApps) {
    pkg.scripts[`build:${app}`] = `turbo run build --filter=${app}`;
    pkg.scripts[`dev:${app}`] = `turbo run dev --filter=${app}`;
    pkg.scripts[`start:${app}`] = `turbo run start --filter=${app}`;
    pkg.scripts[`format:${app}`] = `turbo run format --filter=${app}`;
  }

  fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });

  console.log("📦 Instalando dependências...");
  fs.removeSync(path.join(rootDir, "package-lock.json"));
  await execa("npm", ["install"], { cwd: rootDir, stdio: "inherit" });
  await execa("git", ["init"]);

  console.log("\n✅ Monorepo configurado com sucesso!");
  console.log(`📂 Local: ${rootDir}`);
  console.log("👉 Agora você pode rodar:");
  createdApps.forEach((app) => {
    console.log(`   - npm run dev:${app}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
