"use client"
import React from 'react';

import { ArrowRight, Zap, Shield, Users, Sparkles, Wallet } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';
import useFlashFundStore from '@/lib/store';

const HeroSection = () => {
    const { account, connectWallet } = useFlashFundStore();

    const handleConnectWallet = () => {
        if (!account) {
            connectWallet('metamask');
        }
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
            {/* Background gradient with enhanced depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900 z-0"></div>

            {/* Animated background elements with improved animation */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Grid pattern overlay for texture */}
            <div className="absolute inset-0 bg-repeat opacity-10 z-0"></div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-5xl mx-auto"
                >
                    {/* Main heading with enhanced gradient */}
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-7xl font-bold mb-6"
                    >
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent inline-block">FlashFund</span>
                        <br />
                        <span className="text-white">The Future of</span>
                        <br />
                        <span className="text-white">Crowdfunding</span>
                    </motion.h1>

                    {/* Subtitle with motion */}
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
                    >
                        Transparent, decentralized crowdfunding powered by blockchain technology.
                        Fund projects you believe in with complete transparency and security.
                    </motion.p>

                    {/* Feature highlights with improved icons */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-8 mb-12"
                    >
                        <div className="flex items-center space-x-2 text-gray-300 backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full">
                            <Shield className="w-5 h-5 text-blue-400" />
                            <span>100% Transparent</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300 backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full">
                            <Zap className="w-5 h-5 text-purple-400" />
                            <span>Lightning Fast</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300 backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full">
                            <Users className="w-5 h-5 text-green-400" />
                            <span>Community Driven</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300 backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                            <span>Innovative Projects</span>
                        </div>
                    </motion.div>

                    {/* CTA buttons with enhanced styling */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col  sm:flex-row gap-4 items-center justify-center"
                    >
                        <Link href="/campaigns" className="group">
                            <button className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300">
                                Explore Campaigns
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>
                        {account ? (
                            <Link href="/create" className="group">
                                <button className="flex items-center justify-center border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white text-lg px-6 py-6 rounded-xl shadow-lg transition-all duration-300">
                                    Start Your Campaign
                                    <Sparkles className="w-5 h-5 ml-2 opacity-70 group-hover:opacity-100" />
                                </button>
                            </Link>
                        ) : (
                            <button
                                onClick={handleConnectWallet}
                                className="flex items-center justify-center border-2 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white text-lg px-8 py-6 rounded-xl shadow-lg transition-all duration-300 "
                            >
                                Connect Wallet
                                <Wallet className="w-5 h-5 ml-2 opacity-70 group-hover:opacity-100" />
                            </button>
                        )}
                    </motion.div>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="flex flex-col items-center justify-center"
                    >
                        <p className="text-gray-300 text-xl mt-10">Build & Innovate By <a href="https://www.linkedin.com/in/shangesh-s" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500 transition-colors">Shangesh</a></p>
                    </motion.div>

                    {/* Stats with enhanced glass effect */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10"
                    >
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/20 transition-all duration-300">
                            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">1,247</div>
                            <div className="text-gray-400">Campaigns Funded</div>
                        </div>
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl hover:shadow-purple-500/10 hover:border-purple-500/20 transition-all duration-300">
                            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">₿ 2,847</div>
                            <div className="text-gray-400">Total Raised</div>
                        </div>
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl hover:shadow-pink-500/10 hover:border-pink-500/20 transition-all duration-300">
                            <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-amber-400 bg-clip-text text-transparent mb-2">89%</div>
                            <div className="text-gray-400">Success Rate</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HeroSection;
