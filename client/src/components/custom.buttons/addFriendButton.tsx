import { ReactNode } from "react";
import { useAppSelector } from "@/_hooks/hooks";

type ChannelsIconProps = {
  onClick: () => void;
  children: ReactNode;
};

export default function AddFriendButton({
  children,
  onClick,
}: ChannelsIconProps) {
  const active = useAppSelector(
    (state) => state.filter.action.openAddFriendForm
  );
  return (
    <button
      className={`add-friend-button ${
        active ? "active-add" : "not-active-add"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
