export interface IPOMetadata {
  sector: string;
  about: string;
  businessModel: string;
  competitiveLandscape: string;
  strengths: string[];
  risks: string[];
}

export const IPO_METADATA_MAP: Record<string, IPOMetadata> = {
  "csm-technologies": {
    sector: "IT / Software Services",
    about: "CSM Technologies Ltd is a leading GovTech consulting and enterprise software firm. They specialize in digital transformation, portal development, database systems, and custom workflow solutions for government departments and corporate clients across India and East Africa.",
    businessModel: "Operates on a contract-based services and licensing model. Revenue is generated through government IT consultancy contracts, enterprise SaaS platforms, and multi-year annual maintenance contracts (AMC).",
    competitiveLandscape: "Competes with tier-1 IT consulting giants (like TCS, Wipro) for massive government tenders, as well as specialized niche boutique GovTech suppliers.",
    strengths: [
      "Robust track record in executing large-scale, complex digital governance systems.",
      "High visibility of recurring revenue from multi-year maintenance and operations contracts.",
      "Pioneer in implementing paperless workflow solutions in public administration."
    ],
    risks: [
      "Vulnerability to changes in government leadership, administrative priorities, or procurement delays.",
      "High working capital requirements caused by long payment cycles in public sector tenders.",
      "Intense industry-wide competition for senior software engineers and project managers."
    ]
  },
  "sri-priyanka-geo-commex": {
    sector: "Infrastructure Services",
    about: "Sri Priyanka Geo Commex Ltd provides specialized engineering services, including geo-technical surveys, marine dredging, land reclamation, soil testing, and geological mapping for ports, highways, and heavy construction sites.",
    businessModel: "Generates revenue on a project-execution contract basis, renting heavy marine dredging equipment, and providing scientific geological assessment services to builders and governments.",
    competitiveLandscape: "Competes with regional marine contractors, soil mechanics labs, and mid-tier construction engineering firms.",
    strengths: [
      "Owns a high-value fleet of specialized marine and survey machinery.",
      "High technical entry barrier due to niche expertise in underwater geological profiling.",
      "Direct beneficiary of India's port-led development projects (Sagarmala initiative)."
    ],
    risks: [
      "High geographical concentration, with most projects situated along the eastern coastline.",
      "Highly weather-dependent operations; severe monsoons or cyclones can halt project timelines.",
      "Capital-intensive business necessitating frequent reinvestment in machinery maintenance."
    ]
  },
  "crazy-snacks": {
    sector: "FMCG / Packaged Foods",
    about: "Crazy Snacks Ltd is a regional manufacturer and brand of packaged snacks, bakery goods, confectionery, and ready-to-eat savories. The brand is highly popular in tier-2 and tier-3 cities across Northern and Eastern India.",
    businessModel: "Uses a distributor-led FMCG wholesale model. Products are manufactured in automated regional plants and distributed via a network of super-stockists, distributors, and retail grocery stores.",
    competitiveLandscape: "Competes with national snack brands (Haldiram's, Bikano, Balaji Wafers) and local unorganized sweet and savory vendors.",
    strengths: [
      "Strong brand recall and market penetration in rural and semi-urban North India.",
      "Diverse product portfolio catering to local taste preferences at attractive price points.",
      "Low manufacturing overheads due to highly automated, cost-efficient processing plants."
    ],
    risks: [
      "Fluctuations in agricultural raw material prices, particularly wheat, cooking oil, and sugar.",
      "Intense pricing competition limiting operational profit margins.",
      "High marketing and advertising costs required to defend market share against national giants."
    ]
  },
  "ic-electricals": {
    sector: "Electrical Equipment",
    about: "IC Electricals Company Ltd manufactures industrial electrical panels, switchgears, control systems, and power distribution boxes. Their products are critical components in electrical substations, commercial buildings, and factories.",
    businessModel: "B2B sales driven by direct contracts with industrial developers, government power distribution companies (DISCOMs), and OEM manufacturing supply agreements.",
    competitiveLandscape: "Competes with major electrical switchgear manufacturers (L&T, Siemens, Havells) and regional panel fabrication companies.",
    strengths: [
      "Certified product range with industry-standard CPRI (Central Power Research Institute) approvals.",
      "Strong pipeline of recurring orders from corporate industrial estate builders.",
      "Proprietary smart electrical panel models with internet-of-things (IoT) monitoring."
    ],
    risks: [
      "High exposure to metal price volatility, particularly copper, steel, and aluminum.",
      "Customer payment risks due to financial stress in the real estate and public utility sectors.",
      "Strict product liability issues due to safety regulations surrounding electrical systems."
    ]
  },
  "aastha-spintex": {
    sector: "Textiles / Cotton Yarn",
    about: "Aastha Spintex Ltd operates a modern, automated cotton spinning mill. They manufacture high-quality combed cotton yarn, carded threads, and synthetic blended yarn for domestic weaving mills and garment exporters.",
    businessModel: "Processes raw cotton bails into finished yarn. Products are sold through textile brokers and commission agents to weaving and knitting factories across India and international markets.",
    competitiveLandscape: "Competes in a highly fragmented and price-sensitive textile industry with thousands of spinning mills in Gujarat and Maharashtra.",
    strengths: [
      "Strategic location in Gujarat's cotton belt, reducing raw material logistics and transit costs.",
      "Modern ring-spinning machinery ensuring consistent yarn quality and high efficiency.",
      "Established export channels with international fabric manufacturers in Bangladesh and Vietnam."
    ],
    risks: [
      "Susceptibility to monsoon failures and pest outbreaks affecting annual cotton crop yields.",
      "High electricity costs, as spinning mills are highly energy-intensive operations.",
      "Volatility in international yarn prices due to global demand-supply cycles."
    ]
  },
  "twinkle-papers": {
    sector: "Paper & Packaging",
    about: "Twinkle Papers Ltd manufactures industrial kraft paper, duplex boards, and corrugated paper rolls. They utilize recycled waste paper and agricultural residue to produce packaging materials for the e-commerce and retail sectors.",
    businessModel: "B2B supply model. Finished paper rolls and duplex sheets are sold to corrugated box manufacturers, consumer electronics packagers, and logistics firms.",
    competitiveLandscape: "Competes with regional recycled paper mills and large integrated packaging solution companies.",
    strengths: [
      "Sustainable, environment-friendly production utilizing 100% recycled fibers.",
      "Riding on the strong tailwinds of e-commerce expansion and the plastic packaging ban.",
      "Strong demand for high-strength Kraft paper for industrial heavy shipping."
    ],
    risks: [
      "Sharp increases in local and imported waste paper raw material costs.",
      "Strict government environmental norms regarding effluent discharge and water usage.",
      "Highly capital-intensive nature of continuous paper mill machinery operations."
    ]
  },
  "adon-agro-commodities": {
    sector: "Agro Processing & Trading",
    about: "Adon Agro Commodities Ltd is engaged in the sourcing, sorting, processing, and trading of agricultural commodities. Their main products include pulses, grains, oil seeds, and spices sold in domestic and export markets.",
    businessModel: "An asset-light agro-trading business. The company sources crops directly from farmer cooperatives and agricultural markets, cleans/packs them at central hubs, and ships to food processing corporations.",
    competitiveLandscape: "Competes with massive global agro-conglomerates (Adani Wilmar, Cargill) and thousands of wholesale grain merchants.",
    strengths: [
      "Asset-light model with minimal capital tied up in heavy manufacturing machinery.",
      "Deeply integrated sourcing network ensuring access to quality crops at competitive rates.",
      "Established certifications for export of organic commodities to Middle Eastern markets."
    ],
    risks: [
      "High exposure to climatic risks, monsoon failures, and harvest yields.",
      "Government policies, such as sudden export bans, stock-holding limits, or price controls.",
      "Very low operating profit margins typical of bulk commodity trading."
    ]
  },
  "atharva-polyplast": {
    sector: "Plastic Piping Systems",
    about: "Atharva Polyplast Ltd manufactures PVC pipes, HDPE conduits, sprinkler irrigation pipes, and plastic fittings used in agricultural watering, municipal sewage, and real estate construction.",
    businessModel: "Operates a distributor-led retail sales model. Sells pipes through a network of hardware and agricultural equipment dealers, alongside direct bidding for government water supply schemes.",
    competitiveLandscape: "Competes with established plastic pipe giants (Astral, Supreme, Finolex) and regional low-cost extrusion plants.",
    strengths: [
      "Extensive retail dealer network spanning major agricultural hubs.",
      "Diversified product application across agriculture, real estate, and municipal infrastructure.",
      "In-house compounding facility reducing raw polymer purchase costs."
    ],
    risks: [
      "Direct dependence on crude oil derivative prices (PVC resin is a petroleum derivative).",
      "Highly seasonal demand, with sales dropping significantly during the monsoon months.",
      "High freight costs due to the bulky nature of finished pipes, limiting economical shipping radius."
    ]
  },
  "kratikal-tech": {
    sector: "Cybersecurity & SaaS",
    about: "Kratikal Tech Ltd is a premier cybersecurity software company. They offer anti-phishing simulation platforms, email security SaaS, vulnerability assessment services (VAPT), and cyber risk governance systems.",
    businessModel: "SaaS subscription model for products like 'ThreatCop' (annual recurring revenue), paired with fixed-fee professional cybersecurity consulting and testing services.",
    competitiveLandscape: "Competes with global tech consultancies (Big 4, Accenture) and specialized cybersecurity SaaS giants.",
    strengths: [
      "High gross margins and predictable recurring revenue from enterprise SaaS subscriptions.",
      "Proprietary technology stack with registered patents in anti-phishing simulation.",
      "Rapidly growing market demand due to rise in ransomware and enterprise data regulations."
    ],
    risks: [
      "Rapid technological cycles requiring continuous R&D to counter evolving cyber threats.",
      "Potential reputation damage and legal liability if a client experiences a breach despite using their software.",
      "Severe talent shortage and high attrition rates for qualified cybersecurity engineers."
    ]
  },
  "sampark-india-logistics": {
    sector: "Logistics & Supply Chain",
    about: "Sampark India Logistics Ltd is a third-party logistics (3PL) provider. They offer warehousing, express parcel delivery, freight forwarding, and supply chain design for industrial and retail corporations.",
    businessModel: "Operates on an asset-light model. Warehouses are leased and transportation trucks are outsourced from contracted fleet owners, minimizing fixed overhead costs.",
    competitiveLandscape: "Competes with large logistics networks (DHL, Blue Dart, Delhivery) and highly fragmented regional transport brokers.",
    strengths: [
      "Highly flexible, low-overhead asset-light operational structure.",
      "Deep expertise in handling temperature-sensitive pharmaceutical and automotive logistics.",
      "State-of-the-art warehouse management software integrated with client ERP systems."
    ],
    risks: [
      "Vulnerability to fuel (diesel) price hikes which directly increase transport costs.",
      "Severe pricing pressure during corporate cargo logistics bidding processes.",
      "Dependency on outsourced fleet reliability and driver availabilities."
    ]
  },
  "seemax resources": {
    sector: "Industrial Minerals",
    about: "Seemax Resources Ltd processes and trades industrial minerals and chemical compounds, specializing in premium-grade silica sand, quartz powder, and feldspar used in glass, ceramics, and solar panel glass manufacturing.",
    businessModel: "B2B supply model. Sours raw ores from mining concessions, refines them at company-owned mineral crushing plants, and supplies chemical/glass giants.",
    competitiveLandscape: "Competes with regional mine owners, chemical suppliers, and global mineral import agencies.",
    strengths: [
      "Captive processing and grading plant ensuring high-purity silica products.",
      "Long-term purchase agreements with established glass and ceramic manufacturers.",
      "Favorable mine supply contracts in resource-rich mineral belts."
    ],
    risks: [
      "Strict environmental clearance procedures and pollution controls for mineral grinding plants.",
      "High rail/road transportation costs for moving heavy, bulk mineral powders.",
      "Slowdown in consumer demand for real estate ceramics and automotive glass."
    ]
  },
  "seemax-resources": {
    sector: "Industrial Minerals",
    about: "Seemax Resources Ltd processes and trades industrial minerals and chemical compounds, specializing in premium-grade silica sand, quartz powder, and feldspar used in glass, ceramics, and solar panel glass manufacturing.",
    businessModel: "B2B supply model. Sours raw ores from mining concessions, refines them at company-owned mineral crushing plants, and supplies chemical/glass giants.",
    competitiveLandscape: "Competes with regional mine owners, chemical suppliers, and global mineral import agencies.",
    strengths: [
      "Captive processing and grading plant ensuring high-purity silica products.",
      "Long-term purchase agreements with established glass and ceramic manufacturers.",
      "Favorable mine supply contracts in resource-rich mineral belts."
    ],
    risks: [
      "Strict environmental clearance procedures and pollution controls for mineral grinding plants.",
      "High rail/road transportation costs for moving heavy, bulk mineral powders.",
      "Slowdown in consumer demand for real estate ceramics and automotive glass."
    ]
  },
  "knack-packaging": {
    sector: "Industrial Packaging",
    about: "Knack Packaging Ltd manufactures PP/HDPE woven sacks, BOPP laminated packaging bags, and woven fabrics. Their packaging bags are extensively used in packing fertilizers, cement, chemicals, grains, and flour.",
    businessModel: "B2B bulk manufacturing model. Generates revenue by manufacturing customized packaging solutions for large industrial brands under long-term supply rate contracts.",
    competitiveLandscape: "Competes with regional plastic woven sack producers, flexible packaging manufacturers, and paper sack builders.",
    strengths: [
      "Advanced multi-color BOPP (Biaxially Oriented Polypropylene) printing and laminating facilities.",
      "Approved corporate supplier status with major public sector fertilizer and cement corporations.",
      "Export presence, supplying packaging bags to North American and European agricultural distributors."
    ],
    risks: [
      "Heavy reliance on plastic polymer prices which fluctuate with international crude oil rates.",
      "Tightening environmental regulations regarding single-use plastics and packaging bag thicknesses.",
      "Intense price competition leading to thin margins on bulk commodity packaging bags."
    ]
  },
  "hexagon-nutrition": {
    sector: "Nutraceuticals & Healthcare",
    about: "Hexagon Nutrition Ltd is a research-oriented nutrition company. They manufacture clinical nutrition formulations, child wellness premixes, and fortified food supplements aimed at addressing malnutrition and wellness.",
    businessModel: "Institutional B2B sales to global relief organizations (UNICEF, NGOs) and domestic child welfare programs, paired with B2C retail brand sales of clinical foods (Pentasure, Obesigo).",
    competitiveLandscape: "Competes with international healthcare groups (Abbott Nutrition, Nestle) and domestic pharmaceutical corporations entering nutraceuticals.",
    strengths: [
      "Established vendor status with international global relief and health organizations.",
      "Research-driven portfolio with specialized clinical products for oncology and diabetic nutrition.",
      "Established clinical nutrition manufacturing facilities with global WHO-GMP approvals."
    ],
    risks: [
      "Highly regulated certifications required for medical-grade and clinical nutrition foods.",
      "Vulnerability to fluctuations in government and aid agency allocation budgets for malnutrition schemes.",
      "High customer concentration on the institutional procurement side."
    ]
  },
  "cmr-green-technologies": {
    sector: "Metal Recycling / Green Alloys",
    about: "CMR Green Technologies Ltd is India's largest metal recycling company. They specialize in processing aluminum and zinc scrap to manufacture high-quality casting alloys, extensively used in the automotive sector to produce engine and transmission casings.",
    businessModel: "Green recycling model. Imports aluminum scrap, melts and refines it in automated furnaces, and sells liquid molten metal and alloy ingots directly to automotive component manufacturers.",
    competitiveLandscape: "Competes with primary aluminum producers (Hindalco, Vedanta) for domestic market share, as well as local scrap scrap dealers.",
    strengths: [
      "Leading market position in automotive aluminum recycling, with direct supply lines to Maruti Suzuki, Honda, and Toyota.",
      "High energy savings and eco-friendly credentials compared to primary aluminum refining.",
      "Pioneered liquid aluminum delivery using specialized insulated containers, eliminating reheating costs."
    ],
    risks: [
      "Volatility in London Metal Exchange (LME) pricing for metal scrap and finished alloys.",
      "Direct exposure to the cyclicality of the domestic automotive sector's performance.",
      "Stricter import regulations, customs duties, or pollution controls surrounding industrial metal scrap."
    ]
  }
};
