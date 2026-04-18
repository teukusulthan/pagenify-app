import sanitizeHtml from "sanitize-html";

export function sanitizeHtmlContent(html: string): string {
  return sanitizeHtml(html, {
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
