import { useNavigate, useLocation } from 'react-router-dom';

const AppNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Compare', path: '/compare' } 
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center h-12 px-4 border-b bg-background/95 backdrop-blur-sm shadow-sm">
      <button 
        onClick={() => navigate('/')} 
        className="font-bold text-primary hover:text-primary/80 transition-colors"
      >
        StockSage
      </button>
      <div className="ml-6 flex space-x-1">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isActive(item.path)
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </nav>
  );
};

export { AppNavbar };