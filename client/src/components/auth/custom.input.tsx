export default function Input({
  type,
  name,
  lable,
  placeholder,
  value,
  onChange,
}: {
  type: string;
  name: string;
  lable: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col justify-center w-full">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
      />
      {lable && <label className="input-label">{lable}</label>}
    </div>
  );
}
