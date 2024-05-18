import axios from "axios";

import devConfig from "../config";
import qs from "qs";

const VENLY_AUTH_BASE_URL = "https://login-staging.venly.io";
const VENLY_WALLET_BASE_URL = "https://api-wallet-sandbox.venly.io";

let config: any = {};

const getAccessToken = async () => {
  config.baseURL = VENLY_AUTH_BASE_URL;

  const url = `/auth/realms/Arkane/protocol/openid-connect/token`;

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const data = {
    grant_type: "client_credentials",
    client_id: devConfig.venlyclientId,
    client_secret: devConfig.venlyclientSecret,
  };

  config.method = "POST";
  config.url = url;
  config.headers = headers;
  config.data = qs.stringify(data);
  try {
    const response = await axios(config);
    return response.data.access_token;
  } catch (error) {
    console.log(error);
  }
};

export const getSignature = async (walletId: string, reqData: any) => {
  const token = await getAccessToken();
  config.baseURL = VENLY_WALLET_BASE_URL;

  const url = `/api/signatures`;

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
  const data = {
    pincode: "177438",
    signatureRequest: {
      type: "EIP712",
      secretType: "ETHEREUM",
      walletId,
      data: reqData,
    },
  };

  console.log(reqData);

  config.method = "POST";
  config.url = url;
  config.headers = headers;
  config.responseType = "json";
  config.data = data;
  try {
    const response = await axios(config);
    if (response.data.success) {
      return response.data.result.signature;
    } else {
      throw new Error("Failed to sign");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Failed to sign");
  }
};

const createWallet = async () => {
  const token = await getAccessToken();
  config.baseURL = VENLY_WALLET_BASE_URL;

  const url = `/api/wallets`;

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
  };
  const data = {
    pincode: "177438",
    secretType: "ETHEREUM",
    walletType: "WHITE_LABEL",
  };
  config.method = "POST";
  config.url = url;
  config.headers = headers;
  config.responseType = "json";
  config.data = data;
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export { createWallet, getAccessToken };
