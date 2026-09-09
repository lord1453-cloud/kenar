import React from 'react';
import { useApp } from '../../context/AppContext';
import { FEATURED_COVERS } from '../../data/featuredBooksCovers';
import { BookCover } from '../common/BookCover';

export const ResearchView = () => {
  const { openFolder } = useApp();

  const folderCategories = [
    {
      id: 'top100',
      name: 'Bu Yılın En Çok Okunanları',
      count: '100 kitap',
      tabColor: '#F6D3D9',
      flapColor: '#F6D3D9',
      books: [
        { cover: FEATURED_COVERS.gece_yarisi.cover, title: FEATURED_COVERS.gece_yarisi.title },
        { cover: FEATURED_COVERS.atomik_aliskanliklar.cover, title: FEATURED_COVERS.atomik_aliskanliklar.title },
        { cover: FEATURED_COVERS.simyaci.cover, title: FEATURED_COVERS.simyaci.title }
      ]
    },
    {
      id: 'turk',
      name: 'Türk Edebiyatı',
      count: '64 kitap',
      tabColor: '#CFE0D2',
      flapColor: '#CFE0D2',
      books: [
        { cover: FEATURED_COVERS.saatleri_ayarlama.cover, title: FEATURED_COVERS.saatleri_ayarlama.title },
        { cover: FEATURED_COVERS.kurk_mantolu.cover, title: FEATURED_COVERS.kurk_mantolu.title },
        { cover: FEATURED_COVERS.tutunamayanlar.cover, title: FEATURED_COVERS.tutunamayanlar.title }
      ]
    },
    {
      id: 'dunya',
      name: 'Dünya Klasikleri',
      count: '87 kitap',
      tabColor: '#F5DEC0',
      flapColor: '#F5DEC0',
      books: [
        { cover: FEATURED_COVERS.suc_ve_ceza.cover, title: FEATURED_COVERS.suc_ve_ceza.title },
        { cover: FEATURED_COVERS.kayip_zaman.cover, title: FEATURED_COVERS.kayip_zaman.title },
        { cover: FEATURED_COVERS.george_1984.cover, title: FEATURED_COVERS.george_1984.title }
      ]
    },
    {
      id: 'scifi',
      name: 'Bilim Kurgu & Fantastik',
      count: '52 kitap',
      tabColor: '#CFE3F2',
      flapColor: '#CFE3F2',
      books: [
        { cover: FEATURED_COVERS.dune.cover, title: FEATURED_COVERS.dune.title },
        { cover: FEATURED_COVERS.george_1984.cover, title: FEATURED_COVERS.george_1984.title },
        { cover: FEATURED_COVERS.korluk.cover, title: FEATURED_COVERS.korluk.title }
      ]
    },
    {
      id: 'gelisim',
      name: 'Kişisel Gelişim',
      count: '31 kitap',
      tabColor: '#F5E7B8',
      flapColor: '#F5E7B8',
      books: [
        { cover: FEATURED_COVERS.atomik_aliskanliklar.cover, title: FEATURED_COVERS.atomik_aliskanliklar.title },
        { cover: FEATURED_COVERS.simyaci.cover, title: FEATURED_COVERS.simyaci.title },
        { cover: FEATURED_COVERS.gece_yarisi.cover, title: FEATURED_COVERS.gece_yarisi.title }
      ]
    },
    {
      id: 'siir',
      name: 'Şiir',
      count: '28 kitap',
      tabColor: '#E7D6F2',
      flapColor: '#E7D6F2',
      books: [
        { cover: FEATURED_COVERS.sessiz_ev.cover, title: FEATURED_COVERS.sessiz_ev.title },
        { cover: FEATURED_COVERS.beyaz_gece.cover, title: FEATURED_COVERS.beyaz_gece.title },
        { cover: FEATURED_COVERS.donusum.cover, title: FEATURED_COVERS.donusum.title }
      ]
    }
  ];

  return (
    <div className="content wide">
      {/* Yapay Zeka Otomatik Kategori Notu */}
      <div className="ai-note">
        <span className="badge badge-blue">
          <svg viewBox="0 0 24 24">
            <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z"/>
          </svg>
          Yapay zekâ bu ay 100 kitabı otomatik olarak kategorilere ekledi
        </span>
      </div>

      {/* 3x2 3D Cep Klasör Izgarası: İçinde Gerçek Minyatür Kitap Kapakları */}
      <div className="folder-grid">
        {folderCategories.map(f => (
          <button 
            key={f.id} 
            className="folder-card" 
            onClick={() => openFolder(f.name)}
          >
            <div className="folder-visual">
              {/* Gerçek Kitap Kapakları Minyatürleri */}
              <div className="f-items">
                {f.books.map((b, idx) => (
                  <BookCover 
                    key={idx} 
                    src={b.cover} 
                    title={b.title} 
                    alt={b.title} 
                    className="fi" 
                  />
                ))}
              </div>
              <div className="f-tab" style={{ background: f.tabColor }} />
              <div className="f-flap" style={{ background: f.flapColor }} />
            </div>
            <div className="folder-caption">{f.name}</div>
            <div className="folder-count">{f.count}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
