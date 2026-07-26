export interface FAQGroup {
  category: string;
  items: { question: string; answer: string }[];
}

export const FAQS: FAQGroup[] = [
  {
    category: "General NFC Technology",
    items: [
      { question: "What is NFC and how does it work?", answer: "NFC stands for Near Field Communication. It uses passive radio frequency tags to transmit small data packets (like profile URLs) to nearby smartphones with a tap." },
      { question: "Do NFC business cards require charging?", answer: "No, the card operates passively. It draws power electromagnetically from the scanning smartphone's reader, requiring no internal batteries." }
    ]
  },
  {
    category: "Compatibility & Security",
    items: [
      { question: "Which phones are compatible with Tapfolio cards?", answer: "All modern iPhones (XR and newer) and 95% of Android devices have NFC enabled by default. Older devices can scan the dynamic QR fallback print." },
      { question: "Is my personal data secure on Tapfolio?", answer: "Yes, we only store and transmit your public profile URL. Secure databases and SSL protocols protect your account." }
    ]
  }
];
