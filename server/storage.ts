import { type User, type InsertUser, type Campaign, type InsertCampaign, type Contact, type InsertContact, type EmailTemplate, type InsertEmailTemplate, type CampaignContact } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Campaigns
  getCampaign(id: string): Promise<Campaign | undefined>;
  getCampaigns(): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined>;
  deleteCampaign(id: string): Promise<boolean>;
  
  // Contacts
  getContact(id: string): Promise<Contact | undefined>;
  getContacts(): Promise<Contact[]>;
  getContactsBySheetId(sheetId: string): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  createManyContacts(contacts: InsertContact[]): Promise<Contact[]>;
  deleteContactsBySheetId(sheetId: string): Promise<void>;
  
  // Email Templates
  getEmailTemplate(id: string): Promise<EmailTemplate | undefined>;
  getEmailTemplates(): Promise<EmailTemplate[]>;
  createEmailTemplate(template: InsertEmailTemplate): Promise<EmailTemplate>;
  updateEmailTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate | undefined>;
  deleteEmailTemplate(id: string): Promise<boolean>;
  
  // Campaign Contacts
  getCampaignContacts(campaignId: string): Promise<CampaignContact[]>;
  addContactsToCampaign(campaignId: string, contactIds: string[]): Promise<void>;
  updateCampaignContactStatus(campaignId: string, contactId: string, status: string, timestamp?: Date): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private campaigns: Map<string, Campaign>;
  private contacts: Map<string, Contact>;
  private emailTemplates: Map<string, EmailTemplate>;
  private campaignContacts: Map<string, CampaignContact>;

  constructor() {
    this.users = new Map();
    this.campaigns = new Map();
    this.contacts = new Map();
    this.emailTemplates = new Map();
    this.campaignContacts = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Campaigns
  async getCampaign(id: string): Promise<Campaign | undefined> {
    return this.campaigns.get(id);
  }

  async getCampaigns(): Promise<Campaign[]> {
    return Array.from(this.campaigns.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createCampaign(insertCampaign: InsertCampaign): Promise<Campaign> {
    const id = randomUUID();
    const now = new Date();
    const campaign: Campaign = { 
      ...insertCampaign,
      id,
      status: insertCampaign.status || "draft",
      totalRecipients: insertCampaign.totalRecipients || 0,
      sentCount: insertCampaign.sentCount || 0,
      openCount: insertCampaign.openCount || 0,
      clickCount: insertCampaign.clickCount || 0,
      bounceCount: insertCampaign.bounceCount || 0,
      scheduledAt: insertCampaign.scheduledAt || null,
      startedAt: insertCampaign.startedAt || null,
      completedAt: insertCampaign.completedAt || null,
      createdAt: now,
      updatedAt: now
    };
    this.campaigns.set(id, campaign);
    return campaign;
  }

  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const existing = this.campaigns.get(id);
    if (!existing) return undefined;
    
    const updated: Campaign = { 
      ...existing, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.campaigns.set(id, updated);
    return updated;
  }

  async deleteCampaign(id: string): Promise<boolean> {
    return this.campaigns.delete(id);
  }

  // Contacts
  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async getContactsBySheetId(sheetId: string): Promise<Contact[]> {
    return Array.from(this.contacts.values()).filter(contact => contact.sheetId === sheetId);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      email: insertContact.email,
      name: insertContact.name || null,
      customFields: insertContact.customFields || {},
      sheetId: insertContact.sheetId || null,
      id,
      createdAt: new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async createManyContacts(insertContacts: InsertContact[]): Promise<Contact[]> {
    const contacts: Contact[] = [];
    for (const insertContact of insertContacts) {
      const contact = await this.createContact(insertContact);
      contacts.push(contact);
    }
    return contacts;
  }

  async deleteContactsBySheetId(sheetId: string): Promise<void> {
    const contactsToDelete = Array.from(this.contacts.entries())
      .filter(([_, contact]) => contact.sheetId === sheetId)
      .map(([id]) => id);
    
    contactsToDelete.forEach(id => this.contacts.delete(id));
  }

  // Email Templates
  async getEmailTemplate(id: string): Promise<EmailTemplate | undefined> {
    return this.emailTemplates.get(id);
  }

  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return Array.from(this.emailTemplates.values()).sort((a, b) => 
      new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
    );
  }

  async createEmailTemplate(insertTemplate: InsertEmailTemplate): Promise<EmailTemplate> {
    const id = randomUUID();
    const now = new Date();
    const template: EmailTemplate = { 
      ...insertTemplate, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.emailTemplates.set(id, template);
    return template;
  }

  async updateEmailTemplate(id: string, updates: Partial<EmailTemplate>): Promise<EmailTemplate | undefined> {
    const existing = this.emailTemplates.get(id);
    if (!existing) return undefined;
    
    const updated: EmailTemplate = { 
      ...existing, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.emailTemplates.set(id, updated);
    return updated;
  }

  async deleteEmailTemplate(id: string): Promise<boolean> {
    return this.emailTemplates.delete(id);
  }

  // Campaign Contacts
  async getCampaignContacts(campaignId: string): Promise<CampaignContact[]> {
    return Array.from(this.campaignContacts.values())
      .filter(cc => cc.campaignId === campaignId);
  }

  async addContactsToCampaign(campaignId: string, contactIds: string[]): Promise<void> {
    for (const contactId of contactIds) {
      const id = randomUUID();
      const campaignContact: CampaignContact = {
        id,
        campaignId,
        contactId,
        status: "pending",
        sentAt: null,
        openedAt: null,
        clickedAt: null
      };
      this.campaignContacts.set(id, campaignContact);
    }
  }

  async updateCampaignContactStatus(campaignId: string, contactId: string, status: string, timestamp?: Date): Promise<void> {
    const campaignContact = Array.from(this.campaignContacts.values())
      .find(cc => cc.campaignId === campaignId && cc.contactId === contactId);
    
    if (campaignContact) {
      const updated = { ...campaignContact, status };
      
      if (status === "sent" && timestamp) {
        updated.sentAt = timestamp;
      } else if (status === "opened" && timestamp) {
        updated.openedAt = timestamp;
      } else if (status === "clicked" && timestamp) {
        updated.clickedAt = timestamp;
      }
      
      this.campaignContacts.set(campaignContact.id, updated);
    }
  }
}

export const storage = new MemStorage();
