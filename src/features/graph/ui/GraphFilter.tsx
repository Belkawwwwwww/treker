interface ChartFiltersProps {
  selectedParams: { [key: string]: boolean };
  onChange: (param: string) => void;
}

const ChartFilters: React.FC<ChartFiltersProps> = ({
  selectedParams,
  onChange,
}) => {
  return (
    <div>
      {Object.entries(selectedParams).map(([key, value]) => (
        <label key={key}>
          <input
            type="checkbox"
            checked={value}
            onChange={() => onChange(key)}
          />
          {key.charAt(0).toUpperCase() + key.slice(1)} {/* Форматируем ключ */}
        </label>
      ))}
    </div>
  );
};

export default ChartFilters;
