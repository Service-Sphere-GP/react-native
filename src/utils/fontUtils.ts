import { useMemo } from 'react';
import { useLanguage } from '@/src/i18n/LanguageContext';

/**
 * Font weight types supported in the app
 */
export type FontWeight =
  | 'thin'
  | 'extraLight'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semiBold'
  | 'bold'
  | 'extraBold';

/**
 * Maps font weight to font family name for both English (Roboto) and Arabic (Montserrat Arabic)
 */
const fontFamilyMap: Record<string, Record<FontWeight, string>> = {
  en: {
    thin: 'Roboto-Thin',
    extraLight: 'Roboto-ExtraLight',
    light: 'Roboto-Light',
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    semiBold: 'Roboto-SemiBold',
    bold: 'Roboto-Bold',
    extraBold: 'Roboto-ExtraBold',
  },
  ar: {
    thin: 'Montserrat-Arabic-Thin-250',
    extraLight: 'Montserrat-Arabic-ExtraLight-275',
    light: 'Montserrat-Arabic-Light-300',
    regular: 'Montserrat-Arabic-Regular-400',
    medium: 'Montserrat-Arabic-Medium-500',
    semiBold: 'Montserrat-Arabic-SemiBold-600',
    bold: 'Montserrat-Arabic-Bold-700',
    extraBold: 'Montserrat-Arabic-ExtraBold-800',
  },
};

/**
 * Hook that returns the font families based on the current language
 * @returns Font family map for the current language
 */
export function useFontFamily() {
  const { language } = useLanguage();

  return useMemo(() => {
    // Default to English fonts if the language is not supported
    const languageKey = fontFamilyMap[language] ? language : 'en';
    return fontFamilyMap[languageKey];
  }, [language]);
}

/**
 * Helper function to get the appropriate text style class based on RTL and font weight
 * This is useful for applying dynamic font styles in a consistent way
 *
 * @param isRTL Whether the current layout is RTL
 * @param weight Font weight to use
 * @returns A string to be used in className for styling and an object for style prop
 */
export function getTextStyle(
  isRTL: boolean,
  weight: FontWeight = 'regular',
): { className: string; style: { fontFamily: string } } {
  const fontFamily = isRTL
    ? fontFamilyMap.ar[weight]
    : fontFamilyMap.en[weight];
  const textAlign = isRTL ? 'text-right' : 'text-left';

  // Return both className for alignment and style object for font family
  return {
    className: textAlign,
    style: { fontFamily },
  };
}

/**
 * Helper function to get a font family for inline styles
 * This should be used when dynamic styling based on language is needed
 *
 * @param language Current language code
 * @param weight Font weight to use
 * @returns Font family name
 */
export function getFontFamily(
  language: string,
  weight: FontWeight = 'regular',
): string {
  const languageKey = fontFamilyMap[language] ? language : 'en';
  return fontFamilyMap[languageKey][weight];
}

/**
 * Helper to check if a font is available in the current language
 *
 * @param language Language code to check
 * @returns Boolean indicating if fonts are available
 */
export function hasFontsForLanguage(language: string): boolean {
  return !!fontFamilyMap[language];
}
