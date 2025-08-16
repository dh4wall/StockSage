const Select = ({ value, onValueChange, children }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className="w-full border rounded p-2"
  >
    {children}
  </select>
);

const SelectTrigger = ({ children }) => <div>{children}</div>;
const SelectContent = ({ children }) => <div>{children}</div>;
const SelectItem = ({ value, children }) => <option value={value}>{children}</option>;
const SelectValue = ({ placeholder }) => <span>{placeholder}</span>;

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue };