
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckSquare, 
  Calendar, 
  Settings, 
  Menu,
  X,
  Bell,
  Search,
  Plus
} from "lucide-react";
import { cn } from "../../lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { icon: CheckSquare, label: "Tasks", active: true },
    { icon: Calendar, label: "Calendar", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 transform border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <span className="text-xl font-bold text-gray-800">Focus List</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-lg p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <nav className="mt-4 px-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "mb-1 flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                item.active
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-900">Pro Tips</p>
            <p className="mt-1 text-xs text-blue-700">
              Use keyboard shortcuts to be more productive. Press '?' to view all shortcuts.
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-200 ease-in-out",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}
      >
        {/* Top navigation */}
        <header className="sticky top-0 z-30 border-b bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="mr-4 rounded-lg p-1 hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6 text-gray-500" />
                </button>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 rounded-lg border border-gray-300 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative rounded-full p-1 hover:bg-gray-100">
                <Bell className="h-6 w-6 text-gray-500" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-blue-500" />
              </button>
              <button className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
                <span className="text-sm font-medium text-white">JD</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto max-w-5xl p-6">{children}</main>
      </div>
    </div>
  );
}