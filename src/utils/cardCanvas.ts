export function isLightColorHex(color: string): boolean {
  if (!color) return false;
  const c = color.trim().toLowerCase();
  if (c === "#ffffff" || c === "#f8f9fa" || c === "#fff" || c === "white" || c === "#e0e0e0" || c === "#f5f5f7") {
    return true;
  }
  const cleanHex = c.replace("#", "");
  let r = 0, g = 0, b = 0;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  } else {
    return false;
  }
  // Standard perceptual luminance formula
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 165;
}

/**
 * Dynamically draws the card's front design on an HTML Canvas.
 */
export function drawCardFront(
  canvas: HTMLCanvasElement,
  name: string,
  role: string,
  company: string,
  color: string,
  material: "pvc" | "metal",
  finish: "glossy" | "matte" | "brushed",
  logoImg: HTMLImageElement | null
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const isLight = isLightColorHex(color);

  // 1. Draw Background
  ctx.clearRect(0, 0, w, h);
  
  if (material === "metal") {
    // Premium brushed metal gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    if (isLight) {
      grad.addColorStop(0, "#e5e7eb");
      grad.addColorStop(0.5, "#f9fafb");
      grad.addColorStop(1, "#d1d5db");
    } else if (color === "#111111" || color === "#0a0a0a" || !color) {
      grad.addColorStop(0, "#1c1c1e");
      grad.addColorStop(0.5, "#2c2c2e");
      grad.addColorStop(1, "#111112");
    } else {
      // Metallic colored card
      grad.addColorStop(0, color);
      grad.addColorStop(0.5, "#ffffff66");
      grad.addColorStop(1, color);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Subtle brushed metal texture strokes
    if (finish === "brushed") {
      ctx.strokeStyle = isLight ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < h; i += 2) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(w, i);
        ctx.stroke();
      }
    }
  } else {
    // PVC solid background
    ctx.fillStyle = color || (isLight ? "#f8f9fa" : "#0a0a0a");
    ctx.fillRect(0, 0, w, h);

    // Subtle gloss reflections for glossy pvc
    if (finish === "glossy") {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, isLight ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.08)");
      grad.addColorStop(0.3, "rgba(255, 255, 255, 0.0)");
      grad.addColorStop(0.7, "rgba(0, 0, 0, 0.0)");
      grad.addColorStop(1, isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(0, 0, 0, 0.15)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  }

  // 2. Draw card border outline
  ctx.strokeStyle = isLight ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  // 3. Draw Contactless Chip Contact Pad (Smart Card Chip)
  const chipX = 80;
  const chipY = h / 2 - 35;
  const chipW = 75;
  const chipH = 60;
  
  // Chip Base (gold/silver)
  const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
  if (material === "metal" && isLight) {
    chipGrad.addColorStop(0, "#d1d5db");
    chipGrad.addColorStop(1, "#9ca3af");
  } else {
    chipGrad.addColorStop(0, "#fde68a");
    chipGrad.addColorStop(0.5, "#d97706");
    chipGrad.addColorStop(1, "#92400e");
  }
  ctx.fillStyle = chipGrad;
  ctx.beginPath();
  ctx.roundRect?.(chipX, chipY, chipW, chipH, 8);
  ctx.fill();

  // Chip Wireframe lines
  ctx.strokeStyle = "rgba(0, 0, 0, 0.45)";
  ctx.lineWidth = 2;
  ctx.strokeRect(chipX + 10, chipY + 10, chipW - 20, chipH - 20);
  
  ctx.beginPath();
  ctx.moveTo(chipX + chipW / 2, chipY);
  ctx.lineTo(chipX + chipW / 2, chipY + chipH);
  ctx.moveTo(chipX, chipY + chipH / 2);
  ctx.lineTo(chipX + chipW, chipY + chipH / 2);
  ctx.stroke();

  // 4. Logo Render
  const logoSize = 64;
  const logoX = w - 144;
  const logoY = 55;

  if (logoImg) {
    // Draw uploaded logo
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
  } else {
    // Draw default abstract geometric "T." logo
    ctx.fillStyle = isLight ? "#0a0a0a" : "#ffffff";
    ctx.beginPath();
    ctx.moveTo(logoX + 10, logoY + 10);
    ctx.lineTo(logoX + 54, logoY + 10);
    ctx.lineTo(logoX + 54, logoY + 22);
    ctx.lineTo(logoX + 38, logoY + 22);
    ctx.lineTo(logoX + 38, logoY + 54);
    ctx.lineTo(logoX + 26, logoY + 54);
    ctx.lineTo(logoX + 26, logoY + 22);
    ctx.lineTo(logoX + 10, logoY + 22);
    ctx.closePath();
    ctx.fill();

    // Floating red dot
    ctx.fillStyle = "#EF4444";
    ctx.beginPath();
    ctx.arc(logoX + 48, logoY + 48, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Draw Typography (Name, Role, Company)
  const textPrimary = isLight ? "#050505" : "#FFFFFF";
  const textSecondary = isLight ? "rgba(10, 10, 10, 0.75)" : "rgba(255, 255, 255, 0.75)";

  ctx.textAlign = "left";

  // Name (Deep Crisp Bold)
  ctx.fillStyle = textPrimary;
  ctx.font = "bold 44px Outfit, -apple-system, sans-serif";
  ctx.fillText(name || "Alex Sterling", 80, h - 140);

  // Role
  ctx.fillStyle = textSecondary;
  ctx.font = "600 24px Outfit, -apple-system, sans-serif";
  ctx.fillText(role || "CEO & Founder", 80, h - 95);

  // Company
  ctx.fillStyle = textSecondary;
  ctx.font = "bold 20px Outfit, -apple-system, sans-serif";
  ctx.fillText(company || "TAPFOLIO", 80, h - 55);

  // Brand Stamp
  ctx.textAlign = "right";
  ctx.fillStyle = textSecondary;
  ctx.font = "bold 14px Outfit, -apple-system, sans-serif";
  ctx.fillText("TAPFOLIO NFC v2", w - 80, h - 55);
}

/**
 * Dynamically draws the card's back design.
 */
export function drawCardBack(
  canvas: HTMLCanvasElement,
  color: string,
  material: "pvc" | "metal",
  finish: "glossy" | "matte" | "brushed",
  name: string
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const isLight = isLightColorHex(color);

  // 1. Draw Background
  ctx.clearRect(0, 0, w, h);
  
  if (material === "metal") {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    if (isLight) {
      grad.addColorStop(0, "#e5e7eb");
      grad.addColorStop(0.5, "#f9fafb");
      grad.addColorStop(1, "#d1d5db");
    } else if (color === "#111111" || color === "#0a0a0a" || !color) {
      grad.addColorStop(0, "#1c1c1e");
      grad.addColorStop(0.5, "#2c2c2e");
      grad.addColorStop(1, "#111112");
    } else {
      grad.addColorStop(0, color);
      grad.addColorStop(0.5, "#ffffff66");
      grad.addColorStop(1, color);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (finish === "brushed") {
      ctx.strokeStyle = isLight ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      for (let i = 0; i < h; i += 2) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(w, i);
        ctx.stroke();
      }
    }
  } else {
    ctx.fillStyle = color || (isLight ? "#f8f9fa" : "#0a0a0a");
    ctx.fillRect(0, 0, w, h);
  }

  // Border
  ctx.strokeStyle = isLight ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 4;
  ctx.strokeRect(10, 10, w - 20, h - 20);

  const textPrimary = isLight ? "#050505" : "#FFFFFF";
  const textSecondary = isLight ? "rgba(10, 10, 10, 0.75)" : "rgba(255, 255, 255, 0.75)";

  // 2. Draw Simulated QR Code (Right Side)
  const qrX = w - 240;
  const qrY = h / 2 - 80;
  const qrSize = 160;

  // QR Container background for ultra high contrast
  if (!isLight) {
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect?.(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 8);
    ctx.fill();
  }

  const qrColor = "#050505";
  ctx.fillStyle = qrColor;
  ctx.lineWidth = 3;
  ctx.strokeStyle = qrColor;
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);
  
  // Custom futuristic qr alignment patterns
  ctx.fillRect(qrX + 10, qrY + 10, 40, 40);
  ctx.clearRect(qrX + 20, qrY + 20, 20, 20);
  
  ctx.fillRect(qrX + qrSize - 50, qrY + 10, 40, 40);
  ctx.clearRect(qrX + qrSize - 40, qrY + 20, 20, 20);
  
  ctx.fillRect(qrX + 10, qrY + qrSize - 50, 40, 40);
  ctx.clearRect(qrX + 20, qrY + qrSize - 40, 20, 20);

  // QR Pixel Matrix
  ctx.fillStyle = qrColor;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r < 3 && c < 3) || (r < 3 && c > 4) || (r > 4 && c < 3)) continue;
      if ((Math.sin(r * 12.5 + c * 33.7) > 0)) {
        ctx.fillRect(qrX + 25 + c * 15, qrY + 25 + r * 15, 10, 10);
      }
    }
  }

  // 3. Draw Contactless Waves (Left Side)
  const signalX = 100;
  const signalY = h / 2;

  ctx.strokeStyle = textPrimary;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  
  // Wave 1
  ctx.beginPath();
  ctx.arc(signalX, signalY, 20, -Math.PI/3, Math.PI/3);
  ctx.stroke();

  // Wave 2
  ctx.beginPath();
  ctx.arc(signalX, signalY, 40, -Math.PI/3, Math.PI/3);
  ctx.stroke();

  // Wave 3
  ctx.beginPath();
  ctx.arc(signalX, signalY, 60, -Math.PI/3, Math.PI/3);
  ctx.stroke();

  // Tap Icon
  ctx.fillStyle = textPrimary;
  ctx.font = "bold 16px Outfit, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("TAP TO SHARE", signalX + 60, signalY + 5);

  // 4. URL and Instructions
  const formattedSlug = (name || "alex").toLowerCase().replace(/[^a-z0-9]+/g, "");
  ctx.fillStyle = textSecondary;
  ctx.font = "bold 20px Outfit, -apple-system, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`tapfolio.me/${formattedSlug}`, 80, h - 55);
}

/**
 * Dynamically draws the internal NFC antenna pathway and microchip.
 */
export function drawNFCCore(
  canvas: HTMLCanvasElement,
  glowIntensity: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Clear background (completely transparent substrate)
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(0, 20, 10, 0.1)";
  ctx.fillRect(0, 0, w, h);

  // 1. Draw Copper Antenna Coils (Concentric rounded rects)
  ctx.strokeStyle = `rgba(212, 175, 55, ${0.4 + glowIntensity * 0.6})`;
  ctx.lineWidth = 3;

  for (let i = 0; i < 6; i++) {
    const offset = 35 + i * 12;
    ctx.beginPath();
    ctx.roundRect?.(offset, offset, w - offset * 2, h - offset * 2, 24);
    ctx.stroke();
  }

  // 2. Connect antenna lines to the center chip
  const chipX = w / 2;
  const chipY = h / 2;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 80, h / 2);
  ctx.lineTo(chipX - 30, chipY);
  ctx.moveTo(w / 2 + 80, h / 2);
  ctx.lineTo(chipX + 30, chipY);
  ctx.stroke();

  // 3. Draw Silicon Microchip Base
  ctx.fillStyle = "#1e1e1e";
  ctx.strokeStyle = "#3a3a3a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect?.(chipX - 35, chipY - 35, 70, 70, 8);
  ctx.fill();
  ctx.stroke();

  // Draw gold contacts on the chip
  ctx.fillStyle = `rgba(212, 175, 55, ${0.7 + glowIntensity * 0.3})`;
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(chipX - 25 + i * 15, chipY - 25, 8, 12);
    ctx.fillRect(chipX - 25 + i * 15, chipY + 13, 8, 12);
  }

  // Core microprocessor dot
  ctx.fillStyle = glowIntensity > 0.1 ? `rgba(255, 59, 48, ${glowIntensity})` : "#333";
  ctx.beginPath();
  ctx.arc(chipX, chipY, 8, 0, Math.PI * 2);
  ctx.fill();
}
