import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.diproit.coopmobilepos',
  appName: 'coop-mobile-pos-web',
  webDir: 'build',
  server: {
    url:'https://mellifluous-torrone-9758de.netlify.app',
    cleartext:true
  }
};

export default config;
