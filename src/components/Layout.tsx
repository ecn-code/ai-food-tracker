import { useState } from "react";
import LeftPanel from "./LeftPanel"
import Header from "./Header"

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  console.log('a')

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <LeftPanel menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <main className="flex-1 bg-gray-100 p-4 md:p-6 flex flex-col">
          <Header setMenuOpen={setMenuOpen} />
          <div className="mt-6 flex-1">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-gray-600">Here you can track and manage your data efficiently.</p>
          </div>
        </main>
      </div>
    </div>
  );
}
