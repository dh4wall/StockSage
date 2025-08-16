const Button = ({ variant, className, children }) => (
  <button
    className={`px-4 py-2 rounded ${variant === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'} ${className}`}
  >
    {children}
  </button>
);

export { Button };