import Channels from "@/components/userMainPage/channels";
import ChannelMenu from "@/components/channels.layout/channel.Menu";
import ChannelsList from "@/components/channels.discovery/ChannelsList";

export default function Discoverylayout() {
  return (
    <div className="main-page-container">
      <section className="main-left-section-container">
        <Channels />
      </section>
      <section className="chat-container">
        <ChannelMenu>
          <p className="full-center-container text-gray-500 capitalize">
            Here you can find a community for every taste
          </p>
        </ChannelMenu>
        <ChannelsList />
      </section>
    </div>
  );
}
