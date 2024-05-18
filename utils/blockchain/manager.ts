import MANAGER_ABI from "./AbiManager.json";
import { executeMetaTransaction } from "./utils";
import Transaction from "../../models/transaction";
import { web3, adminAccount } from "./localKeys";

const MANAGER_CONTRACT_ADDRESS = process.env.MANAGER_CONTRACT_ADDRESS;
const ADMIN_WALLET_VENLY_ID = process.env.ADMIN_WALLET_VENLY_ID;

const managerContract = new web3.eth.Contract(
  MANAGER_ABI as any[],
  MANAGER_CONTRACT_ADDRESS
);

export const getMUSDAddress = async () => {
  try {
    console.log("getMUSDAddress-->");
    return await managerContract.methods
      .musd()
      .call({ from: adminAccount.address });
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

export const getProjectAddress = async (projectId: string) => {
  try {
    console.log("getProjectAddress-->");
    return await managerContract.methods
      .projects(projectId)
      .call({ from: adminAccount.address });
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

export const createNewTrading = async (
  projectId: string,
  tokenName: string,
  tokenSymbol: string,
  supply: number,
  value: number,
  decimals: number,
  projectOwner: string,
  fundraisingStartTime: number,
  fundraisingEndTime: number,
  tradingStartTime: number,
  tradingEndTime: number
) => {
  try {
    console.log("createNewTradingProject-->");

    const txHash = await executeMetaTransaction(
      {
        name: "createNewTradingICO",
        type: "function",
        inputs: [
          {
            internalType: "string",
            name: "projectId",
            type: "string",
          },
          {
            internalType: "string",
            name: "tokenName",
            type: "string",
          },
          {
            internalType: "string",
            name: "tokenSymbol",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "supply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_projectOwner",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_fundraisingStartTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_fundraisingEndTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_tradingStartTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "_tradingEndTime",
            type: "uint256",
          },
        ],
      },
      [
        projectId,
        tokenName,
        tokenSymbol,
        web3.utils.toWei(supply.toString(), "ether").toString(),
        web3.utils.toWei(value.toString(), "ether").toString(),
        projectOwner,
        fundraisingStartTime,
        fundraisingEndTime,
        tradingStartTime,
        tradingEndTime,
      ],
      adminAccount.address,
      MANAGER_CONTRACT_ADDRESS,
      ADMIN_WALLET_VENLY_ID
    );

    const projectContract = await managerContract.methods
      .projects(projectId)
      .call({ from: adminAccount.address });

    const trasaction = new Transaction({
      from: projectOwner,
      projectId,
      value: 0,
      action: "create new trading ico",
      txHash,
    });

    await trasaction.save();
    return { success: true, contract: projectContract };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
};

export const createNewProject = async (
  projectId: string,
  tokenName: string,
  tokenSymbol: string,
  supply: number,
  value: number,
  decimals: number,
  projectOwner: string
) => {
  try {
    console.log("createNewProject-->");

    const txHash = await executeMetaTransaction(
      {
        name: "createNewShippingProject",
        type: "function",
        inputs: [
          {
            internalType: "string",
            name: "projectId",
            type: "string",
          },
          {
            internalType: "string",
            name: "tokenName",
            type: "string",
          },
          {
            internalType: "string",
            name: "tokenSymbol",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "supply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "_projectOwner",
            type: "address",
          },
        ],
      },
      [
        projectId,
        tokenName,
        tokenSymbol,
        web3.utils.toWei(supply.toString(), "ether").toString(),
        web3.utils.toWei(value.toString(), "ether").toString(),
        projectOwner,
      ],
      adminAccount.address,
      MANAGER_CONTRACT_ADDRESS,
      ADMIN_WALLET_VENLY_ID
    );

    const projectContract = await managerContract.methods
      .projects(projectId)
      .call({ from: adminAccount.address });

    const trasaction = new Transaction({
      from: projectOwner,
      projectId,
      value: 0,
      action: "create new shipping project",
      txHash,
    });

    await trasaction.save();
    return { success: true, contract: projectContract };
  } catch (err) {
    console.log(err);
    return { success: false };
  }
};
