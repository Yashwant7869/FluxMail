import Sidebar from "@/components/sidebar";
import StatsGrid from "@/components/stats-grid";
import CampaignForm from "@/components/campaign-form";
import ActivitySidebar from "@/components/activity-sidebar";
import CampaignsTable from "@/components/campaigns-table";
import EmailPreviewModal from "@/components/email-preview-modal";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

interface PreviewData {
  subject: string;
  content: string;
  recipientEmail: string;
  recipientName?: string;
}

interface StatsData {
  totalCampaigns: number;
  emailsSent: number;
  openRate: number;
  clickRate: number;
}

export default function Dashboard() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  const { data: stats } = useQuery<StatsData>({
    queryKey: ['/api/stats'],
  });

  const handlePreviewEmail = (data: PreviewData) => {
    setPreviewData(data);
    setIsPreviewOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                className="md:hidden p-2 rounded-lg hover:bg-accent"
                data-testid="button-mobile-menu"
              >
                <i className="fas fa-bars"></i>
              </button>
              <div>
                <h2 className="text-xl font-semibold">Campaign Dashboard</h2>
                <p className="text-sm text-muted-foreground">Manage your email campaigns and track performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                data-testid="button-new-campaign"
              >
                <i className="fas fa-plus mr-2"></i>
                New Campaign
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-6">
            <StatsGrid stats={stats} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CampaignForm onPreviewEmail={handlePreviewEmail} />
              </div>
              <div>
                <ActivitySidebar />
              </div>
            </div>

            <CampaignsTable />
          </div>
        </main>
      </div>

      <EmailPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        previewData={previewData}
      />
    </div>
  );
}
