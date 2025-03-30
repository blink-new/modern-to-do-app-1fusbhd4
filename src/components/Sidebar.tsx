
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Clock,
  Archive,
  Settings,
  Trash2
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const navigation = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: 'dashboard'
    },
    {
      name: 'Tasks',
      icon: CheckSquare,
      path: 'tasks'
    },
    {
      name: 'Calendar',
      icon: Calendar,
      path: 'calendar'
    },
    {
      name: 'Upcoming',
      icon: Clock,
      path: 'upcoming'
    },
    {
      name: 'Archive',
      icon: Archive,
      path: 'archive'
    }
  ];

  const secondaryNavigation = [
    {
      name: 'Settings',
      icon: Settings,
      path: 'settings'
    },
    {
      name: 'Trash',
      icon: Trash2,
      path: 'trash'
    }
  ];

  const NavItem = ({ item }: { item: typeof navigation[0] }) => {
    const isActive = activeTab === item.path;
    const Icon = item.icon;

    return (
      <button
        onClick={() => onTabChange(item.path)}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
        {item.name}
      </button>
    );
  };

  return (
    <div className="flex h-full flex-col gap-y-7 px-3 py-4">
      <nav className="flex flex-1 flex-col gap-1">
        {navigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>
      <nav className="flex flex-col gap-1">
        {secondaryNavigation.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>
    </div>
  );
}