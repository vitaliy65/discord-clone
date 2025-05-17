interface ModalAvatarInputProps {
  avatarUrl: string;
  onChange: (value: string) => void;
}

export const ModalAvatarInput = ({
  avatarUrl,
  onChange,
}: ModalAvatarInputProps) => (
  <div>
    <label className="channel-modal__field">Channel Avatar</label>
    <div className="channel-modal__avatar-container">
      <img
        src={avatarUrl}
        alt="Channel avatar"
        className="channel-modal__avatar"
      />
      <input
        type="text"
        value={avatarUrl}
        onChange={(e) => onChange(e.target.value)}
        className="channel-modal__input"
        placeholder="Enter avatar URL"
      />
    </div>
  </div>
);
