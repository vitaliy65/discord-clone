interface ModalPublicSelectorProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function ModalPublicSelector({
  value,
  onChange,
}: ModalPublicSelectorProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="channel-modal__field">Server accessability</label>
      <div className="flex gap-4 justify-center">
        <button
          type="button"
          className={`channel-modal__button--public ${
            !value
              ? "channel-modal__button--neutral hover:bg-green-700 hover:text-white"
              : ""
          }`}
          onClick={() => onChange(true)}
        >
          public
        </button>
        <button
          type="button"
          className={`channel-modal__button--private ${
            value
              ? "channel-modal__button--neutral hover:bg-blue-700 hover:text-white"
              : ""
          }`}
          onClick={() => onChange(false)}
        >
          private
        </button>
      </div>
      <p className="channel-modal__text">
        {value
          ? "Будь-хто може приєднатися до цього каналу."
          : "Тільки запрошені користувачі можуть приєднатися до цього каналу."}
      </p>
    </div>
  );
}
