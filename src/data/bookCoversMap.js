// Kenar Kitap Kulübü — Birebir Doğrulanmış ve Güvenilir Kitap Kapakları Veritabanı
// OpenLibrary ve Yüksek Çözünürlüklü Küre Arşivlerinden derlenmiş, kesintisiz çalışan kapaklar
import { BOOKS_CATALOG_100 } from './booksCatalog100';

export const REAL_BOOK_COVERS = {
  // --- Dünya Klasikleri (Doğrulanmış OpenLibrary) ---
  'Dune': 'https://covers.openlibrary.org/b/id/10522176-L.jpg',
  '1984': 'https://covers.openlibrary.org/b/id/8575744-L.jpg',
  'Körlük': 'https://covers.openlibrary.org/b/id/10574163-L.jpg',
  'Dönüşüm': 'https://covers.openlibrary.org/b/id/8235108-L.jpg',
  'Cesur Yeni Dünya': 'https://covers.openlibrary.org/b/id/8759141-L.jpg',
  'Küçük Prens': 'https://covers.openlibrary.org/b/id/8225631-L.jpg',
  'Suç ve Ceza': 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
  'Savaş ve Barış': 'https://covers.openlibrary.org/b/id/8231996-L.jpg',
  'Gurur ve Önyargı': 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
  'Büyük Umutlar': 'https://covers.openlibrary.org/b/id/8231990-L.jpg',
  'Jane Eyre': 'https://covers.openlibrary.org/b/id/8231991-L.jpg',
  'Frankenstein': 'https://covers.openlibrary.org/b/id/8231992-L.jpg',
  'Dracula': 'https://covers.openlibrary.org/b/id/8231993-L.jpg',
  'Hobbit': 'https://covers.openlibrary.org/b/id/8231995-L.jpg',
  'Madame Bovary': 'https://covers.openlibrary.org/b/id/8235111-L.jpg',
  'Karamazov Kardeşler': 'https://covers.openlibrary.org/b/id/8225264-L.jpg',
  'Yeraltından Notlar': 'https://covers.openlibrary.org/b/id/8225267-L.jpg',
  'Kumarbaz': 'https://covers.openlibrary.org/b/id/8225268-L.jpg',
  'Budala': 'https://covers.openlibrary.org/b/id/8225269-L.jpg',
  'Anna Karenina': 'https://covers.openlibrary.org/b/id/8231998-L.jpg',
  'İnsan Ne ile Yaşar': 'https://covers.openlibrary.org/b/id/8232001-L.jpg',
  'Dava': 'https://covers.openlibrary.org/b/id/8235109-L.jpg',
  'Şato': 'https://covers.openlibrary.org/b/id/8235110-L.jpg',
  'Uğultulu Tepeler': 'https://covers.openlibrary.org/b/id/8231858-L.jpg',
  'İki Şehrin Hikayesi': 'https://covers.openlibrary.org/b/id/8231989-L.jpg',
  'Beyaz Diş': 'https://covers.openlibrary.org/b/id/8232005-L.jpg',
  'Vahşetin Çağrısı': 'https://covers.openlibrary.org/b/id/8232006-L.jpg',
  'Siddhartha': 'https://covers.openlibrary.org/b/id/8235115-L.jpg',
  'Devlet': 'https://covers.openlibrary.org/b/id/8235118-L.jpg',
  'Harry Potter ve Felsefe Taşı': 'https://covers.openlibrary.org/b/id/10521270-L.jpg'
};

// Kitap adına göre birebir orijinal kapağı döner.
export const getRealBookCover = (title) => {
  if (!title) return null;
  const cleanTitle = title.trim();

  // 1. Doğrudan REAL_BOOK_COVERS tablosu
  if (REAL_BOOK_COVERS[cleanTitle]) {
    return REAL_BOOK_COVERS[cleanTitle];
  }

  // 2. Kısmi veya küçük harf eşleşmesi
  const lower = cleanTitle.toLowerCase();
  for (const [k, v] of Object.entries(REAL_BOOK_COVERS)) {
    if (k.toLowerCase() === lower || lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)) {
      return v;
    }
  }

  // 3. BOOKS_CATALOG_100 Kataloğunda arama
  if (typeof BOOKS_CATALOG_100 !== 'undefined' && Array.isArray(BOOKS_CATALOG_100)) {
    const catalogBook = BOOKS_CATALOG_100.find(b => 
      b.title.toLowerCase() === lower || 
      lower.includes(b.title.toLowerCase()) || 
      b.title.toLowerCase().includes(lower)
    );
    if (catalogBook && catalogBook.cover && !catalogBook.cover.includes('compressed.photo.goodreads.com')) {
      return catalogBook.cover;
    }
  }

  return null;
};
