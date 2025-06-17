"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Eye, Rocket, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useFlashFundStore from '@/lib/store';
import toast from 'react-hot-toast';

export default function Create() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [previewMode, setPreviewMode] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        goalAmount: '',
        duration: '',
        imageUrl: 'https://th.bing.com/th/id/OIP.BqW-AkFRjVg3DVhBNn5gfAHaEK?rs=1&pid=ImgDetMain',
        creatorName: '',
        creatorBio: '',
        walletAddress: '',
        agreeTerms: false
    });
    const [submitting, setSubmitting] = useState(false);

    const { account, createCampaign, loading, setIsModalOpen } = useFlashFundStore();

    useEffect(() => {
        if (!account) {
            toast.error('Please connect your wallet to create a campaign');
            router.push('/campaigns');
        } else {
            setFormData(prev => ({
                ...prev,
                walletAddress: account
            }));
        }
    }, [account, router]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const nextStep = () => {
        if (currentStep < 5) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.agreeTerms) {
            try {
                setSubmitting(true);

                const tx = await createCampaign(
                    formData.title,
                    formData.description,
                    formData.imageUrl,
                    formData.creatorName,
                    formData.goalAmount,
                    formData.duration
                );

                if (tx) {
                    toast.success('Campaign created successfully!');
                    setTimeout(() => {
                        router.push('/campaigns');
                    }, 2000);
                } else {
                    throw new Error("Failed to create campaign");
                }
            } catch (error) {
                console.error("Failed to create campaign:", error);
                toast.error('Failed to create campaign');
            } finally {
                setSubmitting(false);
            }
        } else {
            toast.error('Please agree to the terms and conditions');
        }
    };

    const steps = [
        { number: 1, title: 'Basic Information', description: 'Campaign title', icon: '📝' },
        { number: 2, title: 'Campaign Details', description: 'Description and image', icon: '🖼️' },
        { number: 3, title: 'Funding & Timeline', description: 'Goal amount and duration', icon: '💰' },
        { number: 4, title: 'Creator Profile', description: 'Your information', icon: '👤' },
        { number: 5, title: 'Review & Launch', description: 'Final review', icon: '🚀' }
    ];

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-8">
                        <div>
                            <label htmlFor="title" className="text-white text-lg font-semibold">Campaign Title *</label>
                            <input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter your campaign title"
                                required
                                className="w-full mt-3 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-8">
                        <div>
                            <label htmlFor="description" className="text-white text-lg font-semibold">Campaign Description *</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe your campaign in detail. What are you building? Why is it important?"
                                rows={8}
                                required
                                className="w-full mt-3 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="imageUrl" className="text-white text-lg font-semibold">Campaign Image URL *</label>
                            <div className="mt-3 space-y-3">
                                <input
                                    id="imageUrl"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    placeholder="https://example.com/your-image.jpg"
                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-md border border-gray-700">
                                    <p className="text-sm text-gray-400 mb-2">Image Preview:</p>
                                    {formData.imageUrl ? (
                                        <img
                                            src={formData.imageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <span className="text-gray-500">NO IMAGE FOUND</span>
                                    )}
                                </div>
                                <div className="p-4 rounded-lg bg-gray-800/50 backdrop-blur-md border border-gray-700">
                                    <div className="flex items-center space-x-3">
                                        <Upload className="w-5 h-5 text-blue-400" />
                                        <span className="text-gray-300 text-sm">Make sure image url take from trusted source only.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-8">
                        <div>
                            <label htmlFor="goalAmount" className="text-white text-lg font-semibold">Funding Goal (ETH) *</label>
                            <input
                                id="goalAmount"
                                name="goalAmount"
                                type="number"
                                step="0.01"
                                required
                                value={formData.goalAmount}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full mt-3 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label htmlFor="duration" className="text-white text-lg font-semibold">Campaign Duration (Days) *</label>
                            <select
                                id="duration"
                                name="duration"
                                required
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full mt-3 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select duration</option>
                                <option value="7">7 days</option>
                                <option value="14">14 days</option>
                                <option value="30">30 days</option>
                                <option value="60">60 days</option>
                                <option value="90">90 days</option>
                            </select>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-8">

                        <div>
                            <label htmlFor="walletAddress" className="text-white text-lg font-semibold">Wallet Address *</label>
                            <input
                                id="walletAddress"
                                name="walletAddress"
                                value={formData.walletAddress}
                                onChange={handleChange}
                                placeholder="0x..."
                                disabled={account}
                                className="w-full mt-3 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-70"
                            />
                            {account && <p className="text-blue-400 text-sm mt-2">Using your connected wallet address</p>}
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-8">
                        {/* Campaign Preview */}
                        <div className="border border-gray-700 rounded-xl overflow-hidden">
                            {/* Preview Header */}
                            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <Eye className="w-5 h-5 text-blue-400" />
                                    <h3 className="font-semibold text-white">Campaign Preview</h3>
                                </div>
                                <button
                                    onClick={() => setPreviewMode(!previewMode)}
                                    className="text-sm text-blue-400 hover:text-blue-300"
                                >
                                    {previewMode ? 'Show Details' : 'Show Preview'}
                                </button>
                            </div>

                            {/* Preview Content */}
                            {previewMode ? (
                                <div className="p-6">
                                    {/* Campaign Card Preview */}
                                    <div className="border border-gray-700 bg-gray-800/50 rounded-lg overflow-hidden">
                                        {/* Image */}
                                        <div className="h-48 bg-gray-700 flex items-center justify-center">
                                            <img
                                                src={formData.imageUrl}
                                                alt={formData.title}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/640x360?text=Image+Not+Found";
                                                }}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-white mb-2">
                                                {formData.title || 'Campaign Title'}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-4">
                                                {formData.description || 'Campaign description will appear here...'}
                                            </p>

                                            <div className="flex justify-between mb-4">
                                                <span className="text-gray-400">Goal:</span>
                                                <span className="text-white font-semibold">
                                                    {formData.goalAmount || '0'} ETH
                                                </span>
                                            </div>

                                            <div className="flex justify-between mb-4">
                                                <span className="text-gray-400">Duration:</span>
                                                <span className="text-white font-semibold">
                                                    {formData.duration || '0'} days
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 space-y-6">
                                    {/* Campaign Details Summary */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-3">Campaign Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-gray-400">Title</p>
                                                <p className="text-white">{formData.title || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Category</p>
                                                <p className="text-white">{formData.category || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Goal Amount</p>
                                                <p className="text-white">{formData.goalAmount || '0'} ETH</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Duration</p>
                                                <p className="text-white">{formData.duration || '0'} days</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Creator Details Summary */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-3">Creator Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-gray-400">Name</p>
                                                <p className="text-white">{formData.creatorName || 'Not provided'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400">Wallet Address</p>
                                                <p className="text-white font-mono text-sm">
                                                    {formData.walletAddress || 'Not provided'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description Summary */}
                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-3">Description</h4>
                                        <p className="text-white whitespace-pre-line">
                                            {formData.description || 'No description provided'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Terms & Conditions */}
                        <div className="p-6 border border-gray-700 rounded-xl bg-gray-800/50">
                            <h4 className="text-lg font-semibold text-white mb-3">Terms & Conditions</h4>
                            <p className="text-gray-400 mb-4">
                                By launching this campaign, you agree to our platform's terms and conditions.
                                You confirm that all information provided is accurate and that you have the
                                right to create this campaign.
                            </p>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="agreeTerms"
                                    className="w-4 h-4 accent-blue-500"
                                    checked={formData.agreeTerms}
                                    onChange={handleChange}
                                    name="agreeTerms"
                                />
                                <label htmlFor="agreeTerms" className="text-white">
                                    I agree to the terms and conditions
                                </label>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen bg-gray-950 text-white py-20">
            <div className="container mx-auto px-6">
                {/* Back Button */}
                <Link href="/campaigns" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Campaigns
                </Link>

                {/* Page Header */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Create Campaign</h1>
                    <p className="text-gray-400 text-lg">
                        Launch your project and start raising funds on the blockchain.
                    </p>
                </div>

                {!account ? (
                    <div className="border border-gray-700 rounded-xl p-8 text-center bg-gray-800/50 max-w-xl mx-auto">
                        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                        <p className="text-gray-400 mb-6">
                            You need to connect your wallet to create a campaign. This allows you to
                            receive funds and manage your campaign on the blockchain.
                        </p>
                        <div className="flex justify-center">
                            <button
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Connect Wallet
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Steps Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="border border-gray-700 rounded-xl p-6 bg-gray-800/50 sticky top-24">
                                <h3 className="text-lg font-semibold mb-6">Campaign Creation Steps</h3>
                                <div className="space-y-4">
                                    {steps.map((step) => (
                                        <div
                                            key={step.number}
                                            className={`flex items-start p-3 rounded-lg ${currentStep === step.number
                                                ? 'bg-blue-500/20 border border-blue-500/50'
                                                : currentStep > step.number
                                                    ? 'bg-green-500/10 border border-green-500/30'
                                                    : 'bg-gray-800/50 border border-gray-700'
                                                }`}
                                        >
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${currentStep === step.number
                                                    ? 'bg-blue-500 text-white'
                                                    : currentStep > step.number
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-700 text-gray-300'
                                                    }`}
                                            >
                                                {currentStep > step.number ? (
                                                    <CheckCircle className="w-5 h-5" />
                                                ) : (
                                                    <span>{step.number}</span>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-white">{step.title}</h4>
                                                <p className="text-sm text-gray-400">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="lg:col-span-3">
                            <div className="border border-gray-700 rounded-xl p-8 bg-gray-800/50">
                                <div>
                                    {renderStepContent()}

                                    {/* Navigation Buttons */}
                                    <div className="flex justify-between mt-10">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className={`px-6 py-3 border border-gray-600 text-gray-300 hover:bg-gray-700 font-medium rounded-lg transition-all duration-300 ${currentStep === 1 ? 'invisible' : ''
                                                }`}
                                        >
                                            Previous Step
                                        </button>

                                        {currentStep < 5 ? (
                                            <button
                                                type="button"
                                                onClick={nextStep}
                                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300"
                                            >
                                                Next Step
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={submitting || loading}
                                                onClick={handleSubmit}
                                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {(submitting || loading) ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                                        <span>Creating...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Rocket className="w-5 h-5" />
                                                        <span>Launch Campaign</span>
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}