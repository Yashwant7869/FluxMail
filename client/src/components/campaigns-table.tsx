import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

export default function CampaignsTable() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['/api/campaigns'],
  });

  const sendCampaignMutation = useMutation({
    mutationFn: async (campaignId: string) => {
      return apiRequest('POST', `/api/campaigns/${campaignId}/send`, {});
    },
    onSuccess: (_, campaignId) => {
      toast({
        title: "Success",
        description: "Campaign is being sent"
      });
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to send campaign",
        variant: "destructive"
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'sending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'fas fa-check-circle';
      case 'sending': return 'fas fa-paper-plane';
      case 'scheduled': return 'fas fa-calendar';
      case 'paused': return 'fas fa-pause';
      default: return 'fas fa-file-alt';
    }
  };

  const campaignsArray = Array.isArray(campaigns) ? campaigns : [];
  const filteredCampaigns = campaignsArray.filter((campaign: any) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Campaigns</h3>
          <div className="flex items-center space-x-2">
            <Input
              type="search"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
              data-testid="input-search-campaigns"
            />
            <Button variant="outline" size="sm" data-testid="button-filter">
              <i className="fas fa-filter text-sm"></i>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Recipients
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Open Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Click Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredCampaigns.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                  {campaignsArray.length === 0 ? "No campaigns found. Create your first campaign to get started." : "No campaigns match your search."}
                </td>
              </tr>
            ) : (
              filteredCampaigns.map((campaign: any) => (
                <tr key={campaign.id} className="hover:bg-muted/50" data-testid="row-campaign">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <i className={`${getStatusIcon(campaign.status)} text-blue-600 text-xs`}></i>
                      </div>
                      <div>
                        <p className="text-sm font-medium" data-testid="text-campaign-name">
                          {campaign.name}
                        </p>
                        <p className="text-xs text-muted-foreground" data-testid="text-campaign-subject">
                          {campaign.subject}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}
                      data-testid="badge-status"
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" data-testid="text-recipients">
                    {campaign.totalRecipients || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" data-testid="text-open-rate">
                    {campaign.totalRecipients && campaign.openCount 
                      ? `${((campaign.openCount / campaign.totalRecipients) * 100).toFixed(1)}%`
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" data-testid="text-click-rate">
                    {campaign.totalRecipients && campaign.clickCount
                      ? `${((campaign.clickCount / campaign.totalRecipients) * 100).toFixed(1)}%`
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground" data-testid="text-date">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 hover:bg-accent rounded" 
                        title="View Details"
                        data-testid="button-view-details"
                      >
                        <i className="fas fa-eye text-xs"></i>
                      </button>
                      {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                        <button
                          className="p-1 hover:bg-accent rounded"
                          title="Send Campaign"
                          onClick={() => sendCampaignMutation.mutate(campaign.id)}
                          disabled={sendCampaignMutation.isPending}
                          data-testid="button-send-campaign"
                        >
                          <i className="fas fa-paper-plane text-xs"></i>
                        </button>
                      )}
                      {campaign.status === 'sending' && (
                        <button 
                          className="p-1 hover:bg-accent rounded" 
                          title="Pause"
                          data-testid="button-pause"
                        >
                          <i className="fas fa-pause text-xs"></i>
                        </button>
                      )}
                      <button 
                        className="p-1 hover:bg-accent rounded" 
                        title="Edit"
                        data-testid="button-edit"
                      >
                        <i className="fas fa-edit text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {filteredCampaigns.length > 0 && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground" data-testid="text-pagination-info">
              Showing 1 to {Math.min(filteredCampaigns.length, 10)} of {filteredCampaigns.length} campaigns
            </p>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled 
                data-testid="button-previous"
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={filteredCampaigns.length <= 10}
                data-testid="button-next"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
