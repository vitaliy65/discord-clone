export default function FileDownloadButton({
  isDownloading,
  show,
  handleDownload,
}: {
  isDownloading: boolean;
  show: boolean;
  handleDownload: () => void;
}) {
  return (
    <>
      {show && (
        <div className="relative">
          <button
            className="file-download-button bg-clicked hover:bg-custom-focus"
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
          >
            {isDownloading ? (
              <div className="scalable-loading-spinner"></div>
            ) : (
              <img
                src="/chat/download.png"
                alt="download image"
                height={128}
                width={128}
              />
            )}
          </button>
        </div>
      )}
    </>
  );
}
