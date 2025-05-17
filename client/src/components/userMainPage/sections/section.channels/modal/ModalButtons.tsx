interface ModalButtonsProps {
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ModalButtons = ({ onCancel, onSubmit }: ModalButtonsProps) => (
  <div className="channel-modal__buttons">
    <button
      type="button"
      onClick={onCancel}
      className="channel-modal__button channel-modal__button--cancel"
    >
      Cancel
    </button>
    <button
      type="submit"
      onClick={onSubmit}
      className="channel-modal__button channel-modal__button--create"
    >
      Create Channel
    </button>
  </div>
);
