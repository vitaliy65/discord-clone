import { useState } from "react";
import FilterButton from "../custom.buttons/filterButton";
import AddFriendButton from "../custom.buttons/addFriendButton";
import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import { AppDispatch } from "@/_store/store";
import {
  setShowAll,
  setShowOnline,
  setShowPending,
  setOpenAddFriendForm,
} from "@/_store/filter/filterFriendSlice";

import "@/styles/components/custom.buttons/filter.buttons.css";
import { useNavigate } from "react-router-dom";

export default function Menu() {
  const [activeIndex, setActiveIndex] = useState<number>(2);
  const friendRequestCount = useAppSelector(
    (state) => state.friendRequest.requests.length
  );
  const filter = useAppSelector((state) => state.filter.action);
  const dispatch = useAppDispatch();
  const navigator = useNavigate();

  const action = async (
    index: number,
    actionFunction: () => ReturnType<AppDispatch>
  ) => {
    setActiveIndex(index);
    await dispatch(actionFunction());
  };

  return (
    <section className="chat-header-menu-container bg-friends borde-b-channels">
      <FilterButton
        isActive={activeIndex == 1}
        onClick={() => action(1, setShowOnline)}
      >
        В сети
      </FilterButton>
      <FilterButton
        isActive={activeIndex == 2}
        onClick={() => action(2, setShowAll)}
      >
        Все
      </FilterButton>
      <div className="friend-request-filter-button">
        <FilterButton
          isActive={filter.showPending}
          onClick={() => {
            action(activeIndex, setShowPending);
            navigator("friendRequests", { replace: true });
          }}
        >
          Ожидание
        </FilterButton>
        {friendRequestCount > 0 ? (
          <div className="friend-request-counter">
            <p className="counter">{friendRequestCount}</p>
          </div>
        ) : null}
      </div>
      <AddFriendButton
        onClick={() => {
          action(4, setOpenAddFriendForm);
          navigator("addFriend", { replace: true });
        }}
      >
        Добавить в друзья
      </AddFriendButton>
    </section>
  );
}
