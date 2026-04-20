const CSS_RESET = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
body { font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif; color: #1a1a2e; background: #ffffff; line-height: 1.6; }
img { max-width: 100%; height: auto; display: block; }
a { text-decoration: none; color: inherit; }
`;

const CSS_VARIABLES = `
:root {
  --primary: #4f46e5;
  --primary-dark: #4338ca;
  --primary-light: #818cf8;
  --accent: #06b6d4;
  --bg-white: #ffffff;
  --bg-light: #f8fafc;
  --bg-section: #f1f5f9;
  --text-heading: #0f172a;
  --text-body: #334155;
  --text-muted: #64748b;
  --border: #e2e8f0;
  --radius: 12px;
  --radius-sm: 8px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04);
  --max-w: 1120px;
}
`;

const CSS_UTILITIES = `
.container { max-width: var(--max-w); margin: 0 auto; padding: 0 24px; }
.section { padding: 80px 0; }
.section-alt { background: var(--bg-section); }
.section-header { text-align: center; margin-bottom: 48px; }
.section-label { display: inline-block; font-size: 13px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--primary); background: rgba(79,70,229,0.08); padding: 4px 12px; border-radius: 20px; margin-bottom: 12px; }
.section-title { font-size: 32px; font-weight: 700; color: var(--text-heading); line-height: 1.2; margin-bottom: 12px; }
.section-subtitle { font-size: 18px; color: var(--text-muted); max-width: 600px; margin: 0 auto; }
.btn { display: inline-flex; align-items: center; justify-content: center; padding: 14px 32px; border-radius: var(--radius-sm); font-size: 16px; font-weight: 600; border: none; cursor: pointer; transition: all 0.2s ease; }
.btn-primary { background: var(--primary); color: #fff; box-shadow: 0 1px 3px rgba(79,70,229,0.3); }
.btn-primary:hover { background: var(--primary-dark); box-shadow: 0 4px 12px rgba(79,70,229,0.35); transform: translateY(-1px); }
.btn-outline { background: transparent; color: var(--primary); border: 2px solid var(--primary); }
.btn-outline:hover { background: var(--primary); color: #fff; }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media (max-width: 768px) { .grid-2, .grid-3 { grid-template-columns: 1fr; } .section { padding: 48px 0; } .section-title { font-size: 26px; } }
`;

const CSS_COMPONENTS = `
/* Hero */
.hero { padding: 100px 0 80px; background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%); position: relative; overflow: hidden; }
.hero::before { content: ''; position: absolute; top: -50%; right: -20%; width: 600px; height: 600px; background: radial-gradient(circle, rgba(79,70,229,0.06) 0%, transparent 70%); pointer-events: none; }
.hero-inner { display: flex; align-items: center; gap: 48px; position: relative; z-index: 1; }
.hero-text { flex: 1; }
.hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(79,70,229,0.08); color: var(--primary); font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: 20px; margin-bottom: 20px; }
.hero-title { font-size: 48px; font-weight: 800; color: var(--text-heading); line-height: 1.1; margin-bottom: 20px; letter-spacing: -0.02em; }
.hero-title span { color: var(--primary); }
.hero-subtitle { font-size: 20px; color: var(--text-muted); line-height: 1.6; margin-bottom: 32px; max-width: 520px; }
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.hero-image { flex: 0 0 420px; }
.hero-image img { border-radius: var(--radius); box-shadow: var(--shadow-lg); }
@media (max-width: 768px) { .hero { padding: 60px 0 48px; } .hero-inner { flex-direction: column; } .hero-title { font-size: 34px; } .hero-image { flex: none; width: 100%; max-width: 400px; } }

/* Benefit cards */
.benefit-card { background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; transition: all 0.2s ease; }
.benefit-card:hover { border-color: var(--primary-light); box-shadow: var(--shadow-md); transform: translateY(-2px); }
.benefit-icon { width: 44px; height: 44px; background: rgba(79,70,229,0.08); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 22px; }
.benefit-card h4 { font-size: 18px; font-weight: 600; color: var(--text-heading); margin-bottom: 8px; }
.benefit-card p { font-size: 15px; color: var(--text-muted); line-height: 1.6; }

/* Feature cards */
.feature-card { background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--radius); padding: 32px; }
.feature-card h4 { font-size: 17px; font-weight: 600; color: var(--text-heading); margin-bottom: 8px; }
.feature-card p { font-size: 15px; color: var(--text-muted); line-height: 1.6; }

/* Pricing */
.pricing-card { background: var(--bg-white); border: 2px solid var(--border); border-radius: var(--radius); padding: 40px; text-align: center; max-width: 440px; margin: 0 auto; }
.pricing-card.featured { border-color: var(--primary); box-shadow: 0 0 0 1px var(--primary), var(--shadow-lg); position: relative; }
.pricing-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--primary); color: #fff; font-size: 12px; font-weight: 600; padding: 4px 16px; border-radius: 20px; }
.pricing-amount { font-size: 48px; font-weight: 800; color: var(--text-heading); margin: 16px 0 8px; }
.pricing-period { font-size: 15px; color: var(--text-muted); margin-bottom: 24px; }
.pricing-features { list-style: none; text-align: left; margin-bottom: 32px; }
.pricing-features li { padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 15px; color: var(--text-body); display: flex; align-items: center; gap: 10px; }
.pricing-features li:last-child { border-bottom: none; }
.pricing-features li::before { content: '✓'; color: var(--primary); font-weight: 700; font-size: 14px; }

/* Social proof */
.testimonial-card { background: var(--bg-white); border: 1px solid var(--border); border-radius: var(--radius); padding: 28px; }
.testimonial-stars { color: #f59e0b; font-size: 16px; margin-bottom: 12px; letter-spacing: 2px; }
.testimonial-text { font-size: 15px; color: var(--text-body); line-height: 1.7; font-style: italic; margin-bottom: 16px; }
.testimonial-author { font-size: 14px; font-weight: 600; color: var(--text-heading); }
.testimonial-role { font-size: 13px; color: var(--text-muted); }

/* FAQ */
.faq-item { border-bottom: 1px solid var(--border); padding: 20px 0; }
.faq-question { font-size: 17px; font-weight: 600; color: var(--text-heading); margin-bottom: 8px; }
.faq-answer { font-size: 15px; color: var(--text-muted); line-height: 1.7; }

/* Final CTA */
.cta-final { background: linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%); color: #fff; text-align: center; padding: 80px 0; border-radius: 0; }
.cta-final h2 { font-size: 36px; font-weight: 700; margin-bottom: 16px; }
.cta-final p { font-size: 18px; opacity: 0.9; max-width: 520px; margin: 0 auto 32px; }
.cta-final .btn { background: #fff; color: var(--primary); font-weight: 700; }
.cta-final .btn:hover { background: #f0f0ff; transform: translateY(-1px); }

/* Footer */
.page-footer { text-align: center; padding: 32px 0; border-top: 1px solid var(--border); color: var(--text-muted); font-size: 14px; }
`;

export const SYSTEM_PROMPT = `You are a world-class landing page designer and direct-response copywriter.

TASK: Generate a COMPLETE, production-ready HTML sales page.

## HARD RULES
1. Return a COMPLETE HTML document from <!DOCTYPE html> to </html>.
2. Do NOT wrap in markdown code fences.
3. Do NOT include explanations before or after the HTML.
4. Do NOT use any external CSS frameworks, CDNs, or JavaScript.
5. Do NOT include any <script> tags.
6. Do NOT fabricate real testimonials. Use clearly placeholder social proof.
7. Do NOT mention being an AI.
8. ALL CSS must be in a single <style> tag in the <head>.
9. Do NOT include a navigation bar, top bar, sticky header, or any visible element before the hero section. The hero is the FIRST thing the user sees.
10. The <title> tag is for the browser tab only. Do NOT render it as visible text on the page.

## DESIGN SYSTEM
You MUST use the following CSS exactly as provided. Place it in a <style> tag in the <head>. You may ADD to it but do NOT override these base styles:

<style>
${CSS_RESET}
${CSS_VARIABLES}
${CSS_UTILITIES}
${CSS_COMPONENTS}
</style>

## PAGE STRUCTURE (follow this exact order — NO other elements outside these sections)

CRITICAL: The VERY FIRST tag inside <body> MUST be the hero section. Do this:
<body>
<section class="hero">

Do NOT add any of the following before the hero section:
- Navigation bars (<nav>)
- Headers (<header>)
- Logo bars
- Title bars
- Top banners
- Any text, links, or divs

1. **Hero** — Use <section class="hero">. This is the FIRST visible element on the page. Include a hero-badge, hero-title (wrap the key phrase in <span>), hero-subtitle, hero-actions with a .btn-primary and optional .btn-outline. If a product image URL is provided, include it in a hero-image div.
2. **Benefits** — Use class="section section-alt". Section-label, section-title, section-subtitle. Grid of benefit-cards with benefit-icon (use a unicode emoji), h4, and p.
3. **Features** — Use class="section". Same header pattern. Grid of feature-cards with h4 and p. Expand each user-provided feature into a clear description.
4. **Pricing** — Use class="section section-alt". A single pricing-card (add class "featured" with a pricing-badge saying "Best Value"). Show pricing-amount, pricing-period, a pricing-features list with checkmarks, and a .btn-primary.
5. **Social Proof** — Use class="section". 3 testimonial-cards in a grid-3. Each has testimonial-stars (★★★★★), testimonial-text (placeholder copy), testimonial-author, testimonial-role. Placeholder names only — e.g. "Sarah M.", "James T.", "Priya K." with generic role like "Small Business Owner".
6. **FAQ** — Use class="section section-alt". 4-5 faq-items, each with faq-question and faq-answer. Write genuinely helpful Q&A based on the product context.
7. **Final CTA** — Use class="cta-final". h2, p, and a .btn. Make the copy urgent but honest.
8. **Footer** — Use class="page-footer". Simple one-liner.

## COPYWRITING RULES
- Rewrite all raw user input to sound professional, specific, and persuasive.
- The hero headline must be specific to the offer — never generic.
- Benefits focus on user outcomes (what they gain), not product features.
- Feature descriptions explain what is included and why it matters.
- CTA buttons use action-oriented text: "Get Started", "Claim Your Copy", etc.
- All copy must be truthful to the user-provided information. Do NOT invent claims.`;

export function buildUserPrompt(input: {
  offerType: string;
  title: string;
  description: string;
  targetAudience: string;
  priceDisplay: string;
  keyFeatures: string[];
  uniqueSellingPoints: string[];
  productImageUrl: string | null;
}): string {
  const imageInstruction = input.productImageUrl
    ? `Product image URL (place in the hero section as an <img> inside a div with class="hero-image"):\n${input.productImageUrl}`
    : "No product image provided — omit the hero-image div.";

  return `Generate the full HTML sales page for this offer.

## Offer Details

Offer type: ${input.offerType}

Title: ${input.title}

Description: ${input.description}

Target audience: ${input.targetAudience}

Price: ${input.priceDisplay}

Key features (expand each into a feature-card with a clear description):
${input.keyFeatures.map((f) => `- ${f}`).join("\n")}

Unique selling points (convert into benefit-cards focused on user outcomes):
${input.uniqueSellingPoints.map((s) => `- ${s}`).join("\n")}

${imageInstruction}

## Instructions
- Place the polished title into the hero-headline wrapped in an <h1> with class="hero-title".
- Rewrite the description into a compelling hero-subtitle.
- Convert each unique selling point into a benefit-card with an emoji icon.
- Convert each key feature into a feature-card with a detailed explanation.
- Show the price in the pricing section. Include the key features as pricing-features checklist items.
- Write 3 placeholder testimonials relevant to this offer's domain.
- Write 4-5 relevant FAQ questions with helpful answers.
- Use a strong, specific closing CTA.

Return ONLY the complete HTML document. No markdown, no code fences, no explanations.`;
}
