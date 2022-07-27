module.exports = {
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      lineHeight: {
        0: '0',
      },
      colors: {
        light: '#fcfbfb',
        dark: '#004000',
        primary: '#ca1e49',
        secondary: '#1796bc',
      },
      backgroundImage: {
        'check-white': `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="white"><path d="M13 4a1 1 0 0 1 1 0v1l-6 7a1 1 0 0 1-1 0L3 8a1 1 0 0 1 0-1 1 1 0 0 1 1 0l3 3 6-6Z"/></svg>')`,
      },
    },
  },
  plugins: [],
};
