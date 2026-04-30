import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const guests = [
  ["Marcin Dyliński", "DGLC-64G1B3"],
  ["Maciej Kuźma", "DGLC-VYF7AF"],
  ["Grzegorz Firczyk", "DGLC-CNLED6"],
  ["Monika Majewska", "DGLC-O1INBY"],
  ["Franciszek Gałązka", "DGLC-P97QWB"],
  ["Aneta Oratowska", "DGLC-OT4EGQ"],
  ["Katarzyna Świderska", "DGLC-JW4RNN"],
  ["Agnieszka Niedziela", "DGLC-W4BTZB"],
  ["Tomasz Weiss", "DGLC-89RXIM"],
  ["Michał Jaworski", "DGLC-P8H9WX"],
  ["Tomasz Masjło", "DGLC-AG9U1J"],
  ["Iwona Skalska", "DGLC-KPA5XW"],
  ["Dorota Bachman", "DGLC-DF7JM5"],
  ["Wiktor Kowalski", "DGLC-NYDXH5"],
  ["Joanna Kozikowska", "DGLC-HJUTDD"],
  ["Szymon Dera", "DGLC-BJTJA0"],
  ["Małgorzata Sprusińska", "DGLC-Z1UWO1"],
  ["Roman Kordus", "DGLC-HD5BOT"],
  ["Marta Oleksiak", "DGLC-H8YA1I"],
  ["Tomasz Głodowski", "DGLC-K1KH9I"],
  ["Agnieszka Wasilewska", "DGLC-9D8PK6"],
  ["Michał Jakóbczyk", "DGLC-VWKZ5H"],
  ["Agata Dublasiewicz", "DGLC-LI6B6P"],
  ["Piotr Wieruszewski", "DGLC-XWGP03"],
  ["Aleksandra Bujnowska", "DGLC-VGHKVP"],
  ["Robert Karolak", "DGLC-4MEMNZ"],
  ["Rafał Wosztyl", "DGLC-HU34YB"],
  ["Łukasz Wójcik", "DGLC-EF5WXZ"],
  ["Piotr Strzałkowski", "DGLC-D86KRF"],
  ["Paulina Ciecierska", "DGLC-F073Z6"],
  ["Piotr Frankowski", "DGLC-U85H4L"],
];

const slugify = (value) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const baseDir = process.cwd();
const templatePath = join(baseDir, "invitation-template.html");
const outputDir = join(baseDir, "invitations-named");
const template = readFileSync(templatePath, "utf8");

mkdirSync(outputDir, { recursive: true });

const manifest = ["name,code,file"];
const indexRows = [];

for (const [name, codeRaw] of guests) {
  const code = codeRaw.trim().toUpperCase();
  const fileName = `invite-${slugify(name)}-${code}.html`;
  const filePath = join(outputDir, fileName);

  const html = template
    .replaceAll("{{GUEST_NAME}}", name)
    .replaceAll("{{INVITE_CODE}}", code);

  writeFileSync(filePath, html, "utf8");
  manifest.push(`${JSON.stringify(name)},${code},${fileName}`);
  indexRows.push({ name, code, fileName });
}

writeFileSync(join(outputDir, "manifest.csv"), `${manifest.join("\n")}\n`, "utf8");

const indexHtml = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Spis zaproszen imiennych | Digital Growth Collective</title>
  <style>
    body {
      margin: 0;
      font-family: Inter, Arial, sans-serif;
      background: #020710;
      color: #f1f5f9;
      padding: 24px;
    }
    .wrap {
      max-width: 980px;
      margin: 0 auto;
    }
    h1 {
      margin: 0 0 8px;
      font-size: 32px;
    }
    p {
      color: #94a3b8;
      margin: 0 0 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: rgba(10, 18, 30, 0.82);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      overflow: hidden;
    }
    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    th {
      color: #00bfff;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    a {
      color: #00bfff;
      text-decoration: none;
      font-weight: 600;
    }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Spis zaproszen imiennych</h1>
    <p>Lista wygenerowanych zaproszen Digital Growth Collective.</p>
    <table>
      <thead>
        <tr>
          <th>Imie i nazwisko</th>
          <th>Kod</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        ${indexRows
          .map(
            ({ name, code, fileName }) =>
              `<tr><td>${name}</td><td>${code}</td><td><a href="./${fileName}" target="_blank" rel="noopener noreferrer">Otworz zaproszenie</a></td></tr>`,
          )
          .join("\n        ")}
      </tbody>
    </table>
  </div>
</body>
</html>`;

writeFileSync(join(outputDir, "index.html"), indexHtml, "utf8");

console.log(`Wygenerowano ${guests.length} imiennych zaproszen w katalogu invitations-named/`);
console.log("Plik mapowania: invitations-named/manifest.csv");
console.log("Spis tresci: invitations-named/index.html");
