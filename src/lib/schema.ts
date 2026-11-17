import { SITE } from './site';

const ORG_ID = `${SITE.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;

export interface Crumb { name: string; path: string }
export interface Faq { q: string; a: string }
export interface ServiceInfo { name: string; serviceType: string; description: string; phoneTel: string }

const areaServed = [
  {
    '@type': 'City',
    name: 'Baytown',
    containedInPlace: { '@type': 'State', name: 'Texas' },
  },
  ...SITE.zips.map((z) => ({ '@type': 'PostalCodeSpecification', postalCode: z, addressCountry: 'US' })),
];

/** Strip tags so FAQ answers in schema match the visible text. */
const plain = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

export function buildGraph(opts: {
  path: string; title: string; description: string;
  crumbs?: Crumb[]; faqs?: Faq[]; service?: ServiceInfo;
}) {
  const pageUrl = SITE.url + opts.path;
  const org: Record<string, unknown> = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.brandName,
    url: SITE.url + '/',
    logo: { '@type': 'ImageObject', url: `${SITE.url}/logo.png`, width: 512, height: 512 },
    telephone: SITE.phoneWaterTel,
    email: SITE.email,
    description:
      'A phone referral service that connects Baytown, Texas homeowners with independent local water and fire damage restoration companies.',
    areaServed,
  };
  // sameAs only when real profiles are listed in site.json
  if (SITE.social.length) org.sameAs = SITE.social.map((s: { url: string }) => s.url);

  const graph: Record<string, unknown>[] = [
    org,
    { '@type': 'WebSite', '@id': WEBSITE_ID, url: SITE.url + '/', name: SITE.brandName, inLanguage: 'en-US', publisher: { '@id': ORG_ID } },
    {
      '@type': 'WebPage', '@id': `${pageUrl}#webpage`, url: pageUrl, name: opts.title,
      description: opts.description, inLanguage: 'en-US', isPartOf: { '@id': WEBSITE_ID }, about: { '@id': ORG_ID },
      datePublished: SITE.published,
      dateModified: SITE.lastUpdated,
    },
  ];

  if (opts.crumbs?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${pageUrl}#breadcrumb`,
      itemListElement: [{ name: 'Home', path: '/' }, ...opts.crumbs].map((c, i) => ({
        '@type': 'ListItem', position: i + 1, name: c.name, item: SITE.url + c.path,
      })),
    });
  }
  if (opts.service) {
    graph.push({
      '@type': 'Service',
      '@id': `${pageUrl}#service`,
      name: opts.service.name,
      serviceType: opts.service.serviceType,
      description: opts.service.description,
      url: pageUrl,
      areaServed,
      provider: { '@id': ORG_ID },
    });
  }
  if (opts.faqs?.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${pageUrl}#faq`,
      mainEntity: opts.faqs.map((f) => ({
        '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: plain(f.a) },
      })),
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}
