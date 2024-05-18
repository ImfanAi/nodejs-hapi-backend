import Transaction from "../../models/transaction";
import { executeMetaTransaction } from "./utils";
import { getMUSDAddress } from "./manager";

import MANAGER_ABI from "./AbiManager.json";
import PROJECT_ABI from "./AbiProject.json";

import { web3, adminAccount } from "./localKeys";
import Web3 from "web3";

const MANAGER_CONTRACT_ADDRESS = process.env.MANAGER_CONTRACT_ADDRESS;
const ADMIN_WALLET_VENLY_ID = process.env.ADMIN_WALLET_VENLY_ID;

const managerContract = new web3.eth.Contract(
  MANAGER_ABI as any[],
  MANAGER_CONTRACT_ADDRESS
);

export const getAssets = async (projectId: string, investorAddress: string) => {
  try {
    console.log("getAssets--->", projectId, investorAddress);

    if (
      investorAddress === "" ||
      !Web3.utils.isAddress(investorAddress) ||
      !Web3.utils.checkAddressChecksum(investorAddress)
    ) {
      return 0;
    }

    const projectAddress = await managerContract.methods
      .projects(projectId)
      .call({ from: adminAccount.address });

    const projectContract = new web3.eth.Contract(
      PROJECT_ABI as any[],
      projectAddress
    );

    const balance = await projectContract.methods
      .balanceOf(investorAddress)
      .call({ from: adminAccount.address });

    const result = await projectContract.methods
      .convertToAssets(balance)
      .call({ from: adminAccount.address });

    return web3.utils.fromWei(result, "ether").toString();
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const getFundraising = async (projectId: string) => {
  try {
    console.log("getFundraising--->", projectId);

    const projectAddress = await managerContract.methods
      .projects(projectId)
      .call({ from: adminAccount.address });

    const projectContract = new web3.eth.Contract(
      PROJECT_ABI as any[],
      projectAddress
    );
    const result = await projectContract.methods
      .totalInvestments()
      .call({ from: adminAccount.address });
    return web3.utils.fromWei(result, "ether").toString();
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const getWithdrawal = async (projectId: string) => {
  try {
    console.log("getWithdrawal--->", projectId);

    const projectAddress = await managerContract.methods
      .projects(projectId)
      .call({ from: adminAccount.address });

    const projectContract = new web3.eth.Contract(
      PROJECT_ABI as any[],
      projectAddress
    );
    const result = await projectContract.methods
      .withdrawals()
      .call({ from: adminAccount.address });
    return web3.utils.fromWei(result, "ether").toString();
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const getGivenRewards = async (projectId: string) => {
  try {
    console.log("getGivenRewards--->", projectId);

    const projectAddress = await managerContract.methods
      .projects(projectId)
      .call({ from: adminAccount.address });

    const projectContract = new web3.eth.Contract(
      PROJECT_ABI as any[],
      projectAddress
    );
    const result = await projectContract.methods
      .depositedRewards()
      .call({ from: adminAccount.address });
    return web3.utils.fromWei(result, "ether").toString();
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const getTotalClaimedRewards = async (projectId: string) => {
  try {
    console.log("getTotalClaimedRewards--->", projectId);

    const projectAddress = await managerContract.methods
      .projects(projectId)
      .call({ from: adminAccount.address });

    const projectContract = new web3.eth.Contract(
      PROJECT_ABI as any[],
      projectAddress
    );
    const result = await projectContract.methods
      .claimedRewards()
      .call({ from: adminAccount.address });
    return web3.utils.fromWei(result, "ether").toString();
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const getClaimableAmount = async (
  projectId: string,
  investorAddress: string
) => {
  try {
    console.log("getClaimableAmount--->", projectId, investorAddress);

    if (
      investorAddress === "" ||
      !Web3.utils.isAddress(investorAddress) ||
      !Web3.utils.checkAddressChecksum(investorAddress)
    ) {
      return 0;
    }

    const projectAddress = await managerContract.methods
      .projects(projectId)
      .call({ from: adminAccount.address });

    const projectContract = new web3.eth.Contract(
      PROJECT_ABI as any[],
      projectAddress
    );
    const result = await projectContract.methods
      .claimableRewards(investorAddress)
      .call({ from: adminAccount.address });
    return web3.utils.fromWei(result, "ether").toString();
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const getClaimedRewards = async (
  projectId: string,
  investorAddress: string
) => {
  try {
    console.log("getClaimedRewards--->", projectId, investorAddress);

    if (
      investorAddress === "" ||
      !Web3.utils.isAddress(investorAddress) ||
      !Web3.utils.checkAddressChecksum(investorAddress)
    ) {
      return 0;
    }

    const projectAddress = await managerContract.methods
      .projects(projectId)
      .call({ from: adminAccount.address });

    const projectContract = new web3.eth.Contract(
      PROJECT_ABI as any[],
      projectAddress
    );
    const result = await projectContract.methods
      .claimedRewardsPerClient(investorAddress)
      .call({ from: adminAccount.address });
    return web3.utils.fromWei(result, "ether").toString();
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const getBalance = async (
  projectId: string,
  investorAddress: string
) => {
  try {
    console.log("getBalance--->", projectId, investorAddress);

    if (
      investorAddress === "" ||
      !Web3.utils.isAddress(investorAddress) ||
      !Web3.utils.checkAddressChecksum(investorAddress)
    ) {
      return 0;
    }

    const projectAddress = await managerContract.methods
      .projects(projectId)
      .call({ from: adminAccount.address });

    const projectContract = new web3.eth.Contract(
      PROJECT_ABI as any[],
      projectAddress
    );

    const result = await projectContract.methods
      .balanceOf(investorAddress)
      .call({ from: adminAccount.address });
    return web3.utils.fromWei(result, "ether").toString();
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const claim = async (projectId: string, accountId: string, account) => {
  try {
    console.log("claim--->", projectId, accountId);

    const projectAddress = await managerContract.methods
      .projects(projectId)
      .call({ from: adminAccount.address });

    const amount = await getClaimableAmount(projectId, account);

    const txHash = await executeMetaTransaction(
      {
        type: "function",
        inputs: [],
        name: "claimRewards",
      },
      [],
      account,
      projectAddress,
      accountId
    );

    const transaction = new Transaction({
      from: account,
      projectId,
      value: amount,
      action: "claim rewards",
      txHash,
    });

    await transaction.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const withdraw = async (
  projectId: string,
  projectOwnerAddress: string
) => {
  try {
    console.log("withdraw--->", projectId);

    const projectAddress = await managerContract.methods
      .projects(projectId)
      .call({ from: adminAccount.address });

    console.log("withdraw -->", projectAddress);

    const fundraising = await getFundraising(projectId);
    const withdrawal = await getWithdrawal(projectId);

    const txHash = await executeMetaTransaction(
      {
        type: "function",
        inputs: [],
        name: "withdrawByProjectOwner",
      },
      [],
      adminAccount.address,
      projectAddress,
      ADMIN_WALLET_VENLY_ID
    );

    const transaction = new Transaction({
      from: projectOwnerAddress,
      projectId,
      value: Number(fundraising) - Number(withdrawal),
      action: "withdraw on the project",
      txHash,
    });

    await transaction.save();

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const deposit = async (
  projectId: string,
  projectOwnerId: string,
  projectOwnerAddress: string,
  amount: number
) => {
  try {
    console.log("deposit--->", projectId, projectOwnerId, amount);

    const projectAddress = await managerContract.methods
      .projects(projectId)
      .call({ from: adminAccount.address });
    console.log("project deposit -->", projectAddress);

    const musdContractAddress = await getMUSDAddress();

    await executeMetaTransaction(
      {
        type: "function",
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "approve",
      },
      [projectAddress, web3.utils.toWei(amount.toString(), "ether").toString()],
      projectOwnerAddress,
      musdContractAddress,
      projectOwnerId
    );

    const txHash = await executeMetaTransaction(
      {
        type: "function",
        inputs: [
          {
            internalType: "uint256",
            name: "amount_",
            type: "uint256",
          },
        ],
        name: "depositRewards",
      },
      [web3.utils.toWei(amount.toString(), "ether").toString()],
      projectOwnerAddress,
      projectAddress,
      projectOwnerId
    );

    const trasaction = new Transaction({
      from: projectOwnerAddress,
      projectId,
      value: amount,
      action: "deposit on the project",
      txHash,
    });

    await trasaction.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const invest = async (
  projectId: string,
  investorId: string,
  investorAddress: string,
  amount: number
) => {
  try {
    console.log("invest--->", projectId, investorId, amount);

    const projectAddress = await managerContract.methods
      .projects(projectId)
      .call({ from: adminAccount.address });

    console.log("On investment project address-->", projectAddress);

    const musdContractAddress = await getMUSDAddress();

    await executeMetaTransaction(
      {
        type: "function",
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "approve",
      },
      [projectAddress, web3.utils.toWei(amount.toString(), "ether").toString()],
      investorAddress,
      musdContractAddress,
      investorId
    );

    const txHash = await executeMetaTransaction(
      {
        type: "function",
        inputs: [
          {
            internalType: "uint256",
            name: "assets",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "receiver",
            type: "address",
          },
        ],
        name: "deposit",
      },
      [
        web3.utils.toWei(amount.toString(), "ether").toString(),
        investorAddress,
      ],
      investorAddress,
      projectAddress,
      investorId
    );

    const transaction = new Transaction({
      from: investorAddress,
      projectId,
      value: amount,
      action: "Invest on project",
      txHash,
    });

    await transaction.save();
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
