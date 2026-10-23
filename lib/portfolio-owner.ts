/**
 * The same codebase is deployed under several Vercel hostnames, one per person.
 * The owner is resolved from the request hostname so that every deployment runs
 * the identical build with no per-deployment environment variables or edits.
 *
 *   projects-portfolio-sourabh.vercel.app  → "Sourabh K."
 *   surbhi-projects-portfolio.vercel.app   → "Surbhi G."
 *   gaurav-project-portfolio.vercel.app    → "Gaurav B."
 *   project-portfolio-paridhi.vercel.app   → "Paridhi G."
 *   project-portfolio-piyush.vercel.app    → "Piyush S."
 */

export type PortfolioOwner = {
  firstName: string
  surnameInitial: string
  /** Shown as "{experience} years' experience", e.g. "10+" or "5+". */
  experience: string
}

/** Experience shown for every owner who does not set their own. */
const DEFAULT_EXPERIENCE = "10+"

/**
 * Keyed by the slug that appears in that person's hostname. The surname initial
 * cannot be derived from the URL, so it is recorded here — adding a deployment
 * means adding one line, wherever the slug sits in the hostname. Add
 * `experience` only when it differs from {@link DEFAULT_EXPERIENCE}.
 */
const OWNERS_BY_SLUG: Record<string, Omit<PortfolioOwner, "experience"> & { experience?: string }> = {
  sourabh: { firstName: "Sourabh", surnameInitial: "K" },
  surbhi: { firstName: "Surbhi", surnameInitial: "G" },
  gaurav: { firstName: "Gaurav", surnameInitial: "B", experience: "5+" },
  paridhi: { firstName: "Paridhi", surnameInitial: "G" },
  piyush: { firstName: "Piyush", surnameInitial: "S" },
  juhi: { firstName: "Juhi", surnameInitial: "P", experience: "5+" },
  sourabhprojects: { firstName: "Sourabh", surnameInitial: "G", experience: "5+" },
}

/** Used for localhost, previews and any hostname without a known slug. */
export const FALLBACK_OWNER: PortfolioOwner = {
  firstName: "Swati",
  surnameInitial: "R",
  experience: DEFAULT_EXPERIENCE,
}

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

  if (!match) return FALLBACK_OWNER

  return { experience: DEFAULT_EXPERIENCE, ...OWNERS_BY_SLUG[match] }
}
