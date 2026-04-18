import sanitizeHtml from "sanitize-html";
import type { LlmStructuredOutput } from "@/types/llm";

export function composeHtml(
  copy: LlmStructuredOutput,
  imageUrl?: string | null
): string {
  const imageBlock = imageUrl
    ? `
    <section style="text-align:center;padding:20px 0;">
      <img src="${imageUrl}" alt="Product" style="max-width:100%;max-height:400px;border-radius:12px;object-fit:cover;" />
    </section>`
    : "";

  const benefitsList = copy.benefits
    .map(
      (b) => `
      <li style="margin-bottom:10px;font-size:1.05rem;line-height:1.6;">
        ${escapeHtml(b)}
      </li>`
    )
    .join("");

  const featuresList = copy.featuresBreakdown
    .map(
      (f) => `
      <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:20px;">
        <h3 style="margin:0 0 8px;font-size:1.1rem;font-weight:600;color:#111;">${escapeHtml(f.title)}</h3>
        <p style="margin:0;font-size:0.95rem;line-height:1.6;color:#555;">${escapeHtml(f.description)}</p>
      </div>`
    )
    .join("");

  const paragraphs = copy.descriptionParagraphs
    .map(
      (p) =>
        `<p style="font-size:1.05rem;line-height:1.8;color:#444;margin-bottom:16px;">${escapeHtml(p)}</p>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(copy.headline)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; background: #fafafa; }
    .container { max-width: 720px; margin: 0 auto; padding: 20px; }
    .section { margin-bottom: 48px; }
    .hero { background: linear-gradient(135deg, #1a1a2e, #16213e); color: #fff; padding: 60px 20px; text-align: center; border-radius: 12px; }
    .hero h1 { font-size: 2rem; margin-bottom: 12px; }
    .hero p { font-size: 1.15rem; opacity: 0.9; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
    .cta-section { text-align: center; background: #1a1a2e; color: #fff; padding: 48px 20px; border-radius: 12px; }
    .cta-button { display: inline-block; background: #f59e0b; color: #111; padding: 14px 36px; border-radius: 8px; font-size: 1.1rem; font-weight: 600; text-decoration: none; margin-top: 16px; }
    .pricing { text-align: center; font-size: 1.8rem; font-weight: 700; color: #111; margin: 24px 0; }
    .social-proof { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; text-align: center; }
    .faq { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; }
    h2 { font-size: 1.5rem; margin-bottom: 20px; color: #111; }
  </style>
</head>
<body>
  <div class="container">
    <!-- Hero -->
    <section class="section hero">
      <h1>${escapeHtml(copy.headline)}</h1>
      <p>${escapeHtml(copy.subheadline)}</p>
    </section>

    <!-- Image -->
    ${imageBlock}

    <!-- Summary -->
    <section class="section">
      ${paragraphs}
    </section>

    <!-- Benefits -->
    <section class="section">
      <h2>Benefits</h2>
      <ul style="list-style:disc;padding-left:24px;">
        ${benefitsList}
      </ul>
    </section>

    <!-- Features -->
    <section class="section">
      <h2>Features</h2>
      <div class="grid">
        ${featuresList}
      </div>
    </section>

    <!-- Pricing -->
    <section class="section" style="text-align:center;">
      <h2>Pricing</h2>
      <div class="pricing">${escapeHtml(copy.pricingText)}</div>
    </section>

    <!-- Social Proof -->
    <section class="section social-proof">
      <h2>${escapeHtml(copy.socialProofTitle)}</h2>
      <p style="font-size:0.95rem;line-height:1.6;color:#555;margin-top:12px;">${escapeHtml(copy.socialProofBody)}</p>
    </section>

    <!-- FAQ -->
    <section class="section faq">
      <h2>${escapeHtml(copy.faqPlaceholderTitle)}</h2>
      <p style="font-size:0.95rem;line-height:1.6;color:#555;margin-top:12px;">${escapeHtml(copy.faqPlaceholderBody)}</p>
    </section>

    <!-- CTA -->
    <section class="section cta-section">
      <h2 style="color:#fff;">Ready to get started?</h2>
      <p style="opacity:0.9;margin-top:8px;">${escapeHtml(copy.ctaText)}</p>
      <a href="#" class="cta-button">${escapeHtml(copy.ctaText)}</a>
    </section>
  </div>
</body>
</html>`;

  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "style"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "style"],
      a: ["href", "class"],
      section: ["class", "style"],
      div: ["class", "style"],
      h1: ["style"],
      h2: ["style"],
      h3: ["style"],
      p: ["style"],
      ul: ["style"],
      li: ["style"],
      span: ["style"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
