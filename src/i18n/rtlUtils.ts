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

/**
 * Helper function to get the appropriate flexDirection based on RTL status
 *
 * @param isRTL Boolean indicating if the layout is RTL
 * @param defaultDirection Optional default direction for LTR (default: 'row')
 * @returns The appropriate flexDirection value
 */
export function getFlexDirection(
  isRTL: boolean,
  defaultDirection: 'row' | 'column' = 'row',
): 'row' | 'row-reverse' | 'column' | 'column-reverse' {
  if (defaultDirection === 'row') {
    return isRTL ? 'row-reverse' : 'row';
  } else {
    // For column layouts, RTL doesn't typically affect the primary axis
    return defaultDirection;
  }
}

/**
 * Helper function to get the appropriate text alignment based on RTL status
 *
 * @param isRTL Boolean indicating if the layout is RTL
 * @returns The appropriate textAlign value
 */
export function getTextAlignment(isRTL: boolean): 'left' | 'right' {
  return isRTL ? 'right' : 'left';
}

/**
 * Helper function to get horizontal margin/padding classes with RTL awareness
 *
 * @param isRTL Boolean indicating if the layout is RTL
 * @param size Margin/padding size (numeric value or string like 'sm', 'md', etc.)
 * @param type Type of spacing ('margin' or 'padding')
 * @returns Appropriate tailwind class string
 */
export function getRTLSpacing(
  isRTL: boolean,
  size: string | number,
  type: 'margin' | 'padding' = 'margin',
): string {
  const prefix = type === 'margin' ? 'm' : 'p';

  // Handle numeric values
  if (typeof size === 'number') {
    return isRTL ? `${prefix}r-${size}` : `${prefix}l-${size}`;
  }

  // Handle named sizes
  return isRTL ? `${prefix}r-${size}` : `${prefix}l-${size}`;
}

/**
 * Gets Tailwind CSS classes for flexbox direction that respect RTL layout
 *
 * @param isRTL Boolean indicating if the layout is RTL
 * @returns Tailwind class for flex direction
 */
export function getFlexDirectionClass(isRTL: boolean): string {
  return isRTL ? 'flex-row-reverse' : 'flex-row';
}

/**
 * Gets Tailwind CSS classes for text alignment that respect RTL layout
 *
 * @param isRTL Boolean indicating if the layout is RTL
 * @returns Tailwind class for text alignment
 */
export function getTextAlignClass(isRTL: boolean): string {
  return isRTL ? 'text-right' : 'text-left';
}

/**
 * Gets appropriate border radius classes for RTL-aware UI elements
 *
 * @param isRTL Boolean indicating if the layout is RTL
 * @param position 'start' or 'end' to indicate which side needs radius
 * @param size Size of the radius ('sm', 'md', 'lg', 'xl', etc.)
 * @returns Tailwind classes for appropriate border radius
 */
export function getBorderRadiusClass(
  isRTL: boolean,
  position: 'start' | 'end',
  size: string = '',
): string {
  const sizeStr = size ? `-${size}` : '';

  if (position === 'start') {
    return isRTL
      ? `rounded-tr${sizeStr} rounded-br${sizeStr}`
      : `rounded-tl${sizeStr} rounded-bl${sizeStr}`;
  } else {
    return isRTL
      ? `rounded-tl${sizeStr} rounded-bl${sizeStr}`
      : `rounded-tr${sizeStr} rounded-br${sizeStr}`;
  }
}

/**
 * Gets appropriate positions classes for absolutely positioned elements
 * with RTL awareness
 *
 * @param isRTL Boolean indicating if the layout is RTL
 * @param position 'start' or 'end' to indicate which side
 * @param value Position value
 * @returns Tailwind class for position
 */
export function getPositionClass(
  isRTL: boolean,
  position: 'start' | 'end',
  value: string | number,
): string {
  const val = typeof value === 'number' ? `-${value}` : `-${value}`;

  if (position === 'start') {
    return isRTL ? `right${val}` : `left${val}`;
  } else {
    return isRTL ? `left${val}` : `right${val}`;
  }
}
