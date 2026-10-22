/* =========================================================
   Desert Wings W.L.L. — Site data & configuration
   ---------------------------------------------------------
   Every piece of editable business content lives here so the
   HTML stays clean. Edit this file to change contact details,
   services, menus, prices and job openings.

   Items marked  // SAMPLE  are demonstration content and must
   be replaced with verified company information before launch.
   ========================================================= */

const DW = {
  company: {
    name: "Desert Wings W.L.L.",
    shortName: "Desert Wings",
    tagline: "Industrial & Event Catering · Housekeeping · Laundry",
    poBox: "P.O. Box 82176",
    city: "Al Wakra, Qatar",
    phone: "+974 3366 8004",
    phoneRaw: "+97433668004",
    phone2: "+974 4463 4345",
    phone2Raw: "+97444634345",
    whatsapp: "97433668004",
    email: "info@desertwingsgroup.com",
    hours: "Sun – Thu: 7:00 AM – 6:00 PM · Sat: 8:00 AM – 2:00 PM",
    kitchenHours: "Kitchen operations run 24/7 for shift-based sites",
    yearsExperience: 10,
    social: {
      linkedin: "https://www.linkedin.com/",
      facebook: "https://www.facebook.com/",
      instagram: "https://www.instagram.com/"
    }
  },

  /* Navigation used by the header & footer (components.js) */
  nav: [
    { label: "Home", href: "index.html" },
    { label: "About", href: "about.html" },
    { label: "Services", href: "services.html" },
    { label: "Menus", href: "menu.html" },
    { label: "QHSE", href: "qhse.html" },
    { label: "Careers", href: "careers.html" },
    { label: "Contact", href: "contact.html" }
  ],

  /* Core services — taken from desertwingsgroup.com */
  services: [
    {
      id: "industrial",
      icon: "factory",
      title: "Industrial Catering",
      short: "Large-volume, cost-effective catering for industrial workforces.",
      body: "We have experience catering for large-volume industrial workforces and provide a cost-effective solution for your catering requirements. A broad range of varied, nutritious menus is planned around your crew's nationalities, shift patterns and site conditions.",
      features: ["Shift-based breakfast, lunch, dinner & night meals", "Multicultural menus for multinational crews", "On-site mess and remote delivery", "Portion & calorie planning for manual labour"],
      sectors: ["Construction", "Oil & Gas", "Manufacturing", "Labour camps"]
    },
    {
      id: "event",
      icon: "party",
      title: "Event Catering",
      short: "Superb service and local & international food for any occasion.",
      body: "Cater for any special event or occasion with superb service and an outstanding variety of local and international food. Our experienced team makes events of any size more enjoyable — from site inaugurations and safety-milestone celebrations to corporate banquets.",
      features: ["Buffet, plated & live-station formats", "Arabic, Asian & continental cuisine", "Service staff, setup & clean-down", "Corporate, community & private events"],
      sectors: ["Corporate", "Government", "Community", "Private"]
    },
    {
      id: "housekeeping",
      icon: "laundry",
      title: "Housekeeping & Laundry",
      short: "Laundry and housekeeping tailored to your needs.",
      body: "We offer standard laundry services tailored to customers' requirements. Our staff are experts in all sorts of clothing materials and handle every garment with care — from coveralls and uniforms to linen for accommodation blocks.",
      features: ["Accommodation & camp housekeeping", "Uniform, coverall & linen laundry", "Collection & delivery schedules", "Material-specific washing & pressing"],
      sectors: ["Camps", "Accommodation", "Offices", "Industrial sites"]
    },
    {
      id: "packed",
      icon: "box",
      title: "Packed Meal Service",
      short: "Hygienically packed meals delivered to site, on time.",
      body: "Hygienically packed, temperature-controlled meals delivered directly to work fronts and remote locations, so crews eat well without leaving site. Ideal for scattered work areas, overtime shifts and field teams.",
      features: ["Sealed, labelled meal boxes", "Hot-hold & cold-chain transport", "Scheduled multi-drop deliveries", "Special-diet boxes on request"],
      sectors: ["Field teams", "Remote sites", "Night shifts", "Projects"]
    },
    {
      id: "cafeteria",
      icon: "coffee",
      title: "Cafeteria Services",
      short: "Fully managed cafeterias and mess halls for your staff.",
      body: "We set up and operate staff cafeterias and mess halls — menu design, staffing, hygiene, stock control and cashless or coupon-based service — so your people get consistent, quality food every day.",
      features: ["Mess hall & canteen management", "Coupon, card or headcount billing", "Daily hygiene & temperature logs", "Snacks, beverages & grab-and-go"],
      sectors: ["Factories", "Offices", "Schools", "Camps"]
    }
  ],

  /* Value propositions — listed on desertwingsgroup.com/who-we-are.html */
  values: [
    { icon: "smile", title: "Less Stress", text: "One accountable partner for food, housekeeping and laundry — so your site managers can focus on the project." },
    { icon: "menu", title: "A Versatile Menu", text: "Rotating multicultural menus with vegetarian, halal and special-diet options built in." },
    { icon: "star", title: "Make a Statement", text: "Well-fed crews are safer, happier and more productive — and it shows in your site culture." },
    { icon: "clock", title: "Save Time", text: "Punctual, shift-aligned service and packed-meal delivery that keeps work fronts moving." },
    { icon: "search", title: "Attention to Detail", text: "Food safety, hygiene and HACCP-based controls at every step from receiving to serving." }
  ],

  /* Industries served */
  sectors: [
    { icon: "crane", title: "Construction Projects" },
    { icon: "flame", title: "Oil, Gas & Energy" },
    { icon: "factory", title: "Manufacturing Plants" },
    { icon: "home", title: "Labour Accommodation" },
    { icon: "briefcase", title: "Corporate Offices" },
    { icon: "party", title: "Events & Functions" }
  ],

  /* Homepage counters. Only "years" and "services" come from the company site;
     update the rest with verified figures.  */
  stats: [
    { value: 10, suffix: "+", label: "Years of Experience" },
    { value: 5, suffix: "", label: "Core Service Lines" },
    { value: 7, suffix: "", label: "HACCP Principles Applied" },
    { value: 24, suffix: "/7", label: "Kitchen Operations" }
  ],

  /* HACCP — the seven principles listed on the company QHSE content */
  haccp: [
    { title: "Hazard Analysis", text: "Identify biological, chemical and physical hazards at every stage — receiving, storage, preparation, cooking, holding, transport and serving." },
    { title: "Identify Critical Control Points", text: "Pinpoint the steps where control is essential, such as cooking temperatures, chilling and hot-holding during transport." },
    { title: "Establish Critical Limits", text: "Set measurable limits for each CCP — e.g. core cooking ≥ 75 °C, chilled storage ≤ 5 °C, hot-hold ≥ 63 °C." },
    { title: "Monitoring Procedures", text: "Probe thermometers, fridge/freezer logs and delivery temperature checks recorded by trained supervisors every shift." },
    { title: "Corrective Actions", text: "Clear, pre-defined actions when a limit is missed: re-heat, re-chill, quarantine or discard — and record why." },
    { title: "Verification", text: "Internal audits, calibration of thermometers, swab tests and review of logs to prove the system works." },
    { title: "Documentation", text: "Complete, traceable records of every check, delivery and corrective action, available for client and municipality inspection." }
  ],

  /* Training & management areas — from the company QHSE content */
  training: ["Food Safety", "First Aid", "Health & Safety", "Management", "Social Care", "Fire Safety", "Train the Trainer", "Licensing", "Environment", "People Skills"],

  /* ---------- Menus (SAMPLE rotation — edit freely) ---------- */
  cuisines: ["Indian", "Arabic", "Filipino", "Nepali", "Continental", "Sri Lankan"],
  dishes: {
    breakfast: [
      { name: "Masala Omelette & Paratha", cuisine: "Indian", diet: ["halal"], kcal: 520 },
      { name: "Foul Medames & Khubz", cuisine: "Arabic", diet: ["veg", "halal"], kcal: 450 },
      { name: "Tapsilog (Beef, Garlic Rice, Egg)", cuisine: "Filipino", diet: ["halal", "protein"], kcal: 640 },
      { name: "Aloo Puri & Chana", cuisine: "Indian", diet: ["veg"], kcal: 560 },
      { name: "Shakshuka & Bread", cuisine: "Arabic", diet: ["veg", "halal"], kcal: 430 },
      { name: "Idli, Sambar & Chutney", cuisine: "Indian", diet: ["veg"], kcal: 380 },
      { name: "Scrambled Eggs, Beans & Toast", cuisine: "Continental", diet: ["halal", "protein"], kcal: 510 },
      { name: "String Hoppers & Dhal Curry", cuisine: "Sri Lankan", diet: ["veg"], kcal: 420 },
      { name: "Labneh, Zaatar Manakish & Olives", cuisine: "Arabic", diet: ["veg"], kcal: 470 },
      { name: "Oats Porridge & Fresh Fruit", cuisine: "Continental", diet: ["veg", "light"], kcal: 320 }
    ],
    lunch: [
      { name: "Chicken Biryani & Raita", cuisine: "Indian", diet: ["halal", "protein"], kcal: 780 },
      { name: "Dal Bhat Tarkari", cuisine: "Nepali", diet: ["veg"], kcal: 650 },
      { name: "Chicken Machboos", cuisine: "Arabic", diet: ["halal", "protein"], kcal: 760 },
      { name: "Chicken Adobo & Rice", cuisine: "Filipino", diet: ["halal", "protein"], kcal: 700 },
      { name: "Fish Curry & Steamed Rice", cuisine: "Sri Lankan", diet: ["halal", "protein"], kcal: 640 },
      { name: "Paneer Butter Masala & Jeera Rice", cuisine: "Indian", diet: ["veg"], kcal: 720 },
      { name: "Grilled Chicken, Potatoes & Salad", cuisine: "Continental", diet: ["halal", "protein", "light"], kcal: 590 },
      { name: "Lamb Kabsa", cuisine: "Arabic", diet: ["halal", "protein"], kcal: 820 },
      { name: "Chana Masala & Chapati", cuisine: "Indian", diet: ["veg", "light"], kcal: 560 },
      { name: "Chicken Momo & Achar", cuisine: "Nepali", diet: ["halal"], kcal: 540 },
      { name: "Beef Caldereta & Rice", cuisine: "Filipino", diet: ["halal", "protein"], kcal: 740 },
      { name: "Vegetable Pasta Primavera", cuisine: "Continental", diet: ["veg"], kcal: 610 }
    ],
    dinner: [
      { name: "Chicken Tikka Masala & Naan", cuisine: "Indian", diet: ["halal", "protein"], kcal: 720 },
      { name: "Mixed Grill & Hummus", cuisine: "Arabic", diet: ["halal", "protein"], kcal: 690 },
      { name: "Vegetable Kurma & Rice", cuisine: "Indian", diet: ["veg"], kcal: 600 },
      { name: "Chicken Tinola & Rice", cuisine: "Filipino", diet: ["halal", "protein", "light"], kcal: 520 },
      { name: "Thukpa Noodle Soup", cuisine: "Nepali", diet: ["halal", "light"], kcal: 480 },
      { name: "Kottu Roti (Chicken)", cuisine: "Sri Lankan", diet: ["halal"], kcal: 700 },
      { name: "Baked Fish, Rice & Vegetables", cuisine: "Continental", diet: ["halal", "protein", "light"], kcal: 540 },
      { name: "Mutton Curry & Rice", cuisine: "Indian", diet: ["halal", "protein"], kcal: 780 },
      { name: "Falafel Wrap & Fattoush", cuisine: "Arabic", diet: ["veg", "light"], kcal: 560 },
      { name: "Pancit Canton (Chicken)", cuisine: "Filipino", diet: ["halal"], kcal: 610 },
      { name: "Rajma Chawal", cuisine: "Indian", diet: ["veg"], kcal: 590 },
      { name: "Chicken Stroganoff & Rice", cuisine: "Continental", diet: ["halal", "protein"], kcal: 680 }
    ]
  },

  /* ---------- Quote calculator (INDICATIVE rates in QAR — set your own) ---------- */
  pricing: {
    currency: "QAR",
    mealRates: { breakfast: 6, lunch: 11, dinner: 10, snack: 4 },   // per person per meal
    packedSurcharge: 1.5,                                           // per packed meal
    cafeteriaMgmtFee: 3500,                                         // per cafeteria per month
    eventRates: { standard: 55, premium: 90, vip: 140 },            // per guest
    housekeepingPerHead: 45,                                        // per person per month
    laundryPerHead: 35,                                             // per person per month
    locationFactor: { doha: 1.0, industrial: 1.05, remote: 1.15 },
    volumeDiscounts: [                                              // headcount ≥ min → % off
      { min: 2000, pct: 12 },
      { min: 1000, pct: 8 },
      { min: 500, pct: 5 }
    ]
  },

  /* ---------- Careers (SAMPLE openings — replace before launch) ---------- */
  jobs: [
    { id: "J101", title: "Head Chef – Industrial Kitchen", dept: "Kitchen", type: "Full-time", location: "Al Wakra", exp: "8+ years", desc: "Lead high-volume production for multinational workforces; menu costing, HACCP compliance and team supervision." },
    { id: "J102", title: "Commis Chef", dept: "Kitchen", type: "Full-time", location: "Al Wakra", exp: "1–3 years", desc: "Prepare and portion meals to recipe standards and maintain hygiene logs in a central kitchen." },
    { id: "J103", title: "Camp Boss / Site Supervisor", dept: "Operations", type: "Full-time", location: "Project sites", exp: "5+ years", desc: "Run day-to-day catering and housekeeping at camp sites, manage staff rosters and client communication." },
    { id: "J104", title: "Kitchen Steward", dept: "Kitchen", type: "Full-time", location: "Al Wakra", exp: "0–2 years", desc: "Dishwashing, kitchen cleaning and waste segregation following cleaning schedules." },
    { id: "J105", title: "Housekeeping Attendant", dept: "Housekeeping", type: "Full-time", location: "Accommodation sites", exp: "1+ years", desc: "Clean and maintain rooms and common areas in staff accommodation to set standards." },
    { id: "J106", title: "Laundry Operator", dept: "Housekeeping", type: "Full-time", location: "Al Wakra", exp: "1+ years", desc: "Operate industrial washers and dryers; sort, treat, press and pack garments by material type." },
    { id: "J107", title: "Food Delivery Driver (Light Vehicle)", dept: "Logistics", type: "Full-time", location: "Qatar-wide", exp: "2+ years, Qatar licence", desc: "Deliver packed meals on schedule while maintaining temperature records and vehicle hygiene." },
    { id: "J108", title: "QHSE Officer", dept: "QHSE", type: "Full-time", location: "Al Wakra", exp: "3+ years", desc: "Monitor HACCP, run internal audits and toolbox talks, and support municipality inspections." },
    { id: "J109", title: "Event Service Staff", dept: "Events", type: "Part-time", location: "Doha & Al Wakra", exp: "Any", desc: "Buffet setup, guest service and clean-down at corporate and private events." }
  ],

  faqs: [
    { q: "What is the minimum headcount for industrial catering?", a: "We tailor contracts to the site. Small teams can be served through packed meals; larger crews through on-site messing or a managed cafeteria. Send us your headcount and we'll suggest the most cost-effective model." },
    { q: "Can you cater for different nationalities and diets?", a: "Yes. Our rotating menus cover Indian, Arabic, Filipino, Nepali, Sri Lankan and continental dishes, with vegetarian, halal and special-diet options." },
    { q: "How do you keep food safe during transport?", a: "Meals travel in insulated, hot-hold or chilled containers. Temperatures are checked and logged at dispatch and on arrival as part of our HACCP system." },
    { q: "Do you provide housekeeping and laundry together with catering?", a: "Yes — many clients bundle catering, housekeeping and laundry under one contract for simpler management and better pricing." },
    { q: "How quickly can you mobilise to a new site?", a: "Mobilisation depends on scope and location. Packed-meal service can usually start quickly; full mess or cafeteria setups need a short site survey first." },
    { q: "Is the online quote final?", a: "No. The calculator gives an indicative budget only. A final proposal follows a site survey and confirmation of menus, headcount and service hours." }
  ]
};
