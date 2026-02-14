import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        happ: {
          dark: '#0A1F12',
          surface: '#132E1C',
          green: '#006838',
          greenLight: '#00A86B',
          yellow: '#FFC72C',
          yellowDark: '#B8860B',
          orange: '#FF6B35',
          cyan: '#00BCD4',
          red: '#DC2626',
        }
      }
    },
  },
  plugins: [],
}
export default config
