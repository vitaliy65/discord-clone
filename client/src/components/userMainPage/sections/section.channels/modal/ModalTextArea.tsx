interface ModalTextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const ModalTextArea = ({
  label,
  value,
  onChange,
  placeholder,
}: ModalTextAreaProps) => (
  <div>
    <label className="channel-modal__field">{label}</label>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="channel-modal__textarea"
      placeholder={placeholder}
    />
  </div>
);
