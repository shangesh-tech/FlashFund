"use client"

import { create } from 'zustand';
import { ethers } from 'ethers';
import EthereumProvider from '@walletconnect/ethereum-provider';
import toast from 'react-hot-toast';

const CONTRACT_ADDRESS = '0xee6Eb96855b4581e0B6c40B8c5F6B26Eacb9C142';
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "EnforcedPause",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ExpectedPause",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            }
        ],
        "name": "CampaignCancelled",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            }
        ],
        "name": "CampaignCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "donor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "DonationReceived",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "FundsClaimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "campaignId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "donor",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "RefundProcessed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "inputs": [],
        "name": "MAXIMUM_DURATION_DAYS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MAX_FEE_PERCENT",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MINIMUM_DONATION_ETHER",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MINIMUM_DURATION_DAYS",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "accumulatedFees",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "campaigns",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "creator",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "image",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "author",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "goalAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "raisedAmount",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "fundsClaimed",
                "type": "bool"
            },
            {
                "internalType": "bool",
                "name": "isCancelled",
                "type": "bool"
            },
            {
                "internalType": "uint256",
                "name": "createdAt",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            }
        ],
        "name": "cancelCampaign",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            }
        ],
        "name": "claimFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            }
        ],
        "name": "claimRefund",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_image",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_author",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_goalAmountEther",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_durationDays",
                "type": "uint256"
            }
        ],
        "name": "createCampaign",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            }
        ],
        "name": "donate",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "donations",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllCampaigns",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "image",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "author",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "goalAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "raisedAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "fundsClaimed",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isCancelled",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct FlashFund.CampaignStruct[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            }
        ],
        "name": "getCampaign",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "creator",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "image",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "author",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "goalAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "raisedAmount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "fundsClaimed",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "isCancelled",
                        "type": "bool"
                    },
                    {
                        "internalType": "uint256",
                        "name": "createdAt",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct FlashFund.CampaignStruct",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getContractBalance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_campaignId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_donor",
                "type": "address"
            }
        ],
        "name": "getDonation",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "pause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "paused",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "platformFeePercent",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalCampaigns",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "unpause",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_newFeePercent",
                "type": "uint256"
            }
        ],
        "name": "updateFeePercent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawFees",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
]

// WalletConnect configuration
const WC_PROJECT_ID = '9601996399f7776c59d80c3202e65abf';
const SUPPORTED_CHAIN_IDS = [1, 11155111];

const useFlashFundStore = create((set, get) => ({
    // Contract states
    contract: null,
    campaigns: [],
    totalCampaigns: 0,
    platformFeePercent: 0,
    accumulatedFees: 0,
    contractBalance: 0,
    contractOwner: null,
    isPaused: false,

    // Wallet states
    provider: null,
    signer: null,
    account: null,
    chainId: null,
    wcProvider: null,
    loading: false,

    // Basic state setters
    setLoading: (loading) => set({ loading }),

    executeContractCall: async (operationType, operation, ...args) => {
        try {
            set({ loading: true });
            const tx = await operation(...args);
            await tx.wait();
            await get().loadContractData();
            set({ loading: false });
            return tx;
        } catch (error) {
            console.error(`${operationType} operation failed:`, error);
            toast.error(`Failed to ${operationType} because ${(error.code).toLowerCase()}`);
            set({ loading: false });
            return null;
        }
    },

    connectWallet: async (walletType) => {
        try {
            let rawProvider = null;
            let ethersProvider = null;

            switch (walletType) {
                case 'metamask':
                    if (window.ethereum && window.ethereum.isMetaMask) {
                        rawProvider = window.ethereum;
                        await rawProvider.request({ method: 'eth_requestAccounts' });
                        toast.success('Connected to MetaMask successfully!');
                    } else {
                        window.open('https://metamask.io/download/', '_blank');
                        toast.error('Please install MetaMask');
                        return;
                    }
                    break;

                case 'brave':
                    try {
                        if (window.navigator && window.navigator.brave) {
                            const isBraveBrowser = await window.navigator.brave.isBrave();
                            if (isBraveBrowser) {
                                if (window.ethereum && window.ethereum.isBraveWallet) {
                                    rawProvider = window.ethereum;
                                    await rawProvider.request({ method: 'eth_requestAccounts' });
                                    toast.success('Connected to Brave Wallet successfully!');
                                } else {
                                    toast.error('Enable Brave Wallet in your browser settings');

                                    setTimeout(() => {
                                        window.open('brave://settings/wallet', '_blank');
                                    }, 1000);
                                    return;
                                }
                            } else {
                                toast.error('Use Brave Browser with Brave Wallet enabled');

                                setTimeout(() => {
                                    window.open('https://brave.com/download/', '_blank');
                                }, 1000);
                                return;
                            }
                        } else {
                            toast.error('Use Brave Browser with Brave Wallet enabled');

                            setTimeout(() => {
                                window.open('https://brave.com/download/', '_blank');
                            }, 1000);
                            return;
                        }
                    } catch (error) {
                        console.error('Brave Wallet connection error:', error);
                        return;
                    }
                    break;

                case 'walletconnect':
                    try {
                        if (!get().wcProvider) {
                            rawProvider = await EthereumProvider.init({
                                projectId: WC_PROJECT_ID,
                                chains: SUPPORTED_CHAIN_IDS,
                                showQrModal: true,
                                metadata: {
                                    name: 'FlashFund',
                                    description: 'Decentralized Crowdfunding Platform',
                                    url: window.location.origin
                                }
                            });
                            set({ wcProvider: rawProvider });
                        } else {
                            rawProvider = get().wcProvider;
                        }
                        await rawProvider.connect();
                        toast.success('Connected via WalletConnect');
                    } catch (error) {
                        console.error('WalletConnect initialization failed:', error);
                        toast.error('Failed to Connect , Try Again...');
                        return;
                    }
                    break;

                default:
                    toast.error('Unsupported wallet type');
                    return;
            }

            ethersProvider = new ethers.BrowserProvider(rawProvider);

            const setupEventListeners = () => {
                const handleAccountsChanged = async (accounts) => {
                    // No accounts: disconnected from external wallet
                    if (!accounts || accounts.length === 0) {
                        set({
                            account: null,
                            signer: null,
                            contract: null,
                            campaigns: [],
                            totalCampaigns: 0,
                            platformFeePercent: 0,
                            accumulatedFees: 0,
                            contractBalance: 0,
                        });
                        toast.error('Disconnected: you disconnected from your wallet');
                    } else {
                        try {
                            const newSigner = await ethersProvider.getSigner();
                            const newAddress = await newSigner.getAddress();
                            const newContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, newSigner);
                            set({
                                signer: newSigner,
                                account: newAddress,
                                contract: newContract
                            });
                            toast.success(`Account changed: ${newAddress}`);
                            await get().loadContractData();
                        } catch (err) {
                            toast.error('Error updating after account change');
                        }
                    }
                };

                const handleChainChanged = async (chainIdHex) => {
                    try {
                        const numericChainId = Number(chainIdHex);
                        set({ chainId: numericChainId });
                        toast.success(`Network changed to chainId ${numericChainId}`);

                        const newSigner = await ethersProvider.getSigner();
                        const newAddress = await newSigner.getAddress();
                        const newContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, newSigner);
                        set({
                            signer: newSigner,
                            account: newAddress,
                            contract: newContract
                        });

                        // Check if supported network
                        if (!SUPPORTED_CHAIN_IDS.includes(numericChainId)) {
                            toast.error(`Unsupported network (chainId ${numericChainId}). Please switch to a supported network.`);
                        } else {
                            await get().loadContractData();
                        }
                    } catch (err) {
                        toast.error('Error updating after network change');
                    }
                };

                const handleDisconnect = () => {
                    set({
                        account: null,
                        signer: null,
                        contract: null,
                        provider: null,
                        campaigns: [],
                        totalCampaigns: 0,
                        platformFeePercent: 0,
                        accumulatedFees: 0,
                        contractBalance: 0,
                    });
                    toast.error('Wallet disconnected successfully');
                };

                rawProvider.on('accountsChanged', handleAccountsChanged);
                rawProvider.on('chainChanged', handleChainChanged);
                rawProvider.on('disconnect', handleDisconnect);

                rawProvider._flashFundEventHandlers = {
                    handleAccountsChanged,
                    handleChainChanged,
                    handleDisconnect
                };
            };

            setupEventListeners();

            const signer = await ethersProvider.getSigner();
            const address = await signer.getAddress();
            const network = await ethersProvider.getNetwork();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            set({
                provider: ethersProvider,
                signer,
                account: address,
                chainId: Number(network.chainId),
                contract,
                loading: false
            });

            await get().loadContractData();
            set({ isModalOpen: false });

            return { signer, address, network };
        } catch (error) {
            console.error('Wallet connection failed:', error);
            toast.error(error.message || 'Failed to connect wallet');
        }
    },

    disconnectWallet: async () => {
        try {
            const { wcProvider } = get();

            if (window.ethereum && window.ethereum._flashFundEventHandlers) {
                const { handleAccountsChanged, handleChainChanged, handleDisconnect } = window.ethereum._flashFundEventHandlers;
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
                window.ethereum.removeListener('chainChanged', handleChainChanged);
                window.ethereum.removeListener('disconnect', handleDisconnect);
                delete window.ethereum._flashFundEventHandlers;
            }

            if (wcProvider) {
                if (wcProvider._flashFundEventHandlers) {
                    const { handleAccountsChanged, handleChainChanged, handleDisconnect } = wcProvider._flashFundEventHandlers;
                    wcProvider.removeListener('accountsChanged', handleAccountsChanged);
                    wcProvider.removeListener('chainChanged', handleChainChanged);
                    wcProvider.removeListener('disconnect', handleDisconnect);
                    delete wcProvider._flashFundEventHandlers;
                }
                try {
                    await wcProvider.disconnect();
                } catch (err) {
                    console.warn('Error disconnecting WalletConnect provider:', err);
                }
            }

            set({
                account: null,
                chainId: null,
                provider: null,
                signer: null,
                contract: null,
                campaigns: [],
                totalCampaigns: 0,
                platformFeePercent: 0,
                accumulatedFees: 0,
                contractBalance: 0,
                wcProvider: null,
                loading: false
            });

            toast.success('Wallet disconnected');
        } catch (error) {
            console.error('Disconnect failed:', error);
            toast.error(error.message || 'Failed to disconnect wallet');
        }
    },

    loadContractData: async () => {
        try {
            const { contract } = get();
            if (!contract) return;

            set({ loading: true });

            const [campaigns, totalCampaigns, platformFeePercent, accumulatedFees, contractBalance, isPaused, owner] = await Promise.all([
                contract.getAllCampaigns(),
                contract.totalCampaigns(),
                contract.platformFeePercent(),
                contract.accumulatedFees(),
                contract.getContractBalance(),
                contract.paused(),
                contract.owner()
            ]);

            set({
                campaigns,
                totalCampaigns,
                platformFeePercent: Number(platformFeePercent),
                accumulatedFees: ethers.formatEther(accumulatedFees),
                contractBalance: ethers.formatEther(contractBalance),
                isPaused,
                contractOwner: owner,
                loading: false
            });
        } catch (error) {
            console.error('Failed to load contract data:', error);
            toast.error('Failed to load campaigns');
            set({ loading: false });
        }
    },

    // Create campaign
    createCampaign: async (title, description, image, author, goalAmountEther, durationDays) => {
        const { contract } = get();
        if (!contract) {
            toast.error('Wallet not connected, please connect your wallet');
            return null;
        }

        return get().executeContractCall(
            'create campaign',
            async () => contract.createCampaign(title, description, image, author, goalAmountEther, durationDays),
            title, description, image, author, goalAmountEther, durationDays
        );
    },

    // Donate to campaign
    donate: async (campaignId, amountEther) => {
        const { contract } = get();
        if (!contract) {
            toast.error('Wallet not connected, please connect your wallet');
            return null;
        }

        return get().executeContractCall(
            'donate',
            async () => contract.donate(campaignId, {
                value: ethers.parseEther(amountEther.toString())
            }),
            campaignId, amountEther
        );
    },

    // Claim funds
    claimFunds: async (campaignId) => {
        const { contract } = get();
        if (!contract) {
            toast.error('Wallet not connected, please connect your wallet');
            return null;
        }

        return get().executeContractCall(
            'claim',
            async () => contract.claimFunds(campaignId),
            campaignId
        );
    },

    // Cancel campaign
    cancelCampaign: async (campaignId) => {
        const { contract } = get();
        if (!contract) {
            toast.error('Wallet not connected, please connect your wallet');
            return null;
        }

        return get().executeContractCall(
            'cancel',
            async () => contract.cancelCampaign(campaignId),
            campaignId
        );
    },

    // Claim refund
    claimRefund: async (campaignId) => {
        const { contract } = get();
        if (!contract) {
            toast.error('Wallet not connected, please connect your wallet');
            return null;
        }

        return get().executeContractCall(
            'refund',
            async () => contract.claimRefund(campaignId),
            campaignId
        );
    },

    // Get donation amount for a donor
    getDonation: async (campaignId) => {
        try {
            const { contract, account } = get();
            if (!contract || !account) {
                toast.error('Wallet not connected');
                return '0';
            }
            const donation = await contract.getDonation(campaignId, account);
            return ethers.formatEther(donation);
        } catch (error) {
            console.error('Failed to get donation amount:', error);
            toast.error('Failed to get donation amount');
            return '0';
        }
    },

    // Check if a campaign is eligible for refund
    checkRefundEligibility: async (campaignId) => {
        try {
            const { contract, account } = get();
            if (!contract || !account) {
                return { eligible: false, amount: '0' };
            }
            const donationAmount = await contract.getDonation(campaignId, account);

            if (donationAmount <= 0) {
                return { eligible: false, amount: '0' };
            }

            return {
                eligible: true,
                amount: ethers.formatEther(donationAmount),
            };
        } catch (error) {
            console.error('Failed to check refund eligibility:', error);
            return { eligible: false, amount: '0' };
        }
    },

    FundClaim: async (campaignId) => {
        try {
            const { contract, account } = get();
            if (!contract || !account) {
                toast.error('Wallet not connected');
                return null;
            }

            return get().executeContractCall(
                'claim funds',
                async () => contract.claimFunds(campaignId),
                campaignId
            );

        } catch (error) {
            console.error('Failed to claim funds:', error);
            toast.error('Failed to claim funds');
            return null;
        }
    },

    // Withdraw fees (owner only)
    withdrawFees: async () => {
        const { contract } = get();
        if (!contract) {
            toast.error('Wallet not connected, please connect your wallet');
            return null;
        }

        return get().executeContractCall(
            'withdraw',
            async () => contract.withdrawFees()
        );
    },

    // Update fee percent (owner only)
    updateFeePercent: async (newFeePercent) => {
        const { contract } = get();
        if (!contract) {
            toast.error('Wallet not connected, please connect your wallet');
            return null;
        }

        return get().executeContractCall(
            'updateFee',
            async () => contract.updateFeePercent(newFeePercent),
            newFeePercent
        );
    },

    // Pause contract (owner only)
    pauseContract: async () => {
        const { contract } = get();
        if (!contract) {
            toast.error('Wallet not connected, please connect your wallet');
            return null;
        }

        return get().executeContractCall(
            'pause contract',
            async () => contract.pause()
        );
    },

    // Unpause contract (owner only)
    unpauseContract: async () => {
        const { contract } = get();
        if (!contract) {
            toast.error('Wallet not connected, please connect your wallet');
            return null;
        }

        return get().executeContractCall(
            'unpause contract',
            async () => contract.unpause()
        );
    },

    formatEther: (wei) => ethers.formatEther(wei),
    parseEther: (ether) => ethers.parseEther(ether.toString())
}));
export default useFlashFundStore;