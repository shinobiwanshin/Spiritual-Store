export interface Product {
  id: string;
  title: string;
  category: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
  reviews: number;
  images: string[];
  description: string;
  benefits: string[];
  howToWear: {
    bestDay: string;
    bestTime: string;
    mantra: string;
    finger?: string;
  };
  zodiacCompatibility: string[];
  isLabCertified: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    title: "Natural Colombian Emerald (Panna)",
    category: "Gemstones",
    price: "₹24,999",
    originalPrice: "₹32,000",
    discount: "22% OFF",
    rating: 4.8,
    reviews: 128,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6dq99HUk3_VUqfws_NnJwc9LOlMrFbK6COgnyc6cjQ94J0E3Lnv2LwZLlJejQ10_QID3YFs6yKPFmXtr7dWhDppjUMJqY3b1IctEYjH1fCiF0dRpdPo0bun1wF6JjOqi2rTbMWmT5LvyrtcKk25KgncRwoGtH00Vke58WmNYdocnKTxFYe6eNgMijkdwgcp5BoD1j-8VK3GFgMy777BUfI33flIkQPgzFtU388oO8vN3OZ4ygo203q_6bkdwLfgDgjM7vpuEy4h0",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgczGTfUL6EEzq4WZtACqh17M-mWDOG6h5vTbyLxR-SO1GgpNcBa_w4Y_EPC21aXMtC1KjvUISz5TRMffrIFBWFHNl0hrxzMVUsCTZdnYyRhpdE9abjbWGNwHLj6h7Z3s5wfbu0IcoKPsT1GYretJuVKjWTu8bCACvWWmMMehnffh0VwbI58AZF9eWTyC35Q3uqR7ce9C7vBFCLEE9XS1woQfGbo4t9aEmQMWbx2IdX6S9StR1QtgYwiAs0oY46YiBtIhpgvuLedY",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWiP2SewcoxlUtCs8f-UvouECt-duFa-hPw0QhsQ9jjjqNAqmLJfEW3bklTVsHwVWWWoC0uAO4VqUfJxh_7wMIsoCsVSV8S1K0ZplxQd305FI51_tisjCoud4z6wvkDZX3a5OL032hrOhk7Cn_LwPajHFhD9d6hLY3uvEXk4NKDAJcLxaMML2GIP6lAvy2kRv4H8gdKYaHkmBQrXerUohDmriOrHiykeAfWWZ0GP5E25IyK6Q4sTJ1GfFh6rFEjOiR6Uig3at4zOg",
    ],
    description:
      "A premium quality, lab-certified Colombian Emerald (Panna). Known to bring wisdom, improved communication, and financial prosperity. Best suited for Gemini and Virgo rashis.",
    benefits: [
      "Enhances Communication & Intellect",
      "Brings Financial Prosperity",
      "Improves Focus & Concentration",
      "Calms the Nervous System",
    ],
    howToWear: {
      bestDay: "Wednesday",
      bestTime: "Morning",
      mantra: "Om Bum Budhaya Namah",
      finger: "Little Finger",
    },
    zodiacCompatibility: ["Gemini", "Virgo"],
    isLabCertified: true,
  },
  {
    id: "2",
    title: "5 Mukhi Nepal Rudraksha Mala (108+1 Beads)",
    category: "Rudraksha",
    price: "₹1,850",
    originalPrice: "₹2,200",
    discount: "16% OFF",
    rating: 4.9,
    reviews: 456,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5UuOpEVjMfcP6B3I3UN8rUY1Tg5opjyJsq3DaS9TPQTMJuFHy6l7lqjnwIvKs357uNdO93uubW5DRZf6YvpUrY4zTRNQGXi5WqsUwtomdOYitPEyVJANfyabWxAfHB0WtvqC0lGhmNH50BKDW2QV67bL3Y-srohMGyHb4OIds1S8zI-wkYjt78aQCnmLldBich8aUpTw2OLqdsZpn_tESOxWG30ml5oelVASXprFplenU4YOAg-5i4I1rsNOlP-O2fzrT2wObqEU",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCY4yTwaOr2Upue2ab4pnb40-JjNur6g-t-WrR3-Y0hdyQRyZ6Yqz8GW9mTjWAy_9eSg8ULXfrbNTgdgJApN3SfaTefiO3EdGmUntPY5ZNFyrkPYwpAXQN5-Ue9spdUzOqIc3XIs8qJ-zfir2vkR4sOxd7qUQ-_sLi9wR8uT_9h-ypOpfyxEKB0WbgzXSVzcYKP5XWGx26mJ6eaSOkOowzRq9-hyQCNg3qw3ATCCAvWDn2z1vQTjN472LF58q3LAtS_ID8r5UFwV2Q",
    ],
    description:
      "Authentic 5 Mukhi Rudraksha mala from Nepal with 108+1 beads. The 5 Mukhi represents Lord Shiva and is known to bring mental peace, lower blood pressure, and aid in spiritual growth.",
    benefits: [
      "Provides Mental Peace & Clarity",
      "Helps in Blood Pressure Management",
      "Aids Spiritual Growth & Focus",
      "Reduces Stress & Anxiety",
    ],
    howToWear: {
      bestDay: "Monday",
      bestTime: "Morning after bath",
      mantra: "Om Hreem Namah",
    },
    zodiacCompatibility: ["All Zodiac Signs"],
    isLabCertified: true,
  },
  {
    id: "3",
    title: "Shri Yantra - Pure Copper (3 inch)",
    category: "Yantras",
    price: "₹551",
    rating: 4.7,
    reviews: 204,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCzrS30payT-shdn7gexjP_uFnMINnUCd3-5Si30KqJsu2eUe82JDQxITLV1EUXdxlvMVvcyYOZT9WMrYqtnuglGjOTSvHCVpxTuykYNLOfBsGGB52ZqjWzh2cmlK2LAFgVp0FnCzpigYGfHDxw4R-NK_NndExMGJ-enoq7gtRDiCRm8SDJ74N2GTMjDkIH9T3n_QziwFgF76SDEwpxf3TuImX6XqkBHAcD6q3ESuimNn0Bp0z7ePU-wHwxs11OvAlMHElV_JD8hJ4",
    ],
    description:
      "Sacred Shri Yantra made from pure copper. This powerful yantra attracts wealth, prosperity, and removes obstacles. Perfect for home or office worship.",
    benefits: [
      "Attracts Wealth & Prosperity",
      "Removes Obstacles",
      "Brings Harmony in Life",
      "Enhances Positive Energy",
    ],
    howToWear: {
      bestDay: "Friday",
      bestTime: "During Sunrise",
      mantra: "Om Shreem Hreem Shreem Kamale Kamalalaye Praseed Praseed",
    },
    zodiacCompatibility: ["All Zodiac Signs"],
    isLabCertified: false,
  },
  {
    id: "4",
    title: "Premium Brass Ganesha Idol (6 inch)",
    category: "Idols",
    price: "₹3,499",
    originalPrice: "₹4,500",
    discount: "22% OFF",
    rating: 4.6,
    reviews: 89,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA8P9cUYQCdQOhZUc6PVHN2xwu43I8RlHFc6HkAl397Iiny5RXYMDRz3elkgJSfoYaKNa8_cquoIKLeHFZr8kka0_PQerAB2eEXHjvxdqMY0sSFKedKunaoR60oPddN2r02O33rJFR-R2hsFAxqQPIGyJ4zA_93Y_u1fqalx2XxIbykd5Oe6kI-zmGwqpGrhIaxapqsIyPelQBKcTP5O1Z9V4hEfahQzUh1hFsGp__flLC1Pmjh5G2nOAf4siDlsm9fqK6gwfHyd6Y",
    ],
    description:
      "Beautiful handcrafted Ganesha idol made from premium brass. Lord Ganesha is the remover of obstacles and the deity of new beginnings. Perfect for puja or as a blessing for your home.",
    benefits: [
      "Removes Obstacles in Life",
      "Blesses New Beginnings",
      "Brings Wisdom & Knowledge",
      "Protects from Negative Energy",
    ],
    howToWear: {
      bestDay: "Wednesday",
      bestTime: "Morning",
      mantra: "Om Gam Ganapataye Namah",
    },
    zodiacCompatibility: ["All Zodiac Signs"],
    isLabCertified: false,
  },
  {
    id: "5",
    title: "Natural Amethyst Crystal Cluster",
    category: "Crystals",
    price: "₹1,200",
    rating: 4.5,
    reviews: 56,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgczGTfUL6EEzq4WZtACqh17M-mWDOG6h5vTbyLxR-SO1GgpNcBa_w4Y_EPC21aXMtC1KjvUISz5TRMffrIFBWFHNl0hrxzMVUsCTZdnYyRhpdE9abjbWGNwHLj6h7Z3s5wfbu0IcoKPsT1GYretJuVKjWTu8bCACvWWmMMehnffh0VwbI58AZF9eWTyC35Q3uqR7ce9C7vBFCLEE9XS1woQfGbo4t9aEmQMWbx2IdX6S9StR1QtgYwiAs0oY46YiBtIhpgvuLedY",
    ],
    description:
      "Natural Amethyst crystal cluster known for its calming and protective properties. Amethyst is the stone of spiritual protection and purification.",
    benefits: [
      "Promotes Calm & Clarity",
      "Enhances Intuition",
      "Provides Spiritual Protection",
      "Aids Sleep & Relaxation",
    ],
    howToWear: {
      bestDay: "Saturday",
      bestTime: "Evening",
      mantra: "Om Shani Shaktiye Namah",
    },
    zodiacCompatibility: ["Pisces", "Aquarius", "Capricorn"],
    isLabCertified: true,
  },
  {
    id: "6",
    title: "Sandalwood Prayer Mala (Set of 2)",
    category: "Malas",
    price: "₹599",
    originalPrice: "₹799",
    discount: "25% OFF",
    rating: 4.4,
    reviews: 112,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCY4yTwaOr2Upue2ab4pnb40-JjNur6g-t-WrR3-Y0hdyQRyZ6Yqz8GW9mTjWAy_9eSg8ULXfrbNTgdgJApN3SfaTefiO3EdGmUntPY5ZNFyrkPYwpAXQN5-Ue9spdUzOqIc3XIs8qJ-zfir2vkR4sOxd7qUQ-_sLi9wR8uT_9h-ypOpfyxEKB0WbgzXSVzcYKP5XWGx26mJ6eaSOkOowzRq9-hyQCNg3qw3ATCCAvWDn2z1vQTjN472LF58q3LAtS_ID8r5UFwV2Q",
    ],
    description:
      "Authentic Sandalwood prayer mala set. Sandalwood has a calming fragrance and is traditionally used for meditation and mantra chanting.",
    benefits: [
      "Enhances Meditation",
      "Calming Fragrance",
      "Traditional & Authentic",
      "Perfect for Mantra Japa",
    ],
    howToWear: {
      bestDay: "Any Day",
      bestTime: "During Meditation",
      mantra: "Any Personal Mantra",
    },
    zodiacCompatibility: ["All Zodiac Signs"],
    isLabCertified: false,
  },
  {
    id: "7",
    title: "Blue Sapphire (Neelam) - 3 Carat",
    category: "Gemstones",
    price: "₹45,000",
    originalPrice: "₹55,000",
    discount: "18% OFF",
    rating: 4.9,
    reviews: 67,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAq91xz-778sDK3j6UBQh57k9GuJ_7cxyKB3XsxmzxDgwDJxNv05vT_zvDni7VzQ_DUYJJLrbkdO7Ts3X6KthgX15cMBT5cISv5oOKjLa84O4_RfLBYkxnSsSQp8xDMPD-imQsG3eWzt08JzuBwNwvzH2V77hV1Yy77LhD7kvGPEPw_8n8L4rvoI2JmFHTL3LuSEIF-ZhHZOBjxIr7lUri8gAtP1Tm1_gAJ3soQHJothGwOLANCiopFPlKmv_8srWlMVaC3A9qxMPw",
    ],
    description:
      "Premium Blue Sapphire (Neelam) stone representing Saturn. This powerful gemstone can bring rapid results when suited to the wearer. Lab certified for authenticity.",
    benefits: [
      "Rapid Wealth & Success",
      "Career Advancement",
      "Protection from Enemies",
      "Mental Discipline",
    ],
    howToWear: {
      bestDay: "Saturday",
      bestTime: "Evening",
      mantra: "Om Sham Shanicharaya Namah",
      finger: "Middle Finger",
    },
    zodiacCompatibility: ["Capricorn", "Aquarius"],
    isLabCertified: true,
  },
  {
    id: "8",
    title: "1 Mukhi Rudraksha (Rare)",
    category: "Rudraksha",
    price: "₹21,000",
    rating: 5.0,
    reviews: 34,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBE_gJbHIqIwCJ_AYgMdg8Zb-ietEEQwrJQBUozD1wUC9Bg-0GT2rucpSb3kWB9Xf2rPL5JiwCQoyNQxU5VK6ylCu-sx8Rudb0pPOhSCjPpVf8SBWYTOK63IW32yeFGxepRy6Kne6LjWk_d1OI5b50gM9mNAvbXqYExZ_9jr_vgtmbJsCtiGmqbmiIpsU23LWalqgYqGGkvDf4K4Bn2LHBFcpCaaP10yTS1i43r5e5wf5xpGV-4FpidvORXzo48I2Kq71gmG4MqAR0",
    ],
    description:
      "Extremely rare 1 Mukhi (Ek Mukhi) Rudraksha representing Lord Shiva himself. This is one of the most powerful and sought-after Rudrakshas for spiritual enlightenment.",
    benefits: [
      "Ultimate Spiritual Awakening",
      "Direct Blessing of Lord Shiva",
      "Destroys All Sins",
      "Liberation (Moksha)",
    ],
    howToWear: {
      bestDay: "Monday",
      bestTime: "Brahma Muhurta (Before Sunrise)",
      mantra: "Om Namah Shivaya",
    },
    zodiacCompatibility: ["All Zodiac Signs"],
    isLabCertified: true,
  },
  {
    id: "9",
    title: "Kuber Yantra - Gold Plated",
    category: "Yantras",
    price: "₹1,299",
    originalPrice: "₹1,599",
    discount: "19% OFF",
    rating: 4.6,
    reviews: 178,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAaOhztilxtDhywZKQVB46xOOe0_umQRHRCu8xBi0SBU8eQODvT5sVlWbI5SOpRbSaOtf1hb3cGapRT_LCU1vM48YZ_Hjcvw2WJvRj5ay8K2XGPtfY0G9FOQZXY4Ojjuribr3DCYweSRMw0t3Lwc4I-sXRu9Lj6_7V_ecUj8TMJihVBUtynB80DZIVF8EtR53_--zOzkeGVX9w-zFOwwziPQ4iYOTaqaaq4unevI5XunDjfUNLJBAiLYhmPVYc11hds4l8isajd1D4",
    ],
    description:
      "Gold-plated Kuber Yantra for wealth and prosperity. Lord Kuber is the treasurer of the gods and this yantra helps attract financial abundance.",
    benefits: [
      "Attracts Wealth & Money",
      "Financial Stability",
      "Business Growth",
      "Removes Debts",
    ],
    howToWear: {
      bestDay: "Thursday",
      bestTime: "During Dhanteras or Diwali",
      mantra:
        "Om Shreem Om Hreem Shreem Hreem Kleem Shreem Kleem Vitteshvaraya Namah",
    },
    zodiacCompatibility: ["All Zodiac Signs"],
    isLabCertified: false,
  },
  {
    id: "10",
    title: "Lakshmi Idol - Pure Silver (2 inch)",
    category: "Idols",
    price: "₹5,999",
    rating: 4.8,
    reviews: 45,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuANK88F7rK193pbOq86V-x1QVSXbe2M8TlsX0WMS-9IA9ztRQqunPp4GOhhQLFGOLKtRJ77mxk5H5OLwR_TIVAb0bipVxy-skdLyKGYzMchPTxDvQevGeTYD9F89AljFAijj0IXMNRCabMPe14XMIPnb-7JQekCukK6gBYiyBpSJoKv-p9h0nPWoYkxYkAZBKP8IVhdjSMN79xbZYTcEqwl7zVcgJVX5KGXKonkDgT1gkolHwzWQ4SVdY2J263xA8nFWD-igTO76Vo",
    ],
    description:
      "Beautiful Goddess Lakshmi idol made from pure silver. Maa Lakshmi is the goddess of wealth, fortune, and prosperity. Perfect for your home temple.",
    benefits: [
      "Blesses with Wealth",
      "Brings Good Fortune",
      "Removes Poverty",
      "Harmonizes Home",
    ],
    howToWear: {
      bestDay: "Friday",
      bestTime: "Evening during Lakshmi Puja",
      mantra: "Om Shreem Mahalakshmiyei Namah",
    },
    zodiacCompatibility: ["All Zodiac Signs"],
    isLabCertified: false,
  },
  {
    id: "11",
    title: "Rose Quartz Heart Pendant",
    category: "Crystals",
    price: "₹899",
    originalPrice: "₹1,199",
    discount: "25% OFF",
    rating: 4.3,
    reviews: 234,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAnR-fT8myoNdVGBsF3VFBGizvxVLnnhMV1js0ib5n6sHUdDXKnxWc6sGQ8P6VJiLP2u1tFvBFtdEM9LO56Q6bY5vg7WDsVNFK3T5SqKiE2jYVJU8yzE-QsA1Cui2sRX9KR3xeEJ3lH5cJAfq5OvOcY18iDARISLF0zZC10X-52CwRzdOZXruIstsN5ovyhTJ0Wd93ChcF81-p7bHnYsRAYyUzyUL7iX7vOXdC8x34oXOTQ_aNPBs55nup8NmEi8pL4kxp73jDeJ3I",
    ],
    description:
      "Beautiful Rose Quartz heart-shaped pendant. Rose Quartz is the stone of unconditional love and infinite peace, perfect for attracting love and healing the heart.",
    benefits: [
      "Attracts Love & Romance",
      "Heals Emotional Wounds",
      "Promotes Self-Love",
      "Brings Inner Peace",
    ],
    howToWear: {
      bestDay: "Friday",
      bestTime: "Any Time",
      mantra: "Om Shukraya Namah",
    },
    zodiacCompatibility: ["Taurus", "Libra"],
    isLabCertified: true,
  },
  {
    id: "12",
    title: "Premium Dhoop Sticks (Pack of 50)",
    category: "Incense",
    price: "₹249",
    rating: 4.2,
    reviews: 567,
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgczGTfUL6EEzq4WZtACqh17M-mWDOG6h5vTbyLxR-SO1GgpNcBa_w4Y_EPC21aXMtC1KjvUISz5TRMffrIFBWFHNl0hrxzMVUsCTZdnYyRhpdE9abjbWGNwHLj6h7Z3s5wfbu0IcoKPsT1GYretJuVKjWTu8bCACvWWmMMehnffh0VwbI58AZF9eWTyC35Q3uqR7ce9C7vBFCLEE9XS1woQfGbo4t9aEmQMWbx2IdX6S9StR1QtgYwiAs0oY46YiBtIhpgvuLedY",
    ],
    description:
      "Premium quality dhoop sticks made from natural ingredients. Creates a divine atmosphere perfect for puja, meditation, and spiritual practices.",
    benefits: [
      "Purifies Environment",
      "Creates Divine Atmosphere",
      "Long-Lasting Fragrance",
      "100% Natural Ingredients",
    ],
    howToWear: {
      bestDay: "Any Day",
      bestTime: "During Puja or Meditation",
      mantra: "Om Shanti Shanti Shanti",
    },
    zodiacCompatibility: ["All Zodiac Signs"],
    isLabCertified: false,
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(
  currentId: string,
  limit: number = 4
): Product[] {
  return products.filter((p) => p.id !== currentId).slice(0, limit);
}
