import * as aes from "./webcrypto/aes.js";
import * as rsa from "./webcrypto/rsa.js";
import { randomString } from "./webcrypto/helpers.js";
import lf from "localforage";

const crypto = window.crypto;

const publicKeyObj = JSON.parse(import.meta.env.VITE_PUBLIC_KEY);

const getPublicKey = async (publicKey) =>
  await crypto.subtle.importKey(
    "jwk",
    publicKey,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-512" },
    },
    false,
    ["encrypt"],
  );

const generateKeypair = async () => {
  const { privateKey, publicKey } = await rsa.generateKeypair();
  const exportPrivateKey = await crypto.subtle.exportKey(
    "jwk",
    privateKey,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-512" },
    },
    false,
    ["decrypt"],
  );
  const exportPublicKey = await crypto.subtle.exportKey(
    "jwk",
    publicKey,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-512" },
    },
    false,
    ["encrypt"],
  );
  return { exportPrivateKey, exportPublicKey };
};

const getPrivateKey = async (privateKey) =>
  await crypto.subtle.importKey(
    "jwk",
    privateKey,
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-512" },
    },
    false,
    ["decrypt"],
  );

const encryptProposalData = async (proposal) => {
  const symatricKey = randomString(128);
  const encryptedData = await aes.encrypt(
    JSON.stringify(proposal),
    symatricKey,
  );
  const encryptedSymatricKey = await rsa.encrypt(
    symatricKey,
    await getPublicKey(publicKeyObj),
  );

  return { encryptedData, encryptedSymatricKey };
};

const decryptProposalData = async (encryptedData, encryptedSymatricKey) => {
  const symatricKey = await rsa.decrypt(
    encryptedSymatricKey,
    await getPrivateKey(await await lf.getItem("encryption.privateKey")),
  );
  const proposalData = JSON.parse(
    await aes.decrypt(encryptedData, symatricKey),
  );

  return {
    proposalData,
    symatricKey,
  };
};

export {
  getPrivateKey,
  getPublicKey,
  encryptProposalData,
  decryptProposalData,
  generateKeypair,
};
