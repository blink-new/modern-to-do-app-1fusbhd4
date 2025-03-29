
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
  LayoutDashboard,
  LogOut
} from "lucide-react";
import { cn } from "../../lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  view: 'tasks' | 'dashboard' | 'settings';
  onViewChange: (view: 'tasks' | 'dashboard' | 'settings') => void;
}

export function Layout({ children, view, onViewChange }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { icon: CheckSquare, label: "Tasks", value: 'tasks', active: view === 'tasks' },
    { icon: LayoutDashboard, label: "Dashboard", value: 'dashboard', active: view === 'dashboard' },
    { icon: Settings, label: "Settings", value: 'settings', active: view === 'settings' },
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
              onClick={() => onViewChange(item.value as any)}
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
          <button className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
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
              <button className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
                <span className="text-sm font-medium text-white">JD</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="mx-auto max-w-5xl p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}