import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import { setSearchParams } from "@/_store/filter/filterFriendSlice";

export default function SearchFriend() {
  const searchParams = useAppSelector(
    (state) => state.filter.action.searchParams
  );
  const dispatch = useAppDispatch();

  const handleSearch = (value: string) => {
    dispatch(setSearchParams(value));
  };

  return (
    <div className="search-friend-container border-b-channels bg-friends">
      <input
        className="search-friend-input bg-channels"
        type="text"
        placeholder="Найти друга"
        value={searchParams}
        onChange={(e) => handleSearch(e.target.value)}
        autoComplete="off"
      />
    </div>
  );
}
