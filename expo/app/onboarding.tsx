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
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, type ImageSource } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ArrowRight, Languages } from 'lucide-react-native';
import { ThemeColors } from '@/constants/colors';
import { useTheme } from '@/providers/ThemeProvider';
import { useChess } from '@/providers/ChessProvider';
import { t } from '@/utils/translations';
import { completeOnboarding } from '@/utils/onboardingStorage';

const { width: SW, height: SH } = Dimensions.get('window');
const IMAGE_HEIGHT = Math.min(SH * 0.46, 380);

const MINT = '#6EE7B7';
const MINT_DARK = '#34D399';

interface SlideConfig {
  image: ImageSource;
  titleKey: string;
  descKey: string;
}

const SLIDES: SlideConfig[] = [
  {
    image: require('@/assets/images/onboarding/slide-welcome.png'),
    titleKey: 'onboarding_slide1_title',
    descKey: 'onboarding_slide1_desc',
  },
  {
    image: require('@/assets/images/onboarding/slide-community.png'),
    titleKey: 'onboarding_slide2_title',
    descKey: 'onboarding_slide2_desc',
  },
  {
    image: require('@/assets/images/onboarding/slide-match.png'),
    titleKey: 'onboarding_slide3_title',
    descKey: 'onboarding_slide3_desc',
  },
  {
    image: require('@/assets/images/onboarding/slide-connect.png'),
    titleKey: 'onboarding_slide4_title',
    descKey: 'onboarding_slide4_desc',
  },
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
  const { colors, isDark } = useTheme();
  const { language, toggleLanguage } = useChess();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const fromSettings = from === 'settings';
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const styles = useMemo(() => createStyles(colors, insets.top), [colors, insets.top]);

  const isLast = page === SLIDES.length - 1;

  const finish = useCallback(async () => {
    try {
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      }
      if (fromSettings) {
        router.back();
        return;
      }
      await completeOnboarding();
      router.replace('/(tabs)/(home)/search');
    } catch (e) {
      Alert.alert(t('error', language), formatError(e));
    }
  }, [language, fromSettings, router]);

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

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={
          isDark
            ? [colors.background, colors.surface, colors.background]
            : [colors.background, colors.surfaceLight, colors.background]
        }
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <Image
            source={require('@/assets/images/app-icon.png')}
            style={styles.brandIcon}
            contentFit="cover"
          />
          <Text style={styles.brandName}>Chessenger</Text>
        </View>
        <View style={styles.topActions}>
          <Pressable onPress={handleToggleLanguage} style={styles.pillBtn}>
            <Languages size={14} color={colors.textSecondary} />
            <Text style={styles.pillBtnText}>{language === 'ja' ? 'EN' : 'JA'}</Text>
          </Pressable>
          <Pressable onPress={finish} hitSlop={12} style={styles.pillBtn}>
            <Text style={styles.skipText}>{t('onboarding_skip', language)}</Text>
          </Pressable>
        </View>
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
        {SLIDES.map((slide, i) => (
          <View key={i} style={styles.slide}>
            <View style={styles.imageFrame}>
              <View style={styles.mintGlow} />
              <Image
                source={slide.image}
                style={styles.slideImage}
                contentFit="contain"
                transition={200}
              />
              <LinearGradient
                colors={['transparent', colors.background]}
                style={styles.imageFade}
              />
            </View>

            <View style={styles.copyCard}>
              <Text style={styles.stepLabel}>
                {String(i + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
              </Text>
              <Text style={styles.slideTitle}>{t(slide.titleKey, language)}</Text>
              <Text style={styles.slideDesc}>{t(slide.descKey, language)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => {
                scrollRef.current?.scrollTo({ x: i * SW, animated: true });
                setPage(i);
              }}
              hitSlop={8}
            >
              <View style={[styles.dot, i === page && styles.dotActive]} />
            </Pressable>
          ))}
        </View>

        <Pressable onPress={handleNext} style={styles.ctaWrap}>
          <LinearGradient
            colors={[MINT, MINT_DARK, '#22C55E']}
            locations={[0, 0.45, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cta}
          >
            <Text style={styles.ctaText}>
              {isLast
                ? (fromSettings ? t('onboarding_confirm', language) : t('get_started', language))
                : t('onboarding_next', language)}
            </Text>
            <View style={styles.ctaIcon}>
              <ArrowRight size={18} color="#0F172A" strokeWidth={2.5} />
            </View>
          </LinearGradient>
        </Pressable>

        {page === 0 && (
          <Text style={styles.tagline}>{t('onboarding_tagline', language)}</Text>
        )}
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors, topInset: number) {
  const cardShadow = Platform.select({
    ios: { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.08, shadowRadius: 24 },
    android: { elevation: 4 },
    web: { boxShadow: '0 12px 40px rgba(15,23,42,0.08)' } as object,
  });

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: Math.max(topInset, Platform.OS === 'ios' ? 12 : 16) + 8,
      paddingHorizontal: 20,
      paddingBottom: 8,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    brandIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
    },
    brandName: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: -0.4,
    },
    topActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    pillBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.cardBorder,
    },
    pillBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.textSecondary,
      letterSpacing: 0.4,
    },
    skipText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    pager: { flex: 1 },
    pagerContent: { alignItems: 'flex-start' },
    slide: {
      width: SW,
      flex: 1,
      paddingHorizontal: 20,
    },
    imageFrame: {
      height: IMAGE_HEIGHT,
      borderRadius: 28,
      overflow: 'hidden',
      marginTop: 4,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      ...cardShadow,
    },
    mintGlow: {
      position: 'absolute',
      top: '18%',
      left: '15%',
      right: '15%',
      height: '50%',
      borderRadius: 999,
      backgroundColor: colors.green,
      opacity: 0.08,
    },
    slideImage: {
      width: '100%',
      height: '100%',
    },
    imageFade: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 72,
    },
    copyCard: {
      flex: 1,
      marginTop: 20,
      paddingHorizontal: 4,
      gap: 10,
      justifyContent: 'flex-start',
    },
    stepLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 2,
      color: MINT_DARK,
      textTransform: 'uppercase',
    },
    slideTitle: {
      fontSize: 26,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: -0.6,
      lineHeight: 32,
    },
    slideDesc: {
      fontSize: 15,
      lineHeight: 23,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    footer: {
      paddingHorizontal: 24,
      paddingBottom: Platform.OS === 'ios' ? 36 : 24,
      gap: 16,
    },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: 'rgba(15,23,42,0.12)',
    },
    dotActive: {
      width: 28,
      backgroundColor: MINT_DARK,
    },
    ctaWrap: {
      borderRadius: 20,
      overflow: 'hidden',
      ...Platform.select({
        ios: { shadowColor: MINT_DARK, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.35, shadowRadius: 20 },
        android: { elevation: 6 },
        web: { boxShadow: '0 10px 28px rgba(52,211,153,0.35)' } as object,
      }),
    },
    cta: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      paddingHorizontal: 24,
    },
    ctaText: {
      color: '#0F172A',
      fontSize: 16,
      fontWeight: '800',
      letterSpacing: 0.2,
    },
    ctaIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255,255,255,0.55)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tagline: {
      textAlign: 'center',
      fontSize: 13,
      fontWeight: '500',
      color: colors.textMuted,
      marginTop: -4,
    },
  });
}
