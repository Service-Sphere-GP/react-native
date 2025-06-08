# Localization Guide for the App

This document provides a comprehensive guide on how to use, test, and extend the localization features in the app.

## Overview

The localization system in this app supports:

- Multiple languages (currently English and Arabic)
- Automatic detection of device language
- Manual language selection that persists across app restarts
- Right-to-Left (RTL) layout support for languages like Arabic
- Namespace organization for translations

## Testing the Localization Features

### Language Switching

1. Navigate to the Profile tab
2. Tap on "Language" option
3. Select your desired language (English or Arabic)
4. The app interface should immediately change to the selected language
5. The layout should adjust automatically for RTL languages (Arabic)

### Testing RTL Support

When you switch to Arabic:

1. Text should be right-aligned
2. UI elements should be mirrored (back buttons, notification badges, etc.)
3. The bottom navigation order should be reversed
4. Input fields and forms should have proper RTL layout

### Testing on Different Devices

To thoroughly test the localization:

1. Change the device language to Arabic in device settings
2. Launch the app and verify it loads with Arabic as the default
3. Test on both iOS and Android devices to ensure consistent behavior
4. Test with different font sizes and screen sizes

## Adding More Languages

To add a new language (e.g., French):

1. Create a new translation file in `src/i18n/locales/fr.json`
2. Add the language to the supported list in `src/i18n/i18n.ts`:
   ```typescript
   export const LANGUAGES = {
     en: { name: 'English', dir: 'ltr', nativeName: 'English' },
     ar: { name: 'Arabic', dir: 'rtl', nativeName: 'العربية' },
     fr: { name: 'French', dir: 'ltr', nativeName: 'Français' },
   };
   ```
3. Import the translation file in `src/i18n/i18n.ts`:

   ```typescript
   import fr from './locales/fr.json';

   const resources = {
     en: en,
     ar: ar,
     fr: fr, // Add the new language resources
   };
   ```

## Best Practices for Using Translations

### In Components

To use translations in a component:

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation(['common', 'profile']);

  return (
    <View>
      <Text>{t('common:welcome')}</Text>
      <Text>{t('profile:settings')}</Text>
    </View>
  );
};
```

### RTL-Aware Styling

For RTL-aware styling, use our utility functions:

```tsx
import { useLanguage } from '@/src/i18n/LanguageContext';
import { applyRTLConditional } from '@/src/i18n/rtlUtils';

const MyComponent = () => {
  const { isRTL } = useLanguage();

  return (
    <View style={applyRTLConditional(styles.container, styles.containerRTL)}>
      {/* Your component content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 16,
    flexDirection: 'row',
  },
  containerRTL: {
    paddingRight: 16,
    flexDirection: 'row-reverse',
  },
});
```

### Best Practices for RTL Layouts

1. Use logical properties instead of left/right:

   - Use `paddingStart`/`paddingEnd` instead of `paddingLeft`/`paddingRight`
   - Use `marginStart`/`marginEnd` instead of `marginLeft`/`marginRight`

2. For text alignment:

   - Use `textAlign: 'left'` for LTR layouts
   - Use `textAlign: 'right'` for RTL layouts
   - Or use our utility: `applyRTLConditional(styles.text, styles.textRTL)`

3. For row layouts:
   - Set `flexDirection: 'row'` for LTR
   - Set `flexDirection: 'row-reverse'` for RTL
   - Or use conditional styling with `isRTL`

## Troubleshooting

### Common Issues

1. **Issue**: Text doesn't change when switching languages
   **Solution**: Make sure you're using the `t` function from `useTranslation` and that your key exists in the translation files

2. **Issue**: RTL layout doesn't apply correctly
   **Solution**: Check that you're using `isRTL` from `useLanguage` hook and applying conditional styles

3. **Issue**: App crashes after language change
   **Solution**: Some components may need to be remounted after language change. Consider using React's key prop to force remounts.

### Debugging Tools

- Use `console.log(i18next.language)` to check the current language
- Log `I18nManager.isRTL` to verify the RTL status

## Resources

- [i18next Documentation](https://www.i18next.com/)
- [React Native RTL Support Guide](https://reactnative.dev/blog/2016/08/19/right-to-left-support-for-react-native-apps)
- [expo-localization Documentation](https://docs.expo.dev/versions/latest/sdk/localization/)
