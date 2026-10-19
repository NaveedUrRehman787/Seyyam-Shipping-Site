// Single source of truth. Change it here, it changes everywhere.

export const offices = [
  {
    id: 'islamabad',
    label: 'Islamabad, Pakistan',
    country: 'Pakistan',
    flag: 'PK',
    address: 'Islamabad, Pakistan',
    phone: '+92 312 9295384',
    phoneHref: '+923129295384',
    whatsapp: '923129295384',
    primary: true,
  },
  {
    id: 'kabul-nader',
    label: 'Kabul — Allah Nazar Market',
    country: 'Afghanistan',
    flag: 'AF',
    address: 'Jadeh Nader Pashtoon, Allah Nazar Market, Kholoum Floor, Kabul, Afghanistan',
    phone: '+93 765 858789',
    phoneHref: '+93765858789',
    whatsapp: '93765858789',
  },
  {
    id: 'kabul-business',
    label: 'Kabul — Business Center',
    country: 'Afghanistan',
    flag: 'AF',
    address: 'Shahr-e-Naw, Haji Yaqub Square, Kabul Business Center, Kabul, Afghanistan',
    phone: '+93 767 301261',
    phoneHref: '+93767301261',
    whatsapp: '93767301261',
  },
  {
    id: 'jalalabad',
    label: 'Jalalabad, Afghanistan',
    country: 'Afghanistan',
    flag: 'AF',
    address: 'Mia Aslam Plaza, Jalalabad, Afghanistan',
    phone: '+93 781 853030',
    phoneHref: '+93781853030',
    whatsapp: '93781853030',
  },
  {
    id: 'dubai',
    label: 'Dubai, UAE',
    country: 'United Arab Emirates',
    flag: 'AE',
    address: 'JNP Signal, behind Fazal Afghan Restaurant, Dubai, UAE',
    phone: '+971 50 304 0084',
    phoneHref: '+971503040084',
    whatsapp: '971503040084',
  },
  {
    id: 'yiwu',
    label: 'Yiwu, China',
    country: 'China',
    flag: 'CN',
    address:
      'Room 609-2, 6th Floor, Building 5, No. 368 Xiufa Avenue, Choujiang Street, Yiwu City, Zhejiang, China',
    phone: '+86 131 5790 8374',
    phoneHref: '+8613157908374',
    whatsapp: '8613157908374',
    altPhone: '+86 130 1371 1932',
    altPhoneHref: '+8613013711932',
    legalAddress: 'NO.188, Shangcheng Avenue, Yiwu, Zhejiang Province, China',
  },
];

const primaryOffice = offices.find((o) => o.primary) ?? offices[0];
const chinaOffice = offices.find((o) => o.id === 'yiwu');
const kabulPrimary = offices.find((o) => o.id === 'kabul-nader');
const dubaiOffice = offices.find((o) => o.id === 'dubai');

export const site = {
  name: 'Nova Source',
  legalName: 'YIWU NOVASOURCE IMPORT AND EXPORT CO.,LTD',
  brandMark: 'N',
  tagline: 'Your Trusted Partner from China to Afghanistan',
  url: 'https://seyyam-shipping-site.vercel.app',
  description:
    'Nova Source helps businesses source from China with verified suppliers, factory audits, pre-shipment quality inspection and reliable freight — with offices in China, Afghanistan, UAE and Pakistan.',
  // Primary contact (Islamabad — WhatsApp & call)
  phone: primaryOffice.phone,
  phoneHref: primaryOffice.phoneHref,
  whatsapp: primaryOffice.whatsapp,
  email: 'novasource72@gmail.com',
  address: primaryOffice.address,
  addressLocality: 'Islamabad',
  addressRegion: 'Islamabad Capital Territory',
  addressCountry: 'PK',
  // Shortcuts used in footer / about
  chinaPhone: chinaOffice.phone,
  chinaPhoneHref: chinaOffice.phoneHref,
  chinaWhatsapp: chinaOffice.whatsapp,
  chinaAddress: chinaOffice.address,
  kabulPhone: kabulPrimary.phone,
  kabulPhoneHref: kabulPrimary.phoneHref,
  dubaiPhone: dubaiOffice.phone,
  dubaiPhoneHref: dubaiOffice.phoneHref,
  founded: '2018',
  social: {
    facebook: 'https://facebook.com/',
    instagram: 'https://instagram.com/',
    linkedin: 'https://linkedin.com/',
    youtube: 'https://youtube.com/',
  },
  // Where the browser POSTs the quote form.
  // Same-origin '/api/send' if you deploy the Node API behind the same domain,
  // or an absolute URL (e.g. https://sourcing-api.vercel.app/api/send).
  formEndpoint: '/api/send',
  turnstileSiteKey: '', // leave empty to disable the captcha widget
};

export const services = [
  {
    slug: 'factory-audit-verification',
    title: 'Factory Audit & Verification',
    short: 'Verify suppliers and factories in China before you place an order.',
    intro:
      'Before you wire a deposit, you should know the factory exists, holds the certifications it claims, and can actually produce what you are ordering at the volume you need.',
    icon: 'shield',
    deliverables: [
      'Business licence and export-licence verification against Chinese government records',
      'On-site visit with dated, geotagged photography of the production floor',
      'Machinery, capacity and workforce assessment against your order volume',
      'Certification check — ISO 9001, BSCI, Sedex, CE, FDA as applicable',
      'Written report with a clear recommendation, delivered within 5 working days',
    ],
    faq: [
      {
        q: 'How long does a factory audit take?',
        a: 'A standard audit is completed within 5 working days of scheduling. Factories in Guangdong, Zhejiang and Fujian can usually be visited within 48 hours.',
      },
      {
        q: 'What if the factory fails the audit?',
        a: 'You receive the full report regardless, and we will shortlist alternative verified suppliers for the same product category at no extra cost.',
      },
    ],
  },
  {
    slug: 'quality-inspection-control',
    title: 'Quality Inspection & Control',
    short: 'Check product quality and catch defects before your goods ship.',
    intro:
      'A defect found in China costs a re-work. The same defect found in your warehouse costs the whole shipment. Inspection happens while the goods are still the supplier’s problem.',
    icon: 'check',
    deliverables: [
      'Pre-shipment inspection to AQL 2.5 / 4.0, or a sampling plan you specify',
      'Function, dimension, workmanship and packaging checks against your spec sheet',
      'Barcode, label and carton-marking verification',
      'Photo and video evidence of every defect found',
      'Same-day report so you can hold payment before the container loads',
    ],
    faq: [
      {
        q: 'When should the inspection happen?',
        a: 'At 80–100% production completion, before the goods are packed for freight. That is the last point at which the supplier can still fix problems at their own cost.',
      },
      {
        q: 'Do you inspect against my own checklist?',
        a: 'Yes. Send your spec sheet or QC checklist and we inspect against it. If you do not have one, we will build it with you.',
      },
    ],
  },
  {
    slug: 'port-to-port-shipping',
    title: 'Port-to-Port Shipping',
    short: 'Move goods from Chinese ports to your destination port by sea or air.',
    intro:
      'If you have your own customs broker and inland haulage at the destination, port-to-port is the cheaper freight option. We handle everything up to the discharge port.',
    icon: 'ship',
    deliverables: [
      'FCL and LCL sea freight from Shenzhen, Ningbo, Shanghai, Qingdao and Guangzhou',
      'Air freight for urgent or high-value cargo',
      'Export customs clearance and documentation',
      'Bill of Lading, packing list and commercial invoice prepared correctly',
      'Container tracking with weekly status updates',
    ],
    faq: [
      {
        q: 'What is the difference between FCL and LCL?',
        a: 'FCL is a full container you do not share. LCL is consolidated cargo sharing a container. LCL is cheaper below roughly 15 CBM; above that, FCL usually wins on cost per unit.',
      },
      {
        q: 'Who handles customs at my end?',
        a: 'You do, or your broker does. If you would rather not, take door-to-door instead — we handle import clearance in that service.',
      },
    ],
  },
  {
    slug: 'door-to-door-shipping',
    title: 'Door-to-Door Shipping',
    short: 'Ship from the Chinese factory directly to your final delivery address.',
    intro:
      'One price, one point of contact, from the supplier’s loading bay to your warehouse door. Customs, duties and final-mile delivery are all handled.',
    icon: 'truck',
    deliverables: [
      'Factory collection and inland transport within China',
      'Sea, air or rail freight depending on your budget and deadline',
      'Import customs clearance at destination',
      'Duty and tax handling — DDP available',
      'Final-mile delivery to your warehouse, with proof of delivery',
    ],
    faq: [
      {
        q: 'Is DDP included?',
        a: 'It can be. Under DDP we pay duties and taxes and bill them to you; under DAP you settle them directly. We quote both so you can compare.',
      },
      {
        q: 'How long does door-to-door take?',
        a: 'Sea freight to Europe runs 30–45 days door to door, to the US East Coast 35–50 days. Air freight is 7–12 days. Rail to Europe sits between the two at 20–28 days.',
      },
    ],
  },
];

export const stats = [
  { value: 8, suffix: '+', label: 'Years of Experience' },
  { value: 40, suffix: '+', label: 'Countries Served' },
  { value: 2500, suffix: '+', label: 'Orders Delivered' },
  { value: 600, suffix: '+', label: 'Satisfied Clients' },
];

export const policies = [
  { slug: 'privacy-policy', title: 'Privacy Policy' },
  { slug: 'terms-conditions', title: 'Terms & Conditions' },
  { slug: 'payment-policy', title: 'Payment Policy' },
  { slug: 'sourcing-policy', title: 'Sourcing Policy' },
  { slug: 'quality-control-policy', title: 'Quality Control Policy' },
  { slug: 'refund-cancellation-policy', title: 'Refund & Cancellation Policy' },
  { slug: 'shipping-delivery-policy', title: 'Shipping & Delivery Policy' },
];

export const nav = [
  { href: '/', label: 'Home' },
  {
    href: '/services/',
    label: 'Services',
    children: services.map((s) => ({ href: `/services/${s.slug}/`, label: s.title })),
  },
  { href: '/about-us/', label: 'About us' },
  { href: '/contact-us/', label: 'Contact us' },
];
