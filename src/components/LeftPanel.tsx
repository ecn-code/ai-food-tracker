import { X, Plus } from "lucide-react";
import Track from "./models/Track";

export default function LeftPanel({ menuOpen, setMenuOpen, tracks, setTracks, setSelectedTrack }: {
    menuOpen: boolean,
    setMenuOpen: (state: boolean) => void,
    tracks: Array<Track>,
    setTracks: (tracks: Array<Track>) => void,
    setSelectedTrack: (track: Track | null) => void
}) {
    const addTrackDay = () => {
        setTracks([...tracks, new Track()])
    }
    const openTrack = (track: Track) => {
        setSelectedTrack(track)
    }
    return (
        <aside
            className={`flex flex-col w-[200px] bg-gradient-to-b from-gray-800 to-gray-900 text-white p-4 fixed md:relative h-full transition-transform 
          ${menuOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 shadow-xl shadow-gray-600/50`}
        >
            <section className="mb-4 flex flex-row">
                <div className="font-bold text-lg">LOGO</div>
                <button
                    className="md:hidden ml-auto p-2 text-white border border-white rounded hover:bg-white hover:text-black"
                    onClick={() => setMenuOpen(false)}
                >
                    <X size={12} />
                </button>
            </section>

            <nav>
                <section className="mb-4 border-t border-gray-600 pt-4">
                    <h2 className="text-gray-300 text-sm uppercase">Actions</h2>
                    <a href="#" className="inline-flex items-center p-2 rounded hover:bg-gray-700 transition-colors">
                        <Plus size={12} />
                        <span onClick={addTrackDay} className="ml-2">Track a new day</span>
                    </a>
                </section>
                <section className="border-t border-gray-600 pt-4">
                    <h2 className="text-gray-300 text-sm uppercase">Days</h2>
                    {
                        tracks.map((track) => {
                            return (
                                <a onClick={() => openTrack(track)} key={track.id} href="#" className="block p-2 rounded hover:bg-gray-700 transition-colors">{track.name}</a>
                            )
                        })
                    }
                </section>
            </nav>
        </aside>
    );
}
