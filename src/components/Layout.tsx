import { useState } from "react";
import LeftPanel from "./LeftPanel"
import Header from "./Header"
import Home from "./Home";
import Track from "./models/Track";
import TrackPanel from "./TrackPanel";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tracks, setTracks] = useState(new Array<Track>);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <LeftPanel menuOpen={menuOpen} setMenuOpen={setMenuOpen} tracks={tracks} setTracks={setTracks} selectedTrack={selectedTrack} setSelectedTrack={setSelectedTrack} />
        <main className="flex-1 bg-gray-100 p-4 md:p-6 flex flex-col">
          <Header setMenuOpen={setMenuOpen} />
          <div className="mt-6 flex-1">
            
            {selectedTrack ? <TrackPanel  tracks={tracks} setTracks={setTracks} track={selectedTrack} /> : <Home />}
            
          </div>
        </main>
      </div>
    </div>
  );
}
