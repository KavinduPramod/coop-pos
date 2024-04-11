import { config } from "./config";
import { getToken } from "./localstorage";

// const getRequest = async (path) => {
//   // console.log(getToken())
//   try {
//     const params = {
//       method: "GET",
//       headers: {
//         Authorization: "Bearer " + getToken(),
//       },
//     };
//     const res = await fetch(config.baseURL + path, params);
//     console.log({ res });
//     const data = await res.text();
//     return { statusCode: res.status, data };
//   } catch (e) {
//     console.error(`error in get Request (${path}) :- `, e);
//     return { statusCode: 400, data: [] };
//   }
// };

const getRequestBody = async (path, body) => {
  try {
    const params = {
      method: "POST", // Change method to POST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    const response = await fetch(config.baseURL+path,params);
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};


const postRequest = async (path, body) => {
  try {
    const params = {
      method: "POST", // Change method to POST
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };
    const response = await fetch(config.baseURL+path,params);
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// const DeleteRequest = async (path) => {
//   try {
//     const params = {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + getToken(),
//       },
//     };

//     const res = await fetch(config.baseURL + path, params);

//     const data = await res.text();
//     return { statusCode: res.status, data };
//   } catch (e) {
//     console.log(`error in Delete Request (${path}) :- `, e);
//   }
// };

// const putRequest = async (path, body) => {
//   try {
//     const params = {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + getToken(),
//       },
//       body: JSON.stringify(body),
//     };

//     const res = await fetch(config.baseURL + path, params);

//     const data = await res.text();
//     return { statusCode: res.status, data };
//   } catch (e) {
//     console.log(`error in PUT Request (${path}) :- `, e);
//   }
// };

export const Api = {
  // getRequest,
  postRequest,
  getRequestBody
  // DeleteRequest,
  // putRequest,
};
