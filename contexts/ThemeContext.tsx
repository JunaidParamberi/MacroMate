import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/theme';

interface ThemeContextType {
  isDark: boolean;
  colors: typeof Colors.light;
  theme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: Colors.light,
  theme: 'light',
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const theme = isDark ? 'dark' : 'light';
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ isDark, colors, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export const useThemedStyles = <T extends Record<string, any>>(
  styleCreator: (theme: ThemeContextType) => T
): T => {
  const theme = useTheme();
  return styleCreator(theme);
};
