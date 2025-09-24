import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCampaignSchema, insertContactSchema, insertEmailTemplateSchema } from "@shared/schema";
import { sendBulkEmails } from "./services/sendgrid";
import { getSheetData, parseContactsFromSheet, getSpreadsheetInfo } from "./services/googleSheets";

export async function registerRoutes(app: Express): Promise<Server> {
  // Campaign routes
  app.get("/api/campaigns", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch campaign" });
    }
  });

  app.post("/api/campaigns", async (req, res) => {
    try {
      const validatedData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(validatedData);
      res.status(201).json(campaign);
    } catch (error) {
      res.status(400).json({ message: "Invalid campaign data" });
    }
  });

  app.patch("/api/campaigns/:id", async (req, res) => {
    try {
      const campaign = await storage.updateCampaign(req.params.id, req.body);
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  app.delete("/api/campaigns/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCampaign(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete campaign" });
    }
  });

  // Google Sheets routes
  app.get("/api/sheets/:spreadsheetId", async (req, res) => {
    try {
      const { spreadsheetId } = req.params;
      const { range } = req.query;
      
      const sheetData = await getSheetData(spreadsheetId, range as string);
      if (!sheetData) {
        return res.status(404).json({ message: "Sheet not found" });
      }
      
      res.json(sheetData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sheet data" });
    }
  });

  app.get("/api/sheets/:spreadsheetId/info", async (req, res) => {
    try {
      const { spreadsheetId } = req.params;
      const info = await getSpreadsheetInfo(spreadsheetId);
      res.json(info);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch spreadsheet info" });
    }
  });

  app.post("/api/sheets/:spreadsheetId/import", async (req, res) => {
    try {
      const { spreadsheetId } = req.params;
      const { emailColumn, nameColumn, range } = req.body;
      
      const sheetData = await getSheetData(spreadsheetId, range);
      if (!sheetData) {
        return res.status(404).json({ message: "Sheet not found" });
      }
      
      const contacts = parseContactsFromSheet(sheetData.values, emailColumn, nameColumn);
      
      // Delete existing contacts for this sheet
      await storage.deleteContactsBySheetId(spreadsheetId);
      
      // Create new contacts
      const insertContacts = contacts.map(contact => ({
        ...contact,
        sheetId: spreadsheetId
      }));
      
      const createdContacts = await storage.createManyContacts(insertContacts);
      
      res.json({
        message: `Imported ${createdContacts.length} contacts`,
        contacts: createdContacts
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to import contacts from sheet" });
    }
  });

  // Contacts routes
  app.get("/api/contacts", async (req, res) => {
    try {
      const { sheetId } = req.query;
      let contacts;
      
      if (sheetId) {
        contacts = await storage.getContactsBySheetId(sheetId as string);
      } else {
        contacts = await storage.getContacts();
      }
      
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact data" });
    }
  });

  // Email templates routes
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getEmailTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const validatedData = insertEmailTemplateSchema.parse(req.body);
      const template = await storage.createEmailTemplate(validatedData);
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ message: "Invalid template data" });
    }
  });

  // Campaign sending route
  app.post("/api/campaigns/:id/send", async (req, res) => {
    try {
      const { id } = req.params;
      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      if (campaign.status !== "draft" && campaign.status !== "scheduled") {
        return res.status(400).json({ message: "Campaign cannot be sent" });
      }
      
      // Get campaign contacts or all contacts if none specified
      let campaignContacts = await storage.getCampaignContacts(id);
      
      if (campaignContacts.length === 0) {
        // If no specific contacts, use all contacts
        const allContacts = await storage.getContacts();
        const contactIds = allContacts.map(c => c.id);
        await storage.addContactsToCampaign(id, contactIds);
        campaignContacts = await storage.getCampaignContacts(id);
      }
      
      const contacts = await Promise.all(
        campaignContacts.map(cc => storage.getContact(cc.contactId))
      );
      
      const validContacts = contacts.filter(c => c !== undefined);
      
      // Update campaign status
      await storage.updateCampaign(id, {
        status: "sending",
        startedAt: new Date(),
        totalRecipients: validContacts.length
      });
      
      // Prepare emails
      const emails = validContacts.map(contact => {
        let personalizedSubject = campaign.subject;
        let personalizedContent = campaign.content;
        
        // Replace placeholders
        if (contact.name) {
          personalizedSubject = personalizedSubject.replace(/\{\{name\}\}/g, contact.name);
          personalizedContent = personalizedContent.replace(/\{\{name\}\}/g, contact.name);
        }
        
        personalizedSubject = personalizedSubject.replace(/\{\{email\}\}/g, contact.email);
        personalizedContent = personalizedContent.replace(/\{\{email\}\}/g, contact.email);
        
        // Replace custom fields
        if (contact.customFields) {
          Object.entries(contact.customFields).forEach(([key, value]) => {
            const placeholder = `{{${key}}}`;
            personalizedSubject = personalizedSubject.replace(new RegExp(placeholder, 'g'), String(value));
            personalizedContent = personalizedContent.replace(new RegExp(placeholder, 'g'), String(value));
          });
        }
        
        return {
          to: contact.email,
          from: `${campaign.fromName} <${campaign.fromEmail}>`,
          subject: personalizedSubject,
          html: personalizedContent,
          text: personalizedContent.replace(/<[^>]*>/g, '') // Strip HTML tags for text version
        };
      });
      
      // Send emails
      const result = await sendBulkEmails(emails);
      
      // Update campaign and contact statuses
      await storage.updateCampaign(id, {
        status: "completed",
        completedAt: new Date(),
        sentCount: result.success
      });
      
      // Update individual contact statuses
      for (let i = 0; i < validContacts.length; i++) {
        const contact = validContacts[i];
        const wasSuccessful = i < result.success; // Simplified logic
        
        await storage.updateCampaignContactStatus(
          id,
          contact.id,
          wasSuccessful ? "sent" : "failed",
          new Date()
        );
      }
      
      res.json({
        message: "Campaign sent successfully",
        result: {
          totalRecipients: validContacts.length,
          successful: result.success,
          failed: result.failed
        }
      });
    } catch (error) {
      console.error("Campaign send error:", error);
      res.status(500).json({ message: "Failed to send campaign" });
    }
  });

  // Stats endpoint
  app.get("/api/stats", async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      
      const totalCampaigns = campaigns.length;
      const totalEmails = campaigns.reduce((sum, c) => sum + (c.sentCount || 0), 0);
      const totalOpens = campaigns.reduce((sum, c) => sum + (c.openCount || 0), 0);
      const totalClicks = campaigns.reduce((sum, c) => sum + (c.clickCount || 0), 0);
      
      const openRate = totalEmails > 0 ? (totalOpens / totalEmails * 100) : 0;
      const clickRate = totalEmails > 0 ? (totalClicks / totalEmails * 100) : 0;
      
      res.json({
        totalCampaigns,
        emailsSent: totalEmails,
        openRate: Math.round(openRate * 10) / 10,
        clickRate: Math.round(clickRate * 10) / 10
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
