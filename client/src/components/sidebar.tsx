export default function Sidebar() {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-card border-r border-border">
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <i className="fas fa-envelope text-primary-foreground text-sm"></i>
            </div>
            <h1 className="text-lg font-semibold">FluxMail</h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 custom-scrollbar overflow-y-auto">
          <a 
            href="#" 
            className="flex items-center px-4 py-3 text-sm font-medium bg-accent text-accent-foreground rounded-lg"
            data-testid="link-dashboard"
          >
            <i className="fas fa-chart-bar mr-3 w-4"></i>
            Dashboard
          </a>
          <a 
            href="#" 
            className="flex items-center px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
            data-testid="link-campaigns"
          >
            <i className="fas fa-paper-plane mr-3 w-4"></i>
            Campaigns
          </a>
          <a 
            href="#" 
            className="flex items-center px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
            data-testid="link-templates"
          >
            <i className="fas fa-file-alt mr-3 w-4"></i>
            Templates
          </a>
          <a 
            href="#" 
            className="flex items-center px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
            data-testid="link-google-sheets"
          >
            <i className="fab fa-google mr-3 w-4"></i>
            Google Sheets
          </a>
          <a 
            href="#" 
            className="flex items-center px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
            data-testid="link-analytics"
          >
            <i className="fas fa-chart-line mr-3 w-4"></i>
            Analytics
          </a>
          <a 
            href="#" 
            className="flex items-center px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
            data-testid="link-settings"
          >
            <i className="fas fa-cog mr-3 w-4"></i>
            Settings
          </a>
        </nav>
        
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-secondary-foreground">T</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" data-testid="text-user-name">Technical Club Flux</p>
              <p className="text-xs text-muted-foreground truncate" data-testid="text-user-email">flux.club@satiengg.in</p>
              <p className="text-xs text-muted-foreground truncate" data-testid="text-user-email">For Support- 7869928242</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
