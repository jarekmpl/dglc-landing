import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseDir = process.cwd();
const codesPath = join(baseDir, "vip_codes.json");
const templatePath = join(baseDir, "invitation-template.html");
const outputDir = join(baseDir, "invitations");

const codes = JSON.parse(readFileSync(codesPath, "utf8"));
const template = readFileSync(templatePath, "utf8");

mkdirSync(outputDir, { recursive: true });

const csvLines = ["code,file"];
let generated = 0;

for (const codeRaw of codes) {
  if (typeof codeRaw !== "string" || !codeRaw.trim()) continue;

  const code = codeRaw.trim().toUpperCase();
  const safeCode = code.replace(/[^A-Z0-9-]/g, "-");
  const fileName = `invite-${safeCode}.html`;
  const filePath = join(outputDir, fileName);

  const html = template.replaceAll("{{INVITE_CODE}}", code);
  writeFileSync(filePath, html, "utf8");

  csvLines.push(`${code},${fileName}`);
  generated += 1;
}

writeFileSync(join(outputDir, "manifest.csv"), `${csvLines.join("\n")}\n`, "utf8");

console.log(`Wygenerowano ${generated} zaproszen w katalogu invitations/`);
console.log("Plik mapowania: invitations/manifest.csv");
