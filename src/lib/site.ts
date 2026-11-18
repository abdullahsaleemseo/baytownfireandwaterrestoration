import site from '../config/site.json';

export type Offer = 'water' | 'fire';

export const SITE = site;

/** Phone hours are shown only after a real value replaces the placeholder in site.json. */
export const HOURS_KNOWN = !/\{\{/.test(site.phoneHours);

/** Phone details for an offer. All numbers come from src/config/site.json. */
export function phone(offer: Offer = 'water') {
  return offer === 'fire'
    ? { display: site.phoneFire, tel: `tel:${site.phoneFireTel}`, offer, label: 'Fire damage line' }
    : { display: site.phoneWater, tel: `tel:${site.phoneWaterTel}`, offer, label: 'Water damage line' };
}

export const lastUpdatedLong = new Date(site.lastUpdated + 'T12:00:00Z').toLocaleDateString('en-US', {
  year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
});

export const DISCLOSURE = `${site.brandName} connects Baytown homeowners with independent, licensed local restoration companies. When you call, we route you to an available company in your area.`;

export const SERVICES = [
  { href: '/water-damage-restoration-baytown-tx/', label: 'Water Damage Restoration' },
  { href: '/fire-smoke-damage-restoration-baytown-tx/', label: 'Fire and Smoke Damage' },
  { href: '/burst-pipe-water-damage-baytown/', label: 'Burst Pipes and Leaks' },
  { href: '/flood-storm-water-cleanup-baytown/', label: 'Flood and Storm Cleanup' },
  { href: '/mold-after-water-damage-baytown/', label: 'Mold After Water Damage' },
];

export const GUIDES = [
  { href: '/water-damage-insurance-claim-tips/', label: 'Insurance Claim Tips' },
  { href: '/choosing-a-restoration-company-baytown/', label: 'Choosing a Restoration Company' },
];

export const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/how-it-works/', label: 'How It Works' },
  { href: '/service-area/', label: 'Service Area' },
  { href: '/faq/', label: 'FAQ' },
  { href: '/contact/', label: 'Contact' },
];

/** Every indexable page, used for the sitemap. */
export const INDEXABLE = [
  '/', ...SERVICES.map((s) => s.href), ...GUIDES.map((g) => g.href),
  '/service-area/', '/how-it-works/', '/about/', '/contact/', '/faq/',
  '/privacy-policy/', '/terms/', '/disclaimer/',
];
