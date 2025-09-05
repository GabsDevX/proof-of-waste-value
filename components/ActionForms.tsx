
import React, { useState } from 'react';
import type { SubmitBatchData, ClaimData, RetireData } from '../types';
import { AppSection, ToastType } from '../types';
import { submitBatch, claimTokens, retireTokens } from '../services/powvService';

// Reusable UI Components (defined outside parent components)

interface CardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, description, children }) => (
  <div className="bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-4xl mx-auto animate-fade-in">
    <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
    <p className="text-gray-400 mb-8">{description}</p>
    {children}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <input
      id={id}
      className="block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green sm:text-sm"
      {...props}
    />
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    id: string;
    helperText: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, id, helperText, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
            {label}
        </label>
        <textarea
            id={id}
            rows={3}
            className="block w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green sm:text-sm"
            {...props}
        />
        <p className="mt-2 text-xs text-gray-500">{helperText}</p>
    </div>
);


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, isLoading = false, ...props }) => (
  <button
    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-green hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    disabled={isLoading}
    {...props}
  >
    {isLoading ? (
      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ) : null}
    {children}
  </button>
);

// Form Components

interface FormProps {
    addToast: (type: ToastType, message: string) => void;
}

export const SubmitBatchForm: React.FC<FormProps> = ({ addToast }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<SubmitBatchData>({
        batchId: '', cidManifest: '', evidenceRoot: '', distributionRoot: '', netKg: '', alphaBps: '', attestationUids: [],
        oracleReport: { feVersion: '', anchorBlock: '', signature: '' }
    });
    const [attestationUidsStr, setAttestationUidsStr] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('oracleReport.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({ ...prev, oracleReport: { ...prev.oracleReport, [field]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const finalData = { ...formData, attestationUids: attestationUidsStr.split(',').map(s => s.trim()).filter(Boolean) };
            const txHash = await submitBatch(finalData);
            addToast(ToastType.SUCCESS, `Batch submitted! Tx: ${txHash.substring(0, 10)}...`);
        } catch (error) {
            addToast(ToastType.ERROR, error instanceof Error ? error.message : 'An unknown error occurred.');
        }
        setIsLoading(false);
    };

    return (
        <Card title={AppSection.SUBMIT} description="Register a new batch of e-waste to start the tokenization process.">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input id="batchId" name="batchId" label="Batch ID" placeholder="0x..." required value={formData.batchId} onChange={handleChange} />
                    <Input id="cidManifest" name="cidManifest" label="Manifest CID" placeholder="bafy..." required value={formData.cidManifest} onChange={handleChange} />
                    <Input id="evidenceRoot" name="evidenceRoot" label="Evidence Merkle Root" placeholder="0x..." required value={formData.evidenceRoot} onChange={handleChange} />
                    <Input id="distributionRoot" name="distributionRoot" label="Distribution Merkle Root" placeholder="0x..." required value={formData.distributionRoot} onChange={handleChange} />
                    <Input id="netKg" name="netKg" label="Net Kg (processed weight)" type="number" placeholder="1234.56" required value={formData.netKg} onChange={handleChange} />
                    <Input id="alphaBps" name="alphaBps" label="Alpha Bps (yield factor, e.g., 9700 for 97%)" type="number" placeholder="9700" required value={formData.alphaBps} onChange={handleChange} />
                </div>
                <TextArea id="attestationUids" name="attestationUids" label="Attestation UIDs" helperText="Enter comma-separated UIDs." placeholder="0x..., 0x..." required value={attestationUidsStr} onChange={e => setAttestationUidsStr(e.target.value)} />
                <fieldset className="border border-gray-700 p-4 rounded-lg">
                    <legend className="text-lg font-medium text-white px-2">Oracle Report</legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <Input id="oracleReport.feVersion" name="oracleReport.feVersion" label="FE Version" placeholder="0x..." required value={formData.oracleReport.feVersion} onChange={handleChange} />
                        <Input id="oracleReport.anchorBlock" name="oracleReport.anchorBlock" label="Anchor Block" type="number" placeholder="12345678" required value={formData.oracleReport.anchorBlock} onChange={handleChange} />
                    </div>
                    <div className="mt-6">
                        <Input id="oracleReport.signature" name="oracleReport.signature" label="Oracle Signature" placeholder="0x..." required value={formData.oracleReport.signature} onChange={handleChange} />
                    </div>
                </fieldset>
                <Button type="submit" isLoading={isLoading}>Submit Batch</Button>
            </form>
        </Card>
    );
};

export const ClaimTokenForm: React.FC<FormProps> = ({ addToast }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ClaimData>({ batchId: '', index: '', account: '', amount: '', merkleProof: [] });
    const [merkleProofStr, setMerkleProofStr] = useState('');

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const finalData = { ...formData, merkleProof: merkleProofStr.split(',').map(s => s.trim()).filter(Boolean) };
            const txHash = await claimTokens(finalData);
            addToast(ToastType.SUCCESS, `Tokens claimed! Tx: ${txHash.substring(0, 10)}...`);
        } catch (error) {
            addToast(ToastType.ERROR, error instanceof Error ? error.message : 'An unknown error occurred.');
        }
        setIsLoading(false);
    };

    return (
        <Card title={AppSection.CLAIM} description="Claim your PoWV tokens for a specific batch using your Merkle proof.">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input id="batchId" name="batchId" label="Batch ID" placeholder="0x..." required value={formData.batchId} onChange={handleChange} />
                <Input id="index" name="index" label="Leaf Index" type="number" placeholder="0" required value={formData.index} onChange={handleChange} />
                <Input id="account" name="account" label="Recipient Account" placeholder="0x..." required value={formData.account} onChange={handleChange} />
                <Input id="amount" name="amount" label="Amount to Claim (in Kg)" type="number" placeholder="12.45" required value={formData.amount} onChange={handleChange} />
                <TextArea id="merkleProof" name="merkleProof" label="Merkle Proof" helperText="Enter comma-separated proof hashes." placeholder="0x..., 0x..." required value={merkleProofStr} onChange={(e) => setMerkleProofStr(e.target.value)} />
                <Button type="submit" isLoading={isLoading}>Claim Tokens</Button>
            </form>
        </Card>
    );
};

export const RetireTokenForm: React.FC<FormProps> = ({ addToast }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<RetireData>({ amount: '', referencesCID: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const txHash = await retireTokens(formData);
            addToast(ToastType.SUCCESS, `Tokens retired! Tx: ${txHash.substring(0, 10)}...`);
        } catch (error) {
            addToast(ToastType.ERROR, error instanceof Error ? error.message : 'An unknown error occurred.');
        }
        setIsLoading(false);
    };

    return (
        <Card title={AppSection.RETIRE} description="Retire (burn) PoWV tokens and link them to an ESG report or reference.">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input id="amount" name="amount" label="Amount to Retire (in Kg)" type="number" placeholder="1000" required value={formData.amount} onChange={handleChange} />
                <Input id="referencesCID" name="referencesCID" label="Reference CID (for report/audit)" placeholder="bafy..." required value={formData.referencesCID} onChange={handleChange} />
                <Button type="submit" isLoading={isLoading}>Retire Tokens</Button>
            </form>
        </Card>
    );
};
