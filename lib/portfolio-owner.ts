/**
 * The same codebase is deployed under several Vercel hostnames, one per person.
 * The owner is resolved from the request hostname so that every deployment runs
 * the identical build with no per-deployment environment variables or edits.
 *
 *   projects-portfolio-sourabh.vercel.app  → "Sourabh K."
 *   surbhi-projects-portfolio.vercel.app   → "Surbhi G."
 *   gaurav-project-portfolio.vercel.app    → "Gaurav B."
 *   project-portfolio-paridhi.vercel.app   → "Paridhi G."
 */

export type PortfolioOwner = {
  firstName: string
  surnameInitial: string
}

/**
 * Keyed by the slug that appears in that person's hostname. The surname initial
 * cannot be derived from the URL, so it is recorded here — adding a deployment
 * means adding one line, wherever the slug sits in the hostname.
 */
const OWNERS_BY_SLUG: Record<string, PortfolioOwner> = {
  sourabh: { firstName: "Sourabh", surnameInitial: "K" },
  surbhi: { firstName: "Surbhi", surnameInitial: "G" },
  gaurav: { firstName: "Gaurav", surnameInitial: "B" },
  paridhi: { firstName: "Paridhi", surnameInitial: "G" },
}

/** Used for localhost, previews and any hostname without a known slug. */
export const FALLBACK_OWNER: PortfolioOwner = { firstName: "Swati", surnameInitial: "R" }

/**
 * Resolves the portfolio owner from a `Host` header value.
 * Falls back to {@link FALLBACK_OWNER} when the hostname names nobody known.
 */
export function getPortfolioOwner(host: string | null | undefined): PortfolioOwner {
  if (!host) return FALLBACK_OWNER

  // Drop the port ("localhost:3000"), then split the hostname into its words so
  // the slug is found wherever it sits — "…-sourabh", "surbhi-…", preview URLs.
  const slugs = host.split(":")[0].trim().toLowerCase().split(/[.-]/)

  const match = slugs.find((slug) => slug in OWNERS_BY_SLUG)

  return match ? OWNERS_BY_SLUG[match] : FALLBACK_OWNER
}
