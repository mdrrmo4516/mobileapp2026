import { 
  type User, 
  type InsertUser,
  type Incident,
  type InsertIncident,
  type GoBagItem,
  type InsertGoBagItem,
  type EvacuationCenter,
  type InsertEvacuationCenter,
  type Household,
  type InsertHousehold,
  type Member,
  type InsertMember,
  type CheckIn,
  type InsertCheckIn,
  type HazardZone,
  type InsertHazardZone,
  type Poi,
  type InsertPoi,
  users,
  incidents,
  goBagItems,
  evacuationCenters,
  households,
  members,
  checkIns,
  hazardZones,
  pois
} from "@shared/schema";
import { db, isSqliteFallback, sqliteDatabase } from "./db";
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
  
  getHouseholds(): Promise<Household[]>;
  createHousehold(household: InsertHousehold): Promise<Household>;
  initializeHouseholds(): Promise<void>;
  
  getMembers(householdId: number): Promise<Member[]>;
  createMember(member: InsertMember): Promise<Member>;
  updateMemberStatus(id: number, status: string, location?: string): Promise<Member>;
  initializeMembers(): Promise<void>;
  
  getCheckIns(memberId: number): Promise<CheckIn[]>;
  createCheckIn(checkIn: InsertCheckIn): Promise<CheckIn>;
  
  getHazardZones(): Promise<HazardZone[]>;
  initializeHazardZones(): Promise<void>;
  
  getPois(type?: string): Promise<Poi[]>;
  initializePois(): Promise<void>;
}

export class DBStorage implements IStorage {
  private adaptForSqlite(row: Record<string, any>) {
    if (!isSqliteFallback) return row;
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(row)) {
      if (v === true) out[k] = 1;
      else if (v === false) out[k] = 0;
      else if (Array.isArray(v)) out[k] = JSON.stringify(v);
      else out[k] = v;
    }
    return out;
  }

  private adaptArrayForSqlite(rows: Record<string, any>[]) {
    if (!isSqliteFallback) return rows;
    return rows.map(r => this.adaptForSqlite(r));
  }

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
      const items = [
        { category: "Essentials", name: "Water (1 gallon/person)", checked: false },
        { category: "Essentials", name: "Non-perishable Food", checked: false },
        { category: "Essentials", name: "Flashlight & Batteries", checked: false },
        { category: "First Aid", name: "Bandages & Antiseptic", checked: false },
        { category: "First Aid", name: "Prescription Meds", checked: false },
        { category: "Documents", name: "ID & Important Papers", checked: false },
        { category: "Documents", name: "Cash & Coins", checked: false },
        { category: "Clothing", name: "Rain Jacket / Poncho", checked: false },
        { category: "Clothing", name: "Extra Clothes", checked: false },
      ];
      console.log('init goBag items', items);
      await db.insert(goBagItems).values(this.adaptArrayForSqlite(items));
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
      const centers = [
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
      ];
      console.log('init evacuation centers', centers);
      await db.insert(evacuationCenters).values(this.adaptArrayForSqlite(centers));
    }
  }

  async getHouseholds(): Promise<Household[]> {
    return await db.select().from(households);
  }

  async createHousehold(household: InsertHousehold): Promise<Household> {
    const [newHousehold] = await db.insert(households).values(household).returning();
    return newHousehold;
  }

  async initializeHouseholds(): Promise<void> {
    const existing = await db.select().from(households);
    if (existing.length === 0) {
      const householdsToInsert = [
        { name: "Sample Household", address: "123 Main Street, Pio Duran, Albay" }
      ];
      console.log('init households', householdsToInsert);
      await db.insert(households).values(this.adaptArrayForSqlite(householdsToInsert));
    }
  }

  async getMembers(householdId: number): Promise<Member[]> {
    return await db.select().from(members).where(eq(members.householdId, householdId));
  }

  async createMember(member: InsertMember): Promise<Member> {
    const [newMember] = await db.insert(members).values(member).returning();
    return newMember;
  }

  async updateMemberStatus(id: number, status: string, location?: string): Promise<Member> {
    const updateData: any = { status };
    if (location) {
      updateData.lastKnownLocation = location;
    }
    const [updated] = await db
      .update(members)
      .set(updateData)
      .where(eq(members.id, id))
      .returning();
    return updated;
  }

  async initializeMembers(): Promise<void> {
    const existing = await db.select().from(members);
    if (existing.length === 0) {
      const membersToInsert = [
        { householdId: 1, name: "You", contact: "+63 912 345 6789", status: "unknown" },
        { householdId: 1, name: "Maria Santos", contact: "+63 912 345 6780", status: "unknown" },
        { householdId: 1, name: "Juan Dela Cruz", contact: "+63 912 345 6781", status: "unknown" },
        { householdId: 1, name: "Rosa Cruz", contact: "+63 912 345 6782", status: "unknown" }
      ];
      console.log('init members', membersToInsert);
      await db.insert(members).values(this.adaptArrayForSqlite(membersToInsert));
    }
  }

  async getCheckIns(memberId: number): Promise<CheckIn[]> {
    return await db.select().from(checkIns).where(eq(checkIns.memberId, memberId));
  }

  async createCheckIn(checkIn: InsertCheckIn): Promise<CheckIn> {
    const [newCheckIn] = await db.insert(checkIns).values(checkIn).returning();
    return newCheckIn;
  }

  async getHazardZones(): Promise<HazardZone[]> {
    const rows = await db.select().from(hazardZones);
    if (isSqliteFallback) {
      // coordinates may be stored as JSON string (or already parsed) in SQLite — normalize to array
      return rows.map(r => {
        const coordsRaw = (r as any).coordinates;
        let coords: string[] = [];
        if (typeof coordsRaw === "string") {
          try {
            coords = JSON.parse(coordsRaw);
          } catch (e) {
            coords = [];
          }
        } else if (Array.isArray(coordsRaw)) {
          coords = coordsRaw;
        }
        return { ...r, coordinates: coords } as HazardZone;
      });
    }

    return rows;
  }

  async initializeHazardZones(): Promise<void> {
    const existing = await db.select().from(hazardZones);
    if (existing.length === 0) {
      const zones = [
        {
          name: "Bicol River Flood Zone",
          type: "flood",
          coordinates: isSqliteFallback ? JSON.stringify(["13.0300,123.4500", "13.0320,123.4520", "13.0310,123.4540"]) : ["13.0300,123.4500", "13.0320,123.4520", "13.0310,123.4540"],
          severity: "high"
        },
        {
          name: "Mt. Mayon Landslide Area",
          type: "landslide",
          coordinates: isSqliteFallback ? JSON.stringify(["13.0400,123.4600", "13.0420,123.4620", "13.0410,123.4640"]) : ["13.0400,123.4600", "13.0420,123.4620", "13.0410,123.4640"],
          severity: "medium"
        },
      ];
      console.log('init hazard zones', zones);
      if (isSqliteFallback && sqliteDatabase) {
        const stmt = sqliteDatabase.prepare('INSERT INTO hazard_zones (name, type, coordinates, severity) VALUES (?, ?, ?, ?)');
        for (const z of zones) {
          stmt.run(z.name, z.type, z.coordinates, z.severity);
        }
      } else {
        await db.insert(hazardZones).values(this.adaptArrayForSqlite(zones));
      }
    }
  }

  async getPois(type?: string): Promise<Poi[]> {
    if (type) {
      return await db.select().from(pois).where(eq(pois.type, type));
    }
    return await db.select().from(pois);
  }

  async initializePois(): Promise<void> {
    const existing = await db.select().from(pois);
    if (existing.length === 0) {
      const poisToInsert = [
        {
          name: "Pio Duran Health Center",
          type: "medical",
          latitude: "13.0350",
          longitude: "123.4570",
          address: "Main Street, Pio Duran",
          available: true
        },
        {
          name: "Municipal Charging Station",
          type: "charging",
          latitude: "13.0360",
          longitude: "123.4580",
          address: "Town Plaza",
          available: true
        },
        {
          name: "Barangay Pet Shelter",
          type: "pet-shelter",
          latitude: "13.0370",
          longitude: "123.4590",
          address: "Barangay Hall Compound",
          available: true
        },
      ];
      console.log('init pois', poisToInsert);
      await db.insert(pois).values(this.adaptArrayForSqlite(poisToInsert));
    }
  }
}

export const storage = new DBStorage();
