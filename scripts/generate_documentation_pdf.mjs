import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const MD_PATH = path.join(rootDir, 'docs', 'TAPFOLIO_SYSTEM_DOCUMENTATION.md');
const PDF_OUTPUT_PATH = path.join(rootDir, 'docs', 'TAPFOLIO_SYSTEM_DOCUMENTATION.pdf');

async function buildPdf() {
  console.log('Reading Markdown document...');
  const mdContent = fs.readFileSync(MD_PATH, 'utf8');

  // Custom renderer for marked to preserve mermaid blocks and enhance tables
  const renderer = new marked.Renderer();

  renderer.code = function({ text, lang }) {
    if (lang === 'mermaid') {
      return `<div class="mermaid-wrapper"><div class="mermaid">${text}</div></div>`;
    }
    const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<div class="code-block-wrapper"><div class="code-lang">${lang || 'text'}</div><pre><code class="language-${lang || 'text'}">${escaped}</code></pre></div>`;
  };

  marked.setOptions({
    renderer: renderer,
    gfm: true,
    breaks: false,
  });

  const parsedBodyHtml = marked.parse(mdContent);

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tapfolio — Complete System Documentation</title>
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap" rel="stylesheet">
  <!-- Mermaid.js -->
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.0/dist/mermaid.min.js"></script>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.65;
      font-size: 10.5pt;
      margin: 0;
      padding: 0;
    }

    /* ── Cover Page ─────────────────────────────────────────────────── */
    .cover-page {
      page-break-after: always;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 40px 20px 30px 20px;
      position: relative;
    }

    .cover-top {
      border-top: 5px solid #0052FF;
      padding-top: 25px;
    }

    .brand-badge {
      display: inline-flex;
      align-items: center;
      background: linear-gradient(135deg, #0052FF, #4F46E5);
      color: #ffffff;
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 11pt;
      letter-spacing: 0.5px;
      padding: 6px 16px;
      border-radius: 20px;
      margin-bottom: 25px;
      box-shadow: 0 4px 12px rgba(0, 82, 255, 0.25);
    }

    .cover-title {
      font-family: 'Outfit', sans-serif;
      font-size: 38pt;
      font-weight: 900;
      color: #0f172a;
      line-height: 1.1;
      margin: 0 0 12px 0;
      letter-spacing: -1px;
    }

    .cover-title span {
      color: #0052FF;
    }

    .cover-subtitle {
      font-family: 'Outfit', sans-serif;
      font-size: 18pt;
      font-weight: 700;
      color: #334155;
      margin: 0 0 16px 0;
    }

    .cover-desc {
      font-size: 12.5pt;
      color: #64748b;
      max-width: 85%;
      margin: 0 0 35px 0;
      font-weight: 400;
      line-height: 1.5;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
      margin-top: 20px;
      max-width: 90%;
    }

    .meta-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 18px;
    }

    .meta-label {
      font-size: 8.5pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: #64748b;
      margin-bottom: 4px;
    }

    .meta-value {
      font-family: 'Outfit', sans-serif;
      font-size: 12pt;
      font-weight: 700;
      color: #0f172a;
    }

    .cover-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9pt;
      color: #94a3b8;
      font-weight: 500;
    }

    /* ── Content Layout ─────────────────────────────────────────────── */
    .content-body {
      padding: 0;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Outfit', sans-serif;
      color: #0f172a;
      letter-spacing: -0.3px;
      page-break-after: avoid;
    }

    h1 {
      font-size: 20pt;
      font-weight: 800;
      border-bottom: 2px solid #0052FF;
      padding-bottom: 8px;
      margin-top: 36px;
      margin-bottom: 18px;
    }

    h2 {
      font-size: 15pt;
      font-weight: 700;
      color: #0052FF;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      margin-top: 28px;
      margin-bottom: 14px;
      page-break-before: auto;
    }

    h3 {
      font-size: 12.5pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    h4 {
      font-size: 11pt;
      font-weight: 600;
      color: #334155;
      margin-top: 14px;
      margin-bottom: 6px;
    }

    p, ul, ol {
      margin-top: 0;
      margin-bottom: 12px;
    }

    ul, ol {
      padding-left: 22px;
    }

    li {
      margin-bottom: 4px;
    }

    blockquote {
      background: #f0f7ff;
      border-left: 4px solid #0052FF;
      margin: 14px 0;
      padding: 10px 16px;
      border-radius: 0 8px 8px 0;
      color: #1e3a8a;
      font-size: 10pt;
    }

    blockquote p:last-child {
      margin-bottom: 0;
    }

    /* ── Tables ─────────────────────────────────────────────────────── */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0 20px 0;
      font-size: 9pt;
      page-break-inside: avoid;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      overflow: hidden;
    }

    thead tr {
      background: #0f172a;
      color: #ffffff;
      text-align: left;
    }

    th {
      padding: 9px 10px;
      font-weight: 700;
      font-size: 8.5pt;
      letter-spacing: 0.3px;
      border-right: 1px solid rgba(255, 255, 255, 0.1);
    }

    th:last-child {
      border-right: none;
    }

    td {
      padding: 8px 10px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #f1f5f9;
      vertical-align: top;
      color: #334155;
    }

    td:last-child {
      border-right: none;
    }

    tbody tr:nth-child(even) {
      background: #f8fafc;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    /* ── Code Blocks ────────────────────────────────────────────────── */
    .code-block-wrapper {
      margin: 14px 0 18px 0;
      border-radius: 10px;
      background: #0f172a;
      border: 1px solid #1e293b;
      overflow: hidden;
      page-break-inside: avoid;
    }

    .code-lang {
      background: #1e293b;
      color: #94a3b8;
      font-size: 7.5pt;
      font-family: 'Fira Code', monospace;
      font-weight: 600;
      text-transform: uppercase;
      padding: 4px 12px;
      letter-spacing: 0.5px;
    }

    pre {
      margin: 0;
      padding: 12px 14px;
      overflow-x: auto;
      background: #0f172a;
    }

    code {
      font-family: 'Fira Code', Menlo, Monaco, Consolas, monospace;
      font-size: 8.5pt;
      color: #e2e8f0;
      line-height: 1.45;
    }

    p code, li code, td code {
      background: #f1f5f9;
      color: #0052FF;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 8.5pt;
      border: 1px solid #e2e8f0;
      font-weight: 500;
    }

    /* ── Mermaid Diagrams ───────────────────────────────────────────── */
    .mermaid-wrapper {
      margin: 20px 0;
      padding: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      text-align: center;
      page-break-inside: avoid;
    }

    .mermaid {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .mermaid svg {
      max-width: 100% !important;
      height: auto !important;
    }

    /* ── Divider ────────────────────────────────────────────────────── */
    hr {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 28px 0;
    }

    /* ── Table of Contents styling ──────────────────────────────────── */
    .toc-container {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 18px 24px;
      margin: 20px 0 30px 0;
      page-break-after: always;
    }

    .toc-title {
      font-family: 'Outfit', sans-serif;
      font-size: 14pt;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 12px;
      border-bottom: 2px solid #0052FF;
      padding-bottom: 6px;
    }

    .toc-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      column-gap: 24px;
      row-gap: 6px;
      font-size: 9pt;
    }

    .toc-item {
      color: #1e293b;
      text-decoration: none;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dotted #cbd5e1;
      padding-bottom: 2px;
    }

    .toc-item:hover {
      color: #0052FF;
    }
  </style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover-page">
    <div class="cover-top">
      <div class="brand-badge">⚡ TAPFOLIO ARCHITECTURE SERIES</div>
      <h1 class="cover-title">Tapfolio <span>Platform</span></h1>
      <div class="cover-subtitle">Complete System Documentation</div>
      <div class="cover-desc">
        Comprehensive Technical Reference covering Mobile Screens, Navigation Flows, Backend APIs, PostgreSQL Data Models, Multi-Card Algorithms, Live Sharing & Analytics Architecture.
      </div>

      <div class="meta-grid">
        <div class="meta-card">
          <div class="meta-label">System Version</div>
          <div class="meta-value">v2.4.0 (Production Architecture)</div>
        </div>
        <div class="meta-card">
          <div class="meta-label">Document Status</div>
          <div class="meta-value">Active &amp; Verified</div>
        </div>
        <div class="meta-card">
          <div class="meta-label">Target Audience</div>
          <div class="meta-value">Engineering, QA &amp; Architecture</div>
        </div>
        <div class="meta-card">
          <div class="meta-label">Generated Date</div>
          <div class="meta-value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>
    </div>

    <div class="cover-footer">
      <div>Tapfolio Technologies Inc. — Confidential System Specification</div>
      <div>Source Code Verified: Flutter + Next.js + PostgreSQL</div>
    </div>
  </div>

  <!-- Document Body -->
  <div class="content-body">
    ${parsedBodyHtml}
  </div>

  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose',
      fontFamily: 'Inter, sans-serif',
      themeVariables: {
        primaryColor: '#e0e7ff',
        primaryTextColor: '#1e1b4b',
        primaryBorderColor: '#6366f1',
        lineColor: '#64748b',
        secondaryColor: '#f1f5f9',
        tertiaryColor: '#ffffff'
      }
    });
  </script>
</body>
</html>`;

  console.log('Writing temporary styled HTML...');
  const tempHtmlPath = path.join(rootDir, 'docs', 'temp_doc_render.html');
  fs.writeFileSync(tempHtmlPath, fullHtml, 'utf8');

  console.log('Launching Headless Chrome for pixel-perfect PDF conversion...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--allow-file-access-from-files'
    ]
  });

  const page = await browser.newPage();
  
  // Navigate to file URL
  const fileUrl = 'file://' + tempHtmlPath;
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 60000 });

  // Wait for Mermaid SVGs to render
  console.log('Waiting for Mermaid diagrams to render as vector SVGs...');
  await page.evaluate(async () => {
    if (window.mermaid) {
      await window.mermaid.run();
    }
  });

  // Small delay to ensure all fonts and SVGs settle
  await new Promise((r) => setTimeout(r, 2000));

  console.log('Generating A4 PDF with header, footer, and page numbers...');
  await page.pdf({
    path: PDF_OUTPUT_PATH,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 8pt; color: #94a3b8; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
        <span style="font-weight: 600; color: #64748b;">Tapfolio — Master System Documentation</span>
        <span>v2.4.0</span>
      </div>
    `,
    footerTemplate: `
      <div style="font-family: 'Inter', sans-serif; font-size: 8pt; color: #94a3b8; width: 100%; padding: 0 15mm; display: flex; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 4px;">
        <span>Tapfolio Confidential &amp; Proprietary</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `,
    margin: {
      top: '18mm',
      bottom: '18mm',
      left: '14mm',
      right: '14mm',
    }
  });

  await browser.close();

  // Clean up temp HTML
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }

  const stats = fs.statSync(PDF_OUTPUT_PATH);
  console.log(`✓ PDF Generated successfully: ${PDF_OUTPUT_PATH} (${(stats.size / 1024).toFixed(1)} KB)`);
}

buildPdf().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
