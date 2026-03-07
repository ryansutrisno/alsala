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
  {
    quote: "Tidaklah sempurna iman seseorang hingga ia mencintai saudaranya sebagaimana ia mencintai dirinya sendiri.",
    source: "HR. Bukhari & Muslim",
    reflection: "Cinta sesama adalah cerminan keimanan yang sejati."
  },
  {
    quote: "Barangsiapa berbuat kebaikan seberat dzarrahpun, niscaya dia akan melihat balasannya.",
    source: "QS. Az-Zalzalah: 7",
    reflection: "Setiap kebaikan, sekecil apapun, tidak akan sia-sia di sisi Allah."
  },
  {
    quote: "Sesungguhnya Allah bersama orang-orang yang sabar.",
    source: "QS. Al-Baqarah: 153",
    reflection: "Dalam kesabaran, ada kekuatan dan keberkahan yang tak terhingga."
  },
  {
    quote: "Dan mintalah pertolongan kepada Allah dengan sabar dan shalat.",
    source: "QS. Al-Baqarah: 45",
    reflection: "Shalat dan sabar adalah senjata orang mukmin dalam menghadapi cobaan."
  },
  {
    quote: "Barangsiapa yang bertakwa kepada Allah, niscaya Dia akan memberinya jalan keluar.",
    source: "QS. At-Talaq: 2",
    reflection: "Takwa adalah kunci dari setiap kesulitan hidup."
  },
  {
    quote: "Rasulullah SAW tidak pernah mengeluh atas suatu kesulitan yang menimpanya.",
    source: "HR. Bukhari",
    reflection: "Contoh terbaik dalam menghadapi ujian hidup adalah ketabahan Nabi."
  },
  {
    quote: "Sesungguhnya shalat itu mencegah dari perbuatan keji dan munkar.",
    source: "QS. Al-Ankabut: 45",
    reflection: "Shalat bukan hanya ibadah, tapi juga pelindung dari perbuatan tercela."
  },
  {
    quote: "Barangsiapa yang bersyukur, niscaya Kami tambahkan nikmat kepadanya.",
    source: "QS. Ibrahim: 7",
    reflection: "Syukur membuka pintu keberkahan dan kelapangan rezeki."
  },
  {
    quote: "Janganlah kamu berduka cita, sesungguhnya Allah bersama kita.",
    source: "QS. At-Taubah: 40",
    reflection: "Allah tidak pernah meninggalkan hamba-Nya yang bertawakkal."
  },
  {
    quote: "Sesungguhnya setiap kesulitan pasti ada kemudahan.",
    source: "QS. Al-Insyirah: 6",
    reflection: "Allah mengulang janji kemudahan dua kali untuk memperkuat keyakinan kita."
  },
  {
    quote: "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia.",
    source: "HR. Ahmad",
    reflection: "Nilai seseorang diukur dari manfaat yang diberikan kepada sesama."
  },
  {
    quote: "Barangsiapa yang memudahkan orang lain dalam kesulitan, Allah akan memudahkan baginya di dunia dan akhirat.",
    source: "HR. Muslim",
    reflection: "Menolong sesama adalah investasi amal yang tak pernah merugi."
  },
  {
    quote: "Sesungguhnya Allah tidak mengubah keadaan suatu kaum hingga mereka mengubah keadaan diri mereka sendiri.",
    source: "QS. Ar-Ra'd: 11",
    reflection: "Perubahan dimulai dari diri sendiri, bukan dari orang lain."
  },
  {
    quote: "Barangsiapa yang berbuat dosa, maka sesungguhnya ia berbuat dosa bagi dirinya sendiri.",
    source: "QS. An-Nisa: 111",
    reflection: "Dosa hanya merugikan diri sendiri, bukan Allah."
  },
  {
    quote: "Dan bertawakallah kepada Allah jika kamu beriman.",
    source: "QS. Al-Ma'idah: 23",
    reflection: "Tawakkal adalah bukti iman yang kuat kepada Allah."
  },
  {
    quote: "Sesungguhnya shalat itu adalah kewajiban yang ditentukan waktunya atas orang-orang yang beriman.",
    source: "QS. An-Nisa: 103",
    reflection: "Shalat wajib dilaksanakan tepat pada waktunya."
  },
  {
    quote: "Barangsiapa yang tidur dalam keadaan bersuci, maka malaikat akan bersamanya sepanjang malam.",
    source: "HR. Ibnu Hibban",
    reflection: "Bersuci sebelum tidur membawa ketenangan dan perlindungan."
  },
  {
    quote: "Tidak sempurna iman seseorang yang makan sementara saudaranya lapar.",
    source: "HR. Bukhari",
    reflection: "Kepedulian sosial adalah bagian dari keimanan yang sempurna."
  },
  {
    quote: "Sesungguhnya Allah menyukai orang-orang yang bertobat dan menyukai orang-orang yang mensucikan diri.",
    source: "QS. Al-Baqarah: 222",
    reflection: "Tobat adalah pintu menuju ampunan dan cinta Allah."
  },
  {
    quote: "Barangsiapa yang menempuh jalan untuk mencari ilmu, Allah akan memudahkan baginya jalan ke surga.",
    source: "HR. Muslim",
    reflection: "Menuntut ilmu adalah ibadah yang mengangkat derajat seseorang."
  },
  {
    quote: "Dan Kami tidak mengutus kamu melainkan untuk menjadi rahmat bagi semesta alam.",
    source: "QS. Al-Anbiya: 107",
    reflection: "Nabi Muhammad adalah rahmat yang sempurna bagi seluruh umat manusia."
  },
  {
    quote: "Barangsiapa yang berbuat kejahatan sebesar dzarrahpun, niscaya dia akan melihat balasannya.",
    source: "QS. Az-Zalzalah: 8",
    reflection: "Setiap perbuatan, baik atau buruk, akan dibalas dengan adil."
  },
  {
    quote: "Sesungguhnya kepada Tuhanmulah tempat kembalimu.",
    source: "QS. Al-Alaq: 8",
    reflection: "Ingatlah bahwa kehidupan ini hanya sementara dan akhirat adalah tujuan kita."
  },
  {
    quote: "Barangsiapa yang meyakini bahwa Allah akan memberinya rezeki, niscaya Allah akan memberinya rezeki.",
    source: "HR. Bukhari",
    reflection: "Keyakinan kepada Allah membuka pintu rezeki yang tak terduga."
  },
  {
    quote: "Dan sesungguhnya akhirat itu lebih baik bagimu daripada yang pertama.",
    source: "QS. Ad-Duha: 4",
    reflection: "Kehidupan akhirat adalah tujuan sejati yang lebih baik dari dunia."
  },
  {
    quote: "Barangsiapa yang berbuat baik bagi perempuan, maka sesungguhnya ia berbuat baik bagi dirinya sendiri.",
    source: "HR. Bukhari",
    reflection: "Berbuat baik kepada perempuan adalah bagian dari akhlak mulia."
  }
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