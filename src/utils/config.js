const devConfig = {
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://165.22.97.154:3001/",
};

const prodConfig = {
  baseURL: "Your production url",
};

export const config = devConfig;
