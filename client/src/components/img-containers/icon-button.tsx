export default function IconButton({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="h-6 w-6 cursor-pointer" />;
}
