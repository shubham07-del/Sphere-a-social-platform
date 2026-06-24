import React from 'react';
import { User, Bell, Lock, Shield, Moon, LogOut } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { logout } = useAuth();
  
  const settingsSections = [
    { title: 'Account', icon: User },
    { title: 'Notifications', icon: Bell },
    { title: 'Privacy and Security', icon: Lock },
    { title: 'Help and Support', icon: Shield },
    { title: 'Appearance', icon: Moon },
  ];

  return (
    <div className="pt-6 px-4 md:px-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

      <div className="space-y-2">
        {settingsSections.map((section, index) => (
          <button 
            key={index}
            onClick={() => alert(`${section.title} settings coming soon!`)}
            className="w-full flex items-center justify-between p-4 glass rounded-xl hover:bg-card-hover transition-colors group"
          >
            <div className="flex items-center gap-4 text-white">
              <section.icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
              <span className="font-medium">{section.title}</span>
            </div>
            <span className="text-gray-500">{'>'}</span>
          </button>
        ))}
      </div>

      <div className="mt-12">
        <Button variant="danger" fullWidth className="py-4" onClick={logout}>
          <LogOut className="w-5 h-5" />
          Log Out
        </Button>
      </div>
    </div>
  );
};

export default Settings;
