const Card = ({ className, children }) => (
  <div className={`bg-card text-card-foreground p-4 rounded-lg shadow ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className, children }) => (
  <div className={`border-b pb-2 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ className, children }) => (
  <div className={className}>
    {children}
  </div>
);

const CardTitle = ({ className, children }) => (
  <h3 className={`text-lg font-semibold ${className}`}>
    {children}
  </h3>
);

export { Card, CardHeader, CardContent, CardTitle };