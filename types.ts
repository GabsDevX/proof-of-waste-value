
export enum AppSection {
  SUBMIT = 'Submit Batch',
  CLAIM = 'Claim Tokens',
  RETIRE = 'Retire Tokens',
}

export interface OracleReport {
  feVersion: string;
  anchorBlock: string;
  signature: string;
}

export interface SubmitBatchData {
  batchId: string;
  cidManifest: string;
  evidenceRoot: string;
  distributionRoot: string;
  netKg: string;
  alphaBps: string;
  attestationUids: string[];
  oracleReport: OracleReport;
}

export interface ClaimData {
  batchId: string;
  index: string;
  account: string;
  amount: string;
  merkleProof: string[];
}

export interface RetireData {
  amount: string;
  referencesCID: string;
}

export enum ToastType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  INFO = 'INFO',
}

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}
