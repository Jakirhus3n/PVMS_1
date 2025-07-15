import { db } from "./db";
import { incidents, newsSources } from "@shared/schema";

async function seedDatabase() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(incidents);
  await db.delete(newsSources);

  // Seed news sources
  const newsSourcesData = [
    {
      name: 'প্রথম আলো',
      url: 'prothomalo.com',
      status: 'active',
      type: 'national',
      lastCrawled: '2025-01-15T08:00:00Z',
      dailyArticles: 1200,
      reliability: 95
    },
    {
      name: 'বাংলা ট্রিবিউন',
      url: 'banglatribune.com',
      status: 'active',
      type: 'national',
      lastCrawled: '2025-01-15T08:05:00Z',
      dailyArticles: 800,
      reliability: 92
    },
    {
      name: 'যুগান্তর',
      url: 'jugantor.com',
      status: 'active',
      type: 'national',
      lastCrawled: '2025-01-15T08:10:00Z',
      dailyArticles: 900,
      reliability: 90
    },
    {
      name: 'সমকাল',
      url: 'samakal.com',
      status: 'active',
      type: 'national',
      lastCrawled: '2025-01-15T08:20:00Z',
      dailyArticles: 950,
      reliability: 91
    }
  ];

  await db.insert(newsSources).values(newsSourcesData);

  // Seed incidents
  const incidentsData = [
    {
      description: 'ঢাকা বিশ্ববিদ্যালয় ক্যাম্পাসে রাজনৈতিক সংঘর্ষে ৫ জন আহত',
      location: 'ঢাকা বিশ্ববিদ্যালয়',
      date: '2025-01-10',
      division: 'ঢাকা',
      district: 'ঢাকা',
      upazila: 'ঢাকা সদর',
      policeStation: 'শাহবাগ',
      coordinates: { lat: 23.7279, lng: 90.3981 },
      party: 'বাংলাদেশ আওয়ামী লীগ',
      injured: 5,
      killed: 0,
      severity: 'medium' as const,
      sourceUrl: 'https://prothomalo.com/example',
      crawledAt: '2025-01-15T10:00:00Z',
      lastUpdated: '2025-01-15T10:00:00Z',
      aiAnalysis: {
        confidence: 85,
        keyEntities: ['ঢাকা বিশ্ববিদ্যালয়', 'রাজনৈতিক সংঘর্ষ', 'আহত'],
        sentiment: 'negative',
        processedAt: '2025-01-15T10:05:00Z',
        extractedInfo: {
          casualties: { killed: 0, injured: 5 },
          locationConfidence: 95,
          partyConfidence: 80,
          violenceType: 'political_clash'
        }
      },
      images: ['https://example.com/image1.jpg'],
      witnesses: ['সাংবাদিক মোঃ আলী', 'প্রত্যক্ষদর্শী সালমা খাতুন'],
      tags: ['বিশ্ববিদ্যালয়', 'রাজনৈতিক', 'সংঘর্ষ']
    },
    {
      description: 'চট্টগ্রামে নির্বাচনী প্রচারণা সহিংসতায় ২ জনের মৃত্যু',
      location: 'চট্টগ্রাম শহর',
      date: '2025-01-08',
      division: 'চট্টগ্রাম',
      district: 'চট্টগ্রাম',
      upazila: 'চট্টগ্রাম সদর',
      policeStation: 'কোতোয়ালী',
      coordinates: { lat: 22.3569, lng: 91.7832 },
      party: 'বাংলাদেশ জাতীয়তাবাদী দল',
      injured: 8,
      killed: 2,
      severity: 'high' as const,
      sourceUrl: 'https://banglatribune.com/example',
      crawledAt: '2025-01-15T09:30:00Z',
      lastUpdated: '2025-01-15T09:30:00Z',
      aiAnalysis: {
        confidence: 92,
        keyEntities: ['চট্টগ্রাম', 'নির্বাচনী প্রচারণা', 'মৃত্যু'],
        sentiment: 'very_negative',
        processedAt: '2025-01-15T09:35:00Z',
        extractedInfo: {
          casualties: { killed: 2, injured: 8 },
          locationConfidence: 98,
          partyConfidence: 85,
          violenceType: 'electoral_violence'
        }
      },
      images: ['https://example.com/image2.jpg', 'https://example.com/image3.jpg'],
      witnesses: ['স্থানীয় নেতা আবদুল করিম', 'পুলিশ কর্মকর্তা সাইফুল ইসলাম'],
      tags: ['নির্বাচন', 'প্রচারণা', 'মৃত্যু']
    },
    {
      description: 'সিলেটে দলীয় কর্মীদের মধ্যে সংঘর্ষে ৩ জন আহত',
      location: 'সিলেট শহর',
      date: '2025-01-12',
      division: 'সিলেট',
      district: 'সিলেট',
      upazila: 'সিলেট সদর',
      policeStation: 'সিলেট সদর',
      coordinates: { lat: 24.8949, lng: 91.8687 },
      party: 'জাতীয় পার্টি',
      injured: 3,
      killed: 0,
      severity: 'low' as const,
      sourceUrl: 'https://jugantor.com/example',
      crawledAt: '2025-01-15T11:00:00Z',
      lastUpdated: '2025-01-15T11:00:00Z',
      aiAnalysis: {
        confidence: 78,
        keyEntities: ['সিলেট', 'দলীয় কর্মী', 'সংঘর্ষ'],
        sentiment: 'negative',
        processedAt: '2025-01-15T11:05:00Z',
        extractedInfo: {
          casualties: { killed: 0, injured: 3 },
          locationConfidence: 90,
          partyConfidence: 75,
          violenceType: 'intra_party_conflict'
        }
      },
      images: [],
      witnesses: ['স্থানীয় দোকানদার রহিম উদ্দিন'],
      tags: ['দলীয়', 'কর্মী', 'সংঘর্ষ']
    },
    {
      description: 'রংপুরে মিছিল চলাকালে পুলিশের সাথে সংঘর্ষে ১০ জন আহত',
      location: 'রংপুর শহর',
      date: '2025-01-14',
      division: 'রংপুর',
      district: 'রংপুর',
      upazila: 'রংপুর সদর',
      policeStation: 'রংপুর সদর',
      coordinates: { lat: 25.7439, lng: 89.2752 },
      party: 'বাংলাদেশ জামায়াতে ইসলামী',
      injured: 10,
      killed: 0,
      severity: 'medium' as const,
      sourceUrl: 'https://samakal.com/example',
      crawledAt: '2025-01-15T12:00:00Z',
      lastUpdated: '2025-01-15T12:00:00Z',
      aiAnalysis: {
        confidence: 88,
        keyEntities: ['রংপুর', 'মিছিল', 'পুলিশ', 'সংঘর্ষ'],
        sentiment: 'negative',
        processedAt: '2025-01-15T12:05:00Z',
        extractedInfo: {
          casualties: { killed: 0, injured: 10 },
          locationConfidence: 92,
          partyConfidence: 82,
          violenceType: 'protest_violence'
        }
      },
      images: ['https://example.com/image4.jpg'],
      witnesses: ['সাংবাদিক নাসির উদ্দিন', 'প্রত্যক্ষদর্শী ফাতেমা বেগম'],
      tags: ['মিছিল', 'পুলিশ', 'সংঘর্ষ']
    }
  ];

  await db.insert(incidents).values(incidentsData);

  console.log("Database seeded successfully!");
}

if (require.main === module) {
  seedDatabase().catch(console.error);
}

export { seedDatabase };