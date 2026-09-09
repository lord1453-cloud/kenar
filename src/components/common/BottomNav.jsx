import React from 'react';
import { 
  Home, 
  PenLine, 
  Radio, 
  Users, 
  BookMarked, 
  User 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav = () => {
  const { activeTab, setActiveTab, setViewingUserId } = useApp();

  const navItems = [
    { id: 'feed', label: 'Akış', icon: Home },
    { id: 'research', label: 'Araştır', icon: BookMarked },
    { id: 'share_thought', label: 'Paylaş', icon: PenLine },
    { id: 'library', label: 'Kitaplığım', icon: Radio },
    { id: 'profile', label: 'Profil', icon: User }
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
