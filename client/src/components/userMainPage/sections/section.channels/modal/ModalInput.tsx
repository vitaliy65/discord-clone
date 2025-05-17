interface ModalInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const ModalInput = ({
  label,
  value,
  onChange,
  placeholder,
}: ModalInputProps) => (
  <div>
    <label className="channel-modal__field">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="channel-modal__input"
      placeholder={placeholder}
    />
  </div>
);
