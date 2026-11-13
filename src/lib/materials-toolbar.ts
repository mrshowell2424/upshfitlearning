/**
 * The bar across the top of every material.
 *
 * Lives here rather than in the route so it can be tested without a
 * signed-in session: the route refuses before it ever reaches the HTML.
 */
/**
 * A material opens in its own tab with no site around it: no header, no
 * footer, no way back except the browser button, and a teacher who has
 * opened six workbooks has six tabs and no way to move between them. This
 * puts the way back inside the page.
 *
 * It is injected here rather than baked into the stored HTML so that it
 * covers all 779 materials at once, changes without a re-seed, and never
 * ends up in the file a teacher prints.
 *
 * Bumping TOOLBAR_VERSION changes every etag, so a browser holding a copy
 * from before the bar existed asks again instead of showing it without one.
 */
export const TOOLBAR_VERSION = 1;

/** Where "back" should go, by where the material lives. */
function hubFor(key: string): { href: string; label: string } {
  if (key.startsWith("math/")) return { href: "/math", label: "Math" };
  if (key.startsWith("pbl/")) return { href: "/pbl", label: "Projects" };
  if (key.startsWith("design-thinking/")) return { href: "/design-thinking", label: "Design Thinking" };
  if (key.startsWith("og-packs/")) return { href: "/og-packs", label: "OG packs" };
  if (key.startsWith("science-of-reading/")) return { href: "/science-of-reading", label: "Science of Reading" };
  return { href: "/reading", label: "Basic Reading" };
}

function toolbarHtml(key: string): string {
  const hub = hubFor(key);
  const link = (href: string, text: string) =>
    `<a href="${href}" style="font-family:Inter,system-ui,sans-serif;font-size:13px;` +
    `font-weight:700;color:rgb(17,17,17);text-decoration:none;border:1.5px solid rgb(17,17,17);` +
    `border-radius:100px;padding:6px 14px;white-space:nowrap;background:#fff">${text}</a>`;
  return (
    `<div data-noprint="true" class="upshift-bar" style="position:sticky;top:0;` +
    `z-index:2147483000;background:#fff;border-bottom:1px solid rgb(233,233,233)">` +
    `<div style="height:3px;background:linear-gradient(135deg,rgb(255,106,91),` +
    `rgb(255,125,174),rgb(184,125,255),rgb(0,180,166))"></div>` +
    `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;` +
    `padding:8px 16px">` +
    `<span style="font-family:Poppins,Inter,system-ui,sans-serif;font-size:13px;` +
    `font-weight:900;letter-spacing:.02em;color:rgb(17,17,17);margin-right:4px">UPSHIFT</span>` +
    link(hub.href, "\u2190 " + hub.label) +
    link("/science-of-reading/resources", "Reading Resources") +
    link("/api/materials/science-of-reading/lesson-builder.html", "Lesson builder") +
    `</div></div>` +
    `<style>@media print{.upshift-bar{display:none !important}}</style>`
  );
}

/** Put the bar just inside <body>, or at the front if there is no body tag. */
export function withToolbar(html: string, key: string): string {
  if (html.includes('class="upshift-bar"')) return html;
  const bar = toolbarHtml(key);
  const m = html.match(/<body[^>]*>/i);
  if (m && m.index !== undefined) {
    const at = m.index + m[0].length;
    return html.slice(0, at) + bar + html.slice(at);
  }
  return bar + html;
}