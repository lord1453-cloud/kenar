import React from 'react';
import { useApp } from '../../context/AppContext';
import { FEATURED_COVERS } from '../../data/featuredBooksCovers';
import { BookCover } from '../common/BookCover';
import { Plus, Sliders, Shield, Users, Sparkles, MessageCircle, Folder } from 'lucide-react';
import { APPLE_FOLDER_COLORS } from '../profile/ProfileFoldersModal';
import '../../styles/research-folders.css';

export const RoomsView = () => {
  const { openRoom, rooms, books, openCustomizeRoom, setIsCreateRoomOpen } = useApp();

  // Her ay otomatik olarak hesaplanacak şekilde o ay en çok okunan 3 kitabın kapak resimleri
  const topReadBooksOfMonth = [...(books || [])]
    .sort((a, b) => (b.readersCount || 0) - (a.readersCount || 0))
    .slice(0, 3);

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
      folderColor: '#8B4A34',
      backColor: '#6B3725',
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
      folderColor: '#455C46',
      backColor: '#2F4030',
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
      folderColor: '#A9832E',
      backColor: '#7A5E1F',
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
      folderColor: '#5856D6',
      backColor: '#403EB0',
      description: 'Beyaz körlük salgını ve karantinadaki insanın varoluşsal ahlak sınavı.'
    }
  ];

  // AppContext'teki özel odaları entegre et
  const customRooms = (rooms || []).filter(r => 
    !defaultRoomsList.some(dr => dr.id === r.id || dr.title === r.name || dr.title === r.title)
  ).map((r, idx) => {
    const colorObj = APPLE_FOLDER_COLORS[idx % APPLE_FOLDER_COLORS.length];
    return {
      id: r.id,
      title: r.title || r.name,
      name: r.name || r.title,
      author: r.author || 'Edebi Topluluk',
      cover: r.coverImage || r.cover,
      coverImage: r.coverImage || r.cover,
      icon: r.icon || '📖',
      sub: `${(r.members || []).length || 1} üye`,
      members: (r.members || []).length || 1,
      folderColor: colorObj.hex,
      backColor: colorObj.backHex,
      description: r.description || 'Topluluk kitap okuma ve değerlendirme odası.'
    };
  });

  const allDisplayRooms = [...customRooms, ...defaultRoomsList];

  return (
    <div className="content wide" style={{ maxWidth: '980px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* Üst Başlık & Oda Özelleştirme Ekleme Barı */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Kitap Odaları
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Sakin okuma kulübü odalarında edebi sohbetlere katılın. Oda kapakları o ayın en çok okunan 3 kitabını sergileyen 3D klasör tasarımıdır.
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

      {/* 2x2 Responsive Oda Kartları Izgarası */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {allDisplayRooms.map(room => {
          const folderColor = room.folderColor || '#007AFF';
          const backColor = room.backColor || '#0055B3';

          return (
            <div 
              key={room.id}
              className="room-card"
              onClick={() => openRoom(room)}
              style={{
                cursor: 'pointer',
                position: 'relative',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                padding: '16px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
              }}
            >
              {/* ODA KAPAĞI: KLASÖR İÇİNDE O AY EN ÇOK OKUNAN 3 KİTAP GÖRSELİ */}
              <div 
                style={{ 
                  background: 'var(--bg-surface-elevated)', 
                  borderRadius: '12px', 
                  padding: '12px 8px 6px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  marginBottom: '14px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div 
                  className="folder-stage" 
                  style={{ 
                    transform: 'scale(0.82)', 
                    transformOrigin: 'bottom center',
                    '--folder-front-color': folderColor,
                    '--folder-back-color': backColor
                  }}
                >
                  {/* Klasör Arka Yüzü ve Kulakçığı */}
                  <div className="folder-back" style={{ background: backColor }}>
                    <div className="folder-tab" style={{ background: backColor }}></div>
                  </div>

                  {/* Klasörün içinde o ay en çok okunan 3 kitap */}
                  <div className="folder-tucked-books">
                    {topReadBooksOfMonth.map((b, bIdx) => (
                      <BookCover
                        key={b.id || bIdx}
                        src={b.cover}
                        title={b.title}
                        alt={b.title}
                        className="tucked-book-cover"
                      />
                    ))}
                  </div>

                  {/* Klasör Ön Cebi */}
                  <div className="folder-front" style={{ background: folderColor }}>
                    <span className="folder-front-badge" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                      Ayın En Çok Okunan 3 Kitabı
                    </span>
                  </div>
                </div>

                {/* Özelleştir Butonu */}
                <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10 }}>
                  <button
                    className="icon-btn"
                    style={{ 
                      width: '28px', 
                      height: '28px', 
                      background: 'rgba(0,0,0,0.4)', 
                      color: '#fff', 
                      border: 'none',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
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
              <div className="rc-title" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {room.title}
              </div>
              
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                {room.description}
              </div>

              <div className="rc-sub" style={{ fontSize: '12.5px', color: 'var(--label-2)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg className="icon icon-sm shield" viewBox="0 0 24 24" style={{ color: 'var(--green)', width: '14px', height: '14px' }}>
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
