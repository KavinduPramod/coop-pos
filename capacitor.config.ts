import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.diproit.coopmobilepos',
  appName: 'coop-mobile-pos-web',
  webDir: 'build',
  server: {
    url:'http://127.0.0.1:3000/',
    cleartext:true
  }
};

export default config;
