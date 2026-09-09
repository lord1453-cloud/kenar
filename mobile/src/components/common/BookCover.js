import React, { useState, useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const PALETTES = [
  { bg: '#1e293b', border: 'rgba(255, 255, 255, 0.25)', spine: '#090d16' },
  { bg: '#3f1d24', border: 'rgba(255, 220, 225, 0.3)', spine: '#16080b' },
  { bg: '#183327', border: 'rgba(215, 255, 230, 0.28)', spine: '#060f0b' },
  { bg: '#382414', border: 'rgba(255, 235, 205, 0.3)', spine: '#120a04' },
  { bg: '#271c38', border: 'rgba(235, 215, 255, 0.28)', spine: '#0c0713' },
  { bg: '#1a2f3b', border: 'rgba(210, 240, 255, 0.28)', spine: '#060e13' }
];

const getPalette = (title = '') => {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = (hash << 5) - hash + title.charCodeAt(i);
    hash |= 0;
  }
  return PALETTES[Math.abs(hash) % PALETTES.length];
};

export const BookCover = ({
  uri,
  title = '',
  author = '',
  style,
  imageStyle
}) => {
  const [hasError, setHasError] = useState(false);

  // Bozuk Goodreads URL kontrolü
  const isInvalidUri = !uri || uri.includes('compressed.photo.goodreads.com');
  const palette = useMemo(() => getPalette(title), [title]);

  if (isInvalidUri || hasError) {
    return (
      <View style={[styles.fallbackBox, { backgroundColor: palette.bg }, style]}>
        {/* Kitap Sırtı Çizgisi */}
        <View style={[styles.spine, { backgroundColor: palette.spine }]} />
        
        {/* İç Çerçeve */}
        <View style={[styles.innerBorder, { borderColor: palette.border }]}>
          <Ionicons name="book-outline" size={18} color="rgba(255,255,255,0.7)" style={styles.icon} />
          <Text style={styles.fallbackTitle} numberOfLines={3} ellipsizeMode="tail">
            {title || 'Kitap'}
          </Text>
          {author ? (
            <Text style={styles.fallbackAuthor} numberOfLines={1} ellipsizeMode="tail">
              {author}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[styles.image, style, imageStyle]}
      onError={() => setHasError(true)}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 60,
    height: 90,
    borderRadius: 6,
    backgroundColor: colors.bgElevated
  },
  fallbackBox: {
    width: 60,
    height: 90,
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3
  },
  spine: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.1)'
  },
  innerBorder: {
    flex: 1,
    width: '85%',
    marginVertical: 4,
    marginLeft: 6,
    borderWidth: 1,
    borderRadius: 4,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    marginBottom: 2
  },
  fallbackTitle: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 11
  },
  fallbackAuthor: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 7,
    marginTop: 2,
    textAlign: 'center'
  }
});
