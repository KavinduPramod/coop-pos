import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.diproit.coopmobilepos',
  appName: 'coop-mobile-pos-web',
  webDir: 'build',
  server: {
    url:'https://effortless-starship-b5b86e.netlify.app',
    cleartext:true
  }
};

export default config;
