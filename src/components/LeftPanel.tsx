import { X, Plus } from "lucide-react";

export default function LeftPanel({ menuOpen, setMenuOpen }: { menuOpen: boolean, setMenuOpen: (state: boolean) => void }) {
    console.log('d')

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
                        <span className="ml-2">Track a new day</span>
                    </a>
                </section>
                <section className="border-t border-gray-600 pt-4">
                    <h2 className="text-gray-300 text-sm uppercase">Days</h2>
                    <a href="#" className="block p-2 rounded hover:bg-gray-700 transition-colors">date</a>
                </section>
            </nav>
        </aside>
    );
}
