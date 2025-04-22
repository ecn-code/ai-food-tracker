import { Menu } from "lucide-react";

export default function Header({ setMenuOpen }: { setMenuOpen: (state: boolean) => void }) {
    return (
        <header className="flex justify-between items-center bg-white shadow-lg p-2 md:p-4 rounded-lg w-full transition-all border border-gray-200">
            <button
                className="md:hidden p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                onClick={() => setMenuOpen(true)}
            >
                <Menu size={20} />
            </button>
            <nav aria-label="Main Navigation" className="flex gap-4">
                <a href="#" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">Tracking</a>
                <a href="#" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">Dashboard</a>
                <a href="#" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">Configuration</a>
            </nav>
        </header>
    );
}
