"use client"
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import useFlashFundStore from '@/lib/store';

const TransactionModal = ({ isOpen, status, txn_hash, onClose }) => {
    if (!isOpen) return null;

    const { chainId } = useFlashFundStore();

    const getEtherscanUrl = () => {
        if (!txn_hash) return '';

        switch (chainId) {
            case 1:
                return `https://etherscan.io/tx/${txn_hash}`;
            case 11155111:
                return `https://sepolia.etherscan.io/tx/${txn_hash}`;
            default:
                return `https://sepolia.etherscan.io/tx/${txn_hash}`;
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200/20 max-w-md w-full mx-4 relative"
                >

                    <div className="flex flex-col items-center space-y-4">


                        {status === 'processing' && (
                            <>
                                <div className="relative w-20 h-20">
                                    <motion.div
                                        animate={{
                                            rotate: 360,
                                            scale: [1, 1.05, 1],
                                        }}
                                        transition={{
                                            rotate: {
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "linear",
                                            },
                                            scale: {
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }
                                        }}
                                        className="absolute inset-0 border-4 border-purple-500/20 rounded-full"
                                    />
                                    <motion.div
                                        animate={{
                                            rotate: -360,
                                            borderColor: ["#8b5cf6", "#a855f7", "#d946ef", "#8b5cf6"],
                                        }}
                                        transition={{
                                            rotate: {
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: "linear",
                                            },
                                            borderColor: {
                                                duration: 3,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }
                                        }}
                                        className="absolute inset-2 border-4 border-t-4 border-purple-500 rounded-full"
                                    />
                                    <motion.div
                                        animate={{
                                            opacity: [0.5, 1, 0.5],
                                        }}
                                        transition={{
                                            duration: 1.2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="absolute inset-4 border-2 border-purple-400/70 rounded-full"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-white ">
                                    Processing Transaction
                                </h3>
                                <p className="text-gray-400 text-center">
                                    Please wait while we process your transaction. This may take a few moments.
                                </p>
                            </>
                        )}

                        {status === 'success' && (
                            <div>
                                {/* Close button */}
                                < button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", bounce: 0.5 }}
                                >
                                    <div className="relative w-20 h-20">
                                        <div className="absolute inset-0 bg-green-500/20 rounded-full" />
                                        <motion.div
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 0.5, delay: 0.2 }}
                                            className="absolute inset-0 flex items-center justify-center"
                                        >
                                            <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <motion.path
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ duration: 0.5, delay: 0.2 }}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </motion.div>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mt-4">
                                        Transaction Successful!
                                    </h3>
                                    {txn_hash && (
                                        <a className='text-blue-500 hover:text-blue-600 text-xl text-center my-5 block' href={getEtherscanUrl()} target="_blank" rel="noopener noreferrer">
                                            View on Etherscan
                                        </a>
                                    )}

                                    <p className="text-gray-400 text-center ">
                                        You have successfully completed the transaction 😊
                                    </p>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence >
    );
};

export default TransactionModal; 