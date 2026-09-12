import React, { useState } from 'react';
import { 
  Folder, 
  FolderPlus, 
  FolderOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ArrowLeft, 
  BookOpen, 
  Star, 
  Sparkles 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { BookCover } from '../common/BookCover';
import '../../styles/research-folders.css';

// Apple iOS Temasına Uygun 12 Seçkin Klasör Rengi
export const APPLE_FOLDER_COLORS = [
  { id: 'ios-blue', name: 'iOS Mavi', hex: '#007AFF', backHex: '#0062CC' },
  { id: 'ios-indigo', name: 'iOS Çivit', hex: '#5856D6', backHex: '#4745B8' },
  { id: 'ios-purple', name: 'iOS Mor', hex: '#AF52DE', backHex: '#933EC0' },
  { id: 'ios-pink', name: 'iOS Pembe', hex: '#FF2D55', backHex: '#D91D42' },
  { id: 'ios-orange', name: 'iOS Turuncu', hex: '#FF9500', backHex: '#D97E00' },
  { id: 'ios-amber', name: 'iOS Kehribar', hex: '#FFCC00', backHex: '#D9AD00' },
  { id: 'ios-green', name: 'iOS Yeşil', hex: '#34C759', backHex: '#28A745' },
  { id: 'ios-mint', name: 'iOS Nane', hex: '#00C7BE', backHex: '#00A39B' },
  { id: 'ios-cyan', name: 'iOS Camgöbeği', hex: '#32ADE6', backHex: '#258EC0' },
  { id: 'ios-rose', name: 'iOS Gül Kurusu', hex: '#FCD5D3', backHex: '#E5BCBA' },
  { id: 'ios-slate', name: 'iOS Kurşun', hex: '#8E8E93', backHex: '#6E6E73' },
  { id: 'ios-midnight', name: 'iOS Gece', hex: '#1C1C1E', backHex: '#2C2C2E' }
];

export const ProfileFoldersModal = () => {
  const { 
    isFoldersModalOpen, 
    setIsFoldersModalOpen, 
    currentUser, 
    userFolders, 
    createUserFolder, 
    updateUserFolder, 
    deleteUserFolder, 
    addBookToUserFolder, 
    removeBookFromUserFolder, 
    moveBookToFolder,
    books, 
    userBooks, 
    setSelectedBookId,
    showToast 
  } = useApp();

  const [activeFolderId, setActiveFolderId] = useState(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [folderName, setFolderName] = useState('');
  const [selectedColor, setSelectedColor] = useState(APPLE_FOLDER_COLORS[0].hex);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [movingBookId, setMovingBookId] = useState(null);

  // Kullanıcının klasörleri
  const myFolders = (userFolders || []).filter(f => f.userId === currentUser.id);
  const isMaxReached = myFolders.length >= 12;

  // Aktif klasör
  const currentFolder = myFolders.find(f => f.id === activeFolderId);
  const currentFolderBooks = currentFolder 
    ? (currentFolder.bookIds || []).map(bId => books.find(b => b.id === bId)).filter(Boolean)
    : [];

  // Kullanıcının okuduğu veya kitaplığındaki kitaplar
  const userReadBookIds = userBooks
    .filter(ub => ub.userId === currentUser.id && (ub.status === 'read' || ub.status === 'reading'))
    .map(ub => ub.bookId);
  
  const userReadBooks = books.filter(b => userReadBookIds.includes(b.id));

  // Klasöre henüz eklenmemiş kitaplar
  const availableToAdd = currentFolder 
    ? userReadBooks.filter(b => !(currentFolder.bookIds || []).includes(b.id))
    : [];

  const handleOpenCreate = () => {
    if (isMaxReached) {
      showToast('Maksimum 12 adet klasör oluşturabilirsiniz!', '⚠️');
      return;
    }
    setEditingFolderId(null);
    setFolderName('');
    setSelectedColor(APPLE_FOLDER_COLORS[myFolders.length % APPLE_FOLDER_COLORS.length].hex);
    setIsCreateMode(true);
  };

  const handleOpenEdit = (folder, e) => {
    e.stopPropagation();
    setEditingFolderId(folder.id);
    setFolderName(folder.name);
    setSelectedColor(folder.color || APPLE_FOLDER_COLORS[0].hex);
    setIsCreateMode(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    if (editingFolderId) {
      updateUserFolder(editingFolderId, { name: folderName.trim(), color: selectedColor });
    } else {
      createUserFolder({ name: folderName.trim(), color: selectedColor });
    }
    setIsCreateMode(false);
    setFolderName('');
    setEditingFolderId(null);
  };

  const handleDelete = (folderId, folderName, e) => {
    e.stopPropagation();
    if (window.confirm(`"${folderName}" klasörünü silmek istediğinize emin misiniz?`)) {
      deleteUserFolder(folderId);
      if (activeFolderId === folderId) {
        setActiveFolderId(null);
      }
    }
  };

  return (
    <Modal
      isOpen={isFoldersModalOpen}
      onClose={() => {
        setIsFoldersModalOpen(false);
        setActiveFolderId(null);
        setIsCreateMode(false);
      }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Folder size={22} color="#007AFF" />
          <span>Kişisel Kitap Dosyaları & Klasörler</span>
          <span className="ios-badge-pill" style={{ marginLeft: '6px' }}>
            {myFolders.length} / 12 Klasör
          </span>
        </div>
      }
      maxWidth="860px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        {/* Üst Bilgilendirme ve Hızlı Eylem Çubuğu */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Okuduğunuz kitapları dosya ceplerinde düzenleyin. En fazla 12 klasör oluşturabilir ve Apple renk paletinden dilediğinizi seçebilirsiniz.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {activeFolderId && (
              <button 
                className="btn-apple-secondary"
                onClick={() => setActiveFolderId(null)}
              >
                <ArrowLeft size={15} />
                <span>Tüm Klasörlere Dön</span>
              </button>
            )}

            {!activeFolderId && (
              <button 
                className="btn-apple-primary"
                onClick={handleOpenCreate}
                disabled={isMaxReached}
                style={{ opacity: isMaxReached ? 0.6 : 1 }}
                title={isMaxReached ? 'Maksimum 12 klasör sınırına ulaştınız' : 'Yeni Klasör Oluştur'}
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Yeni Klasör Oluştur ({myFolders.length}/12)</span>
              </button>
            )}
          </div>
        </div>

        {/* Klasör Oluşturma / Düzenleme Alanı */}
        {isCreateMode && (
          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-strong)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeIn 0.2s ease'
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FolderPlus size={18} color="#007AFF" />
              {editingFolderId ? 'Klasörü Düzenle' : 'Yeni Klasör Tanımla (Maksimum 12)'}
            </h4>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Klasör Adı *
                </label>
                <input 
                  type="text"
                  placeholder="Örn: 2026 Başyapıtları, Türk Klasikleri, Favori Romanlarım..."
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  maxLength={40}
                  required
                  style={{ width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
                  Apple Tema Rengi Seçin:
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {APPLE_FOLDER_COLORS.map(col => {
                    const isSelected = selectedColor === col.hex;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setSelectedColor(col.hex)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: col.hex,
                          border: isSelected ? '3px solid #ffffff' : '1px solid rgba(0,0,0,0.1)',
                          boxShadow: isSelected ? `0 0 0 2px ${col.hex}, 0 2px 8px rgba(0,0,0,0.3)` : 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.15s ease'
                        }}
                        title={col.name}
                      >
                        {isSelected && <Check size={16} color="#ffffff" strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button 
                  type="button"
                  className="btn-apple-secondary"
                  onClick={() => { setIsCreateMode(false); setEditingFolderId(null); }}
                >
                  İptal
                </button>
                <button 
                  type="submit"
                  className="btn-apple-primary"
                  disabled={!folderName.trim()}
                >
                  {editingFolderId ? 'Güncellemeyi Kaydet' : 'Klasörü Oluştur'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 1. SEÇİLİ KLASÖRÜN İÇİ GÖRÜNÜMÜ */}
        {activeFolderId && currentFolder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Klasör Başlık Kartı */}
            <div style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              borderLeft: `6px solid ${currentFolder.color || '#007AFF'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FolderOpen size={28} color={currentFolder.color || '#007AFF'} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 700 }}>
                    {currentFolder.name}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {currentFolderBooks.length} Kitap Bulunuyor • Oluşturulma: {currentFolder.createdAt || '2026'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-apple-primary"
                  onClick={() => setIsAddBookModalOpen(true)}
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                >
                  <Plus size={15} />
                  <span>Kitap Ekle</span>
                </button>
                <button
                  className="btn-apple-secondary"
                  onClick={(e) => handleOpenEdit(currentFolder, e)}
                  title="Klasörü Düzenle"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem' }}
                >
                  <Edit3 size={15} />
                  <span>Düzenle</span>
                </button>
                <button
                  className="btn-ghost btn-sm"
                  style={{ color: 'var(--color-danger)', padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem' }}
                  onClick={(e) => handleDelete(currentFolder.id, currentFolder.name, e)}
                  title="Klasörü Sil"
                >
                  <Trash2 size={15} />
                  <span>Sil</span>
                </button>
              </div>
            </div>

            {/* Klasör İçi Kitap Ekleme Açılır Kutusu */}
            {isAddBookModalOpen && (
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                animation: 'fadeIn 0.2s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Okuduğunuz Kitaplardan Bu Klasöre Ekle:
                  </span>
                  <button 
                    className="btn-icon" 
                    onClick={() => setIsAddBookModalOpen(false)}
                    style={{ width: '28px', height: '28px' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                {availableToAdd.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '10px',
                    maxHeight: '260px',
                    overflowY: 'auto',
                    paddingRight: '6px'
                  }}>
                    {availableToAdd.map(book => (
                      <div
                        key={book.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-surface-elevated)',
                          border: '1px solid var(--border-subtle)',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          addBookToUserFolder(currentFolder.id, book.id);
                        }}
                      >
                        <BookCover 
                          src={book.cover} 
                          title={book.title} 
                          alt={book.title} 
                          style={{ width: '36px', height: '52px', borderRadius: '4px', flexShrink: 0 }} 
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {book.title}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                            {book.author}
                          </div>
                        </div>
                        <button className="btn-apple-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                          +
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.86rem' }}>
                    Tüm okunan kitaplarınız bu klasöre zaten eklenmiş durumda.
                  </div>
                )}
              </div>
            )}

            {/* Klasördeki Kitapların Listesi */}
            {currentFolderBooks.length > 0 ? (
              <div className="category-books-grid">
                {currentFolderBooks.map(book => (
                  <div
                    key={book.id}
                    className="cat-book-card"
                    onClick={() => setSelectedBookId(book.id)}
                    style={{ position: 'relative' }}
                  >
                    <BookCover src={book.cover} title={book.title} alt={book.title} className="cat-book-cover" />
                    <div className="cat-book-info">
                      <span className="cat-book-title" title={book.title}>{book.title}</span>
                      <span className="cat-book-author">{book.author}</span>

                      <div className="cat-book-stats">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#f59e0b', fontWeight: 700 }}>
                          <Star size={12} fill="#f59e0b" color="#f59e0b" />
                          {book.rating}
                        </span>
                        <span style={{ color: 'var(--text-dim)' }}>
                          {book.pages} sf.
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="btn-apple-secondary"
                          style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                          onClick={() => setSelectedBookId(book.id)}
                        >
                          Detay
                        </button>
                        <button
                          className="btn-apple-secondary"
                          style={{ fontSize: '0.74rem', padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                          onClick={() => setMovingBookId(book.id)}
                          title="Başka bir klasöre taşı"
                        >
                          <FolderPlus size={12} />
                          <span>Taşı</span>
                        </button>
                        <button
                          className="btn-ghost btn-sm"
                          style={{ fontSize: '0.74rem', color: 'var(--color-danger)', padding: '3px 8px' }}
                          onClick={() => removeBookFromUserFolder(currentFolder.id, book.id)}
                          title="Klasörden Çıkar"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '48px 20px',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--border-strong)',
                color: 'var(--text-muted)'
              }}>
                <BookOpen size={36} color="var(--text-dim)" style={{ marginBottom: '10px' }} />
                <h4 style={{ margin: '0 0 6px 0', color: 'var(--text-main)' }}>Bu Dosyada Henüz Kitap Yok</h4>
                <p style={{ fontSize: '0.86rem', maxWidth: '420px', margin: '0 auto 16px auto', color: 'var(--text-dim)' }}>
                  Okuma listenizden veya bitirdiğiniz kitaplardan bu klasöre eklemek için yukarıdaki 'Kitap Ekle' butonunu kullanabilirsiniz.
                </p>
                <button 
                  className="btn-apple-primary"
                  onClick={() => setIsAddBookModalOpen(true)}
                >
                  <Plus size={15} />
                  <span>Şimdi Kitap Ekle</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2. TÜM KLASÖRLERİN 3D CEPLİ VİTRİNİ */}
        {!activeFolderId && (
          <div>
            {myFolders.length > 0 ? (
              <div className="folders-grid" style={{ padding: '10px 0' }}>
                {myFolders.map((folder, idx) => {
                  const folderColorObj = APPLE_FOLDER_COLORS.find(c => c.hex.toLowerCase() === (folder.color || '').toLowerCase()) || APPLE_FOLDER_COLORS[idx % APPLE_FOLDER_COLORS.length];
                  const folderBooks = (folder.bookIds || []).map(bId => books.find(b => b.id === bId)).filter(Boolean);
                  const topCovers = folderBooks.slice(0, 3);

                  return (
                    <div
                      key={folder.id}
                      className="folder-card"
                      onClick={() => setActiveFolderId(folder.id)}
                      style={{
                        '--folder-front-color': folderColorObj.hex,
                        '--folder-back-color': folderColorObj.backHex
                      }}
                    >
                      {/* Physical Folder Illustration Stage */}
                      <div className="folder-stage">
                        {/* Folder Back with Tab */}
                        <div className="folder-back">
                          <div className="folder-tab"></div>
                        </div>

                        {/* Tucked Book Covers Peeking Out */}
                        <div className="folder-tucked-books">
                          {topCovers.map(b => (
                            <BookCover
                              key={b.id}
                              src={b.cover}
                              title={b.title}
                              alt={b.title}
                              className="tucked-book-cover"
                            />
                          ))}
                          {topCovers.length === 0 && (
                            <div style={{
                              width: '56px',
                              height: '84px',
                              background: 'rgba(255,255,255,0.4)',
                              borderRadius: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#666',
                              fontSize: '0.7rem'
                            }}>
                              Boş
                            </div>
                          )}
                        </div>

                        {/* Folder Front Pocket */}
                        <div className="folder-front">
                          <span className="folder-front-badge">
                            {folderBooks.length} Kitap
                          </span>
                        </div>
                      </div>

                      {/* Folder Label and Action Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
                        <span className="folder-label" style={{ margin: 0 }}>
                          {folder.name}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <span className="folder-count-text">
                          İncelemek için tıkla
                        </span>
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ width: '24px', height: '24px', padding: 0 }}
                          onClick={(e) => handleOpenEdit(folder, e)}
                          title="Klasörü Düzenle"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          style={{ width: '24px', height: '24px', padding: 0, color: 'var(--color-danger)' }}
                          onClick={(e) => handleDelete(folder.id, folder.name, e)}
                          title="Klasörü Sil"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '50px 20px',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--border-strong)',
                color: 'var(--text-muted)'
              }}>
                <Folder size={42} color="#007AFF" style={{ marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 6px 0', color: 'var(--text-main)' }}>Henüz Özel Klasörünüz Yok</h3>
                <p style={{ fontSize: '0.88rem', maxWidth: '440px', margin: '0 auto 16px auto', color: 'var(--text-dim)' }}>
                  En fazla 12 adet klasör oluşturarak okuduğunuz kitapları kategorilerine ve zevkinize göre düzenleyebilirsiniz.
                </p>
                <button className="btn-apple-primary" onClick={handleOpenCreate}>
                  <Plus size={16} />
                  <span>İlk Klasörünüzü Oluşturun</span>
                </button>
              </div>
            )}
          </div>
        )}

      {/* Başka Klasöre Taşıma Seçim Modalı */}
      {movingBookId && (
        <div className="modal-overlay" style={{ zIndex: 1200 }} onClick={() => setMovingBookId(null)}>
          <div className="modal-content" style={{ maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderPlus size={18} color="#007AFF" />
                Kitabı Başka Klasöre Taşı
              </h4>
              <button className="btn btn-ghost btn-sm" onClick={() => setMovingBookId(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Bu kitabı aktarmak istediğiniz hedef klasörü seçin:
              </span>
              {myFolders.filter(f => f.id !== currentFolder?.id).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {myFolders.filter(f => f.id !== currentFolder?.id).map(f => (
                    <button
                      key={f.id}
                      type="button"
                      className="btn btn-secondary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderLeft: `5px solid ${f.color || '#007AFF'}`,
                        textAlign: 'left'
                      }}
                      onClick={() => {
                        moveBookToFolder(currentFolder.id, f.id, movingBookId);
                        setMovingBookId(null);
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{f.name}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        {(f.bookIds || []).length} kitap
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.86rem' }}>
                  Taşınabilecek başka bir klasörünüz bulunmuyor. Önce yeni bir klasör oluşturun.
                </div>
              )}
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setMovingBookId(null)}>Vazgeç</button>
            </div>
          </div>
        </div>
      )}

      </div>
    </Modal>
  );
};
