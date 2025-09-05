
import type { SubmitBatchData, ClaimData, RetireData } from '../types';

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const submitBatch = async (data: SubmitBatchData): Promise<string> => {
  console.log('Submitting batch with data:', data);
  await delay(1500);
  if (Math.random() > 0.1) { // 90% success rate
    const fakeTxHash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    console.log('Batch submitted successfully. Transaction hash:', fakeTxHash);
    return fakeTxHash;
  } else {
    throw new Error('Failed to submit batch to the smart contract.');
  }
};

export const claimTokens = async (data: ClaimData): Promise<string> => {
    console.log('Claiming tokens with data:', data);
    await delay(1500);
    if (Math.random() > 0.1) {
        const fakeTxHash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        console.log('Tokens claimed successfully. Transaction hash:', fakeTxHash);
        return fakeTxHash;
    } else {
        throw new Error('Failed to claim tokens.');
    }
};

export const retireTokens = async (data: RetireData): Promise<string> => {
    console.log('Retiring tokens with data:', data);
    await delay(1500);
    if (Math.random() > 0.1) {
        const fakeTxHash = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        console.log('Tokens retired successfully. Transaction hash:', fakeTxHash);
        return fakeTxHash;
    } else {
        throw new Error('Failed to retire tokens.');
    }
};
