import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobile } from '../../context/MobileContext';
import { colors } from '../../theme/colors';

export const Header = ({ topInset = 28 }) => {
  const { 
    currentUser, 
    setIsFeedbackOpen, 
    setIsAdminOpen, 
    setIsRoomsOpen,
    setIsLoginOpen 
  } = useMobile();

  const isPrivileged = currentUser?.role === 'founder' || currentUser?.role === 'admin';

  return (
    <View style={[styles.header, { paddingTop: topInset + 6 }]}>
      {/* Brand & Beta Badge */}
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <Ionicons name="book" size={17} color="#fff" />
        </View>
        <View>
          <Text style={styles.brandTitle}>Kenar</Text>
          <Text style={styles.brandSub}>Kitap Kulübü</Text>
        </View>
      </View>

      {/* Right Action Icons */}
      <View style={styles.actionsRow}>
        {/* Rooms Shortcut */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setIsRoomsOpen(true)}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
        >
          <Ionicons name="chatbubbles-outline" size={20} color={colors.textMain} />
        </TouchableOpacity>

        {/* Founder / Admin Panel Shortcut */}
        {isPrivileged && (
          <TouchableOpacity
            style={[styles.iconButton, styles.adminButton]}
            onPress={() => setIsAdminOpen(true)}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
          >
            <Ionicons name="shield-checkmark" size={19} color={colors.star} />
          </TouchableOpacity>
        )}

        {/* Active User Avatar */}
        <TouchableOpacity
          style={styles.userButton}
          onPress={() => setIsLoginOpen(true)}
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
        >
          <Text style={styles.userInitial}>
            {currentUser?.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
          </Text>
          {currentUser?.role === 'founder' && (
            <View style={styles.founderStarBadge}>
              <Text style={styles.founderStarText}>★</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(60, 60, 67, 0.15)'
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  logoBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5
  },
  brandSub: {
    fontSize: 11,
    color: 'rgba(60, 60, 67, 0.6)',
    fontWeight: '600'
  },
  betaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.starLight,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 2,
    alignSelf: 'flex-start'
  },
  betaPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.star
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle
  },
  adminButton: {
    borderColor: 'rgba(245, 158, 11, 0.35)',
    backgroundColor: 'rgba(245, 158, 11, 0.12)'
  },
  userButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  userInitial: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14
  },
  founderStarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#111',
    borderRadius: 7,
    width: 15,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.star
  },
  founderStarText: {
    color: colors.star,
    fontSize: 9,
    fontWeight: '900'
  }
});
