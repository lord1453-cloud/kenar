import React from 'react';
import { 
  Home, 
  MessagesSquare, 
  Users, 
  BookMarked, 
  User 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav = () => {
  const { activeTab, setActiveTab, setViewingUserId } = useApp();

  const navItems = [
    { id: 'feed', label: 'Akış', icon: Home },
    { id: 'rooms', label: 'Odalar', icon: MessagesSquare },
    { id: 'research', label: 'Kitap Ara', icon: BookMarked },
    { id: 'profiles', label: 'Okurlar', icon: Users },
    { id: 'profile', label: 'Profilim', icon: User }
  ];

  const handleNav = (id) => {
    if (id === 'profile') {
      setViewingUserId(null);
    }
    setActiveTab(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              <Icon size={20} />
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
