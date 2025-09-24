import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import RichTextEditor from "./rich-text-editor";

interface PreviewData {
  subject: string;
  content: string;
  recipientEmail: string;
  recipientName?: string;
}

interface CampaignFormProps {
  onPreviewEmail: (data: PreviewData) => void;
}

export default function CampaignForm({ onPreviewEmail }: CampaignFormProps) {
  const { toast } = useToast();
  const [spreadsheetId, setSpreadsheetId] = useState("");
  const [emailColumn, setEmailColumn] = useState<number>(1);
  const [nameColumn, setNameColumn] = useState<number>(0);
  const [campaignData, setCampaignData] = useState({
    name: "",
    subject: "",
    content: "Hi {{name}},\n\nWe hope this email finds you well. We're excited to share some personalized recommendations just for you based on your previous interests.\n\nAs a valued member of our community, we wanted to give you early access to our latest features...\n\nBest regards,\nThe Team",
    fromName: "John Doe",
    fromEmail: "john@company.com"
  });

  const { data: allContacts = [] } = useQuery({
    queryKey: ['/api/contacts']
  });

  const { data: sheetContacts = [] } = useQuery({
    queryKey: ['/api/contacts', `sheetId=${spreadsheetId}`],
    enabled: !!spreadsheetId
  });

  // Use sheet contacts if available, otherwise use all contacts
  const contacts = Array.isArray(sheetContacts) && sheetContacts.length > 0 ? sheetContacts : allContacts;

  const { data: sheetData, isLoading: isLoadingSheet } = useQuery({
    queryKey: ['/api/sheets', spreadsheetId],
    enabled: !!spreadsheetId && spreadsheetId.length > 10
  });

  const importContactsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/sheets/${spreadsheetId}/import`, {
        emailColumn,
        nameColumn,
        range: 'A:Z'
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Contacts imported successfully from Google Sheet"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to import contacts from Google Sheet",
        variant: "destructive"
      });
    }
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('POST', '/api/campaigns', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Campaign created successfully"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive"
      });
    }
  });

  const handleImportContacts = () => {
    if (!spreadsheetId) {
      toast({
        title: "Error",
        description: "Please enter a Google Sheets ID",
        variant: "destructive"
      });
      return;
    }
    importContactsMutation.mutate();
  };

  const handlePreview = () => {
    const sampleContact = Array.isArray(contacts) ? contacts[0] : null;
    if (!sampleContact) {
      toast({
        title: "Error",
        description: "No contacts available for preview. Please import contacts first.",
        variant: "destructive"
      });
      return;
    }

    let previewSubject = campaignData.subject;
    let previewContent = campaignData.content;

    if (sampleContact.name) {
      previewSubject = previewSubject.replace(/\{\{name\}\}/g, sampleContact.name);
      previewContent = previewContent.replace(/\{\{name\}\}/g, sampleContact.name);
    }

    previewSubject = previewSubject.replace(/\{\{email\}\}/g, sampleContact.email);
    previewContent = previewContent.replace(/\{\{email\}\}/g, sampleContact.email);

    // Replace custom fields
    if (sampleContact.customFields) {
      Object.entries(sampleContact.customFields).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        previewSubject = previewSubject.replace(new RegExp(placeholder, 'g'), String(value));
        previewContent = previewContent.replace(new RegExp(placeholder, 'g'), String(value));
      });
    }

    onPreviewEmail({
      subject: previewSubject,
      content: previewContent,
      recipientEmail: sampleContact.email,
      recipientName: sampleContact.name
    });
  };

  const handleSaveCampaign = () => {
    if (!campaignData.name || !campaignData.subject || !campaignData.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    createCampaignMutation.mutate(campaignData);
  };

  return (
    <div className="space-y-6">
      {/* Google Sheets Integration */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Google Sheets Integration</h3>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            {Array.isArray(contacts) && contacts.length ? 'Connected' : 'Not Connected'}
          </span>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="spreadsheet-id" className="block text-sm font-medium mb-2">
              Google Sheets ID
            </Label>
            <Input
              id="spreadsheet-id"
              type="text"
              placeholder="Enter Google Sheets ID from the URL"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              data-testid="input-spreadsheet-id"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium mb-2">Email Column (0-based)</Label>
              <Input
                type="number"
                value={emailColumn}
                onChange={(e) => setEmailColumn(parseInt(e.target.value))}
                data-testid="input-email-column"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium mb-2">Name Column (0-based)</Label>
              <Input
                type="number"
                value={nameColumn}
                onChange={(e) => setNameColumn(parseInt(e.target.value))}
                data-testid="input-name-column"
              />
            </div>
          </div>
          
          <Button
            onClick={handleImportContacts}
            disabled={!spreadsheetId || importContactsMutation.isPending}
            data-testid="button-import-contacts"
          >
            {importContactsMutation.isPending ? "Importing..." : "Import Contacts"}
          </Button>
          
          {Array.isArray(contacts) && contacts.length > 0 && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <i className="fas fa-info-circle text-blue-500 mt-1"></i>
                <div>
                  <p className="text-sm font-medium">Preview Data</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Found {contacts.length} contacts with valid email addresses
                  </p>
                  <div className="mt-2 space-y-1">
                    {contacts.slice(0, 2).map((contact: any, index: number) => (
                      <div key={index} className="text-xs font-mono bg-background px-2 py-1 rounded">
                        {contact.email} | {contact.name || 'No name'}
                      </div>
                    ))}
                    {contacts.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        + {contacts.length - 2} more contacts...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Composition */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold mb-6">Compose Email</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="campaign-name" className="block text-sm font-medium mb-2">
              Campaign Name
            </Label>
            <Input
              id="campaign-name"
              type="text"
              placeholder="Enter campaign name"
              value={campaignData.name}
              onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
              data-testid="input-campaign-name"
            />
          </div>
          
          <div>
            <Label htmlFor="subject" className="block text-sm font-medium mb-2">
              Subject Line
            </Label>
            <Input
              id="subject"
              type="text"
              placeholder="{{name}}, here's your personalized offer..."
              value={campaignData.subject}
              onChange={(e) => setCampaignData(prev => ({ ...prev, subject: e.target.value }))}
              data-testid="input-subject"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from-name" className="block text-sm font-medium mb-2">
                From Name
              </Label>
              <Input
                id="from-name"
                type="text"
                value={campaignData.fromName}
                onChange={(e) => setCampaignData(prev => ({ ...prev, fromName: e.target.value }))}
                data-testid="input-from-name"
              />
            </div>
            <div>
              <Label htmlFor="from-email" className="block text-sm font-medium mb-2">
                From Email
              </Label>
              <Input
                id="from-email"
                type="email"
                value={campaignData.fromEmail}
                onChange={(e) => setCampaignData(prev => ({ ...prev, fromEmail: e.target.value }))}
                data-testid="input-from-email"
              />
            </div>
          </div>
          
          <div>
            <Label className="block text-sm font-medium mb-2">Email Content</Label>
            <RichTextEditor
              content={campaignData.content}
              onChange={(content: string) => setCampaignData(prev => ({ ...prev, content }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                onClick={handlePreview}
                disabled={!Array.isArray(contacts) || !contacts.length}
                data-testid="button-preview"
              >
                <i className="fas fa-eye mr-2"></i>
                Preview
              </Button>
              <Button
                variant="secondary"
                onClick={handleSaveCampaign}
                disabled={createCampaignMutation.isPending}
                data-testid="button-save-template"
              >
                <i className="fas fa-save mr-2"></i>
                {createCampaignMutation.isPending ? "Saving..." : "Save Campaign"}
              </Button>
            </div>
            <Button
              onClick={handleSaveCampaign}
              disabled={createCampaignMutation.isPending}
              data-testid="button-schedule"
            >
              <i className="fas fa-calendar mr-2"></i>
              Create Campaign
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
