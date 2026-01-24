/**
 * PDF Generator for Kundali (Rashi) Reports
 *
 * Print-safe, A4-optimized HTML for PDF generation.
 * Follows print-safe design rules: single-column, flexbox, fixed widths, explicit A4.
 */

interface PlanetData {
  name: string;
  sign: string;
  nakshatra: string;
  house: number;
  normDegree: number;
  isRetro: boolean;
}

interface KundaliReport {
  id: string;
  name: string | null;
  birthDetails: {
    date: string;
    time: string;
    location: string;
  };
  kundali: {
    moonSign: string;
    moonSignHindi: string;
    nakshatra: string | null;
    charts: {
      rasi: string | null;
      navamsa: string | null;
    };
    planets: PlanetData[] | null;
  };
  recommendations: {
    gemstone: { stone: string; wearing: string } | null;
    rudraksha: { mukhi: string; benefits: string } | null;
  };
  createdAt: string;
}

/**
 * Generate print-ready HTML for Kundali report.
 */
export function generateKundaliPrintHTML(report: KundaliReport): string {
  const planetRows =
    report.kundali.planets
      ?.map(
        (planet) => `
    <tr>
      <td>${planet.name}</td>
      <td>${planet.sign}</td>
      <td>${planet.nakshatra}</td>
      <td>${planet.house}</td>
      <td>${planet.normDegree?.toFixed(2)}°</td>
      <td>${planet.isRetro ? '<span class="retro">↺ Retro</span>' : "-"}</td>
    </tr>
  `,
      )
      .join("") || "";

  // Check if chart data is SVG content
  const isSvgContent = (str: string | null) => {
    if (!str) return false;
    const trimmed = str.trim();
    return (
      trimmed.startsWith("<svg") ||
      /^(<\?xml|<!DOCTYPE)[\s\S]*<svg/i.test(trimmed)
    );
  };

  // Normalize SVG for PDF-safe rendering
  const normalizeSVG = (svg: string): string => {
    let normalized = svg;

    // Add viewBox if missing (critical for PDF rendering)
    if (!normalized.includes("viewBox")) {
      // Try to extract width/height from SVG
      const widthMatch = normalized.match(/width=["']?(\d+)/);
      const heightMatch = normalized.match(/height=["']?(\d+)/);
      const w = widthMatch ? widthMatch[1] : "400";
      const h = heightMatch ? heightMatch[1] : "400";

      normalized = normalized.replace(
        "<svg",
        `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet"`,
      );
    }

    // Add preserveAspectRatio if missing
    if (!normalized.includes("preserveAspectRatio")) {
      normalized = normalized.replace(
        "<svg",
        '<svg preserveAspectRatio="xMidYMid meet"',
      );
    }

    return normalized;
  };

  // Render chart (either embedded SVG or image)
  const renderChart = (chartData: string | null, title: string) => {
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

    // If it's a URL, use img tag
    return `
      <div class="chart-box">
        <h3>${title}</h3>
        <img src="${chartData}" alt="${title}" class="chart-img" />
      </div>
    `;
  };

  const hasCharts = report.kundali.charts.rasi || report.kundali.charts.navamsa;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kundali Report - ${report.name || "Vedic Birth Chart"}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }

    @media print {
      body {
        background: white !important;
      }
      .no-print {
        display: none !important;
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
      border-bottom: 3px solid #e94560;
      margin-bottom: 30px;
    }

    .om-symbol {
      font-size: 36px;
      color: #e94560;
    }

    .header h1 {
      font-size: 26px;
      margin: 10px 0 5px;
    }

    .subtitle {
      color: #e94560;
      font-weight: bold;
    }

    .date {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
    }

    /* ---------- SECTIONS ---------- */
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }

    .section-title {
      font-size: 18px;
      margin-bottom: 12px;
      border-bottom: 2px solid #e94560;
      padding-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-icon {
      font-size: 18px;
    }

    /* ---------- INFO BLOCK ---------- */
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

    /* ---------- MOON SIGN ---------- */
    .moon-sign-box {
      background: #e94560;
      color: white;
      border-radius: 14px;
      padding: 20px;
      text-align: center;
      margin-bottom: 30px;
    }

    .moon-sign-box .sign {
      font-size: 28px;
      font-weight: bold;
    }

    .moon-sign-box .nakshatra {
      margin-top: 5px;
      opacity: 0.9;
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
      max-width: 280px !important;
      max-height: 280px !important;
    }

    .chart-img {
      width: 280px;
      height: 280px;
      margin: 0 auto;
      display: block;
      object-fit: contain;
    }

    /* ---------- TABLE ---------- */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    th, td {
      padding: 8px;
      border-bottom: 1px solid #eee;
      text-align: left;
    }

    th {
      background: #f6f7f9;
      font-weight: bold;
    }

    .retro {
      color: #f59e0b;
      font-weight: bold;
    }

    /* ---------- RECOMMENDATIONS ---------- */
    .recommendations-grid {
      display: flex;
      gap: 20px;
    }

    .recommendation-card {
      flex: 1;
      padding: 15px;
      border-radius: 10px;
    }

    .recommendation-card h3 {
      font-size: 12px;
      color: #666;
      margin-bottom: 8px;
    }

    .recommendation-card .name {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .recommendation-card .details {
      font-size: 11px;
      color: #555;
    }

    .gemstone-card {
      border: 2px solid #10b981;
      background: #ecfdf5;
    }

    .gemstone-card .name {
      color: #059669;
    }

    .rudraksha-card {
      border: 2px solid #f59e0b;
      background: #fffbeb;
    }

    .rudraksha-card .name {
      color: #d97706;
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
      color: #e94560;
      font-weight: bold;
    }

    /* ---------- PRINT BUTTON ---------- */
    .print-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #e94560;
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 50px;
      font-size: 16px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(233, 69, 96, 0.3);
    }

    .print-button:hover {
      background: #d63c56;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="om-symbol">ॐ</div>
      <h1>${report.name ? `${report.name}'s Kundali` : "Vedic Kundali Report"}</h1>
      <div class="subtitle">जन्म कुंडली • Birth Chart Analysis</div>
      <div class="date">Generated on ${new Date(report.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
    </div>
    
    <div class="section">
      <h2 class="section-title">
        <span class="section-icon">📅</span>
        Birth Details (जन्म विवरण)
      </h2>
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
    
    <div class="moon-sign-box">
      <div class="sign">${report.kundali.moonSignHindi}</div>
      <div>Moon Sign: ${report.kundali.moonSign}</div>
      ${report.kundali.nakshatra ? `<div class="nakshatra">Birth Nakshatra: ${report.kundali.nakshatra}</div>` : ""}
    </div>
    
    ${
      hasCharts
        ? `
    <div class="section">
      <h2 class="section-title">
        <span class="section-icon">🔮</span>
        Birth Charts (जन्म चक्र)
      </h2>
      <div class="charts-grid">
        ${renderChart(report.kundali.charts.rasi, "Rasi Chart (राशि चक्र)")}
        ${renderChart(report.kundali.charts.navamsa, "Navamsa Chart (नवांश चक्र)")}
      </div>
    </div>
    `
        : ""
    }
    
    ${
      report.kundali.planets && report.kundali.planets.length > 0
        ? `
    <div class="section" style="page-break-before: always;">
      <h2 class="section-title">
        <span class="section-icon">🪐</span>
        Planetary Positions (ग्रह स्थिति)
      </h2>
      <table>
        <thead>
          <tr>
            <th>Planet</th>
            <th>Sign</th>
            <th>Nakshatra</th>
            <th>House</th>
            <th>Degree</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${planetRows}
        </tbody>
      </table>
    </div>
    `
        : ""
    }
    
    ${
      report.recommendations.gemstone || report.recommendations.rudraksha
        ? `
    <div class="section">
      <h2 class="section-title">
        <span class="section-icon">💎</span>
        Personalized Recommendations
      </h2>
      <div class="recommendations-grid">
        ${
          report.recommendations.gemstone
            ? `
        <div class="recommendation-card gemstone-card">
          <h3>Recommended Gemstone (रत्न)</h3>
          <div class="name">${report.recommendations.gemstone.stone}</div>
          <div class="details"><strong>How to wear:</strong> ${report.recommendations.gemstone.wearing}</div>
        </div>
        `
            : ""
        }
        ${
          report.recommendations.rudraksha
            ? `
        <div class="recommendation-card rudraksha-card">
          <h3>Recommended Rudraksha (रुद्राक्ष)</h3>
          <div class="name">${report.recommendations.rudraksha.mukhi}</div>
          <div class="details"><strong>Benefits:</strong> ${report.recommendations.rudraksha.benefits}</div>
        </div>
        `
            : ""
        }
      </div>
    </div>
    `
        : ""
    }
    
    <div class="footer">
      <p>Generated by <span class="brand">AstraSpiritual</span></p>
      <p>Vedic Astrology & Spiritual Guidance</p>
      <p style="margin-top: 8px;">Report ID: ${report.id}</p>
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
 * Open print dialog with styled Kundali report.
 */
export function printKundaliReport(report: KundaliReport): void {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to download PDF");
    return;
  }

  printWindow.document.write(generateKundaliPrintHTML(report));
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
