const CompanyList = ({ companies, selectedCompany, onSelect }) => {
  return (
    <div className="space-y-1 p-4">
      {companies.map(c => (
        <button
          key={c.symbol}
          onClick={() => onSelect(c)}
          className={`w-full text-left p-2 rounded flex items-center gap-2 ${
            selectedCompany?.symbol === c.symbol ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
          }`}
        >
          <div className="w-4 h-4 rounded-full bg-primary/50" />
          {c.name}
        </button>
      ))}
    </div>
  );
};

export { CompanyList };