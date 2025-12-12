import { InspirationContent } from '../types';

const fallbackQuotes: InspirationContent[] = [
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
  // ... (keep some fallback quotes)
];

export const getDailyInspiration = async (prayerName: string): Promise<InspirationContent> => {
  try {
    const response = await fetch('https://apimuslimify.vercel.app/api/v2/quote');
    
    if (!response.ok) {
      throw new Error('Failed to fetch quote');
    }

    const data = await response.json();
    
    if (data.status === 'success' && data.data) {
      return {
        quote: data.data.text,
        source: data.data.reference,
        // API doesn't provide reflection, so we leave it undefined
      };
    }
    
    throw new Error('Invalid data format');
  } catch (error) {
    console.warn("Using fallback quotes due to API error:", error);
    // Fallback logic
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return fallbackQuotes[randomIndex];
  }
};