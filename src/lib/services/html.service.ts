import sanitizeHtml from "sanitize-html";

/**
 * The LLM sometimes outputs the page title as bare text before
 * the <style> tag, with no <html>/<head>/<body> structure.
 * This function strips that stray text and wraps everything properly.
 */
export function stripPreHeroContent(html: string): string {
  // Strategy 1: If the HTML has a <body> tag, strip everything
  // between <body> and the first <section>
  const bodyMatch = html.match(/<body[^>]*>/i);
  if (bodyMatch && bodyMatch.index !== undefined) {
    const bodyEnd = bodyMatch.index + bodyMatch[0].length;
    const afterBody = html.slice(bodyEnd);

    const sectionMatch = afterBody.match(
      /<section[^>]*class=["'][^"']*hero/i
    ) || afterBody.match(/<section\b/i);

    if (sectionMatch && sectionMatch.index !== undefined) {
      const sectionStart = bodyEnd + sectionMatch.index;
      if (html.slice(bodyEnd, sectionStart).trim()) {
        html = html.slice(0, bodyEnd) + "\n" + html.slice(sectionStart);
      }
    }
  }

  // Strategy 2: No <body> tag — the LLM outputs bare text then <style> then sections.
  // Strip any text before the first <style> or <section> tag.
  if (!/<body/i.test(html)) {
    const firstTag = html.search(/<(?:style|section|div|link|meta|!DOCTYPE|html)/i);
    if (firstTag > 0) {
      const before = html.slice(0, firstTag).trim();
      // Only strip if it's bare text (not a tag)
      if (before && !/^</.test(before)) {
        html = html.slice(firstTag);
      }
    }
  }

  return html;
}

export function sanitizeHtmlContent(html: string): string {
  const stripped = stripPreHeroContent(html);

  return sanitizeHtml(stripped, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "style",
      "section",
      "article",
      "header",
      "footer",
      "nav",
      "main",
      "figure",
      "figcaption",
    ]),
    nonTextTags: [
      "style",
      "script",
      "textarea",
      "option",
      "noscript",
      "title",
      "head",
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class", "style", "id"],
      img: ["src", "alt", "style", "width", "height"],
      a: ["href", "class", "style", "target"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });
}

// Alias for shorter imports
export const sanitizeHtmlPage = sanitizeHtmlContent;
