import React from 'react';
import { useApp } from '../../context/AppContext';
import { FEATURED_COVERS } from '../../data/featuredBooksCovers';
import { BookCover } from '../common/BookCover';
import { Plus, Sliders, Shield, Users, Sparkles, MessageCircle } from 'lucide-react';

export const RoomsView = () => {
  const { openRoom, rooms, openCustomizeRoom, setIsCreateRoomOpen } = useApp();

  // Varsayılan zengin edebi odalar
  const defaultRoomsList = [
    {
      id: 'room-1',
      title: FEATURED_COVERS.kayip_zaman.title,
      name: FEATURED_COVERS.kayip_zaman.title,
      author: FEATURED_COVERS.kayip_zaman.author,
      cover: FEATURED_COVERS.kayip_zaman.cover,
      coverImage: FEATURED_COVERS.kayip_zaman.cover,
      icon: '🏛️',
      sub: '412 üye · Eylül seçkisi',
      members: 412,
      description: 'Zamanın akışkanlığı ve madlen keki hatıraları üzerine sakin edebi tahliller.'
    },
    {
      id: 'room-2',
      title: FEATURED_COVERS.beyaz_gece.title,
      name: FEATURED_COVERS.beyaz_gece.title,
      author: FEATURED_COVERS.beyaz_gece.author,
      cover: FEATURED_COVERS.beyaz_gece.cover,
      coverImage: FEATURED_COVERS.beyaz_gece.cover,
      icon: '🌌',
      sub: '298 üye',
      members: 298,
      description: 'St. Petersburg\'un beyaz gecelerinde hayalperest genç ile Nastenka\'nın buluşması.'
    },
    {
      id: 'room-3',
      title: FEATURED_COVERS.sessiz_ev.title,
      name: FEATURED_COVERS.sessiz_ev.title,
      author: FEATURED_COVERS.sessiz_ev.author,
      cover: FEATURED_COVERS.sessiz_ev.cover,
      coverImage: FEATURED_COVERS.sessiz_ev.cover,
      icon: '☕',
      sub: '175 üye',
      members: 175,
      description: 'Cennethisar konağında üç torun ve geçmişin kırılgan siyasi hafızası.'
    },
    {
      id: 'room-4',
      title: FEATURED_COVERS.korluk.title,
      name: FEATURED_COVERS.korluk.title,
      author: FEATURED_COVERS.korluk.author,
      cover: FEATURED_COVERS.korluk.cover,
      coverImage: FEATURED_COVERS.korluk.cover,
      icon: '🕯️',
      sub: '89 üye',
      members: 89,
      description: 'Beyaz körlük salgını ve karantinadaki insanın varoluşsal ahlak sınavı.'
    }
  ];

  // AppContext'teki özel odaları entegre et
  const customRooms = (rooms || []).filter(r => 
    !defaultRoomsList.some(dr => dr.id === r.id || dr.title === r.name || dr.title === r.title)
  ).map(r => ({
    id: r.id,
    title: r.title || r.name,
    name: r.name || r.title,
    author: r.author || 'Edebi Topluluk',
    cover: r.coverImage || r.cover,
    coverImage: r.coverImage || r.cover,
    icon: r.icon || '📖',
    sub: `${(r.members || []).length || 1} üye`,
    members: (r.members || []).length || 1,
    description: r.description || 'Topluluk kitap okuma ve değerlendirme odası.'
  }));

  const allDisplayRooms = [...customRooms, ...defaultRoomsList];

  return (
    <div className="content wide" style={{ maxWidth: '980px', margin: '0 auto' }}>
      
      {/* Üst Başlık & Oda Özelleştirme Ekleme Barı */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Kitap Odaları
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Sakin okuma kulübü odalarında edebi sohbetlere katılın veya odanızı dilediğiniz gibi özelleştirin.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          onClick={() => openCustomizeRoom({
            title: 'Yeni Kitap Kulübü',
            author: '',
            coverImage: '',
            icon: '📖',
            description: 'Bu odada hep birlikte okuyoruz.'
          })}
        >
          <Plus size={16} />
          Yeni Oda Oluştur & Özelleştir
        </button>
      </div>

      {/* Yeşil Otomatik Filtreleme Bilgilendirme Rozeti */}
      <div className="ai-note" style={{ marginBottom: '20px' }}>
        <span className="badge badge-green" style={{ padding: '6px 12px', fontSize: '12px' }}>
          <svg viewBox="0 0 24 24" style={{ width: '13px', height: '13px' }}>
            <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
          Otomatik spoiler koruması ve yapay zeka içerik filtresi tüm odalarda devrededir.
        </span>
      </div>

      {/* 2x2 Oda Kartları Izgarası (Screenshot 4 Birebir Tasarım) */}
      <div className="room-grid">
        {allDisplayRooms.map(room => {
          const defaultBannerColors = {
            'room-1': 'linear-gradient(155deg,#8B4A34,#5b3527)',
            'room-2': 'linear-gradient(155deg,#455C46,#26331f)',
            'room-3': 'linear-gradient(155deg,#A9832E,#6b551d)',
            'room-4': 'linear-gradient(155deg,#5C6151,#2f3229)'
          };
          const bgBanner = room.bannerColor || defaultBannerColors[room.id] || 'linear-gradient(155deg,#8B4A34,#455C46)';

          return (
            <div 
              key={room.id}
              className="room-card"
              onClick={() => openRoom(room)}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              {/* Geniş ve Pürüzsüz Renkli Kapak Bannerı (Screenshot 4) */}
              <div 
                className="rc-cover" 
                style={{ 
                  background: bgBanner,
                  borderRadius: '9px',
                  height: '120px',
                  marginBottom: '12px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <button
                    className="icon-btn"
                    style={{ width: '28px', height: '28px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: 'none' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      openCustomizeRoom(room);
                    }}
                    title="Odayı Özelleştir"
                  >
                    <Sliders size={13} />
                  </button>
                </div>
              </div>

              {/* Başlık ve Üye Bilgisi */}
              <div className="rc-title" style={{ fontSize: '15.5px', fontWeight: 600 }}>
                {room.title}
              </div>
              <div className="rc-sub" style={{ fontSize: '12.5px', color: 'var(--label-2)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg className="icon icon-sm shield" viewBox="0 0 24 24" style={{ color: 'var(--green)' }}>
                  <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/>
                </svg>
                <span>{room.sub || `${room.members} üye`}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
