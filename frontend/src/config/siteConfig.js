/**
 * Explore Udgir - Centralized Site Configuration & Visitor Assistance Profile
 * 
 * IMPORTANT TRUTH POLICY:
 * Anuradha Biradar is the website manager and visitor assistance coordinator.
 * She is NOT represented as a government officer or official MTDC tourist guide.
 */

export const siteConfig = {
  brand: {
    nameEn: "Explore Udgir",
    nameMr: "एक्सप्लोर उदगीर",
    taglineEn: "Discover History. Explore Nature. Experience Udgir.",
    taglineMr: "इतिहास अनुभवा. निसर्ग पाहा. उदगीर जाणा.",
    locationEn: "Udgir, Latur District, Maharashtra, India",
    locationMr: "उदगीर, जि. लातूर, महाराष्ट्र, भारत"
  },
  guide: {
    name: "Anuradha Biradar",
    nameMr: "अनुराधा बिरादार",
    roleEn: "Tourism Information & Visitor Assistance",
    roleMr: "पर्यटन माहिती व अभ्यागत सहाय्य",
    capacityEn: "Website managed by Anuradha Biradar",
    capacityMr: "वेबसाईट व्यवस्थापक: अनुराधा बिरादार",
    email: "biradaranuradha2021@gmail.com",
    phoneDisplay: "+91 9021964018",
    phoneRaw: "9021964018",
    phoneTel: "+919021964018",
    whatsappNumber: "919021964018",
    whatsappMessageEn: "Hello Anuradha, I am planning a visit to Udgir and have a query.",
    whatsappMessageMr: "नमस्कार अनुराधा, मी उदगीर पर्यटनाचे नियोजन करत असून मला माहिती हवी आहे.",
    get whatsappUrl() {
      return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(this.whatsappMessageEn)}`;
    },
    bioEn: "Anuradha Biradar manages the Explore Udgir portal to assist tourists, students, and pilgrims with factual local navigation, directions, and trip planning.",
    bioMr: "अनुराधा बिरादार या पर्यटक, विद्यार्थी आणि भाविकांना उदगीर पर्यटनाविषयी योग्य दिशा व नियोजन सहाय्य पुरवण्यासाठी 'एक्सप्लोर उदगीर' संकेतस्थळाचे व्यवस्थापन करतात."
  },
  emergencyContacts: [
    { labelEn: "Police Helpline / Control Room", labelMr: "पोलीस नियंत्रण कक्ष", number: "112 / 100", tel: "112" },
    { labelEn: "Udgir City Police Station", labelMr: "उदगीर शहर पोलीस ठाणे", number: "02385-256133", tel: "02385256133" },
    { labelEn: "Udgir Rural Police Station", labelMr: "उदगीर ग्रामीण पोलीस ठाणे", number: "02385-256134", tel: "02385256134" },
    { labelEn: "Ambulance Emergency", labelMr: "रुग्णवाहिका कक्ष", number: "108 / 102", tel: "108" },
    { labelEn: "MSRTC Udgir Bus Stand", labelMr: "एसटी बस स्थानक", number: "02385-256102", tel: "02385256102" },
    { labelEn: "District Disaster Management", labelMr: "जिल्हा आपत्ती नियंत्रण", number: "1077", tel: "1077" }
  ]
};
