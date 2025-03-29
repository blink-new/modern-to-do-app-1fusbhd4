
import { useState } from 'react';
import { 
  Moon,
  Sun,
  Layout as LayoutIcon,
  Bell,
  Volume2,
  VolumeX,
  Tag,
  AlertCircle
} from 'lucide-react';
import type { UserPreferences, Category, Priority } from '../lib/types';

interface SettingsProps {
  preferences: UserPreferences;
  onUpdate: (preferences: UserPreferences) => void;
}

export function Settings({ preferences, onUpdate }: SettingsProps) {
  const [currentPreferences, setCurrentPreferences] = useState(preferences);

  const handleChange = (key: keyof UserPreferences, value: any) => {
    const newPreferences = { ...currentPreferences, [key]: value };
    setCurrentPreferences(newPreferences);
    onUpdate(newPreferences);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Preferences</h2>
        <p className="mt-1 text-sm text-gray-500">
          Customize your task management experience
        </p>
      </div>

      <div className="divide-y divide-gray-200 rounded-xl border bg-white">
        {/* Theme */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {currentPreferences.theme === 'dark' ? (
              <Moon className="h-5 w-5 text-gray-500" />
            ) : (
              <Sun className="h-5 w-5 text-gray-500" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">Theme</p>
              <p className="text-sm text-gray-500">Choose your preferred theme</p>
            </div>
          </div>
          <div>
            <select
              value={currentPreferences.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className="rounded-lg border-gray-300 text-sm"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        {/* View */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <LayoutIcon className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Default View</p>
              <p className="text-sm text-gray-500">Choose how tasks are displayed</p>
            </div>
          </div>
          <div>
            <select
              value={currentPreferences.defaultView}
              onChange={(e) => handleChange('defaultView', e.target.value)}
              className="rounded-lg border-gray-300 text-sm"
            >
              <option value="list">List View</option>
              <option value="board">Board View</option>
            </select>
          </div>
        </div>

        {/* Default Category */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Tag className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Default Category</p>
              <p className="text-sm text-gray-500">Set default task category</p>
            </div>
          </div>
          <div>
            <select
              value={currentPreferences.defaultCategory}
              onChange={(e) => handleChange('defaultCategory', e.target.value as Category)}
              className="rounded-lg border-gray-300 text-sm"
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Default Priority */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Default Priority</p>
              <p className="text-sm text-gray-500">Set default task priority</p>
            </div>
          </div>
          <div>
            <select
              value={currentPreferences.defaultPriority}
              onChange={(e) => handleChange('defaultPriority', e.target.value as Priority)}
              className="rounded-lg border-gray-300 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-gray-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">Notifications</p>
              <p className="text-sm text-gray-500">Enable task notifications</p>
            </div>
          </div>
          <div>
            <button
              onClick={() => handleChange('notifications', !currentPreferences.notifications)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                currentPreferences.notifications ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  currentPreferences.notifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Sound */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            {currentPreferences.soundEnabled ? (
              <Volume2 className="h-5 w-5 text-gray-500" />
            ) : (
              <VolumeX className="h-5 w-5 text-gray-500" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">Sound Effects</p>
              <p className="text-sm text-gray-500">Enable sound effects</p>
            </div>
          </div>
          <div>
            <button
              onClick={() => handleChange('soundEnabled', !currentPreferences.soundEnabled)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                currentPreferences.soundEnabled ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  currentPreferences.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}