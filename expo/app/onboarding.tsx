import React, { useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  Alert,
} from 'react-native';
import { Stack, Redirect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import {
  ArrowRight,
  Search,
  MapPin,
  Swords,
  MessageCircle,
  Languages,
  type LucideIcon,
} from 'lucide-react-native';
import { ThemeColors } from '@/constants/colors';
import { useTheme } from '@/providers/ThemeProvider';
import { useChess } from '@/providers/ChessProvider';
import { t } from '@/utils/translations';
import { completeOnboarding } from '@/utils/onboardingStorage';

const { width: SW } = Dimensions.get('window');

interface SlideConfig {
  icon: LucideIcon;
  iconBg: string;
  titleKey: string;
  descKey: string;
}

const SLIDES: SlideConfig[] = [
  { icon: Search, iconBg: '#EDE9FE', titleKey: 'onboarding_slide1_title', descKey: 'onboarding_slide1_desc' },
  { icon: MapPin, iconBg: '#DCFCE7', titleKey: 'onboarding_slide2_title', descKey: 'onboarding_slide2_desc' },
  { icon: Swords, iconBg: '#EDE9FE', titleKey: 'onboarding_slide3_title', descKey: 'onboarding_slide3_desc' },
  { icon: MessageCircle, iconBg: '#DBEAFE', titleKey: 'onboarding_slide4_title', descKey: 'onboarding_slide4_desc' },
];

function formatError(e: unknown): string {
  if (e instanceof Error && e.message) return e.message;
  if (typeof e === 'object' && e !== null && 'message' in e) {
    const msg = (e as { message: unknown }).message;
    if (typeof msg === 'string' && msg) return msg;
  }
  return String(e);
}

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const { language, toggleLanguage } = useChess();
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const [exitToApp, setExitToApp] = useState(false);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const isLast = page === SLIDES.length - 1;

  const finish = useCallback(async () => {
    try {
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      }
      await completeOnboarding();
      setExitToApp(true);
    } catch (e) {
      Alert.alert(t('error', language), formatError(e));
    }
  }, [language]);

  const handleNext = useCallback(() => {
    if (isLast) {
      finish();
      return;
    }
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    const next = page + 1;
    scrollRef.current?.scrollTo({ x: next * SW, animated: true });
    setPage(next);
  }, [isLast, page, finish]);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SW);
    if (idx !== page) setPage(idx);
  }, [page]);

  const handleToggleLanguage = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    toggleLanguage();
  }, [toggleLanguage]);

  if (exitToApp) {
    return <Redirect href="/(tabs)/(home)" />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={['#F0FDF4', '#EDE9FE', '#FAF5FF', '#F0FDF4']}
        locations={[0, 0.3, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.topBar}>
        <Pressable onPress={handleToggleLanguage} style={styles.langBtn}>
          <Languages size={14} color="#6B7280" />
          <Text style={styles.langBtnText}>{language === 'ja' ? 'EN' : 'JA'}</Text>
        </Pressable>
        <Pressable onPress={finish} hitSlop={12} style={styles.skipBtn}>
          <Text style={styles.skipText}>{t('onboarding_skip', language)}</Text>
        </Pressable>
      </View>

      <View style={styles.hero}>
        <Image
          source={require('@/assets/images/app-icon.png')}
          style={styles.appIcon}
          contentFit="cover"
        />
        <Text style={styles.brandTitle}>Chessenger</Text>
        <Text style={styles.brandTagline}>{t('onboarding_tagline', language)}</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.pager}
        contentContainerStyle={styles.pagerContent}
      >
        {SLIDES.map((slide, i) => {
          const Icon = slide.icon;
          return (
            <View key={i} style={styles.slide}>
              <View style={[styles.iconCircle, { backgroundColor: slide.iconBg }]}>
                <Icon size={36} color={colors.accent} strokeWidth={2} />
              </View>
              <Text style={styles.slideTitle}>{t(slide.titleKey, language)}</Text>
              <Text style={styles.slideDesc}>{t(slide.descKey, language)}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === page && styles.dotActive]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Pressable onPress={handleNext} style={styles.ctaWrap}>
          <LinearGradient
            colors={['#22C55E', '#16A34A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>
              {isLast ? t('get_started', language) : t('onboarding_next', language)}
            </Text>
            <ArrowRight size={18} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  const shadow = Platform.select({
    ios: { shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24 },
    android: { elevation: 6 },
    web: { boxShadow: '0 8px 28px rgba(139,92,246,0.12)' } as object,
  });

  return StyleSheet.create({
    container: { flex: 1 },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: Platform.OS === 'ios' ? 56 : 40,
      paddingHorizontal: 24,
    },
    langBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.85)',
      borderWidth: 1,
      borderColor: 'rgba(139,92,246,0.12)',
      ...Platform.select({
        ios: { shadowColor: '#8B5CF6', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
        android: { elevation: 2 },
        web: { boxShadow: '0 2px 8px rgba(139,92,246,0.08)' } as object,
      }),
    },
    langBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#6B7280',
      letterSpacing: 0.5,
    },
    skipBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.85)',
      borderWidth: 1,
      borderColor: 'rgba(139,92,246,0.12)',
    },
    skipText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    hero: {
      alignItems: 'center',
      paddingTop: 8,
      paddingBottom: 12,
      gap: 6,
    },
    appIcon: {
      width: 72,
      height: 72,
      borderRadius: 16,
      ...Platform.select({
        ios: {
          shadowColor: '#22C55E',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 14,
        },
        android: { elevation: 8 },
      }),
    },
    brandTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: -0.5,
    },
    brandTagline: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.textMuted,
    },
    pager: { flexGrow: 0 },
    pagerContent: { alignItems: 'center' },
    slide: {
      width: SW,
      paddingHorizontal: 32,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 220,
      gap: 16,
    },
    iconCircle: {
      width: 88,
      height: 88,
      borderRadius: 44,
      alignItems: 'center',
      justifyContent: 'center',
      ...(shadow ?? {}),
    },
    slideTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textPrimary,
      textAlign: 'center',
      letterSpacing: -0.3,
    },
    slideDesc: {
      fontSize: 15,
      lineHeight: 22,
      fontWeight: '500',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 20,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(139,92,246,0.2)',
    },
    dotActive: {
      width: 24,
      backgroundColor: colors.accent,
    },
    footer: {
      paddingHorizontal: 24,
      paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    },
    ctaWrap: {
      borderRadius: 28,
      overflow: 'hidden',
      ...Platform.select({
        ios: { shadowColor: '#22C55E', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 18 },
        android: { elevation: 8 },
        web: { boxShadow: '0 8px 24px rgba(34,197,94,0.35)' } as object,
      }),
    },
    cta: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    ctaText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
  });
}
