import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";

const adminPrivateKey = process.env.ADMIN_WALLET_PRIVATE_KEY;

const localKeyProvider = new HDWalletProvider({
  privateKeys: [adminPrivateKey],
  providerOrUrl:
    "https://polygon-mumbai.g.alchemy.com/v2/RFEvJAPXa4iS42sVjzUIt5KwMOvBXsxQ",
});
const web3 = new Web3(localKeyProvider);
const adminAccount = web3.eth.accounts.privateKeyToAccount(adminPrivateKey);

export { web3, adminAccount };
