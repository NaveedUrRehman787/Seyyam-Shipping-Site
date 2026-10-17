// Single source of truth. Change it here, it changes everywhere.

export const site = {
  name: 'SEYYAM Shipping Line',
  legalName: 'SEYYAM Shipping Line Pvt Ltd',
  tagline: 'Trusted China Sourcing & Reliable Global Shipping',
  url: 'https://seyyamshippingline.com',
  description:
    'SEYYAM Shipping Line helps businesses source from China with verified suppliers, factory audits, pre-shipment quality inspection and reliable sea, air and road freight — with offices in Pakistan and China.',
  // Primary (Pakistan / Karachi HQ)
  phone: '+92 300 9794896',
  phoneHref: '+923009794896',
  whatsapp: '923009794896',
  email: 'md@seyyamshippingline.com',
  address: 'Nageena Center, Office No 6-B, Keamari, Karachi, Pakistan',
  addressLocality: 'Karachi',
  addressRegion: 'Sindh',
  addressCountry: 'PK',
  // Official China contact (Yiwu)
  chinaPhone: '+86 131 5790 8374',
  chinaPhoneHref: '+8613157908374',
  chinaWhatsapp: '8613157908374',
  chinaEmail: 'novasource72@gmail.com',
  chinaAddress:
    'Room 609-2, 6th Floor, Building 5, No. 368 Xiufa Avenue, Choujiang Street, Yiwu City, Zhejiang, China',
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
