"use client"
import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, Trash2, RefreshCw } from 'lucide-react';
import useFlashFundStore from '@/lib/store';
import TransactionModal from '@/component/TransactionModal';
import { toast } from 'react-hot-toast';

const CampaignCard = ({
    id,
    title,
    description,
    imageUrl,
    currentAmount,
    goalAmount,
    daysLeft,
    creator,
    status,
    openModal,
    checkRefundEligibility,
    account,
    FundClaim
}) => {
    const progressPercentage = (currentAmount / goalAmount) * 100;

    const getStatusColor = () => {
        switch (status) {
            case 'active': return 'bg-green-500';
            case 'expired': return 'bg-red-500';
            case 'funded': return 'bg-green-500';
            case 'inProgress': return 'bg-blue-500';
            case 'cancelled': return 'bg-orange-500';
            default: return 'bg-blue-500';
        }
    };

    const [refund, setRefund] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [donationAmount, setDonationAmount] = useState('0');

    useEffect(() => {
        const checkRefund = async () => {
            try {
                setIsChecking(true);
                const response = await checkRefundEligibility(id);

                setRefund(response.eligible);
                setDonationAmount(response.amount);
            } catch (error) {
                console.error("Error checking refund eligibility:", error);
                setRefund(false);
            } finally {
                setIsChecking(false);
            }
        };

        if (checkRefundEligibility && account && account !== creator) {
            checkRefund();
        } else {
            setIsChecking(false);
            setRefund(false);
        }
    }, [checkRefundEligibility, id, account, creator]);

    const handleClaimFunds = async () => {
        try {
            const tx = await FundClaim(id);
            if (tx) {
                toast.success('Funds claimed successfully');
            } else {
                throw new Error("Transaction failed");
            }
        } catch (error) {
            console.error("Claim funds failed:", error);
            toast.error('Failed to claim funds');
        }
    }

    return (
        <div className="group overflow-hidden border border-gray-700 bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl rounded-xl">
            {/* Image */}
            <div className="relative overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                    <span className={`${getStatusColor()} text-white px-3 py-1 rounded-full text-xs font-semibold`}>
                        {status.toUpperCase()}
                    </span>
                </div>
                <div className="absolute top-4 right-4">
                    <span className="bg-black/50 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        general
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {description}
                </p>

                {/* Creator */}
                <p className="text-gray-500 text-xs mb-4">
                    by <span className="text-gray-300">{`${creator.slice(0, 6)}...${creator.slice(-4)}`}</span>
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white font-semibold">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center mb-6">
                    <div>
                        <div className="text-white font-bold text-lg">
                            {currentAmount} ETH
                        </div>
                        <div className="text-gray-400 text-xs">raised</div>
                    </div>
                    <div>
                        <div className="text-white font-bold text-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {daysLeft}
                        </div>
                        <div className="text-gray-400 text-xs">days left</div>
                    </div>
                </div>

                {/* Goal */}
                <div className="mb-6 pt-4 border-t border-gray-700">
                    <div className="text-center">
                        <span className="text-gray-400 text-sm">Goal: </span>
                        <span className="text-white font-semibold">{goalAmount} ETH</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    {/* Donate Button */}
                    <button
                        onClick={() => openModal('donate', { id, title, currentAmount, goalAmount })}
                        disabled={account === creator || status !== 'active'}
                        className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Donate to Campaign
                    </button>

                    {/* Refund Button */}
                    <button
                        onClick={() => openModal('refund', { id, title })}
                        className="w-full py-3 px-4 border border-orange-500 text-orange-400 hover:bg-orange-500/10 font-medium rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isChecking || !refund}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
                        {isChecking ? 'Checking...' : `Refund ${donationAmount} ETH`}
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={() => openModal('delete', { id, title })}
                        className="w-full py-3 px-4 border border-red-500 text-red-400 hover:bg-red-500/10 font-medium rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={account !== creator || status !== 'active'}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Campaign
                    </button>
                    {/* Claim Funds Button */}
                    {account === creator && (
                        <button
                            onClick={handleClaimFunds}
                            className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg shadow-green-500/20 hover:shadow-green-500/40"
                        >
                            Claim Funds
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function Campaigns() {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [processedCampaigns, setProcessedCampaigns] = useState([]);

    const [activeModal, setActiveModal] = useState(null);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [donationAmount, setDonationAmount] = useState('');
    const [transactionStatus, setTransactionStatus] = useState(null);
    const [transactionHash, setTransactionHash] = useState(null);
    const [transactionModalOpen, setTransactionModalOpen] = useState(false);

    const {
        campaigns,
        account,
        donate,
        claimRefund,
        cancelCampaign,
        formatEther,
        loading,
        checkRefundEligibility,
        FundClaim
    } = useFlashFundStore();


    useEffect(() => {
        if (!campaigns || campaigns.length === 0) return;


        const processed = campaigns.map((campaign, index) => {
            // Calculate days left
            const deadline = Number(campaign.deadline);
            const now = Math.floor(Date.now() / 1000);
            const secondsLeft = Math.max(0, deadline - now);
            const daysLeft = Math.floor(secondsLeft / 86400);

            // Determine status
            let status = 'active';
            if (!campaign.isActive) {
                status = campaign.isCancelled ? 'cancelled' : 'expired';
            } else if (Number(campaign.raisedAmount) >= Number(campaign.goalAmount)) {
                status = 'funded';
            }

            return {
                id: campaign.id,
                title: campaign.title,
                description: campaign.description,
                imageUrl: campaign.image,
                currentAmount: parseFloat(formatEther(campaign.raisedAmount)),
                goalAmount: parseFloat(formatEther(campaign.goalAmount)),
                daysLeft,
                creator: campaign.creator,
                status,
                rawData: campaign
            };
        });

        setProcessedCampaigns(processed);
    }, [campaigns, formatEther]);

    // Filter 
    const filteredCampaigns = processedCampaigns.filter(campaign => {
        const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Sort campaigns
    const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return BigInt(b.id) > BigInt(a.id) ? -1 : 1;
            case 'most-funded':
                return Number(b.currentAmount) - Number(a.currentAmount);
            case 'cancelled':
                return (a.status !== 'cancelled') - (b.status !== 'cancelled');
            default:
                return 0;
        }
    });


    // Modal action handlers
    const handleDonate = async () => {
        if (!donationAmount || isNaN(donationAmount) || parseFloat(donationAmount) <= 0) {
            toast.error('Please enter a valid donation amount');
            return;
        }

        setTransactionModalOpen(true);
        setTransactionStatus('processing');

        try {
            const tx = await donate(selectedCampaign.id, donationAmount);

            if (tx) {
                setTransactionHash(tx.hash);
                setTransactionStatus('success');
            } else {
                throw new Error("Transaction failed");
            }
        } catch (error) {
            console.error("Donation failed:", error);
            setTransactionModalOpen(false);

        }

        setActiveModal(null);
        setDonationAmount('');
    };

    const handleRefund = async () => {
        setTransactionModalOpen(true);
        setTransactionStatus('processing');

        try {
            const tx = await claimRefund(selectedCampaign.id);

            if (tx) {
                setTransactionHash(tx.hash);
                setTransactionStatus('success');
            } else {
                throw new Error("Transaction failed");
            }
        } catch (error) {
            console.error("Refund failed:", error);
            setTransactionModalOpen(false);

        }

        setActiveModal(null);
    };

    const handleDelete = async () => {
        setTransactionModalOpen(true);
        setTransactionStatus('processing');

        try {
            const tx = await cancelCampaign(selectedCampaign.id);

            if (tx) {
                setTransactionHash(tx.hash);
                setTransactionStatus('success');
            } else {
                throw new Error("Transaction failed");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            setTransactionModalOpen(false);

        }

        setActiveModal(null);
    };

    const openModal = (type, campaign) => {
        setSelectedCampaign(campaign);
        setActiveModal(type);
    };

    return (
        <main className="min-h-screen bg-gray-950 text-white py-20">
            {/* Page Header */}
            <div className="container mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Campaigns</h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-3xl">
                    Discover innovative projects from creators around the world and help bring their ideas to life.
                </p>
            </div>

            {/* Filters Section */}
            <div className="container mx-auto px-6 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search campaigns..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Sort By */}
                    <div className="relative">
                        <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        >
                            <option value="newest">Newest</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="most-funded">Most Funded</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Campaigns Grid */}
            <div className="container mx-auto px-6 mt-12">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : !account ? (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
                        <p className="text-gray-400 mb-6">Please connect your wallet to view campaigns</p>
                    </div>
                ) : sortedCampaigns.length === 0 ? (
                    <div className="text-center py-20">
                        <h3 className="text-2xl font-bold mb-4">No Campaigns Found</h3>
                        <p className="text-gray-400 mb-6">Try adjusting your filters or search terms</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sortedCampaigns.map((campaign) => (
                            <CampaignCard
                                key={campaign.id}
                                {...campaign}
                                id={campaign.id}
                                openModal={openModal}
                                checkRefundEligibility={checkRefundEligibility}
                                account={account}
                                FundClaim={FundClaim}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Donation Modal */}
            {activeModal === 'donate' && selectedCampaign && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-4">Donate to Campaign</h3>
                        <p className="text-gray-300 mb-6">{selectedCampaign.title}</p>

                        <div className="mb-6">
                            <label htmlFor="donationAmount" className="block text-gray-300 mb-2">Amount (ETH)</label>
                            <input
                                id="donationAmount"
                                type="number"
                                step="0.001"
                                min="0.001"
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="0.001"
                            />
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={handleDonate}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300"
                            >
                                Donate
                            </button>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 hover:bg-gray-800 font-medium rounded-lg transition-all duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Refund Modal */}
            {activeModal === 'refund' && selectedCampaign && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-4">Request Refund</h3>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to request a refund for your donation to "{selectedCampaign.title}"?
                        </p>

                        <div className="flex space-x-4">
                            <button
                                onClick={handleRefund}
                                className="flex-1 py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-all duration-300"
                            >
                                Confirm Refund
                            </button>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 hover:bg-gray-800 font-medium rounded-lg transition-all duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {activeModal === 'delete' && selectedCampaign && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md border border-gray-700">
                        <h3 className="text-xl font-bold text-white mb-4">Delete Campaign</h3>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete the campaign "{selectedCampaign.title}"? This action cannot be undone.
                        </p>

                        <div className="flex space-x-4">
                            <button
                                onClick={handleDelete}
                                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all duration-300"
                            >
                                Delete Campaign
                            </button>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 hover:bg-gray-800 font-medium rounded-lg transition-all duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction Modal */}
            {transactionModalOpen && (
                <TransactionModal
                    isOpen={transactionModalOpen}
                    status={transactionStatus}
                    txn_hash={transactionHash}
                    onClose={() => {
                        setTransactionModalOpen(false);
                    }}
                />
            )}
        </main>
    );
}