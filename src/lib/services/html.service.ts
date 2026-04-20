import sanitizeHtml from "sanitize-html";

/**
 * Some LLMs output bare text (e.g. the product title) before the HTML
 * document begins. Strip anything before <!DOCTYPE or <html when it is
 * plain text with no HTML tags.
 */
export function stripPreHeroContent(html: string): string {
  const docStart = html.search(/<!DOCTYPE|<html/i);
  if (docStart > 0) {
    const before = html.slice(0, docStart).trim();
    if (before && !/^</.test(before)) {
      return html.slice(docStart);
    }
  }
  return html;
}

export function sanitizeHtmlContent(html: string): string {
  const stripped = stripPreHeroContent(html);

  // Extract <style> blocks before sanitizing — sanitize-html's nonTextTags
  // mechanism discards content inside <style> (and anything inside <head>),
  // so we lift the CSS out first and re-inject it after sanitization.
  const styleBlocks: string[] = [];
  const htmlWithoutStyles = stripped.replace(
    /<style[^>]*>([\s\S]*?)<\/style>/gi,
    (_match, css: string) => {
      styleBlocks.push(css);
      return "";
    }
  );

  const sanitized = sanitizeHtml(htmlWithoutStyles, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "section",
      "article",
      "header",
      "footer",
      "nav",
      "main",
      "figure",
      "figcaption",
    ]),
    nonTextTags: ["script", "textarea", "option", "noscript", "title", "head", "meta", "link"],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["class", "style", "id"],
      img: ["src", "alt", "style", "width", "height"],
      a: ["href", "class", "style", "target"],
    },
    allowedSchemes: ["http", "https", "mailto"],
  });

  if (styleBlocks.length === 0) return sanitized;

  const combinedCss = styleBlocks.join("\n");
  const styleTag = `<style>${combinedCss}</style>`;

  if (sanitized.includes("</head>")) {
    return sanitized.replace("</head>", `${styleTag}</head>`);
  }
  if (sanitized.includes("<body")) {
    return sanitized.replace(/<body[^>]*>/, (m) => `${styleTag}${m}`);
  }
  return styleTag + sanitized;
}

// Alias for shorter imports
export const sanitizeHtmlPage = sanitizeHtmlContent;
