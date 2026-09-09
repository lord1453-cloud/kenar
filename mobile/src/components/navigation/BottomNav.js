import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMobile } from '../../context/MobileContext';
import { colors } from '../../theme/colors';

export const BottomNav = ({ bottomInset = 16 }) => {
  const { activeTab, setActiveTab, setIsRoomsOpen } = useMobile();

  const tabs = [
    { id: 'home', label: 'Ana Sayfa', iconOutline: 'home-outline', iconFilled: 'home' },
    { id: 'rooms', label: 'Odalar', iconOutline: 'chatbubbles-outline', iconFilled: 'chatbubbles', action: 'rooms' },
    { id: 'live', label: 'Canlı Okuma', iconOutline: 'radio-outline', iconFilled: 'radio', isSpecial: true },
    { id: 'library', label: 'Kitaplığım', iconOutline: 'book-outline', iconFilled: 'book' },
    { id: 'profile', label: 'Profil', iconOutline: 'person-outline', iconFilled: 'person' }
  ];

  return (
    <View style={[styles.container, { paddingBottom: Math.max(bottomInset, 16) }]}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        const iconName = isActive ? tab.iconFilled : tab.iconOutline;
        const iconColor = isActive ? colors.primary : colors.textDim;

        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabItem, tab.isSpecial && styles.specialTabItem]}
            onPress={() => {
              if (tab.action === 'rooms') {
                setIsRoomsOpen(true);
              } else {
                setActiveTab(tab.id);
              }
            }}
            activeOpacity={0.7}
          >
            {tab.isSpecial ? (
              <View style={[styles.specialIconCircle, isActive && styles.specialIconCircleActive]}>
                <Ionicons name={iconName} size={22} color={isActive ? '#fff' : colors.primary} />
              </View>
            ) : (
              <Ionicons name={iconName} size={22} color={iconColor} />
            )}
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingVertical: 8,
    paddingBottom: 22,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  tabLabel: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: 3,
    fontWeight: '500'
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: '700'
  },
  specialTabItem: {
    marginTop: -10
  },
  specialIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bgElevated,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  specialIconCircleActive: {
    backgroundColor: colors.primary,
    borderColor: '#60a5fa'
  }
});
