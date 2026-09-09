import React, { useState } from 'react';
import { Sliders, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookCover } from '../common/BookCover';

export const RoomChatView = () => {
  const { activeRoomData, currentUser, openCustomizeRoom, setActiveTab } = useApp();
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  const [inputText, setInputText] = useState('');
  const [extraMessages, setExtraMessages] = useState([]);

  const handleSendMessage = (e) => {
    if (e.key === 'Enter' && inputText.trim()) {
      setExtraMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          author: currentUser?.fullName || 'Ayşe Yılmaz',
          text: inputText.trim()
        }
      ]);
      setInputText('');
    }
  };

  return (
    <div className="content">
      {/* Oda Başlığı ve Özelleştirme Aksiyonu */}
      <div className="room-header">
        <div className="room-header-left">
          <div style={{ width: '64px', height: '94px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
            <BookCover 
              src={activeRoomData?.coverImage || activeRoomData?.cover} 
              title={activeRoomData?.title || 'Kayıp Zamanın İzinde'} 
              alt={activeRoomData?.title} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>{activeRoomData?.icon || '📖'}</span>
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800 }}>{activeRoomData?.title || 'Kayıp Zamanın İzinde'}</h2>
            </div>
            {activeRoomData?.author && (
              <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {activeRoomData.author}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              <div className="badge badge-green">
                <svg viewBox="0 0 24 24" style={{ width: '12px', height: '12px' }}>
                  <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                {activeRoomData?.rules || 'Otomatik filtre aktif'}
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                {activeRoomData?.members || '412 üye'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => openCustomizeRoom(activeRoomData)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Oda profilini, kapağını, başlığını ve kurallarını özelleştir"
          >
            <Sliders size={14} />
            Oda Profilini Özelleştir
          </button>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('rooms')}
          >
            ← Odalara Dön
          </button>
        </div>
      </div>

      {/* Mesaj Listesi */}
      <div className="chat-list">
        {/* Mesaj 1: Ayşe Yılmaz */}
        <div className="msg">
          <div 
            className="avatar" 
            style={{ width: '30px', height: '30px', background: 'linear-gradient(155deg,#8B4A34,#455C46)' }} 
          />
          <div className="msg-body">
            <div className="msg-name">Ayşe Yılmaz</div>
            <div className="msg-text">Dördüncü bölümdeki zaman sıçraması gerçekten şaşırtıcıydı.</div>
          </div>
        </div>

        {/* Mesaj 2: Mert Kaya (Spoiler Filtreli ve Tıklanınca Açılan) */}
        <div 
          className={`msg ${!spoilerRevealed ? 'spoiler-wrap' : ''}`}
          onClick={() => setSpoilerRevealed(true)}
          style={{ cursor: !spoilerRevealed ? 'pointer' : 'default' }}
        >
          <div 
            className="avatar" 
            style={{ width: '30px', height: '30px', background: 'linear-gradient(155deg,#5C6151,#2f3229)' }} 
          />
          <div className={`msg-body ${!spoilerRevealed ? 'blurred' : ''}`}>
            <div className="msg-name">Mert Kaya</div>
            <div className="msg-text">Finalde karakterin aslında ölmüş olduğu ortaya çıkıyor ve...</div>
          </div>
          {!spoilerRevealed && (
            <div className="spoiler-overlay">
              <span className="badge badge-orange">
                <svg viewBox="0 0 24 24">
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/>
                  <line x1="3" y1="3" x2="21" y2="21"/>
                </svg>
                Spoiler içeriyor
              </span>
              <span style={{ marginTop: '4px' }}>Görmek için dokun</span>
            </div>
          )}
        </div>

        {/* Mesaj 3: Otomatik Filtre Tarafından Kaldırıldı */}
        <div className="msg">
          <div 
            className="avatar" 
            style={{ width: '30px', height: '30px', background: 'linear-gradient(155deg,#8B4A34,#455C46)' }} 
          />
          <span className="badge badge-red">
            <svg viewBox="0 0 24 24">
              <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/>
              <line x1="9" y1="9" x2="15" y2="14"/>
              <line x1="15" y1="9" x2="9" y2="14"/>
            </svg>
            Otomatik filtre tarafından kaldırıldı
          </span>
        </div>

        {/* Mesaj 4: Elif Demir (Yazar) */}
        <div className="msg">
          <div 
            className="avatar" 
            style={{ width: '30px', height: '30px', background: 'linear-gradient(155deg,#AF52DE,#6d2f8f)' }} 
          />
          <div className="msg-body">
            <div className="msg-name">Elif Demir</div>
            <div className="msg-text">Bu bölümü yazarken hafızanın güvenilmezliği üzerine çok düşündüm.</div>
          </div>
        </div>

        {/* Kullanıcının Eklediği Notlar */}
        {extraMessages.map(m => (
          <div key={m.id} className="msg">
            <div 
              className="avatar" 
              style={{ width: '30px', height: '30px', background: 'linear-gradient(155deg,#8B4A34,#455C46)' }} 
            />
            <div className="msg-body">
              <div className="msg-name">{m.author}</div>
              <div className="msg-text">{m.text}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mesaj Input Alanı */}
      <div className="chat-input">
        <input 
          type="text" 
          placeholder="Kenar notunu paylaş..." 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleSendMessage}
        />
      </div>
    </div>
  );
};
