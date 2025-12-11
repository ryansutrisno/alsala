import { InspirationContent } from '../types';

const quotes: InspirationContent[] = [
  {
    quote: "Maka sesungguhnya bersama kesulitan ada kemudahan.",
    source: "QS. Al-Insyirah: 5",
    reflection: "Setiap cobaan membawa jalan keluarnya sendiri. Bersabarlah."
  },
  {
    quote: "Shalat adalah tiang agama. Barangsiapa mendirikannya, maka ia telah mendirikan agama.",
    source: "HR. Baihaqi",
    reflection: "Jaga sholatmu, karena ia adalah pondasi kehidupan spiritualmu."
  },
  {
    quote: "Barangsiapa yang menempuh jalan untuk menuntut ilmu, Allah akan mudahkan baginya jalan menuju surga.",
    source: "HR. Muslim",
    reflection: "Jangan lelah belajar, karena ilmu adalah cahaya menuju keabadian."
  },
  {
    quote: "Sebaik-baik manusia adalah yang paling bermanfaat bagi orang lain.",
    source: "HR. Ahmad",
    reflection: "Jadikan harimu bermakna dengan membantu sesama."
  },
  {
    quote: "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.",
    source: "QS. Al-Baqarah: 286",
    reflection: "Kamu kuat. Masalah ini ada karena kamu mampu menghadapinya."
  },
  {
    quote: "Tersenyum ketika bertemu saudaramu adalah ibadah.",
    source: "HR. Tirmidzi",
    reflection: "Hal kecil yang membawa kebahagiaan bagi orang lain adalah pahala."
  },
  {
    quote: "Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram.",
    source: "QS. Ar-Ra'd: 28",
    reflection: "Saat gelisah, kembalilah pada dzikir dan doa."
  },
  {
    quote: "Kebersihan adalah sebagian dari iman.",
    source: "HR. Muslim",
    reflection: "Jaga kebersihan diri dan lingkungan sebagai wujud keimanan."
  },
  {
    quote: "Bertaqwalah kepada Allah di mana saja kamu berada.",
    source: "HR. Tirmidzi",
    reflection: "Tuhan melihatmu, baik saat ramai maupun saat sendiri."
  },
  {
    quote: "Dan Dia (Allah) bersamamu di mana saja kamu berada.",
    source: "QS. Al-Hadid: 4",
    reflection: "Jangan merasa sendiri, Allah selalu mengawasi dan menjagamu."
  },
  {
    quote: "Hai orang-orang yang beriman, jadikanlah sabar dan shalat sebagai penolongmu.",
    source: "QS. Al-Baqarah: 153",
    reflection: "Dua senjata terkuat orang mukmin: kesabaran dan sujud."
  },
  {
    quote: "Tidaklah berkurang harta karena sedekah.",
    source: "HR. Muslim",
    reflection: "Berbagi justru membuka pintu rezeki yang lebih luas."
  }
];

export const getDailyInspiration = async (prayerName: string): Promise<InspirationContent> => {
  // Simulate a realistic async delay for UI consistecy
  await new Promise(resolve => setTimeout(resolve, 800));

  // Pick a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};