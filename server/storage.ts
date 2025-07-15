import { incidents, newsSources, type Incident, type InsertIncident, type NewsSource, type InsertNewsSource, type IncidentFilter } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, like, gte, lte, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  // Incident operations
  getIncidents(filter?: IncidentFilter): Promise<{ incidents: Incident[]; total: number }>;
  getIncident(id: number): Promise<Incident | undefined>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  updateIncident(id: number, incident: Partial<InsertIncident>): Promise<Incident | undefined>;
  deleteIncident(id: number): Promise<boolean>;
  
  // News source operations
  getNewsSources(): Promise<NewsSource[]>;
  getNewsSource(id: number): Promise<NewsSource | undefined>;
  createNewsSource(source: InsertNewsSource): Promise<NewsSource>;
  
  // Analytics
  getStatistics(filter?: IncidentFilter): Promise<{
    totalIncidents: number;
    totalKilled: number;
    totalInjured: number;
    highSeverityCount: number;
    mediumSeverityCount: number;
    lowSeverityCount: number;
    avgConfidence: number;
  }>;
  
  getChartData(): Promise<{
    partyData: Array<{ name: string; incidents: number; killed: number; injured: number }>;
    timelineData: Array<{ date: string; incidents: number; killed: number; injured: number }>;
    severityData: Array<{ name: string; value: number; color: string }>;
    divisionData: Array<{ name: string; incidents: number }>;
  }>;
}

export class MemStorage implements IStorage {
  private incidents: Map<number, Incident> = new Map();
  private newsSources: Map<number, NewsSource> = new Map();
  private currentIncidentId: number = 1;
  private currentNewsSourceId: number = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed news sources
    const mockNewsSources: Omit<NewsSource, 'id'>[] = [
      { name: 'প্রথম আলো', url: 'prothomalo.com', status: 'active', type: 'national', lastCrawled: '2025-01-15T08:00:00Z', dailyArticles: 1200, reliability: 95 },
      { name: 'বাংলা ট্রিবিউন', url: 'banglatribune.com', status: 'active', type: 'national', lastCrawled: '2025-01-15T08:05:00Z', dailyArticles: 800, reliability: 92 },
      { name: 'যুগান্তর', url: 'jugantor.com', status: 'active', type: 'national', lastCrawled: '2025-01-15T08:10:00Z', dailyArticles: 900, reliability: 90 },
      { name: 'সমকাল', url: 'samakal.com', status: 'active', type: 'national', lastCrawled: '2025-01-15T08:20:00Z', dailyArticles: 950, reliability: 91 },
    ];

    mockNewsSources.forEach(source => {
      const newsSource: NewsSource = { ...source, id: this.currentNewsSourceId++ };
      this.newsSources.set(newsSource.id, newsSource);
    });

    // Seed incidents
    const mockIncidents: Omit<Incident, 'id'>[] = [
      {
        date: '2025-01-15',
        division: 'ঢাকা',
        district: 'ঢাকা',
        upazila: 'ধানমন্ডি',
        policeStation: 'ধানমন্ডি থানা',
        location: 'ঢাকা, ধানমন্ডি, ৩২ নম্বর রোড',
        coordinates: { lat: 23.7465, lng: 90.3768 },
        party: 'বাংলাদেশ আওয়ামী লীগ',
        injured: 8,
        killed: 2,
        description: 'দলীয় কার্যালয়ের সামনে প্রতিপক্ষীয় গ্রুপের পরিকল্পিত আক্রমণে রক্তক্ষয়ী সংঘর্ষ। স্থানীয় নেতাদের মধ্যে ক্ষমতার দ্বন্দ্ব থেকে এই ঘটনার সূত্রপাত।',
        severity: 'high',
        images: ['https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400', 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=400'],
        newsSource: 'প্রথম আলো',
        sourceUrl: 'https://www.prothomalo.com/politics/news-1',
        aiAnalysis: {
          confidence: 0.94,
          keyEntities: ['ধানমন্ডি', 'আওয়ামী লীগ', 'সংঘর্ষ'],
          sentiment: 'very_negative',
          processedAt: '2025-01-15T10:30:00Z',
          extractedInfo: {
            casualties: { killed: 2, injured: 8 },
            locationConfidence: 0.96,
            partyConfidence: 0.92,
            violenceType: 'দলীয় সংঘর্ষ'
          }
        },
        crawledAt: '2025-01-15T09:15:00Z',
        lastUpdated: '2025-01-15T11:00:00Z',
        witnesses: ['স্থানীয় দোকানদার', 'পথচারী'],
        policeResponse: 'ঘটনাস্থলে অতিরিক্ত পুলিশ মোতায়েন',
        tags: ['দলীয় সংঘর্ষ', 'ধানমন্ডি', 'উচ্চ তীব্রতা']
      },
      {
        date: '2025-01-14',
        division: 'চট্টগ্রাম',
        district: 'চট্টগ্রাম',
        upazila: 'পাঁচলাইশ',
        policeStation: 'পাঁচলাইশ থানা',
        location: 'চট্টগ্রাম, পাঁচলাইশ, আগ্রাবাদ সি/এ',
        coordinates: { lat: 22.3569, lng: 91.7832 },
        party: 'বাংলাদেশ জাতীয়তাবাদী দল',
        injured: 12,
        killed: 1,
        description: 'হরতাল সমর্থনে বিএনপির শান্তিপূর্ণ মিছিলে পুলিশের লাঠিচার্জ ও টিয়ার গ্যাস নিক্ষেপে উত্তেজনা বৃদ্ধি।',
        severity: 'high',
        images: ['https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400'],
        newsSource: 'যুগান্তর',
        sourceUrl: 'https://www.jugantor.com/politics/news-2',
        aiAnalysis: {
          confidence: 0.87,
          keyEntities: ['চট্টগ্রাম', 'বিএনপি', 'হরতাল', 'পুলিশ'],
          sentiment: 'very_negative',
          processedAt: '2025-01-14T14:20:00Z',
          extractedInfo: {
            casualties: { killed: 1, injured: 12 },
            locationConfidence: 0.89,
            partyConfidence: 0.95,
            violenceType: 'পুলিশি বাহিনীর সাথে সংঘর্ষ'
          }
        },
        crawledAt: '2025-01-14T13:45:00Z',
        lastUpdated: '2025-01-14T15:30:00Z',
        witnesses: ['সাংবাদিক', 'স্থানীয় ব্যবসায়ী'],
        policeResponse: 'আরও বেশি টিয়ার গ্যাস নিক্ষেপ',
        tags: ['হরতাল', 'পুলিশি সংঘর্ষ', 'চট্টগ্রাম']
      },
      {
        date: '2025-01-13',
        division: 'রাজশাহী',
        district: 'রাজশাহী',
        upazila: 'রাজশাহী সদর',
        policeStation: 'শাহ মখদুম থানা',
        location: 'রাজশাহী, রাজশাহী সদর, শাহেব বাজার',
        coordinates: { lat: 24.3745, lng: 88.6042 },
        party: 'জাতীয় পার্টি',
        injured: 6,
        killed: 0,
        description: 'স্থানীয় নেতাদের মধ্যে দলীয় দ্বন্দ্ব ও ক্ষমতার লড়াইয়ে সংঘর্ষ।',
        severity: 'medium',
        images: ['https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400'],
        newsSource: 'সমকাল',
        sourceUrl: 'https://www.samakal.com/politics/news-3',
        aiAnalysis: {
          confidence: 0.82,
          keyEntities: ['রাজশাহী', 'জাতীয় পার্টি', 'দলীয় দ্বন্দ্ব'],
          sentiment: 'negative',
          processedAt: '2025-01-13T12:30:00Z',
          extractedInfo: {
            casualties: { killed: 0, injured: 6 },
            locationConfidence: 0.85,
            partyConfidence: 0.79,
            violenceType: 'অভ্যন্তরীণ দলীয় সংঘর্ষ'
          }
        },
        crawledAt: '2025-01-13T11:45:00Z',
        lastUpdated: '2025-01-13T13:20:00Z',
        witnesses: ['দলীয় কর্মী', 'স্থানীয় অধিবাসী'],
        policeResponse: 'মধ্যস্থতার চেষ্টা',
        tags: ['দলীয় দ্বন্দ্ব', 'রাজশাহী', 'মধ্যম তীব্রতা']
      },
      {
        date: '2025-01-12',
        division: 'খুলনা',
        district: 'খুলনা',
        upazila: 'দৌলতপুর',
        policeStation: 'দৌলতপুর থানা',
        location: 'খুলনা, দৌলতপুর, আইরন বাজার',
        coordinates: { lat: 22.8456, lng: 89.5403 },
        party: 'বাংলাদেশ জাতীয়তাবাদী দল',
        injured: 18,
        killed: 3,
        description: 'পৌরসভা নির্বাচনে দুই প্রতিদ্বন্দ্বী গ্রুপের মধ্যে প্রাণঘাতী সংঘর্ষ।',
        severity: 'high',
        images: ['https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=400'],
        newsSource: 'বাংলা ট্রিবিউন',
        sourceUrl: 'https://www.banglatribune.com/politics/news-4',
        aiAnalysis: {
          confidence: 0.96,
          keyEntities: ['খুলনা', 'বিএনপি', 'পৌর নির্বাচন', 'ভোট কেন্দ্র'],
          sentiment: 'very_negative',
          processedAt: '2025-01-12T18:20:00Z',
          extractedInfo: {
            casualties: { killed: 3, injured: 18 },
            locationConfidence: 0.97,
            partyConfidence: 0.94,
            violenceType: 'নির্বাচনী সহিংসতা'
          }
        },
        crawledAt: '2025-01-12T17:30:00Z',
        lastUpdated: '2025-01-12T19:45:00Z',
        witnesses: ['নির্বাচন কমিশনের অফিসার', 'ভোটার'],
        policeResponse: 'অতিরিক্ত ইউনিট মোতায়েন',
        tags: ['নির্বাচনী সহিংসতা', 'খুলনা', 'উচ্চ তীব্রতা']
      },
      {
        date: '2025-01-11',
        division: 'বরিশাল',
        district: 'বরিশাল',
        upazila: 'বরিশাল সদর',
        policeStation: 'কোতোয়ালী থানা',
        location: 'বরিশাল, বরিশাল সদর, বন্দর রোড',
        coordinates: { lat: 22.7010, lng: 90.3535 },
        party: 'বাংলাদেশের কমিউনিস্ট পার্টি',
        injured: 7,
        killed: 0,
        description: 'শ্রমিক অধিকার নিয়ে সমাবেশে বিরোধী দলের হামলা ও পুলিশের হস্তক্ষেপ।',
        severity: 'medium',
        images: ['https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400'],
        newsSource: 'মানবজমিন',
        sourceUrl: 'https://www.manabzamin.com/politics/news-5',
        aiAnalysis: {
          confidence: 0.78,
          keyEntities: ['বরিশাল', 'কমিউনিস্ট পার্টি', 'শ্রমিক সমাবেশ'],
          sentiment: 'negative',
          processedAt: '2025-01-11T14:15:00Z',
          extractedInfo: {
            casualties: { killed: 0, injured: 7 },
            locationConfidence: 0.81,
            partyConfidence: 0.75,
            violenceType: 'শ্রমিক আন্দোলন সহিংসতা'
          }
        },
        crawledAt: '2025-01-11T13:20:00Z',
        lastUpdated: '2025-01-11T15:00:00Z',
        witnesses: ['শ্রমিক নেতা', 'ট্রেড ইউনিয়ন কর্মী'],
        policeResponse: 'সমাবেশ ভেঙে দেওয়া',
        tags: ['শ্রমিক আন্দোলন', 'বরিশাল', 'মধ্যম তীব্রতা']
      }
    ];

    mockIncidents.forEach(incident => {
      const newIncident: Incident = { ...incident, id: this.currentIncidentId++ };
      this.incidents.set(newIncident.id, newIncident);
    });
  }

  async getIncidents(filter?: IncidentFilter): Promise<{ incidents: Incident[]; total: number }> {
    let incidents = Array.from(this.incidents.values());
    
    if (filter?.search) {
      const searchTerm = filter.search.toLowerCase();
      incidents = incidents.filter(incident => 
        incident.location.toLowerCase().includes(searchTerm) ||
        incident.description.toLowerCase().includes(searchTerm) ||
        incident.party.toLowerCase().includes(searchTerm) ||
        incident.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    if (filter?.division) {
      incidents = incidents.filter(incident => incident.division === filter.division);
    }
    
    if (filter?.district) {
      incidents = incidents.filter(incident => incident.district === filter.district);
    }
    
    if (filter?.party) {
      incidents = incidents.filter(incident => incident.party === filter.party);
    }
    
    if (filter?.severity && filter.severity.length > 0) {
      incidents = incidents.filter(incident => filter.severity!.includes(incident.severity));
    }
    
    if (filter?.dateFrom) {
      incidents = incidents.filter(incident => incident.date >= filter.dateFrom!);
    }
    
    if (filter?.dateTo) {
      incidents = incidents.filter(incident => incident.date <= filter.dateTo!);
    }
    
    if (filter?.fatalOnly) {
      incidents = incidents.filter(incident => incident.killed > 0);
    }
    
    if (filter?.injuredOnly) {
      incidents = incidents.filter(incident => incident.injured > 0);
    }
    
    // Sort incidents
    const sortBy = filter?.sortBy || 'date';
    incidents.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'severity':
          const severityOrder = { high: 3, medium: 2, low: 1 };
          return severityOrder[b.severity as keyof typeof severityOrder] - severityOrder[a.severity as keyof typeof severityOrder];
        case 'casualties':
          return (b.killed + b.injured) - (a.killed + a.injured);
        default:
          return 0;
      }
    });
    
    const total = incidents.length;
    const page = filter?.page || 1;
    const limit = filter?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return { incidents: incidents.slice(start, end), total };
  }

  async getIncident(id: number): Promise<Incident | undefined> {
    return this.incidents.get(id);
  }

  async createIncident(incident: InsertIncident): Promise<Incident> {
    const newIncident: Incident = {
      ...incident,
      id: this.currentIncidentId++,
      crawledAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      injured: incident.injured || 0,
      killed: incident.killed || 0,
      images: Array.isArray(incident.images) ? incident.images : [],
      witnesses: Array.isArray(incident.witnesses) ? incident.witnesses : [],
      tags: Array.isArray(incident.tags) ? incident.tags : []
    };
    this.incidents.set(newIncident.id, newIncident);
    return newIncident;
  }

  async updateIncident(id: number, incident: Partial<InsertIncident>): Promise<Incident | undefined> {
    const existing = this.incidents.get(id);
    if (!existing) return undefined;
    
    const updated: Incident = {
      ...existing,
      ...incident,
      lastUpdated: new Date().toISOString(),
      images: Array.isArray(incident.images) ? incident.images : existing.images,
      witnesses: Array.isArray(incident.witnesses) ? incident.witnesses : existing.witnesses,
      tags: Array.isArray(incident.tags) ? incident.tags : existing.tags
    };
    this.incidents.set(id, updated);
    return updated;
  }

  async deleteIncident(id: number): Promise<boolean> {
    return this.incidents.delete(id);
  }

  async getNewsSources(): Promise<NewsSource[]> {
    return Array.from(this.newsSources.values());
  }

  async getNewsSource(id: number): Promise<NewsSource | undefined> {
    return this.newsSources.get(id);
  }

  async createNewsSource(source: InsertNewsSource): Promise<NewsSource> {
    const newSource: NewsSource = {
      ...source,
      id: this.currentNewsSourceId++,
      dailyArticles: source.dailyArticles || 0,
      reliability: source.reliability || 0
    };
    this.newsSources.set(newSource.id, newSource);
    return newSource;
  }

  async getStatistics(filter?: IncidentFilter): Promise<{
    totalIncidents: number;
    totalKilled: number;
    totalInjured: number;
    highSeverityCount: number;
    mediumSeverityCount: number;
    lowSeverityCount: number;
    avgConfidence: number;
  }> {
    const { incidents } = await this.getIncidents(filter);
    
    const totalIncidents = incidents.length;
    const totalKilled = incidents.reduce((sum, incident) => sum + incident.killed, 0);
    const totalInjured = incidents.reduce((sum, incident) => sum + incident.injured, 0);
    const highSeverityCount = incidents.filter(i => i.severity === 'high').length;
    const mediumSeverityCount = incidents.filter(i => i.severity === 'medium').length;
    const lowSeverityCount = incidents.filter(i => i.severity === 'low').length;
    const avgConfidence = incidents.length > 0 ? incidents.reduce((sum, incident) => sum + incident.aiAnalysis.confidence, 0) / incidents.length : 0;
    
    return {
      totalIncidents,
      totalKilled,
      totalInjured,
      highSeverityCount,
      mediumSeverityCount,
      lowSeverityCount,
      avgConfidence
    };
  }

  async getChartData(): Promise<{
    partyData: Array<{ name: string; incidents: number; killed: number; injured: number }>;
    timelineData: Array<{ date: string; incidents: number; killed: number; injured: number }>;
    severityData: Array<{ name: string; value: number; color: string }>;
    divisionData: Array<{ name: string; incidents: number }>;
  }> {
    const allIncidents = Array.from(this.incidents.values());
    
    // Party data
    const partyMap = new Map<string, { incidents: number; killed: number; injured: number }>();
    allIncidents.forEach(incident => {
      const existing = partyMap.get(incident.party) || { incidents: 0, killed: 0, injured: 0 };
      partyMap.set(incident.party, {
        incidents: existing.incidents + 1,
        killed: existing.killed + incident.killed,
        injured: existing.injured + incident.injured
      });
    });
    
    const partyData = Array.from(partyMap.entries()).map(([party, data]) => ({
      name: party.length > 20 ? party.substring(0, 20) + '...' : party,
      ...data
    })).sort((a, b) => b.incidents - a.incidents);
    
    // Timeline data
    const timelineMap = new Map<string, { incidents: number; killed: number; injured: number }>();
    allIncidents.forEach(incident => {
      const existing = timelineMap.get(incident.date) || { incidents: 0, killed: 0, injured: 0 };
      timelineMap.set(incident.date, {
        incidents: existing.incidents + 1,
        killed: existing.killed + incident.killed,
        injured: existing.injured + incident.injured
      });
    });
    
    const timelineData = Array.from(timelineMap.entries()).map(([date, data]) => ({
      date,
      ...data
    })).sort((a, b) => a.date.localeCompare(b.date));
    
    // Severity data
    const highCount = allIncidents.filter(i => i.severity === 'high').length;
    const mediumCount = allIncidents.filter(i => i.severity === 'medium').length;
    const lowCount = allIncidents.filter(i => i.severity === 'low').length;
    
    const severityData = [
      { name: 'উচ্চ', value: highCount, color: '#dc2626' },
      { name: 'মধ্যম', value: mediumCount, color: '#f97316' },
      { name: 'নিম্ন', value: lowCount, color: '#16a34a' }
    ];
    
    // Division data
    const divisionMap = new Map<string, number>();
    allIncidents.forEach(incident => {
      const existing = divisionMap.get(incident.division) || 0;
      divisionMap.set(incident.division, existing + 1);
    });
    
    const divisionData = Array.from(divisionMap.entries()).map(([division, incidents]) => ({
      name: division,
      incidents
    })).sort((a, b) => b.incidents - a.incidents);
    
    return {
      partyData,
      timelineData,
      severityData,
      divisionData
    };
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getIncidents(filter?: IncidentFilter): Promise<{ incidents: Incident[]; total: number }> {
    let query = db.select().from(incidents);
    const conditions = [];

    if (filter?.search) {
      conditions.push(or(
        like(incidents.description, `%${filter.search}%`),
        like(incidents.location, `%${filter.search}%`),
        like(incidents.party, `%${filter.search}%`)
      ));
    }

    if (filter?.division) {
      conditions.push(eq(incidents.division, filter.division));
    }

    if (filter?.district) {
      conditions.push(eq(incidents.district, filter.district));
    }

    if (filter?.party) {
      conditions.push(eq(incidents.party, filter.party));
    }

    if (filter?.severity && filter.severity.length > 0) {
      conditions.push(sql`${incidents.severity} IN ${filter.severity}`);
    }

    if (filter?.dateFrom) {
      conditions.push(gte(incidents.date, filter.dateFrom));
    }

    if (filter?.dateTo) {
      conditions.push(lte(incidents.date, filter.dateTo));
    }

    if (filter?.fatalOnly) {
      conditions.push(sql`${incidents.killed} > 0`);
    }

    if (filter?.injuredOnly) {
      conditions.push(sql`${incidents.injured} > 0`);
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    if (filter?.sortBy === 'date') {
      query = query.orderBy(desc(incidents.date));
    } else if (filter?.sortBy === 'severity') {
      query = query.orderBy(desc(incidents.severity));
    } else if (filter?.sortBy === 'casualties') {
      query = query.orderBy(desc(sql`${incidents.killed} + ${incidents.injured}`));
    } else {
      query = query.orderBy(desc(incidents.date));
    }

    const page = filter?.page || 1;
    const limit = filter?.limit || 20;
    const offset = (page - 1) * limit;

    const [results, totalCount] = await Promise.all([
      query.limit(limit).offset(offset),
      db.select({ count: sql`COUNT(*)` }).from(incidents).where(conditions.length > 0 ? and(...conditions) : undefined)
    ]);

    return {
      incidents: results,
      total: Number(totalCount[0]?.count) || 0
    };
  }

  async getIncident(id: number): Promise<Incident | undefined> {
    const [incident] = await db.select().from(incidents).where(eq(incidents.id, id));
    return incident;
  }

  async createIncident(incident: InsertIncident): Promise<Incident> {
    const [newIncident] = await db.insert(incidents).values(incident).returning();
    return newIncident;
  }

  async updateIncident(id: number, incident: Partial<InsertIncident>): Promise<Incident | undefined> {
    const [updated] = await db.update(incidents).set(incident).where(eq(incidents.id, id)).returning();
    return updated;
  }

  async deleteIncident(id: number): Promise<boolean> {
    const result = await db.delete(incidents).where(eq(incidents.id, id));
    return result.rowCount > 0;
  }

  async getNewsSources(): Promise<NewsSource[]> {
    return await db.select().from(newsSources);
  }

  async getNewsSource(id: number): Promise<NewsSource | undefined> {
    const [source] = await db.select().from(newsSources).where(eq(newsSources.id, id));
    return source;
  }

  async createNewsSource(source: InsertNewsSource): Promise<NewsSource> {
    const [newSource] = await db.insert(newsSources).values(source).returning();
    return newSource;
  }

  async getStatistics(filter?: IncidentFilter): Promise<{
    totalIncidents: number;
    totalKilled: number;
    totalInjured: number;
    highSeverityCount: number;
    mediumSeverityCount: number;
    lowSeverityCount: number;
    avgConfidence: number;
  }> {
    const { incidents: filteredIncidents } = await this.getIncidents(filter);
    
    const totalIncidents = filteredIncidents.length;
    const totalKilled = filteredIncidents.reduce((sum, incident) => sum + incident.killed, 0);
    const totalInjured = filteredIncidents.reduce((sum, incident) => sum + incident.injured, 0);
    const highSeverityCount = filteredIncidents.filter(i => i.severity === 'high').length;
    const mediumSeverityCount = filteredIncidents.filter(i => i.severity === 'medium').length;
    const lowSeverityCount = filteredIncidents.filter(i => i.severity === 'low').length;
    const avgConfidence = filteredIncidents.length > 0 ? filteredIncidents.reduce((sum, incident) => sum + incident.aiAnalysis.confidence, 0) / filteredIncidents.length : 0;
    
    return {
      totalIncidents,
      totalKilled,
      totalInjured,
      highSeverityCount,
      mediumSeverityCount,
      lowSeverityCount,
      avgConfidence
    };
  }

  async getChartData(): Promise<{
    partyData: Array<{ name: string; incidents: number; killed: number; injured: number }>;
    timelineData: Array<{ date: string; incidents: number; killed: number; injured: number }>;
    severityData: Array<{ name: string; value: number; color: string }>;
    divisionData: Array<{ name: string; incidents: number }>;
  }> {
    const allIncidents = await db.select().from(incidents);
    
    // Party data
    const partyMap = new Map<string, { incidents: number; killed: number; injured: number }>();
    allIncidents.forEach(incident => {
      const existing = partyMap.get(incident.party) || { incidents: 0, killed: 0, injured: 0 };
      partyMap.set(incident.party, {
        incidents: existing.incidents + 1,
        killed: existing.killed + incident.killed,
        injured: existing.injured + incident.injured
      });
    });
    
    const partyData = Array.from(partyMap.entries()).map(([party, data]) => ({
      name: party.length > 20 ? party.substring(0, 20) + '...' : party,
      ...data
    })).sort((a, b) => b.incidents - a.incidents);
    
    // Timeline data
    const timelineMap = new Map<string, { incidents: number; killed: number; injured: number }>();
    allIncidents.forEach(incident => {
      const existing = timelineMap.get(incident.date) || { incidents: 0, killed: 0, injured: 0 };
      timelineMap.set(incident.date, {
        incidents: existing.incidents + 1,
        killed: existing.killed + incident.killed,
        injured: existing.injured + incident.injured
      });
    });
    
    const timelineData = Array.from(timelineMap.entries()).map(([date, data]) => ({
      date,
      ...data
    })).sort((a, b) => a.date.localeCompare(b.date));
    
    // Severity data
    const highCount = allIncidents.filter(i => i.severity === 'high').length;
    const mediumCount = allIncidents.filter(i => i.severity === 'medium').length;
    const lowCount = allIncidents.filter(i => i.severity === 'low').length;
    
    const severityData = [
      { name: 'উচ্চ', value: highCount, color: '#dc2626' },
      { name: 'মধ্যম', value: mediumCount, color: '#f97316' },
      { name: 'নিম্ন', value: lowCount, color: '#16a34a' }
    ];
    
    // Division data
    const divisionMap = new Map<string, number>();
    allIncidents.forEach(incident => {
      const existing = divisionMap.get(incident.division) || 0;
      divisionMap.set(incident.division, existing + 1);
    });
    
    const divisionData = Array.from(divisionMap.entries()).map(([division, incidents]) => ({
      name: division,
      incidents
    })).sort((a, b) => b.incidents - a.incidents);
    
    return {
      partyData,
      timelineData,
      severityData,
      divisionData
    };
  }
}

export const storage = new MemStorage();
