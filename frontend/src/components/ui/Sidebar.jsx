const Sidebar = ({ className, children }) => (
  <aside className={`${className} flex flex-col h-full`}>
    {children}
  </aside>
);

const SidebarHeader = ({ className, children }) => (
  <div className={`${className} flex-shrink-0 border-b bg-card/50 backdrop-blur-sm`}>
    {children}
  </div>
);

const SidebarContent = ({ className, children }) => (
  <div className={`${className} flex-1 overflow-y-auto overflow-x-hidden max-h-full`}>
    {children}
  </div>
);

const SidebarTrigger = ({ className, children }) => (
  <button className={`${className} flex items-center justify-center p-2 rounded-md hover:bg-muted/50 transition-colors`}>
    {children}
  </button>
);

export { Sidebar, SidebarHeader, SidebarContent, SidebarTrigger };