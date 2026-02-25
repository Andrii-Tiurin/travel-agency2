export interface Tour {
  id: number;
  slug: string;
  destination: string;
  countryKey: string; // i18n key
  nights: number;
  price: number;
  rating: number;
  reviews: number;
  gradient: string;
  emoji: string;
  tagKey: string; // i18n key
  departure: string;
  included: string[];
  program: { title: string; desc: string }[];
  description: string;
}

export const tours: Tour[] = [
  {
    id: 1,
    slug: "malediven-paradise",
    destination: "Malediven",
    countryKey: "country_thailand", // overridden below
    nights: 10,
    price: 1299,
    rating: 4.9,
    reviews: 2341,
    gradient: "from-blue-500 via-blue-400 to-cyan-400",
    emoji: "🏝️",
    tagKey: "hot_tag_popular",
    departure: "Frankfurt",
    included: [
      "Flug hin & zurück",
      "Übernachtung (Halbpension)",
      "Flughafentransfer",
      "Reiseleitung vor Ort",
      "Reiseversicherung",
    ],
    description:
      "Traumhafte Strände, kristallklares Wasser und Luxus-Overwater-Bungalows – die Malediven sind das ultimative Reiseziel für Paare und Entspannungssuchende.",
    program: [
      { title: "Ankunft & Check-in", desc: "Transfer zum Resort, Willkommenscocktail, Abendessen am Strand." },
      { title: "Schnorcheln & Tauchen", desc: "Geführte Unterwassertouren im Korallenriff mit zertifiziertem Instructor." },
      { title: "Inselhopping", desc: "Besuche drei lokale Inseln, Fischermarkt und traditionelles Mittagessen." },
      { title: "Wellness & Spa", desc: "Ganztägige Spa-Behandlungen, Yoga am Strand bei Sonnenaufgang." },
      { title: "Freizeit & Abreise", desc: "Letzter Badetag, Transfer zum Flughafen." },
    ],
  },
  {
    id: 2,
    slug: "bali-retreat",
    destination: "Bali",
    countryKey: "country_thailand",
    nights: 8,
    price: 899,
    rating: 4.8,
    reviews: 1876,
    gradient: "from-teal-500 via-emerald-400 to-green-400",
    emoji: "🌴",
    tagKey: "hot_tag_deal",
    departure: "München",
    included: [
      "Flug hin & zurück",
      "Boutique-Hotel (Frühstück inklusive)",
      "Privater Flughafentransfer",
      "Tempelführungen",
      "Kochkurs (traditionell balinesisch)",
    ],
    description:
      "Bali verbindet atemberaubende Natur, spirituelle Kultur und traumhafte Strände. Reisterrassen, hinduistische Tempel und weltklasse Surf-Spots warten auf dich.",
    program: [
      { title: "Ankunft in Denpasar", desc: "Transfer nach Ubud, Abendessen mit Live-Gamelan-Musik." },
      { title: "Tempel & Kultur", desc: "Besuch der Tempel Tanah Lot und Uluwatu, Kecak-Tanz bei Sonnenuntergang." },
      { title: "Reisterrassen-Trek", desc: "Wanderung durch die Tegallalang-Reisterrassen, Mittagessen in einem lokalen Warung." },
      { title: "Küste & Surfen", desc: "Surfstunden in Kuta oder Seminyak für alle Level." },
      { title: "Freizeit & Abreise", desc: "Marktbesuch, Souvenirshopping, Rückflug." },
    ],
  },
  {
    id: 3,
    slug: "santorini-dreams",
    destination: "Santorini",
    countryKey: "country_spain",
    nights: 7,
    price: 1099,
    rating: 4.9,
    reviews: 3102,
    gradient: "from-violet-500 via-purple-400 to-fuchsia-400",
    emoji: "🫐",
    tagKey: "hot_tag_new",
    departure: "Berlin",
    included: [
      "Flug hin & zurück",
      "Cave-Hotel in Oia (Frühstück)",
      "Weintasting-Tour",
      "Katamaran-Sunset-Cruise",
      "Vulkan-Wanderung",
    ],
    description:
      "Santorini ist das Juwel der Ägäis. Weiß-blaue Häuser, der berühmte Caldera-Blick und magische Sonnenuntergänge machen diese Insel zum perfekten romantischen Reiseziel.",
    program: [
      { title: "Ankunft in Thira", desc: "Check-in im Cave-Hotel, erster Blick auf die Caldera bei Sonnenuntergang." },
      { title: "Oia & Fira erkunden", desc: "Spaziergang durch die malerischen Gassen, Museumsbesuch." },
      { title: "Katamaran-Kreuzfahrt", desc: "Ganztagesausflug zu den heißen Quellen, Mittagessen an Bord." },
      { title: "Weintasting", desc: "Besuch zweier lokaler Weingüter mit Verkostung Assyrtiko-Wein." },
      { title: "Vulkan & Abreise", desc: "Wanderung zum Nea Kameni-Vulkan, Transfer zum Flughafen." },
    ],
  },
  {
    id: 4,
    slug: "tulum-explorer",
    destination: "Tulum",
    countryKey: "country_spain",
    nights: 9,
    price: 1199,
    rating: 4.7,
    reviews: 987,
    gradient: "from-emerald-500 via-teal-400 to-cyan-400",
    emoji: "🌿",
    tagKey: "hot_tag_trending",
    departure: "Frankfurt",
    included: [
      "Flug hin & zurück",
      "Eco-Boutique-Lodge (Frühstück)",
      "Cenoten-Tour",
      "Chichén Itzá Ausflug",
      "Yoga & Meditation inklusive",
    ],
    description:
      "Tulum verbindet Maya-Geschichte, türkisfarbene Karibik und ein modernes Bohemian-Lifestyle-Feeling. Traumhafte Cenoten, Ruinen über dem Meer und Biohotels mitten im Dschungel.",
    program: [
      { title: "Ankunft in Cancún", desc: "Transfer nach Tulum, Check-in in der Eco-Lodge." },
      { title: "Tulum-Ruinen & Strand", desc: "Besichtigung der Ruinen über dem Karibischen Meer, Nachmittag am Strand." },
      { title: "Cenoten-Erlebnis", desc: "Schwimmen und Schnorcheln in drei verschiedenen Cenoten mit Guide." },
      { title: "Chichén Itzá", desc: "Ganztagesausflug zum UNESCO-Welterbe mit kommentar-geführter Tour." },
      { title: "Freizeit & Abreise", desc: "Yoga bei Sonnenaufgang, Marktbesuch, Rückflug." },
    ],
  },
  {
    id: 5,
    slug: "thailand-adventure",
    destination: "Thailand",
    countryKey: "country_thailand",
    nights: 12,
    price: 1049,
    rating: 4.8,
    reviews: 2890,
    gradient: "from-orange-400 via-amber-400 to-yellow-400",
    emoji: "🐘",
    tagKey: "hot_tag_popular",
    departure: "Hamburg",
    included: [
      "Flug hin & zurück",
      "Hotels (4 Sterne, Frühstück)",
      "Transfers zwischen Städten",
      "Elefanten-Sanctuary-Besuch",
      "Thai-Kochkurs",
    ],
    description:
      "Thailand begeistert mit goldenen Tempeln, exotischer Küche, freundlichen Menschen und traumhaften Stränden. Von Bangkok bis Chiang Mai bis Koh Samui – ein Land voller Kontraste.",
    program: [
      { title: "Bangkok erkunden", desc: "Grand Palace, Wat Pho, Tuk-Tuk-Tour durch die Altstadt." },
      { title: "Ayutthaya & Geschichte", desc: "Tagesausflug zu den antiken Ruinen der alten Hauptstadt." },
      { title: "Chiang Mai", desc: "Elefanten-Sanctuary, Nachtmarkt, traditioneller Thai-Massage-Kurs." },
      { title: "Koh Samui Inseln", desc: "Speedboot-Tour zu den Ang-Thong-Inseln, Tauchen & Schnorcheln." },
      { title: "Freizeit & Abreise", desc: "Strandtag, Floating-Market-Besuch, Rückflug." },
    ],
  },
  {
    id: 6,
    slug: "japan-culture",
    destination: "Japan",
    countryKey: "country_japan",
    nights: 14,
    price: 2299,
    rating: 4.9,
    reviews: 1543,
    gradient: "from-pink-500 via-rose-400 to-red-400",
    emoji: "⛩️",
    tagKey: "hot_tag_new",
    departure: "Frankfurt",
    included: [
      "Flug hin & zurück",
      "Hotels & Ryokan-Unterkunft",
      "JR Pass (14 Tage)",
      "Teezeremonie",
      "Sumo-Turnier-Tickets",
    ],
    description:
      "Japan – wo Tradition auf Hightech trifft. Erlebe die Kirschblüte in Kyoto, den futuristischen Neon-Dschungel von Tokyo, ruhige Zen-Gärten und die weltbeste Küche.",
    program: [
      { title: "Tokyo Ankunft", desc: "Check-in, Stadtbesichtigung Shibuya & Shinjuku, Izakaya-Abendessen." },
      { title: "Tokio Highlights", desc: "Senso-ji Tempel, Harajuku, TeamLab Borderless Digital Art Museum." },
      { title: "Kyoto & Nara", desc: "Fushimi Inari, Arashiyama Bambushain, Hirsch-Park in Nara." },
      { title: "Osaka Kulinarik", desc: "Street-Food-Tour Dotonbori, Osaka-Schloss, Takoyaki-Kochkurs." },
      { title: "Hiroshima & Miyajima", desc: "Friedensgedenkstätte, schwimmendes Torii-Tor bei Flut." },
    ],
  },
  {
    id: 7,
    slug: "portugal-coast",
    destination: "Portugal",
    countryKey: "country_portugal",
    nights: 8,
    price: 749,
    rating: 4.7,
    reviews: 1230,
    gradient: "from-blue-500 via-indigo-400 to-violet-400",
    emoji: "🏰",
    tagKey: "hot_tag_deal",
    departure: "Berlin",
    included: [
      "Flug hin & zurück",
      "Charme-Hotels (Frühstück)",
      "Mietwagen (7 Tage)",
      "Weinprobe im Douro-Tal",
      "Lissabon Stadtrundfahrt",
    ],
    description:
      "Portugal überzeugt mit Weltklasse-Wein, beeindruckender Architektur, entspanntem Lebensstil und einer der schönsten Küstenlinien Europas. Lissabon, Porto, Algarve – drei Welten in einem Land.",
    program: [
      { title: "Lissabon Ankunft", desc: "Alfama-Viertel, Tram 28, Fado-Abend im traditionellen Restaurant." },
      { title: "Sintra & Cascais", desc: "Märchenschloss Pena, Küstenstraße, Fischmarkt in Cascais." },
      { title: "Alentejo & Wein", desc: "Weinprobe, mittelalterliches Évora (UNESCO), Übernachtung auf Quinta." },
      { title: "Porto & Douro", desc: "Bootsfahrt auf dem Douro, Port-Weinkeller, Livraria Lello." },
      { title: "Algarve Küste & Abreise", desc: "Steilküste Ponta da Piedade, Strandtag in Lagos, Rückflug." },
    ],
  },
  {
    id: 8,
    slug: "spain-fiesta",
    destination: "Spanien",
    countryKey: "country_spain",
    nights: 7,
    price: 649,
    rating: 4.6,
    reviews: 2015,
    gradient: "from-yellow-400 via-orange-400 to-red-400",
    emoji: "🦩",
    tagKey: "hot_tag_trending",
    departure: "München",
    included: [
      "Flug hin & zurück",
      "Apartments & Hotels",
      "Barcelona City Card",
      "Flamenco-Show",
      "Tapas-Kochkurs",
    ],
    description:
      "Spanien pulsiert – Gaudi-Architektur in Barcelona, Flamenco in Granada, mondäne Strände an der Costa del Sol und die kulinarische Welthauptstadt San Sebastián.",
    program: [
      { title: "Barcelona Ankunft", desc: "Sagrada Familia, La Rambla, Tapas-Tour im Boqueria-Markt." },
      { title: "Gaudí & Modernisme", desc: "Park Güell, Casa Batlló, Picasso-Museum." },
      { title: "Madrid & Kunst", desc: "Prado-Museum, Puerta del Sol, Bernabéu-Stadion-Tour." },
      { title: "Granada & Alhambra", desc: "UNESCO-Palast Alhambra, Albaicín-Viertel, Flamenco-Abend." },
      { title: "Costa del Sol & Abreise", desc: "Strandtag Marbella, Abschlussessen, Rückflug." },
    ],
  },
];

// Used by search page for country filter options
export const countryKeys = [
  "country_thailand",
  "country_turkey",
  "country_spain",
  "country_italy",
  "country_japan",
  "country_portugal",
];
