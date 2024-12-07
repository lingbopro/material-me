/**
 * RGB 颜色对象
 */
export interface RgbColor {
  r: number;
  g: number;
  b: number;
}
/**
 * 单个配色方案（浅色/深色）的颜色
 */
export interface ColorScheme {
  Primary: RgbColor;
  OnPrimary: RgbColor;
  PrimaryContainer: RgbColor;
  OnPrimaryContainer: RgbColor;
  Secondary: RgbColor;
  OnSecondary: RgbColor;
  SecondaryContainer: RgbColor;
  OnSecondaryContainer: RgbColor;
  Tertiary: RgbColor;
  OnTertiary: RgbColor;
  TertiaryContainer: RgbColor;
  OnTertiaryContainer: RgbColor;
  Error: RgbColor;
  OnError: RgbColor;
  ErrorContainer: RgbColor;
  OnErrorContainer: RgbColor;
  Surface: RgbColor;
  OnSurface: RgbColor;
  SurfaceVariant: RgbColor;
  OnSurfaceVariant: RgbColor;
  SurfaceContainerHighest: RgbColor;
  SurfaceContainerHigh: RgbColor;
  SurfaceContainer: RgbColor;
  SurfaceContainerLow: RgbColor;
  SurfaceContainerLowest: RgbColor;
  InverseSurface: RgbColor;
  InverseOnSurface: RgbColor;
  SurfaceTint: RgbColor;
  SurfaceTintColor: RgbColor;
  Outline: RgbColor;
  OutlineVariant: RgbColor;
  Background: RgbColor;
  OnBackground: RgbColor;
  SurfaceBright: RgbColor;
  SurfaceDim: RgbColor;
  Scrim: RgbColor;
  Shadow: RgbColor;
}
/**
 * 包含浅色与深色配色方案的主题
 */
export interface ThemeColors {
  light: ColorScheme;
  dark: ColorScheme;
}
/**
 * 不同等级的阴影
 */
export interface ThemeElevations {
  Level1: string;
  Level2: string;
  Level3: string;
  Level4: string;
  Level5: string;
}
/**
 * 主题对象
 */
export interface Theme {
  colors: ThemeColors;
  elevations: ThemeElevations;
}

/**
 * 默认主题
 */
export const defaultTheme: Theme = {
  colors: {
    light: {
      Primary: { r: 103, g: 80, b: 164 },
      OnPrimary: { r: 255, g: 255, b: 255 },
      PrimaryContainer: { r: 234, g: 221, b: 255 },
      OnPrimaryContainer: { r: 79, g: 55, b: 139 },
      Secondary: { r: 98, g: 91, b: 113 },
      OnSecondary: { r: 255, g: 255, b: 255 },
      SecondaryContainer: { r: 232, g: 222, b: 248 },
      OnSecondaryContainer: { r: 74, g: 68, b: 88 },
      Tertiary: { r: 125, g: 82, b: 96 },
      OnTertiary: { r: 255, g: 255, b: 255 },
      TertiaryContainer: { r: 255, g: 216, b: 228 },
      OnTertiaryContainer: { r: 99, g: 59, b: 72 },
      Error: { r: 179, g: 38, b: 30 },
      OnError: { r: 255, g: 255, b: 255 },
      ErrorContainer: { r: 249, g: 222, b: 220 },
      OnErrorContainer: { r: 140, g: 29, b: 24 },
      Surface: { r: 254, g: 247, b: 255 },
      OnSurface: { r: 29, g: 27, b: 32 },
      SurfaceVariant: { r: 231, g: 224, b: 236 },
      OnSurfaceVariant: { r: 73, g: 69, b: 79 },
      SurfaceContainerHighest: { r: 230, g: 224, b: 233 },
      SurfaceContainerHigh: { r: 236, g: 230, b: 240 },
      SurfaceContainer: { r: 243, g: 237, b: 247 },
      SurfaceContainerLow: { r: 247, g: 242, b: 250 },
      SurfaceContainerLowest: { r: 255, g: 255, b: 255 },
      InverseSurface: { r: 50, g: 47, b: 53 },
      InverseOnSurface: { r: 245, g: 239, b: 247 },
      SurfaceTint: { r: 103, g: 80, b: 164 },
      SurfaceTintColor: { r: 103, g: 80, b: 164 },
      Outline: { r: 121, g: 116, b: 126 },
      OutlineVariant: { r: 202, g: 196, b: 208 },
      Background: { r: 254, g: 247, b: 255 },
      OnBackground: { r: 29, g: 27, b: 32 },
      SurfaceBright: { r: 254, g: 247, b: 255 },
      SurfaceDim: { r: 222, g: 216, b: 225 },
      Scrim: { r: 0, g: 0, b: 0 },
      Shadow: { r: 0, g: 0, b: 0 },
    },
    dark: {
      Primary: { r: 208, g: 188, b: 255 },
      OnPrimary: { r: 56, g: 30, b: 114 },
      PrimaryContainer: { r: 79, g: 55, b: 139 },
      OnPrimaryContainer: { r: 234, g: 221, b: 255 },
      Secondary: { r: 204, g: 194, b: 220 },
      OnSecondary: { r: 51, g: 45, b: 65 },
      SecondaryContainer: { r: 74, g: 68, b: 88 },
      OnSecondaryContainer: { r: 232, g: 222, b: 248 },
      Tertiary: { r: 239, g: 184, b: 200 },
      OnTertiary: { r: 73, g: 37, b: 50 },
      TertiaryContainer: { r: 99, g: 59, b: 72 },
      OnTertiaryContainer: { r: 255, g: 216, b: 228 },
      Error: { r: 242, g: 184, b: 181 },
      OnError: { r: 96, g: 20, b: 16 },
      ErrorContainer: { r: 140, g: 29, b: 24 },
      OnErrorContainer: { r: 249, g: 222, b: 220 },
      Surface: { r: 20, g: 18, b: 24 },
      OnSurface: { r: 230, g: 224, b: 233 },
      SurfaceVariant: { r: 73, g: 69, b: 79 },
      OnSurfaceVariant: { r: 202, g: 196, b: 208 },
      SurfaceContainerHighest: { r: 54, g: 52, b: 59 },
      SurfaceContainerHigh: { r: 43, g: 41, b: 48 },
      SurfaceContainer: { r: 33, g: 31, b: 38 },
      SurfaceContainerLow: { r: 29, g: 27, b: 32 },
      SurfaceContainerLowest: { r: 15, g: 13, b: 19 },
      InverseSurface: { r: 230, g: 224, b: 233 },
      InverseOnSurface: { r: 50, g: 47, b: 53 },
      SurfaceTint: { r: 208, g: 188, b: 255 },
      SurfaceTintColor: { r: 208, g: 188, b: 255 },
      Outline: { r: 147, g: 143, b: 153 },
      OutlineVariant: { r: 73, g: 69, b: 79 },
      Background: { r: 20, g: 18, b: 24 },
      OnBackground: { r: 230, g: 224, b: 233 },
      SurfaceBright: { r: 59, g: 56, b: 62 },
      SurfaceDim: { r: 20, g: 18, b: 24 },
      Scrim: { r: 0, g: 0, b: 0 },
      Shadow: { r: 0, g: 0, b: 0 },
    },
  },
  elevations: {
    Level1:
      '0 3px 1px -2px rgba(var(--mm-color-shadow), .2), 0 2px 2px 0 rgba(var(--mm-color-shadow), .14), 0 1px 5px 0 rgba(var(--mm-color-shadow), .12)',
    Level2:
      '0 2px 4px -1px rgba(var(--mm-color-shadow), .2), 0 4px 5px 0 rgba(var(--mm-color-shadow), .14), 0 1px 10px 0 rgba(var(--mm-color-shadow), .12)',
    Level3:
      '0 5px 5px -3px rgba(var(--mm-color-shadow), .2), 0 8px 10px 1px rgba(var(--mm-color-shadow), .14), 0 3px 14px 2px rgba(var(--mm-color-shadow), .12)',
    Level4:
      '0 8px 10px -5px rgba(var(--mm-color-shadow), .2), 0 16px 24px 2px rgba(var(--mm-color-shadow), .14), 0 6px 30px 5px rgba(var(--mm-color-shadow), .12)',
    Level5:
      '0 10px 14px -6px rgba(var(--mm-color-shadow), .2), 0 22px 35px 3px rgba(var(--mm-color-shadow), .14), 0 8px 42px 7px rgba(var(--mm-color-shadow), .12)',
  },
};

const toKebabCase = (str: string) => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

/**
 * 根据给定的主题对象生成 CSS 亮色和暗色变量
 * _注：还需使用 `generateOverrideColorKeys()` 生成将颜色模式变量映射到默认变量的 CSS 变量_
 * @param theme 主题对象
 * @returns 生成的 CSS 变量（需放入选择器内）
 */
export function generateCSSKeys(theme: Theme): string {
  const toRgbValue = (color: RgbColor) => {
    return `${color.r}, ${color.g}, ${color.b}`;
  };
  const generateKeys = (obj: any, prefix: string, valueProcessor?: (value: any) => string) => {
    return Object.keys(obj)
      .map((key) => {
        const value = obj[key];
        const casedKey = toKebabCase(key);
        const CSSKey = `--mm-${prefix}-${casedKey}`;
        valueProcessor = valueProcessor ?? ((value) => value);
        return `${CSSKey}: ${valueProcessor(value)};`;
      })
      .join('\n');
  };

  const keysColorLight = generateKeys(theme.colors.light, 'color-light', (value: RgbColor) => toRgbValue(value));
  const keysColorDark = generateKeys(theme.colors.dark, 'color-dark', (value: RgbColor) => toRgbValue(value));
  const keysElevations = generateKeys(theme.elevations, 'elevation');
  const keys = keysColorLight + keysColorDark + keysElevations;
  return keys;
}
/**
 * 生成将颜色模式变量映射到默认变量的 CSS 变量
 * 即：`--mm-color-*: var(--mm-color-[light|dark]-*)`
 * @param scheme 颜色模式
 * @param theme 主题对象（仅用于提取键名）
 * @returns
 */
export function generateOverrideColorKeys(scheme: 'light' | 'dark', theme: Theme = defaultTheme): string {
  const keys = Object.keys(theme.colors[scheme]).map((key) => {
    const casedKey = toKebabCase(key);
    return `--mm-color-${casedKey}: var(--mm-color-${scheme}-${casedKey});`;
  });
  return keys.join('\n');
}

/**
 * 预生成的映射变量
 * @see generateOverrideColorKeys
 */
export const overrideColorKeys = {
  light: generateOverrideColorKeys('light'),
  dark: generateOverrideColorKeys('dark'),
};
