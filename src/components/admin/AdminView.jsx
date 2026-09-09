import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  MessagesSquare, 
  AlertTriangle, 
  BarChart2, 
  Check, 
  Ban, 
  Trash2,
  Clock,
  BookOpen,
  Crown,
  UserCog,
  ChevronUp,
  ChevronDown,
  ScrollText,
  Bug,
  Ticket,
  Smartphone,
  Monitor,
  RefreshCw,
  Plus,
  Copy,
  Lock,
  Unlock,
  FileText,
  SmartphoneNfc,
  Sparkles,
  Bell
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookCover } from '../common/BookCover';

export const AdminView = () => {
  const { 
    currentUser, 
    users, 
    rooms, 
    books, 
    readingSessions, 
    moderationLogs, 
    toggleUserStatus, 
    closeRoom, 
    unlockRoom,
    launchMonthlyBookClub,
    setSelectedBookId,
    reviewModerationLog,
    formatDuration,
    evaluateMonthlyStarStatus,
    // Rol sistemi
    getUserRole,
    isFounder,
    isAdminUser,
    // Founder: Admin yönetimi
    promoteToAdmin,
    demoteFromAdmin,
    // Admin logları
    adminLogs,
    // Beta Sistemi
    betaFeedbacks,
    refreshBetaFeedbacks,
    updateFeedbackStatus,
    betaTestersData,
    refreshBetaTesters,
    addBetaTesterOrCode,
    betaStatus,
    toggleRestrictedMode,
    setIsFounderSettingsOpen,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'rooms' | 'monthly_club' | 'moderation' | 'system' | 'admin_mgmt' | 'logs' | 'beta_feedback' | 'beta_testers'
  const [feedbackFilter, setFeedbackFilter] = useState('all');
  const [newTesterEmail, setNewTesterEmail] = useState('');
  const [enlargedImage, setEnlargedImage] = useState(null);

  // Aylık Kitap Kulübü Form State (Doküman Paragraf 23)
  const [selectedClubBookId, setSelectedClubBookId] = useState(books[0]?.id || '');
  const [clubAnnouncement, setClubAnnouncement] = useState('');
  const [clubDurationDays, setClubDurationDays] = useState(30);

  if (!isAdminUser()) {
    return (
      <div className="content-layout">
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <Shield size={36} color="var(--color-danger)" style={{ marginBottom: '12px' }} />
          <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Erişim Yetkisi Yok</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Bu alana yalnızca sistem yöneticileri erişebilir.
          </p>
        </div>
      </div>
    );
  }

  // System statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status !== 'suspended').length;
  const totalRooms = rooms.length;
  const totalBooks = books.length;
  const totalSeconds = readingSessions.reduce((acc, s) => acc + s.durationSeconds, 0);
  const founderCount = users.filter(u => u.role === 'founder').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  // Role badge component
  const RoleBadge = ({ role }) => {
    const config = {
      founder: { label: '★ Founder', bg: 'var(--color-star-light)', color: 'var(--color-star)' },
      admin: { label: 'Admin', bg: 'var(--color-primary-light)', color: 'var(--color-primary)' },
      user: { label: 'Kullanıcı', bg: 'var(--bg-surface-elevated)', color: 'var(--text-muted)' }
    };
    const c = config[role] || config.user;
    return (
      <span style={{
        padding: '2px 8px',
        borderRadius: 'var(--radius-xs)',
        fontSize: '0.74rem',
        fontWeight: 700,
        background: c.bg,
        color: c.color
      }}>
        {c.label}
      </span>
    );
  };

  return (
    <div className="content-layout">
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={20} color="var(--color-primary)" />
              <h1 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                Yönetim & Moderasyon Paneli
              </h1>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Kullanıcı hesapları, oda yönetimi, otomatik içerik denetimi ve sistem sağlığı.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isFounder() && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsFounderSettingsOpen(true)}
                style={{
                  fontSize: '0.78rem',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(234, 179, 8, 0.15)',
                  color: 'var(--color-star)',
                  border: '1px solid rgba(234, 179, 8, 0.35)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Crown size={14} /> Kurucu Profilini Düzenle
              </button>
            )}
            <RoleBadge role={getUserRole(currentUser)} />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {currentUser.fullName}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={14} /> Kullanıcılar ({users.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'rooms' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('rooms')}
          >
            <MessagesSquare size={14} /> Odalar ({rooms.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'monthly_club' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('monthly_club')}
            style={{ 
              background: activeTab === 'monthly_club' ? 'var(--color-primary)' : 'rgba(246, 216, 131, 0.22)',
              borderColor: 'rgba(246, 216, 131, 0.6)',
              color: activeTab === 'monthly_club' ? '#fff' : 'var(--text-main)',
              fontWeight: 600,
              gap: '6px'
            }}
          >
            <Sparkles size={14} color="#eab308" /> Aylık Kulüp Kitabı
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'moderation' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('moderation')}
          >
            <AlertTriangle size={14} /> Moderasyon ({moderationLogs.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'system' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('system')}
          >
            <BarChart2 size={14} /> Sistem İstatistikleri
          </button>

          {/* Founder-Only Tabs */}
          {isFounder() && (
            <>
              <button
                className={`btn btn-sm ${activeTab === 'admin_mgmt' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('admin_mgmt')}
                style={{ borderLeft: '2px solid var(--color-star)', marginLeft: '8px', paddingLeft: '14px' }}
              >
                <Crown size={14} /> Admin Yönetimi
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'logs' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('logs')}
              >
                <ScrollText size={14} /> İşlem Logları ({adminLogs.length})
              </button>
            </>
          )}

          {/* Beta Özel Sekmeleri */}
          <button
            className={`btn btn-sm ${activeTab === 'beta_feedback' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setActiveTab('beta_feedback');
              refreshBetaFeedbacks();
            }}
            style={{ borderLeft: '2px solid #f59e0b', marginLeft: '6px', paddingLeft: '12px' }}
          >
            <Bug size={14} /> Beta Feedback ({betaFeedbacks.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'beta_testers' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setActiveTab('beta_testers');
              refreshBetaTesters();
            }}
          >
            <Ticket size={14} /> Beta Testçileri & Davet
          </button>
        </div>

        {/* 1. USERS TAB */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ overflowX: 'auto', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 16px' }}>Kullanıcı</th>
                    <th style={{ padding: '12px 16px' }}>E-posta</th>
                    <th style={{ padding: '12px 16px' }}>Yaş</th>
                    <th style={{ padding: '12px 16px' }}>Rol</th>
                    <th style={{ padding: '12px 16px' }}>Durum</th>
                    <th style={{ padding: '12px 16px' }}>Yıldızlı</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const userRole = getUserRole(u);
                    const canModify = u.id !== currentUser.id && !(userRole === 'founder' && !isFounder());

                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.fullName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>@{u.username}</div>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                          {u.email}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                          {u.age || 25}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <RoleBadge role={userRole} />
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: 'var(--radius-xs)',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            background: u.status === 'suspended' ? 'var(--color-danger-light)' : 'var(--color-success-light)',
                            color: u.status === 'suspended' ? 'var(--color-danger)' : 'var(--color-success)'
                          }}>
                            {u.status === 'suspended' ? 'Askıda' : 'Aktif'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {u.isStarUser ? (
                            <span style={{ color: 'var(--color-star)', fontWeight: 700 }}>
                              ★ Yıldızlı ({u.roomCredit || 0} hak)
                            </span>
                          ) : (
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: '0.75rem', padding: '2px 6px' }}
                              onClick={() => evaluateMonthlyStarStatus(u.id, '2026-08')}
                              title="Aylık performans değerlendirmesi yap"
                            >
                              Değerlendir
                            </button>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          {canModify && (
                            <button
                              className={`btn btn-sm ${u.status === 'suspended' ? 'btn-primary' : 'btn-secondary'}`}
                              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                              onClick={() => toggleUserStatus(u.id)}
                            >
                              {u.status === 'suspended' ? 'Aktifleştir' : 'Askıya Al'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              * Güvenlik gereği kullanıcı parolaları veritabanında açık tutulmaz ve yönetim panelinde görüntülenmez.
              {!isFounder() && ' • Admin, Kurucu (Founder) hesabı üzerinde işlem yapamaz.'}
            </span>
          </div>
        )}

        {/* 2. ROOMS TAB */}
        {activeTab === 'rooms' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {rooms.map(room => {
              const owner = users.find(u => u.id === room.adminId);
              return (
                <div
                  key={room.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.96rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>{room.icon}</span> {room.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Yönetici: {owner?.fullName || 'Admin'} • {room.members.length} Üye
                    </div>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--color-danger)' }}
                    onClick={() => closeRoom(room.id)}
                  >
                    <Trash2 size={14} /> Odayı Kapat
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* 2.5 MONTHLY BOOK CLUB TAB (Doküman Paragraf 23) */}
        {activeTab === 'monthly_club' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Explanatory Banner */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(246, 216, 131, 0.22) 0%, rgba(252, 213, 211, 0.22) 100%)',
              border: '1px solid rgba(246, 216, 131, 0.45)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 22px',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                background: 'var(--color-primary)',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Sparkles size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-main)' }}>
                  Aylık Kitap Kulübü & Kilitli Tartışma Odası Yönetimi
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                  Yönetici olarak her ay topluluk okuması için bir kitap belirleyin. Kulüp başlatıldığında <strong>tüm kullanıcılara anında bildirim iletilir</strong> (bildirimde <em>"İstek Listene Ekle"</em> butonu yer alır). Tartışma odası 1 ay (veya belirlediğiniz süre) boyunca kilitli kalır; süre sonunda otomatik olarak tüm okurların katılımına ve mesajlaşmaya açılır.
                </p>
              </div>
            </div>

            {/* Launch New Monthly Club Form */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                <BookOpen size={18} color="var(--color-primary)" />
                <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                  Yeni Aylık Kulüp Kitabı Seç ve Başlat
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 180px', gap: '20px', alignItems: 'start' }}>
                {/* Form Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Kulüp Kitabı Seçin
                    </label>
                    <select
                      className="form-input"
                      value={selectedClubBookId}
                      onChange={(e) => setSelectedClubBookId(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}
                    >
                      {books.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.title} — {b.author} ({b.genre || 'Genel'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Özel Yönetici Duyurusu / Tartışma Hedefi
                    </label>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder="Bu ay topluluğumuzla bu eseri birlikte okuyoruz. Kitap hakkında notlarınızı alın, ay sonunda odamızda derinlemesine inceleyeceğiz!"
                      value={clubAnnouncement}
                      onChange={(e) => setClubAnnouncement(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', resize: 'vertical' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
                      Kilit Süresi (Geri Sayım - Gün)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={90}
                      className="form-input"
                      value={clubDurationDays}
                      onChange={(e) => setClubDurationDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
                      style={{ width: '140px', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}
                    />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '10px' }}>
                      (Varsayılan: 30 gün = 1 ay)
                    </span>
                  </div>

                  <div style={{ paddingTop: '8px' }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => {
                        if (!selectedClubBookId) return;
                        launchMonthlyBookClub({
                          bookId: selectedClubBookId,
                          description: clubAnnouncement,
                          unlockDays: parseInt(clubDurationDays, 10) || 30
                        });
                        setClubAnnouncement('');
                      }}
                      style={{
                        padding: '10px 20px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: 600,
                        background: 'var(--color-primary)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <Sparkles size={16} /> Aylık Kulüp Kitabını Başlat & Bildirimi Gönder
                    </button>
                  </div>
                </div>

                {/* Selected Book Live Preview Card */}
                {(() => {
                  const targetB = books.find(b => b.id === selectedClubBookId) || books[0];
                  if (!targetB) return null;
                  return (
                    <div style={{
                      background: 'var(--bg-surface-elevated)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      <BookCover
                        src={targetB.cover}
                        title={targetB.title}
                        alt={targetB.title}
                        style={{
                          width: '90px',
                          height: '135px',
                          borderRadius: 'var(--radius-xs)',
                          marginBottom: '10px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                        }}
                      />
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.3 }}>
                        {targetB.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                        {targetB.author}
                      </div>
                      <div style={{
                        marginTop: '8px',
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(246, 216, 131, 0.25)',
                        color: 'var(--text-main)',
                        fontWeight: 600
                      }}>
                        {targetB.genre} • {targetB.pages} sf.
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* List of Active Monthly Club Rooms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                  Aktif ve Geçmiş Aylık Kitap Kulübü Odaları
                </h3>
              </div>

              {rooms.filter(r => r.isMonthlyClub).length === 0 ? (
                <div style={{
                  padding: '30px',
                  textAlign: 'center',
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px dashed var(--border-subtle)',
                  color: 'var(--text-muted)',
                  fontSize: '0.88rem'
                }}>
                  Henüz başlatılmış bir aylık kitap kulübü odası bulunmuyor. Yukarıdaki formdan ilk kulüp kitabını başlatabilirsiniz.
                </div>
              ) : (
                rooms.filter(r => r.isMonthlyClub).map(room => {
                  const clubBook = books.find(b => b.id === room.bookId);
                  return (
                    <div
                      key={room.id}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {clubBook?.cover && (
                          <BookCover
                            src={clubBook.cover}
                            title={clubBook.title}
                            alt={clubBook.title}
                            style={{
                              width: '44px',
                              height: '66px',
                              borderRadius: '4px',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                              flexShrink: 0
                            }}
                          />
                        )}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.98rem', color: 'var(--text-main)' }}>
                              {room.name}
                            </span>
                            {room.isLocked ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'rgba(239, 68, 68, 0.12)',
                                color: 'var(--color-danger)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.74rem',
                                fontWeight: 600
                              }}>
                                <Lock size={12} /> Kilitli (Kalan: {room.countdownDays || 0} gün)
                              </span>
                            ) : (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'rgba(16, 185, 129, 0.12)',
                                color: 'var(--color-success)',
                                border: '1px solid rgba(16, 185, 129, 0.25)',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.74rem',
                                fontWeight: 600
                              }}>
                                <Unlock size={12} /> Tartışmaya Açık
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {room.description}
                          </div>
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                            Açılış Tarihi: {room.unlockDate || 'Belirtilmedi'} • Üyeler: {room.members.length} okur
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {room.isLocked && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => unlockRoom(room.id)}
                            style={{
                              fontSize: '0.78rem',
                              color: 'var(--color-success)',
                              borderColor: 'rgba(16, 185, 129, 0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <Unlock size={13} /> Kilidi Kaldır (Erken Aç)
                          </button>
                        )}
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ color: 'var(--color-danger)' }}
                          onClick={() => closeRoom(room.id)}
                        >
                          <Trash2 size={13} /> Odayı Kapat
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* 3. MODERATION LOGS */}
        {activeTab === 'moderation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {moderationLogs.length > 0 ? (
              moderationLogs.map(log => (
                <div
                  key={log.id}
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={14} /> {log.reason}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      {log.timestamp}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                    Kullanıcı: <strong>{log.userName}</strong>
                  </div>

                  <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', background: 'var(--bg-surface-elevated)', padding: '10px 14px', borderRadius: 'var(--radius-xs)' }}>
                    {log.postContent}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px' }}>
                    <span style={{ fontSize: '0.78rem', color: log.adminReviewed ? 'var(--color-success)' : 'var(--color-star)', fontWeight: 600 }}>
                      Durum: {log.status === 'blocked' ? 'Engellendi' : (log.status === 'restored' ? 'Geri Yüklendi' : 'Kalıcı Kaldırıldı')}
                    </span>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.78rem' }} onClick={() => reviewModerationLog(log.id, 'restore')}>
                        <Check size={13} /> Onayla
                      </button>
                      <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.78rem', color: 'var(--color-danger)' }} onClick={() => reviewModerationLog(log.id, 'confirm')}>
                        <Ban size={13} /> Engeli Onayla
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                Şu anda incelenmeyi bekleyen moderasyon kaydı bulunmuyor.
              </div>
            )}
          </div>
        )}

        {/* 4. SYSTEM STATISTICS */}
        {activeTab === 'system' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Toplam Kullanıcı</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>{totalUsers}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--color-success)', marginTop: '2px' }}>{activeUsers} aktif hesap</div>
            </div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rol Dağılımı</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
                {founderCount} <span style={{ fontSize: '0.8rem', color: 'var(--color-star)' }}>Founder</span>
                {' '}{adminCount} <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)' }}>Admin</span>
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '2px' }}>{totalUsers - founderCount - adminCount} normal kullanıcı</div>
            </div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Okuma Odaları</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>{totalRooms}</div>
            </div>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '18px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Toplam Okuma Süresi</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary)', marginTop: '4px' }}>{formatDuration(totalSeconds)}</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '2px' }}>{readingSessions.length} seans</div>
            </div>
          </div>
        )}

        {/* 5. FOUNDER-ONLY: ADMIN MANAGEMENT TAB */}
        {activeTab === 'admin_mgmt' && isFounder() && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--color-star)', borderRadius: 'var(--radius-sm)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Crown size={18} color="var(--color-star)" />
              <div style={{ fontSize: '0.86rem', color: 'var(--text-main)' }}>
                <strong>Kurucu (Founder) Yönetim Alanı:</strong> Bu bölüm yalnızca size özeldir. Buradan admin atama, admin yetkisi kaldırma ve rol yönetimi yapabilirsiniz.
              </div>
            </div>

            <div style={{ overflowX: 'auto', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 16px' }}>Kullanıcı</th>
                    <th style={{ padding: '12px 16px' }}>Mevcut Rol</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => {
                    const role = getUserRole(u);
                    return (
                      <tr key={u.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.fullName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>@{u.username} • {u.email}</div>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <RoleBadge role={role} />
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          {role === 'founder' ? (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                              Kurucu hesabı değiştirilemez
                            </span>
                          ) : role === 'admin' ? (
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ fontSize: '0.75rem' }}
                              onClick={() => demoteFromAdmin(u.id)}
                            >
                              <ChevronDown size={14} /> Admin Yetkisini Kaldır
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ fontSize: '0.75rem' }}
                              onClick={() => promoteToAdmin(u.id)}
                            >
                              <ChevronUp size={14} /> Admin Yap
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
              * Admin oluşturma ve kaldırma işlemleri yalnızca Kurucu (Founder) tarafından yapılabilir.
              Hiçbir Admin bu alanı göremez veya Founder hesabını değiştiremez.
            </span>
          </div>
        )}

        {/* 6. FOUNDER-ONLY: ADMIN ACTION LOGS */}
        {activeTab === 'logs' && isFounder() && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
              Admin ve Founder işlem geçmişi ({adminLogs.length} kayıt)
            </div>

            {adminLogs.length > 0 ? (
              adminLogs.map(log => {
                const actor = users.find(u => u.id === log.actorId);
                const target = log.targetUserId ? users.find(u => u.id === log.targetUserId) : null;

                const actionLabels = {
                  promote_to_admin: 'Admin Yetkilendirme',
                  demote_from_admin: 'Admin Yetkisi Kaldırma',
                  toggle_user_status: 'Hesap Durum Değişikliği',
                  close_room: 'Oda Kapatma'
                };

                return (
                  <div
                    key={log.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-xs)',
                      padding: '12px 16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '14px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <RoleBadge role={log.actorRole} />
                        <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                          {actor?.fullName || log.actorId}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          → {actionLabels[log.action] || log.action}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {log.details}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
                      {log.timestamp}
                    </span>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                Henüz kayıtlı işlem bulunmuyor.
              </div>
            )}
          </div>
        )}

        {/* --- BETA FEEDBACK GÖRÜNÜMÜ --- */}
        {activeTab === 'beta_feedback' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Üst Bilgi ve Filtreler */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', margin: '0 0 4px 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bug size={18} color="#f59e0b" />
                  Özel Beta Testçi Hata ve Geri Bildirimleri
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                  Web, iOS ve Android istemcilerinden bildirilen tüm hatalar, ekran görüntüleri ve cihaz detayları.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <select
                  value={feedbackFilter}
                  onChange={(e) => setFeedbackFilter(e.target.value)}
                  style={{
                    padding: '6px 10px',
                    fontSize: '0.82rem',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--bg-surface-elevated)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <option value="all">Tüm Durumlar (Hepsi)</option>
                  <option value="yeni">● Yalnızca Yeniler</option>
                  <option value="inceleniyor">⏳ İncelenenler</option>
                  <option value="cozuldu">✓ Çözülenler</option>
                </select>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={refreshBetaFeedbacks}
                  title="Listeyi Yenile"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {/* Geri Bildirim Listesi */}
            {betaFeedbacks.filter(f => feedbackFilter === 'all' || f.status === feedbackFilter).length > 0 ? (
              betaFeedbacks
                .filter(f => feedbackFilter === 'all' || f.status === feedbackFilter)
                .map(fb => (
                  <div
                    key={fb.id}
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                              {fb.userName || 'Beta Okuru'}
                            </span>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              ({fb.userEmail})
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            {/* Platform Rozeti */}
                            {fb.platform === 'ios' ? (
                              <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '2px 8px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: 700 }}>
                                📱 iOS (TestFlight)
                              </span>
                            ) : fb.platform === 'android' ? (
                              <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '2px 8px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: 700 }}>
                                🤖 Android (Internal)
                              </span>
                            ) : (
                              <span style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', padding: '2px 8px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: 700 }}>
                                💻 Web
                              </span>
                            )}
                            {fb.type === 'beta_application' && (
                              <span style={{ background: 'rgba(234, 179, 8, 0.2)', color: 'var(--color-star)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.74rem', fontWeight: 700 }}>
                                📋 KAPALI BETA BAŞVURUSU
                              </span>
                            )}
                            <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                              Sürüm: {fb.appVersion || '0.1.0-beta'}
                            </span>
                            <span style={{ fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                              • Ekran: <strong>{fb.screen}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Durum Seçici & Başvuru Onaylama */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {fb.type === 'beta_application' && fb.status !== 'cozuldu' && (
                          <button
                            className="btn btn-xs"
                            style={{ fontSize: '0.72rem', padding: '3px 10px', background: 'var(--color-star)', color: '#000', fontWeight: 700, border: 'none', borderRadius: '4px' }}
                            onClick={async () => {
                              await addBetaTesterOrCode({ email: fb.userEmail, name: fb.userName, generateCode: true });
                              await updateFeedbackStatus(fb.id, 'cozuldu');
                              showToast(`Testçi onaylandı ve davet kodu üretildi!`, '🎟️');
                            }}
                          >
                            <Ticket size={12} /> Testçi Yap & Kod Üret
                          </button>
                        )}
                        <button
                          className={`btn btn-xs ${fb.status === 'yeni' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ fontSize: '0.72rem', padding: '3px 8px' }}
                          onClick={() => updateFeedbackStatus(fb.id, 'yeni')}
                        >
                          Yeni
                        </button>
                        <button
                          className={`btn btn-xs ${fb.status === 'inceleniyor' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ fontSize: '0.72rem', padding: '3px 8px', background: fb.status === 'inceleniyor' ? '#f59e0b' : undefined }}
                          onClick={() => updateFeedbackStatus(fb.id, 'inceleniyor')}
                        >
                          İnceleniyor
                        </button>
                        <button
                          className={`btn btn-xs ${fb.status === 'cozuldu' ? 'btn-primary' : 'btn-secondary'}`}
                          style={{ fontSize: '0.72rem', padding: '3px 8px', background: fb.status === 'cozuldu' ? '#10b981' : undefined }}
                          onClick={() => updateFeedbackStatus(fb.id, 'cozuldu')}
                        >
                          Çözüldü
                        </button>
                      </div>
                    </div>

                    {/* Açıklama */}
                    <div style={{
                      background: 'var(--bg-surface-elevated)',
                      padding: '12px',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.88rem',
                      color: 'var(--text-main)',
                      lineHeight: '1.5'
                    }}>
                      {fb.description}
                    </div>

                    {/* Ekran Görüntüsü Varsa */}
                    {fb.screenshotUrl && (
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                          İliştirilmiş Ekran Görüntüsü:
                        </span>
                        <img
                          src={fb.screenshotUrl}
                          alt="Hata Ekranı"
                          style={{
                            maxHeight: '140px',
                            borderRadius: 'var(--radius-xs)',
                            border: '1px solid var(--border-subtle)',
                            cursor: 'pointer'
                          }}
                          onClick={() => setEnlargedImage(fb.screenshotUrl)}
                        />
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                      <span>Rapor ID: {fb.id}</span>
                      <span>{new Date(fb.createdAt).toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                Henüz bu filtreye uyan bir hata bildirimi bulunmuyor.
              </div>
            )}
          </div>
        )}

        {/* --- BETA TESTÇİLERİ VE DAVET YÖNETİMİ --- */}
        {activeTab === 'beta_testers' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* KAPALI BETA KİLİDİ & ORTAM YÖNETİMİ */}
            <div style={{
              background: betaStatus.restrictedMode 
                ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(17, 24, 39, 0.8) 100%)'
                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(17, 24, 39, 0.8) 100%)',
              border: `1px solid ${betaStatus.restrictedMode ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.35)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {betaStatus.restrictedMode ? (
                    <Lock size={22} color="#f59e0b" />
                  ) : (
                    <Unlock size={22} color="#10b981" />
                  )}
                  <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700, color: 'var(--text-main)' }}>
                    Kapalı Beta Durumu: {betaStatus.restrictedMode ? 'ÖZEL İZİNLİ KİLİT AKTİF' : 'GENEL ERİŞİME AÇIK'}
                  </h3>
                </div>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '6px 0 0', maxWidth: '620px' }}>
                  {betaStatus.restrictedMode 
                    ? 'Yalnızca davet koduna sahip veya listede onaylı olan testçiler (iOS TestFlight, Android & Web) giriş yapabilir.'
                    : 'Kısıtlama kapalı. Herhangi bir kullanıcı platforma kaydolabilir ve doğrudan kullanabilir.'}
                </p>
              </div>

              <button
                className="btn btn-primary"
                onClick={toggleRestrictedMode}
                style={{
                  background: betaStatus.restrictedMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: betaStatus.restrictedMode ? '#f59e0b' : '#10b981',
                  border: `1px solid ${betaStatus.restrictedMode ? '#f59e0b' : '#10b981'}`,
                  fontWeight: 700,
                  padding: '10px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {betaStatus.restrictedMode ? <Unlock size={16} /> : <Lock size={16} />}
                <span>{betaStatus.restrictedMode ? 'Kısıtlamayı Kaldır (Genel Aç)' : 'Kapalı Betaya Al (Özel İzinli)'}</span>
              </button>
            </div>

            {/* Bilgilendirme Kartı */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '18px'
            }}>
              <h3 style={{ fontSize: '1.02rem', margin: '0 0 8px 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Ticket size={18} color="var(--color-primary)" />
                Özel Beta Altyapı Parametreleri
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 12px 0' }}>
                Uygulama istemcileri (Web, iPhone ve Android) isteklerinde <code>x-client-platform</code> ve <code>x-beta-invite-code</code> başlıklarını gönderir.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: 'var(--radius-xs)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Ortam Durumu</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: betaStatus.restrictedMode ? '#f59e0b' : '#10b981', marginTop: '4px' }}>
                    {betaStatus.environment.toUpperCase()} ({betaStatus.restrictedMode ? 'Kısıtlı Mod' : 'Açık Mod'})
                  </div>
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: 'var(--radius-xs)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Sürüm & Build</span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '4px' }}>
                    v{betaStatus.appVersion} (Build {betaStatus.buildNumber || 1})
                  </div>
                </div>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '12px', borderRadius: 'var(--radius-xs)' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>Tanımlı Tekil Testçi</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-success)', marginTop: '4px' }}>
                    {betaTestersData?.designatedTesterEmail || 'beta@kitapkulubu.com'}
                  </div>
                </div>
              </div>
            </div>

            {/* Yeni Testçi / Davet Kodu Tanımlama */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '18px'
            }}>
              <h4 style={{ fontSize: '0.95rem', margin: '0 0 12px 0', color: 'var(--text-main)' }}>
                Yeni Testçi Davet Et veya Davet Kodu Üret
              </h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  placeholder="Test kullanıcısının e-postası (örn: test@kitapkulubu.com)"
                  value={newTesterEmail}
                  onChange={(e) => setNewTesterEmail(e.target.value)}
                  style={{
                    flex: '1',
                    minWidth: '240px',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--bg-surface-elevated)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.88rem'
                  }}
                />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={async () => {
                    if (!newTesterEmail.trim()) return;
                    await addBetaTesterOrCode({ email: newTesterEmail.trim(), generateCode: true });
                    setNewTesterEmail('');
                  }}
                >
                  <Plus size={14} /> Testçi Ekle & Kod Üret
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={async () => {
                    await addBetaTesterOrCode({ generateCode: true });
                  }}
                >
                  <Ticket size={14} /> Sadece Davet Kodu Üret
                </button>
              </div>

              {/* Aktif Kodlar */}
              {betaTestersData?.activeInviteCodes && betaTestersData.activeInviteCodes.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    Sistemde Aktif Olan Beta Davet Kodları (Kopyalamak için tıklayın):
                  </span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {betaTestersData.activeInviteCodes.map(code => (
                      <button
                        key={code}
                        onClick={() => {
                          navigator.clipboard.writeText(code);
                          showToast(`Kod panoya kopyalandı: ${code}`, '📋');
                        }}
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.84rem',
                          background: 'var(--bg-surface-elevated)',
                          border: '1px dashed var(--color-primary)',
                          color: 'var(--color-primary)',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-xs)',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        title="Kodu kopyala"
                      >
                        <span>{code}</span>
                        <Copy size={13} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MOBİL (IOS & ANDROID) KAPALI BETA DAĞITIM REHBERİ */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '18px'
            }}>
              <h4 style={{ fontSize: '0.95rem', margin: '0 0 12px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={16} color="var(--color-primary)" />
                Android & iPhone (iOS) Kapalı Beta Dağıtım Kılavuzu
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#60a5fa', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>📱 iPhone (iOS TestFlight)</span>
                  </div>
                  <ol style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, paddingLeft: '18px', lineHeight: 1.6 }}>
                    <li><code>cd mobile && eas build --platform ios --profile beta</code> komutu ile IPA derleyin.</li>
                    <li>Apple App Store Connect &gt; TestFlight alanında "Internal / External Testing" grubu açın.</li>
                    <li>Testçinizin Apple ID e-postasını ekleyin; testçiye Apple'dan davet bildirimi gider.</li>
                    <li>Uygulamayı açtığında sizin verdiğiniz Davet Kodunu girerek kilitli içeriklere erişir.</li>
                  </ol>
                </div>

                <div style={{ background: 'var(--bg-surface-elevated)', padding: '14px', borderRadius: 'var(--radius-xs)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#34d399', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🤖 Android (Google Play & Doğrudan APK)</span>
                  </div>
                  <ol style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0, paddingLeft: '18px', lineHeight: 1.6 }}>
                    <li><strong>Doğrudan APK:</strong> <code>eas build --platform android --profile preview</code> ile anında yüklenebilir APK üretin ve testçilere link verin.</li>
                    <li><strong>Google Play Console:</strong> "Kapalı Test" veya "Dahili Test" kanalına AAB yükleyin.</li>
                    <li>Testçilerin Gmail adreslerini yetkilendirin veya davet linkini iletin.</li>
                    <li>Uygulamaya girerken aynı şekilde kapalı beta davet koduyla doğrulama yaparlar.</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Testçiler Tablosu */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '18px'
            }}>
              <h4 style={{ fontSize: '0.95rem', margin: '0 0 12px 0', color: 'var(--text-main)' }}>
                Kayıtlı Beta Testçileri ({betaTestersData?.testers?.length || 0})
              </h4>

              {betaTestersData?.testers && betaTestersData.testers.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {betaTestersData.testers.map(t => (
                    <div
                      key={t.id}
                      style={{
                        padding: '10px 14px',
                        background: 'var(--bg-surface-elevated)',
                        borderRadius: 'var(--radius-xs)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                          {t.name} ({t.email})
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          Cihaz: {t.device} • Davet Kodu: <code>{t.inviteCode}</code>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.74rem', background: '#10b98120', color: '#10b981', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
                        {t.status === 'active' ? 'Aktif Testçi' : t.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Henüz ek bir testçi kaydedilmedi. Belirlenen tekil testçi e-postası: <strong>{betaTestersData?.designatedTesterEmail}</strong>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
