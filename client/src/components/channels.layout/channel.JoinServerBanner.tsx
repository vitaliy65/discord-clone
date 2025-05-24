import { useAppDispatch, useAppSelector } from "@/_hooks/hooks";
import ArrowBack from "@/assets/icons/arrow-back";
import { useNavigate } from "react-router-dom";
import { addChannel, setIsGuest } from "@/_store/channel/channelSlice";
import axios from "axios";
import { SERVER_API_URL } from "@/utils/constants";

export default function JoinServerBanner() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentChannel = useAppSelector((s) => s.channel.currentChannel);

  const handleNavigateBack = () => {
    navigate("/discovery/servers");
  };

  const handleJoinServer = async () => {
    try {
      dispatch(setIsGuest(false));

      if (currentChannel === null) return;

      await axios.post(
        `${SERVER_API_URL}/channel/join`,
        {
          channelId: currentChannel._id,
        },
        { headers: { Authorization: localStorage.getItem("token") } }
      );

      dispatch(addChannel(currentChannel));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="full-center-container channel-banner-container">
      <button
        className="channel-banner-back-button"
        onClick={handleNavigateBack}
      >
        <ArrowBack />
        назад
      </button>
      <div className="channel-banner-text-container">
        <div className="center-container channel-banner-text">
          Вы находитесь в режиме просмотра. Присоединитесь к серверу, чтобы
          начать общаться.
        </div>
        <button
          className="channel-banner-join-button"
          onClick={handleJoinServer}
        >
          присоедениться
        </button>
      </div>
    </div>
  );
}
