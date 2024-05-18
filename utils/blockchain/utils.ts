import FORWARDER_ABI from "./AbiForwarder.json";
import { web3, adminAccount } from "./localKeys";
import { getSignature } from "../venly";

const FORWARDER_CONTRACT_ADDRESS = process.env.FORWARDER_CONTRACT_ADDRESS;

const EIP712Domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" },
];

const types = {
  EIP712Domain,
  ForwardRequest: [
    {
      name: "from",
      type: "address",
    },
    {
      name: "to",
      type: "address",
    },
    {
      name: "value",
      type: "uint256",
    },
    {
      name: "gas",
      type: "uint256",
    },
    {
      name: "nonce",
      type: "uint256",
    },
    {
      name: "deadline",
      type: "uint48",
    },
    {
      name: "data",
      type: "bytes",
    },
  ],
};

const domain = {
  name: "Forwarder",
  version: "1",
  chainId: Number(process.env.CHAIN_ID),
  verifyingContract: FORWARDER_CONTRACT_ADDRESS,
};

export async function executeMetaTransaction(
  abi: any,
  params: any[],
  from: string,
  to: string,
  walletId: string
) {
  try {
    var blockNumber = await web3.eth.getBlockNumber();
    var timestamp = (await web3.eth.getBlock(blockNumber)).timestamp;

    const forwardContract = new web3.eth.Contract(
      FORWARDER_ABI as any[],
      FORWARDER_CONTRACT_ADDRESS
    );

    console.log(abi, params);

    const encodedFunctionData = web3.eth.abi.encodeFunctionCall(abi, params);
    const req = {
      from,
      to,
      value: "0",
      gas: "3000000",
      nonce: Number(await forwardContract.methods.nonces(from).call({ from })),
      deadline: Number(timestamp) + 30,
      data: encodedFunctionData,
    };
    domain.chainId = await web3.eth.getChainId();
    const signature = await getSignature(walletId, {
      types: types,
      domain: domain,
      primaryType: "ForwardRequest",
      message: req,
    });
    console.log("execution signature", signature);

    const requestData = {
      from,
      to,
      value: "0",
      gas: "3000000",
      deadline: Number(timestamp) + 30,
      data: encodedFunctionData,
      signature,
    };
    await forwardContract.methods
      .verify(requestData)
      .call({ from: adminAccount.address });

    const nonce = await web3.eth.getTransactionCount(adminAccount.address);
    const tx = await forwardContract.methods
      .execute(requestData)
      .send({ from: adminAccount.address, nonce });

    console.log("meta trasaction executed tx ------>", tx.transactionHash);
    return tx.transactionHash;
  } catch (error) {
    console.log(error);
    throw new Error("Execution failed" + error);
  }
}
