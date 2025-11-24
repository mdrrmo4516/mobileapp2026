import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertIncidentSchema, insertGoBagItemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Initialize default data
  await storage.initializeGoBagItems();
  await storage.initializeEvacuationCenters();

  // Incident Routes
  app.post("/api/incidents", async (req, res) => {
    try {
      const incident = insertIncidentSchema.parse(req.body);
      const newIncident = await storage.createIncident(incident);
      res.json(newIncident);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create incident" });
    }
  });

  app.get("/api/incidents", async (req, res) => {
    try {
      const incidents = await storage.getIncidents();
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch incidents" });
    }
  });

  // Go Bag Routes
  app.get("/api/go-bag-items", async (req, res) => {
    try {
      const items = await storage.getGoBagItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch go bag items" });
    }
  });

  app.patch("/api/go-bag-items/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { checked } = req.body;
      if (typeof checked !== "boolean") {
        return res.status(400).json({ error: "checked must be a boolean" });
      }
      const item = await storage.updateGoBagItem(id, checked);
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to update item" });
    }
  });

  // Evacuation Centers Routes
  app.get("/api/evacuation-centers", async (req, res) => {
    try {
      const centers = await storage.getEvacuationCenters();
      res.json(centers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch evacuation centers" });
    }
  });

  app.patch("/api/evacuation-centers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      if (!status || typeof status !== "string") {
        return res.status(400).json({ error: "status is required" });
      }
      const center = await storage.updateEvacuationCenter(id, status);
      res.json(center);
    } catch (error) {
      res.status(500).json({ error: "Failed to update evacuation center" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
