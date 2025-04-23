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
 * Maps language to base font family name
 * Montserrat-Arabic is used for Arabic text, while Roboto is used for English text
 * Font weights are handled separately with font-weight classes in the app
 */
const fontFamilyMap: Record<string, string> = {
  en: 'Roboto-Regular',
  ar: 'Montserrat-Arabic',
};

/**
 * Hook that returns the font family based on the current language
 * @returns Font family name for the current language
 */
export function useFontFamily() {
  const { language } = useLanguage();

  return useMemo(() => {
    // Default to English font if the language is not supported
    return fontFamilyMap[language] || fontFamilyMap.en;
  }, [language]);
}

/**
 * Helper function to get the appropriate text style class based on RTL
 * This is useful for applying dynamic font styles in a consistent way
 *
 * @param isRTL Whether the current layout is RTL
 * @returns A string to be used in className for styling and an object for style prop
 */
export function getTextStyle(isRTL: boolean): {
  className: string;
  style: { fontFamily: string };
} {
  const fontFamily = isRTL ? fontFamilyMap.ar : fontFamilyMap.en;
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
 * @returns Font family name
 */
export function getFontFamily(language: string): string {
  return fontFamilyMap[language] || fontFamilyMap.en;
}

/**
 * Helper to check if a font is available for the given language
 *
 * @param language Language code to check
 * @returns Boolean indicating if fonts are available
 */
export function hasFontsForLanguage(language: string): boolean {
  return !!fontFamilyMap[language];
}
