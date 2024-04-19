import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cooppos.app',
  appName: 'coop-mobile-pos-web',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
