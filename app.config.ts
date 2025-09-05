import {ConfigContext, ExpoConfig} from "@expo/config";

const IS_DEV = process.env.APP_VARIANT === 'development';
const IS_PREVIEW = process.env.APP_VARIANT === 'preview';

const getUniqueIdentifier = () => {
  if (IS_DEV) {
    return 'com.anonymous.intermedinterpretermobile.dev';
  }

  if (IS_PREVIEW) {
    return 'com.anonymous.intermedinterpretermobile.preview';
  }

  return 'com.anonymous.intermedinterpretermobile';
};

const getAppName = () => {
  if (IS_DEV) {
    return 'intermed-interpreter-mobile (Dev)';
  }

  if (IS_PREVIEW) {
    return 'intermed-interpreter-mobile (Preview)';
  }

  return 'intermed-interpreter-mobile';
};

export default({ config  }: ConfigContext ): ExpoConfig => ({
  ...config,
    "name": getAppName(),
    "slug": "intermed-interpreter-mobile",
    "version": "1.2.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/images/icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
  updates: {
    // This URL points to your project's update server on EAS
    url: "https://u.expo.dev/2b5de7d1-cdce-4b08-be6b-abc30058ddda"
  },
  runtimeVersion:
    // This policy ties the updates to your app version.
    // When you change "version" above (e.g., to "1.0.1"), you'll need a new build.
    // Updates will only apply to builds with the same app version.
    "1.2.0",
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": getUniqueIdentifier(),
      "entitlements": {
        "aps-environment": IS_DEV ? "development" : "production"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": getUniqueIdentifier(),
      "googleServicesFile": "./google-services.json"
    },
    "web": {
      "bundler": "metro",
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "@rnmapbox/maps",
        {
          "RNMapboxMapsDownloadToken": "sk.eyJ1IjoiYnBlbmE3MDciLCJhIjoiY2x6eGpzMWx4MHU4ZzJycTN1bnZ6ajdrcSJ9.LZ5AeW2xo7EXhN_3iEz44A"
        }
      ],
      "expo-secure-store",
      "expo-font",
      "expo-updates",
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notifications-icon.png",
          "color": "#ffffff",
          "defaultChannel": "default"
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    },
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "2b5de7d1-cdce-4b08-be6b-abc30058ddda"
      }
    },
  "owner": "bpena707"
})

