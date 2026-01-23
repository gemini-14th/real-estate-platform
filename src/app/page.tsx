import Navbar from "@/components/navbar";
import VideoFeed from "@/components/video-feed";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black">
      <Navbar />
      <VideoFeed />
    </main>
  );
}
