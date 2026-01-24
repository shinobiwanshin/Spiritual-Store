/**
 * PDF Generator for Astrology Reports
 *
 * Print-safe, A4-optimized HTML for PDF generation.
 * Enhanced with birth charts, numerology, and detailed predictions.
 */

import { AstrologyReport, YearlyReport, AstrologyProfile } from "./types";

// Extended report type with optional birth chart data
export type ExtendedAstrologyReport = AstrologyReport & {
  profile?: AstrologyProfile;
  name?: string;
  birthDetails?: {
    date: string;
    time: string;
    location: string;
  };
  charts?: {
    rasi?: string | null;
    navamsa?: string | null;
  };
  // Numerology type inherited from AstrologyReport but explicitly typed here for safety within this file context if needed,
  // but better to rely on AstrologyReport structure.
  // We'll trust the AstrologyReport structure which now has correct Numerology types.

  zodiacRelations?: {
    friendSigns?: { sign: string; description: string }[];
    enemySigns?: { sign: string; description: string }[];
  };
};

// Normalize SVG for PDF-safe rendering
function normalizeSVG(svg: string): string {
  let normalized = svg;

  if (!normalized.includes("viewBox")) {
    const widthMatch = normalized.match(/width=["']?(\d+)/);
    const heightMatch = normalized.match(/height=["']?(\d+)/);
    const w = widthMatch ? widthMatch[1] : "400";
    const h = heightMatch ? heightMatch[1] : "400";

    normalized = normalized.replace(
      "<svg",
      `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet"`,
    );
  }

  if (!normalized.includes("preserveAspectRatio")) {
    normalized = normalized.replace(
      "<svg",
      '<svg preserveAspectRatio="xMidYMid meet"',
    );
  }

  return normalized;
}

function isSvgContent(str: string | null | undefined): boolean {
  if (!str) return false;
  const trimmed = str.trim();
  return (
    trimmed.startsWith("<svg") ||
    /^(<\?xml|<!DOCTYPE)[\s\S]*<svg/i.test(trimmed)
  );
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Zodiac symbols
const ZODIAC_SYMBOLS: Record<string, string> = {
  aries: "♈",
  taurus: "♉",
  gemini: "♊",
  cancer: "♋",
  leo: "♌",
  virgo: "♍",
  libra: "♎",
  scorpio: "♏",
  sagittarius: "♐",
  capricorn: "♑",
  aquarius: "♒",
  pisces: "♓",
};

/**
 * Generate welcome/intro section
 */
function generateIntroSection(report: ExtendedAstrologyReport): string {
  const name = report.name || "Valued Seeker";
  return `
    <div class="intro-section">
      <p class="greeting">Hi ${name},</p>
      <p>Excitement builds as your <strong>"${report.duration} Prediction"</strong> report is now ready, and it holds incredible insights waiting for you!</p>
      <p>This detailed report covers key aspects of your life, offering personalized insights and guidance to help unlock your true potential. It's designed to empower you to make informed decisions and navigate life with confidence.</p>
      <p>By understanding the patterns and influences shaping your life, this report will guide you toward a future filled with clarity and purpose.</p>
    </div>
  `;
}

/**
 * Generate birth details section
 */
function generateBirthSection(report: ExtendedAstrologyReport): string {
  if (!report.birthDetails) return "";

  return `
    <div class="section">
      <h2 class="section-title">📅 Birth Details</h2>
      <div class="info-grid">
        <div class="info-item">
          <label>Date of Birth</label>
          <value>${report.birthDetails.date}</value>
        </div>
        <div class="info-item">
          <label>Time of Birth</label>
          <value>${report.birthDetails.time}</value>
        </div>
        <div class="info-item">
          <label>Place of Birth</label>
          <value>${report.birthDetails.location.split(",").slice(0, 2).join(", ")}</value>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generate chart section
 */
function generateChartsSection(report: ExtendedAstrologyReport): string {
  if (!report.charts?.rasi && !report.charts?.navamsa) return "";

  const renderChart = (chartData: string | null | undefined, title: string) => {
    if (!chartData) return "";

    if (isSvgContent(chartData)) {
      return `
        <div class="chart-box">
          <h3>${title}</h3>
          <div class="chart-svg">
            ${normalizeSVG(chartData)}
          </div>
        </div>
      `;
    }

    return `
      <div class="chart-box">
        <h3>${title}</h3>
        <img src="${chartData}" alt="${title}" class="chart-img" />
      </div>
    `;
  };

  return `
    <div class="section">
      <h2 class="section-title">🔮 Birth Charts</h2>
      <div class="charts-grid">
        ${renderChart(report.charts.rasi, "Rasi Chart (राशि चक्र)")}
        ${renderChart(report.charts.navamsa, "Navamsa Chart (नवांश चक्र)")}
      </div>
    </div>
  `;
}

/**
 * Generate Core Numerology section
 */
function generateNumerologySection(report: ExtendedAstrologyReport): string {
  if (!report.numerology) return "";

  const { lifePath, destiny, soulUrge, personality, birthDate } =
    report.numerology;

  return `
    <div class="section page-break">
      <h2 class="section-title">🔢 Core Numerology Profile</h2>
      <div class="numerology-grid">
        ${
          lifePath
            ? `
        <div class="number-card">
          <div class="number-label">Life Path Number</div>
          <div class="number-value">${lifePath.number}</div>
          <div class="number-meaning">${lifePath.meaning}</div>
        </div>`
            : ""
        }
        
        ${
          destiny
            ? `
        <div class="number-card">
          <div class="number-label">Destiny (Name) Number</div>
          <div class="number-value">${destiny.number}</div>
          <div class="number-meaning">${destiny.meaning}</div>
        </div>`
            : ""
        }
        
        ${
          soulUrge
            ? `
        <div class="number-card">
          <div class="number-label">Soul Urge Number</div>
          <div class="number-value">${soulUrge.number}</div>
          <div class="number-meaning">${soulUrge.meaning}</div>
        </div>`
            : ""
        }
        
        ${
          personality
            ? `
        <div class="number-card">
          <div class="number-label">Personality Number</div>
          <div class="number-value">${personality.number}</div>
          <div class="number-meaning">${personality.meaning}</div>
        </div>`
            : ""
        }
        
        ${
          birthDate
            ? `
        <div class="number-card">
          <div class="number-label">Birth Date Number</div>
          <div class="number-value">${birthDate.number}</div>
          <div class="number-meaning">${birthDate.meaning}</div>
        </div>`
            : ""
        }
      </div>
    </div>
  `;
}

/**
 * Generate zodiac relations section
 */
function generateZodiacRelationsSection(
  report: ExtendedAstrologyReport,
): string {
  if (!report.zodiacRelations) return "";

  const { friendSigns, enemySigns } = report.zodiacRelations;

  const renderSign = (
    sign: { sign: string; description: string },
    color: string,
  ) => {
    const symbol = ZODIAC_SYMBOLS[sign.sign.toLowerCase()] || "✦";
    return `
      <div class="zodiac-card" style="border-color: ${color}">
        <div class="zodiac-symbol">${symbol}</div>
        <div class="zodiac-name" style="color: ${color}">${capitalizeFirst(sign.sign)}</div>
        <div class="zodiac-desc">${sign.description}</div>
      </div>
    `;
  };

  return `
    <div class="section">
      <h2 class="section-title">Core Zodiac Compatibility (Lifetime)</h2>
      <div class="zodiac-relations">
        ${
          friendSigns && friendSigns.length > 0
            ? `
        <div class="zodiac-group">
          <h3 class="zodiac-group-title" style="color: #10b981">FRIEND Zodiac</h3>
          <div class="zodiac-row">
            ${friendSigns.map((s) => renderSign(s, "#10b981")).join("")}
          </div>
        </div>
        `
            : ""
        }
        ${
          enemySigns && enemySigns.length > 0
            ? `
        <div class="zodiac-group">
          <h3 class="zodiac-group-title" style="color: #ef4444">ENEMY Zodiac</h3>
          <div class="zodiac-row">
            ${enemySigns.map((s) => renderSign(s, "#ef4444")).join("")}
          </div>
        </div>
        `
            : ""
        }
      </div>
    </div>
  `;
}

/**
 * Generate yearly prediction section with detailed layout
 */
function generateYearSection(yearReport: YearlyReport): string {
  const numerologyBlock = yearReport.numerology
    ? `
    <div class="year-numerology-box" style="border-left-color: ${
      yearReport.numerology.element === "Fire"
        ? "#ef4444"
        : yearReport.numerology.element === "Water"
          ? "#3b82f6"
          : yearReport.numerology.element === "Air"
            ? "#eab308"
            : "#22c55e"
    }">
      <div class="yn-header">
        <span class="yn-title">Personal Year ${yearReport.numerology.personalYear}</span>
        <span class="yn-theme">(${yearReport.numerology.theme})</span>
      </div>
      <p class="yn-pred">${yearReport.numerology.prediction}</p>
      <div class="yn-element-tag" style="background: ${
        yearReport.numerology.element === "Fire"
          ? "#fef2f2; color: #991b1b"
          : yearReport.numerology.element === "Water"
            ? "#eff6ff; color: #1e40af"
            : yearReport.numerology.element === "Air"
              ? "#fefce8; color: #854d0e"
              : "#f0fdf4; color: #166534"
      }">Element: ${yearReport.numerology.element} Emphasis</div>
    </div>
    `
    : "";

  return `
    <div class="year-section page-break">
      <div class="year-header">
        <h2>YOUR YEAR ${yearReport.year} PREDICTION</h2>
      </div>
      
      ${numerologyBlock}
      
      <div class="year-overview">
        <p>${yearReport.overview}</p>
      </div>
      
      <div class="predictions-list">
        <div class="prediction-item">
          <h3 class="prediction-title">Career</h3>
          <p>${yearReport.career}</p>
          <div class="advice-block">
            <strong>Advice</strong>
            <p>Stay focused on your goals and remain adaptable to changes in your professional environment.</p>
          </div>
        </div>
        
        <div class="prediction-item">
          <h3 class="prediction-title">Finance</h3>
          <p>${yearReport.finance}</p>
          <div class="advice-block">
            <strong>Advice</strong>
            <p>Be mindful of your spending and focus on building long-term financial security.</p>
          </div>
        </div>
        
        <div class="prediction-item">
          <h3 class="prediction-title">Health</h3>
          <p>${yearReport.health}</p>
          <div class="advice-block">
            <strong>Advice</strong>
            <p>Prioritize regular exercise, balanced diet, and sufficient rest for optimal well-being.</p>
          </div>
        </div>
        
        <div class="prediction-item">
          <h3 class="prediction-title">Family</h3>
          <p>${yearReport.family}</p>
          <div class="advice-block">
            <strong>Advice</strong>
            <p>Nurture your family bonds and make time for meaningful connections.</p>
          </div>
        </div>
        
        <div class="prediction-item">
          <h3 class="prediction-title">Love</h3>
          <p>${yearReport.love}</p>
          <div class="advice-block">
            <strong>Advice</strong>
            <p>Be open to love and focus on emotional growth within your relationships.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generate complete print-ready HTML document.
 */
export function generatePrintHTML(report: ExtendedAstrologyReport): string {
  const yearlySections = report.reports
    .map((r) => generateYearSection(r))
    .join("");

  const phasesSection = report.phases?.length
    ? `
      <div class="phases-section">
        <h2 class="section-title">📊 Life Phases</h2>
        ${report.phases
          .map(
            (phase) => `
          <div class="phase-card">
            <h3>${phase.name} (${phase.years.join("-")})</h3>
            <p>${phase.summary}</p>
          </div>
        `,
          )
          .join("")}
      </div>
    `
    : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Astrology Report - ${report.duration}</title>
  <style>
    @page {
      size: A4;
      margin: 15mm;
    }

    @media print {
      body {
        background: white !important;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
      }
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: "Georgia", serif;
      color: #1a1a2e;
      margin: 0;
      padding: 0;
      background: white;
      line-height: 1.6;
    }

    .container {
      max-width: 720px;
      margin: 0 auto;
      padding: 20px;
    }

    /* ---------- HEADER ---------- */
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 3px solid #f97316;
      margin-bottom: 30px;
    }

    .om-symbol {
      font-size: 36px;
      color: #f97316;
    }

    .header h1 {
      font-size: 26px;
      margin: 10px 0 5px;
      color: #16213e;
    }

    .header .subtitle {
      color: #f97316;
      font-weight: bold;
    }

    .header .date {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
    }

    /* ---------- INTRO ---------- */
    .intro-section {
      margin-bottom: 30px;
      line-height: 1.8;
    }

    .intro-section .greeting {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .intro-section p {
      margin-bottom: 12px;
    }

    /* ---------- SECTIONS ---------- */
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }

    .section-title {
      font-size: 18px;
      margin-bottom: 15px;
      border-bottom: 2px solid #f97316;
      padding-bottom: 8px;
      color: #16213e;
    }

    /* ---------- INFO GRID ---------- */
    .info-grid {
      display: flex;
      gap: 15px;
    }

    .info-item {
      flex: 1;
      background: #f6f7f9;
      padding: 12px;
      border-radius: 8px;
    }

    .info-item label {
      font-size: 11px;
      color: #666;
      display: block;
    }

    .info-item value {
      display: block;
      font-weight: bold;
      margin-top: 4px;
      font-size: 13px;
    }

    /* ---------- CHARTS ---------- */
    .charts-grid {
      display: flex;
      gap: 20px;
      page-break-inside: avoid;
    }

    .chart-box {
      flex: 1;
      border: 1px solid #ddd;
      border-radius: 10px;
      padding: 10px;
      text-align: center;
      background: #fafafa;
    }

    .chart-box h3 {
      font-size: 14px;
      margin-bottom: 8px;
      color: #16213e;
    }

    .chart-svg {
      width: 280px;
      height: 280px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      padding: 5px;
      overflow: hidden;
    }

    .chart-svg svg {
      width: 280px !important;
      height: 280px !important;
    }

    .chart-img {
      width: 280px;
      height: 280px;
      margin: 0 auto;
      display: block;
      object-fit: contain;
    }

    /* ---------- NUMEROLOGY ---------- */
    .numerology-grid {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
    }

    .number-card {
      flex: 1;
      min-width: 150px;
      border: 2px solid #f97316;
      border-radius: 10px;
      padding: 15px;
      text-align: center;
      background: #fff7ed;
    }

    .number-label {
      font-size: 11px;
      color: #f97316;
      font-weight: bold;
      text-transform: uppercase;
    }

    .number-value {
      font-size: 36px;
      font-weight: bold;
      color: #16213e;
      margin: 8px 0;
    }

    .number-meaning {
      font-size: 11px;
      color: #666;
    }

    /* ---------- YEAR NUMEROLOGY ---------- */
    .year-numerology-box {
      margin-bottom: 25px;
      padding: 15px;
      background: #fafaf9;
      border-left: 4px solid #f97316;
      border-radius: 0 8px 8px 0;
    }

    .yn-header {
      display: flex;
      align-items: baseline;
      gap: 10px;
      margin-bottom: 8px;
    }

    .yn-title {
      font-weight: bold;
      color: #16213e;
      font-size: 14px;
    }

    .yn-theme {
      color: #666;
      font-size: 12px;
      font-style: italic;
    }

    .yn-pred {
      margin: 0;
      font-size: 13px;
      line-height: 1.5;
      text-align: justify;
    }

    .yn-element-tag {
      display: inline-block;
      margin-top: 8px;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
    }

    /* ---------- ZODIAC RELATIONS ---------- */
    .zodiac-relations {
      display: flex;
      gap: 30px;
    }

    .zodiac-group {
      flex: 1;
    }

    .zodiac-group-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .zodiac-row {
      display: flex;
      gap: 15px;
    }

    .zodiac-card {
      flex: 1;
      border: 2px solid;
      border-radius: 10px;
      padding: 15px;
      text-align: center;
    }

    .zodiac-symbol {
      font-size: 36px;
      margin-bottom: 8px;
    }

    .zodiac-name {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .zodiac-desc {
      font-size: 10px;
      color: #666;
    }

    /* ---------- YEAR SECTIONS ---------- */
    .year-section {
      margin-bottom: 40px;
    }

    .year-header {
      background: #f97316;
      color: white;
      padding: 12px 20px;
      border-radius: 5px;
      margin-bottom: 20px;
    }

    .year-header h2 {
      margin: 0;
      font-size: 18px;
      letter-spacing: 1px;
    }

    .year-overview {
      margin-bottom: 25px;
      line-height: 1.8;
      text-align: justify;
    }

    .predictions-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .prediction-item {
      border-left: 3px solid #f97316;
      padding-left: 15px;
    }

    .prediction-title {
      color: #f97316;
      font-size: 16px;
      margin-bottom: 8px;
    }

    .prediction-item p {
      margin-bottom: 10px;
      text-align: justify;
    }

    .advice-block {
      background: #f6f7f9;
      padding: 10px 15px;
      border-radius: 5px;
      margin-top: 10px;
      font-size: 12px;
    }

    .advice-block strong {
      display: block;
      margin-bottom: 5px;
    }

    /* ---------- PHASES ---------- */
    .phases-section {
      margin: 30px 0;
    }

    .phase-card {
      background: #f6f7f9;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
    }

    .phase-card h3 {
      color: #f97316;
      margin-bottom: 8px;
    }

    /* ---------- DISCLAIMER ---------- */
    .disclaimer {
      margin-top: 40px;
      padding: 15px;
      background: #fff7ed;
      border-radius: 8px;
      font-size: 11px;
      color: #92400e;
      border: 1px solid #f97316;
    }

    .disclaimer strong {
      display: block;
      margin-bottom: 8px;
    }

    /* ---------- FOOTER ---------- */
    .footer {
      text-align: center;
      font-size: 11px;
      color: #777;
      margin-top: 40px;
      border-top: 1px solid #ddd;
      padding-top: 15px;
    }

    .footer .brand {
      color: #f97316;
      font-weight: bold;
    }

    /* ---------- PRINT BUTTON ---------- */
    .print-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #f97316;
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 50px;
      font-size: 16px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
    }

    .print-button:hover {
      background: #ea580c;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="om-symbol">ॐ</div>
      <h1>${report.name ? `${report.name}'s` : ""} Astrology Report</h1>
      <div class="subtitle">${report.duration} Prediction</div>
      <div class="date">Years: ${report.years.join(", ")}</div>
    </div>
    
    ${generateIntroSection(report)}
    
    ${generateBirthSection(report)}
    
    ${generateChartsSection(report)}
    
    ${generateNumerologySection(report)}
    
    ${generateZodiacRelationsSection(report)}
    
    ${phasesSection}
    
    ${yearlySections}
    
    <div class="disclaimer">
      <strong>⚠️ Disclaimer</strong>
      ${report.disclaimer}
    </div>
    
    <div class="footer">
      <p>Wishing all the best on your journey,</p>
      <p><span class="brand">AstraSpiritual</span></p>
      <p style="margin-top: 10px;">Generated on ${new Date(report.generatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
    </div>
  </div>
  
  <button class="print-button no-print" onclick="window.print()">
    📄 Save as PDF
  </button>
</body>
</html>
  `;
}

/**
 * Open print dialog to save as PDF.
 * Called from client-side component.
 */
export function printReport(report: ExtendedAstrologyReport): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to download PDF");
    return;
  }

  printWindow.document.write(generatePrintHTML(report));
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
