import axios from "axios";

const ETHERSCAN_API_URL = "https://api-goerli.etherscan.io";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

let config: any = {};

const getTransaction = async (address, page) => {
  config.baseURL = ETHERSCAN_API_URL;

  const url = `/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=${page}&offset=25&sort=asc&apikey=${ETHERSCAN_API_KEY}`;

  const headers = {
    Accept: "application/json",
  };

  config.method = "GET";
  config.url = url;
  config.headers = headers;
  try {
    const response = await axios(config);
    return response.data.result;
  } catch (error) {
    console.log(error);
  }
};

export { getTransaction };
