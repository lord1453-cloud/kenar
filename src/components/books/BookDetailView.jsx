import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BookCover } from '../common/BookCover';

export const BookDetailView = () => {
  const { activeBookData, setActiveTab, showToast } = useApp();
  const [activeTabLocal, setActiveTabLocal] = useState('summary'); // 'summary' | 'reviews'
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);

  const StarIcon = () => (
    <svg viewBox="0 0 24 24">
      <path d="M12 2l2.9 6.4 7.1.7-5.3 4.8 1.6 6.9L12 17.3 5.7 20.8l1.6-6.9L2 9.1l7.1-.7z"/>
    </svg>
  );

  return (
    <div className="content wide">
      {/* Geri Dön Butonu */}
      <button 
        className="btn btn-outline" 
        onClick={() => setActiveTab('folder_detail')}
        style={{ marginBottom: '18px', padding: '6px 12px', fontSize: '13px' }}
      >
        ← Klasöre Geri Dön
      </button>

      {/* Hero Alanı */}
      <div className="book-detail">
        <BookCover 
          src={activeBookData?.coverImage || activeBookData?.cover} 
          title={activeBookData?.title} 
          alt={activeBookData?.title} 
          className="cv-hero" 
          style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.25)', borderRadius: '10px' }} 
        />

        <div>
          <div className="genre-tag">{activeBookData?.genre || 'Roman · Edebiyat'}</div>
          <h1>{activeBookData?.title || 'Kayıp Zamanın İzinde'}</h1>
          <div className="author-line">{activeBookData?.author || 'Elif Demir'}</div>

          <div className="rating-row">
            <span className="stars">
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
            </span>
            <span className="rating-text">
              {activeBookData?.rating || '4.4'} · {activeBookData?.reviewsCount || '1.284'} değerlendirme
            </span>
          </div>

          <div className="detail-actions">
            <button 
              className="btn btn-outline"
              onClick={() => showToast('İstek listenize eklendi', '📚')}
            >
              <svg className="icon icon-sm" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              İstek listene ekle
            </button>
            <button 
              className="btn btn-accent"
              onClick={() => showToast('Puanınız kaydedildi (5/5)', '⭐')}
            >
              <svg className="icon icon-sm" viewBox="0 0 24 24">
                <path d="M12 2l2.9 6.4 7.1.7-5.3 4.8 1.6 6.9L12 17.3 5.7 20.8l1.6-6.9L2 9.1l7.1-.7z"/>
              </svg>
              Puanla
            </button>
          </div>

          <div className="ai-summary-label">
            <span className="badge badge-blue">
              <svg viewBox="0 0 24 24">
                <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z"/>
              </svg>
              Yapay zekâ özeti — spoiler içermez
            </span>
          </div>
          <p className="summary-text">
            {activeBookData?.summary || 'Hafızanın kırılganlığını ve zamanın akışkanlığını konu alan bu roman, bir ailenin üç kuşak boyunca taşıdığı sessiz sırları yavaş, sabırlı bir anlatımla ele alıyor.'}
          </p>
        </div>
      </div>

      {/* Sekmeler */}
      <div className="tabs">
        <button 
          className={`tab ${activeTabLocal === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTabLocal('summary')}
        >
          Özet
        </button>
        <button 
          className={`tab ${activeTabLocal === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTabLocal('reviews')}
        >
          Yorumlar
        </button>
      </div>

      {/* Özet Paneli */}
      {activeTabLocal === 'summary' && (
        <div className="tab-panel">
          <p className="summary-text">
            Roman, İstanbul'un eski bir semtinde geçen, üç kuşağın hafıza ve unutma üzerinden birbirine bağlandığı bir aile hikâyesi anlatıyor. Yazar, zamanın doğrusal akmadığı bir kurguyla okuru bölümler arasında ileri geri taşıyor.
          </p>
        </div>
      )}

      {/* Yorumlar Paneli */}
      {activeTabLocal === 'reviews' && (
        <div className="tab-panel">
          {/* Yorum 1: Elif Demir */}
          <div className="review">
            <div className="review-head">
              <div 
                className="avatar" 
                style={{ width: '34px', height: '34px', background: 'linear-gradient(155deg,#AF52DE,#6d2f8f)' }} 
              />
              <div>
                <div className="post-name-row">
                  <span className="post-name">Elif Demir</span>
                  <span className="badge badge-purple">
                    <svg className="fill" viewBox="0 0 24 24">
                      <path d="M12 2l2.9 6.4 7.1.7-5.3 4.8 1.6 6.9L12 17.3 5.7 20.8l1.6-6.9L2 9.1l7.1-.7z"/>
                    </svg>
                    Yazar
                  </span>
                </div>
                <div className="post-username">@elifdemir</div>
              </div>
            </div>
            <div className="review-stars stars">
              <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
            </div>
            <p className="review-text">
              Bu kitabı yazarken en çok emek verdiğim şey, hafızanın güvenilmezliğini okura hissettirebilmekti. Yorumlarınız için teşekkürler.
            </p>
          </div>

          {/* Yorum 2: Mert Kaya (Spoiler Filtreli) */}
          <div 
            className={`review ${!spoilerRevealed ? 'spoiler-wrap' : ''}`}
            onClick={() => setSpoilerRevealed(true)}
            style={{ cursor: !spoilerRevealed ? 'pointer' : 'default' }}
          >
            <div className="review-head">
              <div 
                className="avatar" 
                style={{ width: '34px', height: '34px', background: 'linear-gradient(155deg,#5C6151,#2f3229)' }} 
              />
              <div>
                <span className="post-name">Mert Kaya</span>
                <div className="post-username">@mertkaya</div>
              </div>
            </div>
            <div className="review-stars stars" style={{ marginTop: '6px' }}>
              <StarIcon /><StarIcon /><StarIcon /><StarIcon />
            </div>
            <p className="review-text" style={{ filter: !spoilerRevealed ? 'blur(6px)' : 'none' }}>
              Finalde karakterin aslında hiç var olmadığı, tüm hikâyenin bir hayal ürünü olduğu ortaya çıkıyor ve bu beni çok şaşırttı.
            </p>
            {!spoilerRevealed && (
              <div className="spoiler-overlay" style={{ position: 'relative', marginTop: '-30px' }}>
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

          {/* Yorum 3: Zeynep Arslan */}
          <div className="review">
            <div className="review-head">
              <div 
                className="avatar" 
                style={{ width: '34px', height: '34px', background: 'linear-gradient(155deg,#8B4A34,#455C46)' }} 
              />
              <div>
                <span className="post-name">Zeynep Arslan</span>
                <div className="post-username">@zeyneparslan</div>
              </div>
            </div>
            <div className="review-stars stars" style={{ marginTop: '6px' }}>
              <StarIcon /><StarIcon /><StarIcon />
            </div>
            <p className="review-text">
              Beklediğimden daha yavaş ilerledi ama sona doğru toparladı.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
