import { 
  type User, 
  type InsertUser,
  type Incident,
  type InsertIncident,
  type GoBagItem,
  type InsertGoBagItem,
  type EvacuationCenter,
  type InsertEvacuationCenter,
  users,
  incidents,
  goBagItems,
  evacuationCenters
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createIncident(incident: InsertIncident): Promise<Incident>;
  getIncidents(): Promise<Incident[]>;
  
  getGoBagItems(): Promise<GoBagItem[]>;
  updateGoBagItem(id: number, checked: boolean): Promise<GoBagItem>;
  initializeGoBagItems(): Promise<void>;
  
  getEvacuationCenters(): Promise<EvacuationCenter[]>;
  updateEvacuationCenter(id: number, status: string): Promise<EvacuationCenter>;
  initializeEvacuationCenters(): Promise<void>;
}

export class DBStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createIncident(incident: InsertIncident): Promise<Incident> {
    const [newIncident] = await db.insert(incidents).values(incident).returning();
    return newIncident;
  }

  async getIncidents(): Promise<Incident[]> {
    return await db.select().from(incidents).orderBy(incidents.reportedAt);
  }

  async getGoBagItems(): Promise<GoBagItem[]> {
    return await db.select().from(goBagItems);
  }

  async updateGoBagItem(id: number, checked: boolean): Promise<GoBagItem> {
    const [item] = await db
      .update(goBagItems)
      .set({ checked })
      .where(eq(goBagItems.id, id))
      .returning();
    return item;
  }

  async initializeGoBagItems(): Promise<void> {
    const existingItems = await db.select().from(goBagItems);
    if (existingItems.length === 0) {
      await db.insert(goBagItems).values([
        { category: "Essentials", name: "Water (1 gallon/person)", checked: false },
        { category: "Essentials", name: "Non-perishable Food", checked: false },
        { category: "Essentials", name: "Flashlight & Batteries", checked: false },
        { category: "First Aid", name: "Bandages & Antiseptic", checked: false },
        { category: "First Aid", name: "Prescription Meds", checked: false },
        { category: "Documents", name: "ID & Important Papers", checked: false },
        { category: "Documents", name: "Cash & Coins", checked: false },
        { category: "Clothing", name: "Rain Jacket / Poncho", checked: false },
        { category: "Clothing", name: "Extra Clothes", checked: false },
      ]);
    }
  }

  async getEvacuationCenters(): Promise<EvacuationCenter[]> {
    return await db.select().from(evacuationCenters);
  }

  async updateEvacuationCenter(id: number, status: string): Promise<EvacuationCenter> {
    const [center] = await db
      .update(evacuationCenters)
      .set({ status })
      .where(eq(evacuationCenters.id, id))
      .returning();
    return center;
  }

  async initializeEvacuationCenters(): Promise<void> {
    const existingCenters = await db.select().from(evacuationCenters);
    if (existingCenters.length === 0) {
      await db.insert(evacuationCenters).values([
        { 
          name: "Pio Duran Central School", 
          distance: "0.5 km", 
          capacity: "500 pax", 
          status: "Open",
          latitude: "13.0345",
          longitude: "123.4567"
        },
        { 
          name: "Municipal Gymnasium", 
          distance: "1.2 km", 
          capacity: "1000 pax", 
          status: "Open",
          latitude: "13.0355",
          longitude: "123.4577"
        },
        { 
          name: "Barangay Hall Shelter", 
          distance: "2.5 km", 
          capacity: "200 pax", 
          status: "Full",
          latitude: "13.0365",
          longitude: "123.4587"
        },
      ]);
    }
  }
}

export const storage = new DBStorage();
