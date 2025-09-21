#!/usr/bin/env node
import inquirer from "inquirer";
import { execa } from "execa";
import fs from "fs-extra";
import path from "path";

async function main() {
  console.log("🚀 Criador de Monorepo");

  // Nome do monorepo
  const { monorepoName } = await inquirer.prompt([
    { type: "input", name: "monorepoName", message: "Nome do monorepo:" }
  ]);

  const rootDir = path.join(process.cwd(), monorepoName);

  console.log("📦 Clonando template base...");
  await execa("git", [
    "clone",
    "--depth",
    "1",
    "https://github.com/peal-26/monorepo-template.git",
    rootDir
  ]);

  fs.removeSync(path.join(rootDir, ".git"));

  const appsDir = path.join(rootDir, "apps");

  // Tipos de apps disponíveis
  const appTypes = [
    { name: "Next.js (web)", value: "_web" },
    { name: "Expo (mobile)", value: "_mobile" },
    { name: "NestJS (api)", value: "_api" }
  ];

  const { selectedTypes } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedTypes",
      message: "Quais tipos de apps deseja criar?",
      choices: appTypes
    }
  ]);

  for (const type of selectedTypes) {
    const { count } = await inquirer.prompt([
      {
        type: "number",
        name: "count",
        message: `Quantos apps do tipo ${type.replace("_", "")} deseja criar?`,
        default: 1
      }
    ]);

    for (let i = 0; i < count; i++) {
      const { appName } = await inquirer.prompt([
        {
          type: "input",
          name: "appName",
          message: `Nome do app #${i + 1} (${type.replace("_", "")}):`
        }
      ]);

      const src = path.join(appsDir, type);
      const dest = path.join(appsDir, appName);

      console.log(`📂 Criando app ${appName} a partir de ${type}...`);
      fs.copySync(src, dest);
    }
  }

  // Remove templates base (_web, _mobile, _api)
  for (const type of appTypes.map(t => t.value)) {
    fs.removeSync(path.join(appsDir, type));
  }

  console.log("\n✅ Monorepo configurado com sucesso!");
  console.log(`📂 Local: ${rootDir}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
