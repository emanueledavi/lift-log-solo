import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.dbfdeded06664deb94374c0458912f06',
  appName: 'lift-log-solo',
  webDir: 'dist',
  server: {
    url: 'https://dbfdeded-0666-4deb-9437-4c0458912f06.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    StatusBar: {
      style: 'dark',
      backgroundColor: '#1a1a1a'
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a1a1a',
      showSpinner: false
    }
  }
};

export default config;