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

      {/* 2x2 Oda Kartları Izgarası: Kesinlikle Basık Olmayan Dik Orijinal Kitap Kapakları (84px × 124px) */}
      <div className="room-grid">
        {allDisplayRooms.map(room => (
          <div 
            key={room.id}
            className="room-card" 
            style={{ position: 'relative' }}
          >
            {/* Dik ve Orantılı 2:3 Kitap Kapağı (84px × 124px) */}
            <div 
              className="rc-cover" 
              onClick={() => openRoom(room)}
              style={{ cursor: 'pointer' }}
              title={`${room.title} kapağı`}
            >
              <BookCover 
                src={room.coverImage || room.cover} 
                title={room.title}
                alt={room.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>

            {/* Oda İçeriği ve Aksiyonlar */}
            <div className="rc-content">
              <div 
                onClick={() => openRoom(room)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{room.icon || '📖'}</span>
                  <div className="rc-title">{room.title}</div>
                </div>
                {room.author && (
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {room.author}
                  </div>
                )}
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-dim)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {room.description}
                </p>
                <div className="rc-sub" style={{ marginTop: '6px' }}>
                  <svg className="icon icon-sm shield" viewBox="0 0 24 24">
                    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/>
                  </svg>
                  <span>{room.sub}</span>
                </div>
              </div>

              {/* Alt Aksiyon Butonları */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                <button 
                  className="btn btn-primary btn-sm"
                  style={{ fontSize: '0.8rem', padding: '5px 12px' }}
                  onClick={() => openRoom(room)}
                >
                  <MessageCircle size={13} />
                  Odaya Gir
                </button>
                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.8rem', padding: '5px 10px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openCustomizeRoom(room);
                  }}
                  title="Oda profilini, kapağını, başlığını ve kurallarını özelleştir"
                >
                  <Sliders size={13} />
                  Özelleştir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
