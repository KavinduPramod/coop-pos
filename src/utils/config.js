process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const devConfig = {
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:3001",
};

// const prodConfig = {
//   baseURL: "Your production url",
// };

export const config = devConfig;
