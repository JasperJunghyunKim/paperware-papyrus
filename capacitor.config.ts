import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'paperware.user.mobile',
  appName: 'paperware-user-mobile',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
