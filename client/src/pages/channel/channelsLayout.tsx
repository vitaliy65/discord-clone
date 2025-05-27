import Channels from "@/components/userMainPage/channels";
import UserProfile from "@/components/userMainPage/sections/section.profile/userProfile";
import { Outlet } from "react-router-dom";
import ChannelMembers from "@/components/channels.layout/channel.Members";
import ChannelChats from "@/components/channels.layout/channel.Chats";
import ChannelMenu from "@/components/channels.layout/channel.Menu";
import { useAppSelector } from "@/_hooks/hooks";
import JoinServerBanner from "@/components/channels.layout/channel.JoinServerBanner";
import { motion } from "motion/react";
import ListArrow from "@/assets/icons/listArrow";
import { useEffect, useState } from "react";

export default function ChannelsLayout() {
  const isGuest = useAppSelector((state) => state.channel.isGuest);
  const [hideContainer, setHideContainer] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowSize({
        width: newWidth,
        height: window.innerHeight,
      });

      if (newWidth >= 1280) setHideContainer(false);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {isGuest && (
        <section className="center-container w-full h-12 bg-blue-600">
          <JoinServerBanner />
        </section>
      )}
      <div className="main-page-container">
        <section className="main-left-section-container">
          <Channels />
          <ChannelChats />
          <UserProfile />
        </section>

        <motion.section
          className="chat-container"
          initial={{ width: "100%" }}
          animate={
            windowSize.width < 1080 && !hideContainer
              ? { width: "0px" }
              : { width: "100%" }
          }
          transition={{ type: "tween", duration: 0.3 }}
        >
          <ChannelMenu />
          <Outlet />
        </motion.section>

        <motion.section
          className="relative"
          initial={{ width: "240px" }}
          animate={
            hideContainer
              ? { width: "0px" }
              : windowSize.width < 1080
              ? { width: "100%" }
              : { width: "280px" }
          }
          transition={{ type: "tween", duration: 0.5 }}
          exit={{ opacity: 0 }}
        >
          {/* button to close and open the channel members section */}
          {windowSize.width < 1280 && (
            <button
              className="members-container-hide-button"
              onClick={() => setHideContainer(!hideContainer)}
            >
              <ListArrow
                rotate={hideContainer}
                initialAngle={-90}
                angle={90}
                size="24px"
              />
            </button>
          )}
          <ChannelMembers />
        </motion.section>
      </div>
    </div>
  );
}
