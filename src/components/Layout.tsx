import { useState } from "react";
import LeftPanel from "./LeftPanel"
import Header from "./Header"
import Home from "./Home";
import Track, { TRACK_TYPE } from "./Track";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tracks, setTracks] = useState(new Array<TRACK_TYPE>);
  const [selectedTrack, setSelectedTrack] = useState<TRACK_TYPE | null>(null);
  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <LeftPanel menuOpen={menuOpen} setMenuOpen={setMenuOpen} tracks={tracks} setTracks={setTracks} setSelectedTrack={setSelectedTrack} />
        <main className="flex-1 bg-gray-100 p-4 md:p-6 flex flex-col">
          <Header setMenuOpen={setMenuOpen} />
          <div className="mt-6 flex-1">
            
            {selectedTrack ? <Track track={selectedTrack} /> : <Home />}
            
          </div>
        </main>
      </div>
    </div>
  );
}
