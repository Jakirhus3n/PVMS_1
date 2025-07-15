import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { filterSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get incidents with filtering
  app.get("/api/incidents", async (req, res) => {
    try {
      const filter = filterSchema.parse(req.query);
      const result = await storage.getIncidents(filter);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid filter parameters" });
    }
  });

  // Get single incident
  app.get("/api/incidents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const incident = await storage.getIncident(id);
      if (!incident) {
        return res.status(404).json({ error: "Incident not found" });
      }
      res.json(incident);
    } catch (error) {
      res.status(400).json({ error: "Invalid incident ID" });
    }
  });

  // Get statistics
  app.get("/api/statistics", async (req, res) => {
    try {
      const filter = filterSchema.parse(req.query);
      const stats = await storage.getStatistics(filter);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ error: "Invalid filter parameters" });
    }
  });

  // Get chart data
  app.get("/api/charts", async (req, res) => {
    try {
      const data = await storage.getChartData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chart data" });
    }
  });

  // Get news sources
  app.get("/api/news-sources", async (req, res) => {
    try {
      const sources = await storage.getNewsSources();
      res.json(sources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch news sources" });
    }
  });

  // Export incidents
  app.get("/api/export", async (req, res) => {
    try {
      const filter = filterSchema.parse(req.query);
      const { incidents } = await storage.getIncidents(filter);
      
      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="incidents.csv"');
      
      // Generate CSV
      const csvHeaders = [
        'ID', 'Date', 'Division', 'District', 'Location', 'Party', 'Killed', 'Injured', 
        'Severity', 'Description', 'News Source', 'AI Confidence'
      ];
      
      const csvRows = incidents.map(incident => [
        incident.id,
        incident.date,
        incident.division,
        incident.district,
        incident.location,
        incident.party,
        incident.killed,
        incident.injured,
        incident.severity,
        `"${incident.description.replace(/"/g, '""')}"`,
        incident.newsSource,
        Math.round(incident.aiAnalysis.confidence * 100)
      ]);
      
      const csvContent = [csvHeaders, ...csvRows].map(row => row.join(',')).join('\n');
      res.send(csvContent);
    } catch (error) {
      res.status(400).json({ error: "Export failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
