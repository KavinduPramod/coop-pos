process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const devConfig = {
  baseURL: process.env.REACT_APP_API_BASE_URL || "https://coop-pos-7dc6d9047bd4.herokuapp.com",
};

const prodConfig = {
  baseURL: "Your production url",
};

export const config = devConfig;
