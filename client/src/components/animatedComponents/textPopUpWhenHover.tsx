export default function TextPopUpWhenHover({
  isHovered,
  text,
}: {
  isHovered: boolean;
  text?: string; // Optional text prop to display
}) {
  if (!isHovered) return null;

  return (
    <div className="fixed z-[9999] translate-x-2">
      <div
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-custom-focus 
      text-[#dcddde] text-sm rounded shadow-lg whitespace-nowrap ring-1 ring-gray-500"
      >
        {text}
        <div className="absolute left-1/2 -bottom-1 transform -translate-x-1/2 w-2 h-2 bg-custom-focus rotate-45"></div>
      </div>
    </div>
  );
}
