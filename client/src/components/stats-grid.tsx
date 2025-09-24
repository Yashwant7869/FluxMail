interface StatsGridProps {
  stats?: {
    totalCampaigns: number;
    emailsSent: number;
    openRate: number;
    clickRate: number;
  };
}

export default function StatsGrid({ stats }: StatsGridProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-card p-6 rounded-lg border border-border animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                <div className="h-8 bg-muted rounded w-12"></div>
              </div>
              <div className="w-12 h-12 bg-muted rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: "Total Campaigns",
      value: stats.totalCampaigns.toString(),
      icon: "fas fa-paper-plane",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      change: "12% from last month",
      changeType: "positive",
      testId: "stat-total-campaigns"
    },
    {
      label: "Emails Sent",
      value: stats.emailsSent.toLocaleString(),
      icon: "fas fa-check-circle",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      change: "8% from last month",
      changeType: "positive",
      testId: "stat-emails-sent"
    },
    {
      label: "Open Rate",
      value: `${stats.openRate}%`,
      icon: "fas fa-eye",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      change: "2% from last month",
      changeType: "negative",
      testId: "stat-open-rate"
    },
    {
      label: "Click Rate",
      value: `${stats.clickRate}%`,
      icon: "fas fa-mouse-pointer",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      change: "5% from last month",
      changeType: "positive",
      testId: "stat-click-rate"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item) => (
        <div key={item.label} className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-bold" data-testid={item.testId}>{item.value}</p>
            </div>
            <div className={`w-12 h-12 ${item.iconBg} rounded-lg flex items-center justify-center`}>
              <i className={`${item.icon} ${item.iconColor}`}></i>
            </div>
          </div>
          <p className={`text-xs mt-2 ${item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
            <i className={`fas fa-arrow-${item.changeType === 'positive' ? 'up' : 'down'} mr-1`}></i>
            {item.change}
          </p>
        </div>
      ))}
    </div>
  );
}
