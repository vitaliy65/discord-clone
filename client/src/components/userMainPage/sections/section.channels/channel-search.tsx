import Compass from "@/assets/icons/compass";
import ChannelButton from "./channel-button";
import { useNavigate } from "react-router-dom";

export default function SearchChannel() {
  const navigator = useNavigate();

  return (
    <ChannelButton
      isActive={false}
      onClick={() => {
        navigator("../discovery/servers");
      }}
      src="/channels/search.png"
      alt="searchChannel"
    >
      <Compass />
    </ChannelButton>
  );
}
