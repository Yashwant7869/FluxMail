import { useQuery } from "@tanstack/react-query";

export default function ActivitySidebar() {
  const { data: campaigns = [] } = useQuery({
    queryKey: ['/api/campaigns'],
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['/api/templates'],
  });

  const campaignsArray = Array.isArray(campaigns) ? campaigns : [];
  const templatesArray = Array.isArray(templates) ? templates : [];
  const activeCampaigns = campaignsArray.filter((c: any) => c.status === 'sending' || c.status === 'scheduled');
  const completedCampaigns = campaignsArray.filter((c: any) => c.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Active Campaign Progress */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold mb-4">Campaign Progress</h3>
        
        <div className="space-y-4">
          {activeCampaigns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active campaigns</p>
          ) : (
            activeCampaigns.map((campaign: any) => (
              <div key={campaign.id} className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" data-testid="text-campaign-name">
                    {campaign.name}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize" data-testid="text-campaign-status">
                    {campaign.status}
                  </span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ 
                      width: `${campaign.totalRecipients ? (campaign.sentCount / campaign.totalRecipients * 100) : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span data-testid="text-progress">{campaign.sentCount || 0} / {campaign.totalRecipients || 0} sent</span>
                  <span data-testid="text-progress-percentage">
                    {campaign.totalRecipients ? Math.round(campaign.sentCount / campaign.totalRecipients * 100) : 0}%
                  </span>
                </div>
              </div>
            ))
          )}

          {completedCampaigns.slice(0, 2).map((campaign: any) => (
            <div key={campaign.id} className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium" data-testid="text-completed-campaign">{campaign.name}</span>
                <span className="text-xs text-green-600">Completed</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "100%" }}></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{campaign.sentCount || 0} / {campaign.totalRecipients || 0} sent</span>
                <span>100%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-semibold mb-4">Today's Performance</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Emails Delivered</span>
            <span className="text-sm font-medium" data-testid="text-delivered-today">
              {campaignsArray.reduce((sum: number, c: any) => sum + (c.sentCount || 0), 0)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Opens</span>
            <span className="text-sm font-medium" data-testid="text-opens-today">
              {campaignsArray.reduce((sum: number, c: any) => sum + (c.openCount || 0), 0)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Clicks</span>
            <span className="text-sm font-medium" data-testid="text-clicks-today">
              {campaignsArray.reduce((sum: number, c: any) => sum + (c.clickCount || 0), 0)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Bounces</span>
            <span className="text-sm font-medium text-red-600" data-testid="text-bounces-today">
              {campaignsArray.reduce((sum: number, c: any) => sum + (c.bounceCount || 0), 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Templates */}
      <div className="bg-card p-6 rounded-lg border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Templates</h3>
          <button className="text-xs text-primary hover:underline" data-testid="button-view-all-templates">
            View All
          </button>
        </div>
        
        <div className="space-y-3">
          {templatesArray.length === 0 ? (
            <p className="text-sm text-muted-foreground">No templates available</p>
          ) : (
            templatesArray.slice(0, 3).map((template: any, index: number) => (
              <div 
                key={template.id} 
                className="flex items-center space-x-3 p-2 hover:bg-accent rounded-lg cursor-pointer transition-colors"
                data-testid="card-template"
              >
                <div className={`w-8 h-8 rounded flex items-center justify-center ${
                  index === 0 ? 'bg-blue-100' : index === 1 ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  <i className={`fas fa-file-alt text-xs ${
                    index === 0 ? 'text-blue-600' : index === 1 ? 'text-green-600' : 'text-purple-600'
                  }`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" data-testid="text-template-name">
                    {template.name}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid="text-template-date">
                    Last used {new Date(template.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
