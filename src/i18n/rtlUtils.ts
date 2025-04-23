import { StyleSheet, I18nManager } from 'react-native';

/**
 * Creates RTL-aware styles by automatically mirroring
 * specific style properties like padding, margin, etc. for RTL languages
 *
 * @param styles The style object to process
 * @returns RTL-friendly style object
 */
export function createRTLStyles(styles: Record<string, any>) {
  const processedStyles: Record<string, any> = {};

  for (const [key, style] of Object.entries(styles)) {
    if (typeof style === 'object') {
      const rtlStyle: Record<string, any> = { ...style };

      // Mirror padding/margin properties
      if (rtlStyle.paddingLeft !== undefined) {
        rtlStyle.paddingStart = rtlStyle.paddingLeft;
        delete rtlStyle.paddingLeft;
      }
      if (rtlStyle.paddingRight !== undefined) {
        rtlStyle.paddingEnd = rtlStyle.paddingRight;
        delete rtlStyle.paddingRight;
      }
      if (rtlStyle.marginLeft !== undefined) {
        rtlStyle.marginStart = rtlStyle.marginLeft;
        delete rtlStyle.marginLeft;
      }
      if (rtlStyle.marginRight !== undefined) {
        rtlStyle.marginEnd = rtlStyle.marginRight;
        delete rtlStyle.marginRight;
      }

      // Mirror positioning properties
      if (rtlStyle.left !== undefined) {
        rtlStyle.start = rtlStyle.left;
        delete rtlStyle.left;
      }
      if (rtlStyle.right !== undefined) {
        rtlStyle.end = rtlStyle.right;
        delete rtlStyle.right;
      }

      // Convert textAlign values
      if (rtlStyle.textAlign === 'left') {
        rtlStyle.textAlign = 'start';
      } else if (rtlStyle.textAlign === 'right') {
        rtlStyle.textAlign = 'end';
      }

      // Handle borderRadius special cases
      if (
        rtlStyle.borderTopLeftRadius !== undefined ||
        rtlStyle.borderBottomLeftRadius !== undefined ||
        rtlStyle.borderTopRightRadius !== undefined ||
        rtlStyle.borderBottomRightRadius !== undefined
      ) {
        if (rtlStyle.borderTopLeftRadius !== undefined) {
          rtlStyle.borderTopStartRadius = rtlStyle.borderTopLeftRadius;
          delete rtlStyle.borderTopLeftRadius;
        }
        if (rtlStyle.borderBottomLeftRadius !== undefined) {
          rtlStyle.borderBottomStartRadius = rtlStyle.borderBottomLeftRadius;
          delete rtlStyle.borderBottomLeftRadius;
        }
        if (rtlStyle.borderTopRightRadius !== undefined) {
          rtlStyle.borderTopEndRadius = rtlStyle.borderTopRightRadius;
          delete rtlStyle.borderTopRightRadius;
        }
        if (rtlStyle.borderBottomRightRadius !== undefined) {
          rtlStyle.borderBottomEndRadius = rtlStyle.borderBottomRightRadius;
          delete rtlStyle.borderBottomRightRadius;
        }
      }

      processedStyles[key] = rtlStyle;
    } else {
      processedStyles[key] = style;
    }
  }

  return StyleSheet.create(processedStyles);
}

/**
 * Creates an RTL-aware style object with separate LTR and RTL versions.
 *
 * @param createStyles Function that returns a style object
 * @returns An object with regular and RTL styles
 */
export function withRTL<T extends StyleSheet.NamedStyles<T>>(
  createStyles: () => T,
): T & { rtl: Partial<T> } {
  const styles = createStyles();

  // Create RTL-specific overrides
  const rtlStyles: Partial<T> = {};

  // Add RTL-specific style overrides here if needed
  // This would be for styles that need more than just property name changes

  return {
    ...styles,
    rtl: rtlStyles,
  };
}

/**
 * Helper function to conditionally apply RTL styles based on the current layout direction
 *
 * @param baseStyle Base style for both LTR and RTL
 * @param rtlStyle Style to apply only for RTL
 * @returns The appropriate style based on direction
 */
export function applyRTLConditional(baseStyle: any, rtlStyle: any) {
  return I18nManager.isRTL ? [baseStyle, rtlStyle] : baseStyle;
}
