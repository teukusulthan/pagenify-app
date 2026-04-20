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
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
@media (max-width: 768px) { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } .section { padding: 48px 0; } .section-title { font-size: 26px; } }
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
.cta-final { background: linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%); color: #fff; text-align: center; padding: 80px 0; }
.cta-final h2 { font-size: 36px; font-weight: 700; margin-bottom: 16px; }
.cta-final p { font-size: 18px; opacity: 0.9; max-width: 520px; margin: 0 auto 32px; }
.cta-final .btn { background: #fff; color: var(--primary); font-weight: 700; }
.cta-final .btn:hover { background: #f0f0ff; transform: translateY(-1px); }

/* Footer */
.page-footer { text-align: center; padding: 32px 0; border-top: 1px solid var(--border); color: var(--text-muted); font-size: 14px; }
`;

const CSS_MARKETPLACE = `
/* Stats / metrics bar */
.stats-bar { background: var(--bg-white); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 40px 0; }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; text-align: center; }
.stat-value { font-size: 38px; font-weight: 800; color: var(--primary); line-height: 1; margin-bottom: 6px; }
.stat-label { font-size: 14px; color: var(--text-muted); }
@media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; } }

/* How it works */
.steps-list { max-width: 680px; margin: 0 auto; }
.how-step { display: flex; gap: 24px; align-items: flex-start; padding: 28px 0; border-bottom: 1px solid var(--border); }
.how-step:last-child { border-bottom: none; }
.step-number { flex: 0 0 44px; width: 44px; height: 44px; background: var(--primary); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 700; }
.step-content h4 { font-size: 18px; font-weight: 600; color: var(--text-heading); margin-bottom: 6px; }
.step-content p { font-size: 15px; color: var(--text-muted); line-height: 1.6; }

/* Guarantee */
.guarantee-section { padding: 60px 0; }
.guarantee-box { border: 2px dashed var(--border); border-radius: var(--radius); padding: 40px 48px; text-align: center; max-width: 560px; margin: 0 auto; background: var(--bg-white); }
.guarantee-icon { font-size: 48px; margin-bottom: 16px; }
.guarantee-box h3 { font-size: 22px; font-weight: 700; color: var(--text-heading); margin-bottom: 10px; }
.guarantee-box p { font-size: 15px; color: var(--text-muted); line-height: 1.7; }

/* Trust badges */
.trust-bar { padding: 32px 0; border-top: 1px solid var(--border); }
.trust-items { display: flex; flex-wrap: wrap; justify-content: center; gap: 32px; }
.trust-item { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; color: var(--text-muted); }
.trust-item span { font-size: 20px; }

/* Comparison / vs table */
.comparison-table { width: 100%; border-collapse: collapse; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-md); }
.comparison-table th { padding: 16px 20px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
.comparison-table th:first-child { background: var(--bg-section); color: var(--text-muted); text-align: left; }
.comparison-table th.col-them { background: var(--bg-section); color: var(--text-muted); }
.comparison-table th.col-us { background: var(--primary); color: #fff; }
.comparison-table td { padding: 14px 20px; border-bottom: 1px solid var(--border); font-size: 15px; text-align: center; background: var(--bg-white); }
.comparison-table td:first-child { text-align: left; font-weight: 500; color: var(--text-heading); background: var(--bg-white); }
.comparison-table tr:last-child td { border-bottom: none; }
.check-yes { color: #22c55e; font-size: 18px; }
.check-no { color: #e2e8f0; font-size: 18px; }

/* What's included / deliverables */
.included-list { list-style: none; display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.included-list li { display: flex; align-items: flex-start; gap: 12px; font-size: 15px; color: var(--text-body); line-height: 1.5; }
.included-list li::before { content: '✦'; color: var(--primary); font-size: 12px; margin-top: 3px; flex-shrink: 0; }
@media (max-width: 768px) { .included-list { grid-template-columns: 1fr; } }

/* Urgency / scarcity banner */
.urgency-banner { background: linear-gradient(90deg, #fef3c7, #fde68a); border: 1px solid #f59e0b; border-radius: var(--radius-sm); padding: 14px 24px; text-align: center; font-size: 15px; font-weight: 600; color: #92400e; margin-bottom: 32px; }

/* CSS-only fade-in animation */
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.fade-up { animation: fadeUp 0.5s ease both; }
.fade-up-1 { animation-delay: 0.1s; }
.fade-up-2 { animation-delay: 0.2s; }
.fade-up-3 { animation-delay: 0.3s; }
`;

export const SYSTEM_PROMPT = `You are an elite conversion designer and direct-response copywriter who builds marketplace-grade sales pages — the kind seen on Gumroad, AppSumo, and high-converting product launches.

TASK: Generate a COMPLETE, production-ready HTML sales page tailored for the marketplace industry.

## NON-NEGOTIABLE OUTPUT RULES
1. Return ONLY a complete HTML document — start with <!DOCTYPE html>, end with </html>.
2. Do NOT wrap output in markdown code fences or backticks.
3. Do NOT include any text before <!DOCTYPE html> or after </html>.
4. Do NOT use external CSS frameworks, CDN links, or JavaScript libraries.
5. Do NOT include any <script> tags or inline event handlers (onclick, onload, etc.).
6. Do NOT add a navigation bar or sticky header — the hero section is the FIRST visible element.
7. ALL CSS must be inside a single <style> tag in the <head>.
8. The <title> tag is for the browser tab only — never render it as visible text.
9. Do NOT mention being an AI anywhere in the output.

## DESIGN SYSTEM
The following CSS is your foundation. You MUST include it in your <style> tag.
You are FREE to:
- Override any CSS variable to match the offer's brand personality
- Add new classes, layouts, animations, and components beyond this foundation
- Use CSS keyframe animations and transitions freely
- Use gradients, shadows, overlays, and full-bleed backgrounds creatively

<style>
${CSS_RESET}
${CSS_VARIABLES}
${CSS_UTILITIES}
${CSS_COMPONENTS}
${CSS_MARKETPLACE}
</style>

## BRAND PERSONALITY & COLOR THEMING
Adapt the color palette to fit the offer's world. Override --primary, --primary-dark, --accent etc. as needed:
- Digital course / knowledge product → warm amber or deep teal
- SaaS / productivity tool → clean blue or violet
- Creative asset / template → bold coral or emerald
- Health / lifestyle / coaching → earthy green or warm rose
- Finance / business tool → confident navy or charcoal
- Marketplace listing (general) → keep the default indigo

## PAGE STRUCTURE — Build 6 to 8 sections
The page MUST open with the hero. Choose remaining sections based on what best serves this specific offer. Not all sections are required — choose thoughtfully.

### REQUIRED SECTIONS (always include):
1. **Hero** — The page's most important section. Use class="hero". Elements:
   - hero-badge: short punchy category label (e.g. "🔥 Digital Product", "✦ For Freelancers")
   - hero-title with <h1>: bold outcome headline. Wrap the 2–3 key words in <span> for color emphasis. Do NOT use the raw product title — rewrite as a specific outcome statement.
   - hero-subtitle: 1–2 sentences expanding the outcome. Written directly to the buyer.
   - hero-actions: .btn-primary (primary CTA) + optional .btn-outline (secondary)
   - If a product image URL is provided, include a hero-image div with the <img>. If not, omit it.

2. **Benefits** — What the buyer actually gains. Use class="section section-alt". 3–6 benefit-cards in a grid. Each card: benefit-icon (emoji), h4 (outcome headline), p (1–2 sentences from buyer's perspective, starting with "You'll…" or "Finally…").

3. **Final CTA** — Closing section with urgency. Use class="cta-final". h2, p (reinforce the transformation), .btn (white button).

### OPTIONAL SECTIONS (choose those relevant to this offer):
4. **Stats Bar** — class="stats-bar". 3–4 impressive numbers (use plausible illustrative numbers, e.g. "10,000+ customers", "4.9★ rating", "#1 in category"). Label each stat. Great for established products.

5. **How It Works** — class="section". 3-step numbered process. Use class="steps-list" + "how-step". Show simplicity and speed. Great for services, courses, tools.

6. **What's Included / Features** — class="section section-alt". Use included-list or feature-cards grid. Detail exactly what the buyer receives. Each item: 2–3 sentence explanation of value, not just a label.

7. **Pricing** — class="section section-alt". Single pricing-card.featured. Show the price boldly, a features checklist, and a strong .btn-primary. Optional: add a strikethrough "regular price" for anchoring.

8. **Testimonials / Social Proof** — class="section". 3 testimonial-cards in grid-3. Write these like real buyer feedback: specific numbers ("Saved me 6 hours/week"), emotional ("I was skeptical but…"), outcome-focused. Use plausible placeholder names and roles relevant to the target audience.

9. **Comparison** — class="section section-alt". Use comparison-table. "Without [product]" vs "With [product]" columns, or compare to competitors. 5–7 rows. Great for demonstrating clear differentiation.

10. **Guarantee** — class="guarantee-section". Use guarantee-box. 30-day or results-based guarantee copy. Reduces purchase anxiety. Include a shield emoji as guarantee-icon.

11. **FAQ** — class="section". 4–5 faq-items. Write questions buyers actually ask before purchasing — about results, delivery, refunds, support, compatibility.

12. **Trust Bar** — class="trust-bar". 4–5 trust-items with emojis: "🔒 Secure Checkout", "⚡ Instant Delivery", "🏆 5-Star Rated", "🔄 30-Day Guarantee", etc.

## COPYWRITING CRAFT
- **Headlines**: Specific outcome beats generic name. "Double Your Leads in 30 Days" beats "Lead Generation Toolkit".
- **Voice**: Speak directly to the buyer's pain and desire. Use "you" and "your" constantly.
- **Power words**: unlock, effortless, proven, instant, transform, finally, guaranteed, exclusive.
- **Benefits vs features**: Benefits = what the buyer gains. Features = what the product does. Always lead with benefits.
- **Social proof**: Specific beats vague. "Saved me $2,400/month" beats "Very useful".
- **Urgency**: Use honest scarcity — limited bonuses, founding pricing, cohort size — not fake countdown timers.
- **CTA text**: Combine action + outcome. "Get Instant Access", "Start Selling Today", "Unlock the System".
- **Truthfulness**: All claims must be grounded in the user-provided information. Do NOT invent features, pricing, or guarantees not mentioned by the user.

## VISUAL EXCELLENCE STANDARDS
- Each section must feel visually distinct — alternate backgrounds, use gradients and borders creatively
- Typography hierarchy: display (48–64px) → section-title (32px) → card-title (17–20px) → body (15px)
- Generous whitespace — minimum 80px section padding, 24px card padding
- All interactive elements must have hover states
- Fully responsive at 768px breakpoint
- Use fade-up animation classes (fade-up, fade-up-1, fade-up-2, fade-up-3) on hero elements for polish`;

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
    ? `Product image URL (place in the hero-image div as an <img>):\n${input.productImageUrl}`
    : "No product image provided — omit the hero-image div entirely.";

  const features = input.keyFeatures
    .map((f, i) => `${i + 1}. ${f}`)
    .join("\n");

  const usps = input.uniqueSellingPoints
    .map((s, i) => `${i + 1}. ${s}`)
    .join("\n");

  return `Build a high-converting marketplace sales page for this offer. Use your creative judgment on layout, section selection, copy angles, and visual design to maximize conversion.

## Offer Details

Type: ${input.offerType}
Title: ${input.title}
Description: ${input.description}
Target audience: ${input.targetAudience}
Price: ${input.priceDisplay}

## Key Features (expand each into a detailed feature card or included-list item)
${features}

## Unique Selling Points (transform into benefit cards focused on buyer outcomes)
${usps}

${imageInstruction}

## Creative Direction for This Page

1. **Headline**: Rewrite the title as a specific outcome statement for the target audience — do NOT use the raw title as the hero heading.
2. **Color theme**: Choose a color palette that fits this offer type and audience. Override the CSS variables if indigo doesn't suit this product's personality.
3. **Sections**: Select 6–8 sections from the system. Prioritize sections that address the biggest buyer objections and desires for this specific offer type.
4. **Testimonials**: Write 3 placeholder testimonials that sound authentic to this audience. Use specific numbers and emotional language. Placeholder names should feel real and relevant to the target market.
5. **Urgency element**: If appropriate, add a .urgency-banner or scarcity copy near the CTA. Keep it honest.
6. **Animations**: Apply fade-up classes to the hero elements for a polished entrance effect.

Return ONLY the complete HTML document. No markdown fences, no code blocks, no explanations outside the HTML.`;
}
