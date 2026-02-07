/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 * 
 * NOTE: Dark mode temporarily disabled - both light and dark return light colors
 * TODO: Re-enable when implementing dark mode feature
 */

import { Colors } from '@/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light
) {
  // Keep the hook structure but always use light colors for now
  // This preserves the dark mode state detection for future implementation
  const colorFromProps = props.light;

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Always return light color regardless of color scheme
    return Colors.light[colorName];
  }
}
