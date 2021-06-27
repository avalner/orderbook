export type MonochromeColors = {
  lightest: React.CSSProperties['color'];
  lighter: React.CSSProperties['color'];
  light: React.CSSProperties['color'];
  mediumlight: React.CSSProperties['color'];
  medium: React.CSSProperties['color'];
  mediumdark: React.CSSProperties['color'];
  dark: React.CSSProperties['color'];
  darker: React.CSSProperties['color'];
  darkest: React.CSSProperties['color'];
};

const monochrome: MonochromeColors = {
  lightest: '#FFFFFF',
  lighter: '#F8F8F8',
  light: '#F3F3F3',
  mediumlight: '#EEEEEE',
  medium: '#DDDDDD',
  mediumdark: '#999999',
  dark: '#666666',
  darker: '#444444',
  darkest: '#333333',
};

const theme = {
  spacing: 8,
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: 'Cantarell, sans-serif',
    fontWeightBold: 600,
    h1: {
      fontSize: 38,
      fontWeight: 'bold',
    },
    h5: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    h6: {
      fontSize: 16,
      fontWeight: 'bold',
      letterSpacing: 1,
    },
    size: {
      s1: '12',
      s2: '14',
      s3: '16',
      m1: '20',
      m2: '24',
      m3: '28',
      l1: '32',
      l2: '40',
      l3: '48',
      code: '90',
    },
  },
  control: {
    height: 26,
  },
  controls: {
    select: {
      minWidth: 140,
    },
  },
  palette: {
    primary: '#2a50a2',
    secondary: '#2aa286',
    text: {
      primary: '#DFDFDF',
    },
    mainBackgroundColor: '#111827',
    panelBackgroundColor: '#242D3C',
    subPanelBackgroundColor: '#111827',
    buyColor: '#3E212C',
    sellColor: '#103839',
    color: {
      purple: '#5741D9',
      red: '#B91D1D',
    },
    monochrome,
  },
};

export default theme;
