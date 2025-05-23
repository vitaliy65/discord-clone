import { ServerInfo } from "@/types/types";

interface ServerCardProps {
  server: ServerInfo;
  onClick: (id: string) => void;
  loading: string;
}

export default function ServerCard({
  server,
  onClick,
  loading,
}: ServerCardProps) {
  return (
    <div
      key={server._id}
      className="server-card-container"
      onClick={() => onClick(server._id)}
    >
      <div className="server-card-avatar-container">
        <img
          src={server.avatar}
          alt="server avatar"
          className="server-card-avatar"
          loading="lazy"
        />
      </div>
      <div className="server-card-info-container">
        <div className="overflow-hidden">
          <h2 className="server-card-name">{server.name}</h2>
          <p className="server-card-description">{server.description}</p>
        </div>
        <p className="server-card-members">members: {server.membersCount}</p>
      </div>
      {loading === server._id && (
        <div className="absolute full-center-container bg-black/50">
          <div className="main-loading-spinner"></div>
        </div>
      )}
    </div>
  );
}
