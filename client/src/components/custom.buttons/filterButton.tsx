import { ReactNode } from "react";

type ChannelsIconProps = {
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
};

export default function AddFriendButton({
  children,
  isActive,
  onClick,
}: ChannelsIconProps) {
  return (
    <button
      className={`filter-button hover:bg-custom-focus ${
        isActive ? "active bg-clicked" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
