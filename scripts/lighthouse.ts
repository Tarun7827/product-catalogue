import fs from "fs";
import path from "path";

const BASE_URL = process.env.LIGHTHOUSE_URL ?? "http://localhost:3000";

const PAGES = [
  { name: "home", path: "/" },
  { name: "cart", path: "/cart" },
  { name: "profile", path: "/profile" },
];

const REPORTS_DIR = path.resolve(process.cwd(), "lighthouse-reports");

async function runAudit(url: string, name: string) {
  // Dynamic imports because lighthouse is ESM-only
  const { default: lighthouse } = await import("lighthouse");
  const chromeLauncher = await import("chrome-launcher");

  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--allow-insecure-localhost",
      "--ignore-certificate-errors",
    ],
  });

  try {
    const options = {
      logLevel: "error" as const,
      output: ["html", "json"] as ("html" | "json")[],
      port: chrome.port,
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    };

    console.log(`  Auditing: ${url}`);
    const runnerResult = await lighthouse(url, options);

    if (!runnerResult) {
      console.error(`  No result for ${url}`);
      return;
    }

    const { lhr, report } = runnerResult;
    const [htmlReport, jsonReport] = report as [string, string];

    // Write HTML report
    const htmlPath = path.join(REPORTS_DIR, `${name}.html`);
    fs.writeFileSync(htmlPath, htmlReport);

    // Write JSON report
    const jsonPath = path.join(REPORTS_DIR, `${name}.json`);
    fs.writeFileSync(jsonPath, jsonReport);

    // Print scores to console
    const scores = {
      Performance:    Math.round((lhr.categories.performance?.score    ?? 0) * 100),
      Accessibility:  Math.round((lhr.categories.accessibility?.score  ?? 0) * 100),
      "Best Practices": Math.round((lhr.categories["best-practices"]?.score ?? 0) * 100),
      SEO:            Math.round((lhr.categories.seo?.score            ?? 0) * 100),
    };

    console.log(`\n  /${name}`);
    for (const [category, score] of Object.entries(scores)) {
      const color = score >= 90 ? "🟢" : score >= 50 ? "🟡" : "🔴";
      console.log(`    ${color}  ${category.padEnd(18)} ${score}`);
    }
    console.log(`  Report saved → ${htmlPath}`);
  } finally {
    await chrome.kill();
  }
}

async function main() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  console.log(`\nLighthouse audit — ${BASE_URL}\n`);

  for (const page of PAGES) {
    await runAudit(`${BASE_URL}${page.path}`, page.name);
  }

  console.log("\nDone! Open lighthouse-reports/*.html to view full reports.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
