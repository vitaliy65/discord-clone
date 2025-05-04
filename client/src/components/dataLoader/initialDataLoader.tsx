import { ReactNode, useEffect, useState } from "react";
import { useAppDispatch } from "@/_hooks/hooks";
import { fetchChannels } from "@/_store/channel/channelSlice";
import { fetchFriends } from "@/_store/friend/friendSlice";
import { fetchChats } from "@/_store/chat/chatSlice";

interface InitialDataLoaderProps {
  children: ReactNode;
}

export default function InitialDataLoader({
  children,
}: InitialDataLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load all required data in parallel
        await Promise.all([
          dispatch(fetchChannels()),
          dispatch(fetchFriends()),
          dispatch(fetchChats()),
          // Add other data fetching here
        ]);

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading initial data:", error);
        // Handle error appropriately
      }
    };

    loadInitialData();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="items-position-center">
        <div className="main-loading-spinner"></div>
      </div>
    );
  }

  return children;
}
