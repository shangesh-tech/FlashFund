"use client"
import React from 'react';
import { Wallet, Search, Heart, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
    const steps = [
        {
            icon: Wallet,
            title: 'Connect Wallet',
            description: 'Connect your crypto wallet to get started with secure, decentralized funding.',
            step: '01',
            color: 'from-blue-500 to-indigo-600'
        },
        {
            icon: Search,
            title: 'Discover Projects',
            description: 'Browse innovative campaigns and find projects that inspire you.',
            step: '02',
            color: 'from-indigo-500 to-purple-600'
        },
        {
            icon: Heart,
            title: 'Fund & Support',
            description: 'Back projects you believe in with transparent, blockchain-secured transactions.',
            step: '03',
            color: 'from-purple-500 to-pink-600'
        },
        {
            icon: Zap,
            title: 'Track Progress',
            description: 'Watch your supported projects come to life with real-time updates and milestones.',
            step: '04',
            color: 'from-pink-500 to-rose-600'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                        How <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">FlashFund</span> Works
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Four simple steps to revolutionize how you fund and support innovative projects.
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="relative"
                >
                    {/* Timeline connector */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-y-1/2 z-0 opacity-50"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
                        {steps.map((step, index) => {
                            const IconComponent = step.icon;
                            return (
                                <motion.div
                                    key={index}
                                    variants={itemVariants}
                                    className="relative"
                                >
                                    <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full hover:shadow-[0_0_25px_rgba(79,70,229,0.15)] transition-all duration-500 hover:border-indigo-500/30 group">
                                        {/* Step number */}
                                        <div className={`absolute -top-5 right-5 w-10 h-10 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20`}>
                                            {step.step}
                                        </div>

                                        {/* Icon */}
                                        <div className="mb-8 relative">
                                            <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                                                <IconComponent className="w-10 h-10 text-white" />
                                            </div>
                                            <div className={`absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-r ${step.color} rounded-full opacity-20 blur-lg group-hover:opacity-40 transition-opacity duration-500`}></div>
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-300 leading-relaxed text-lg">
                                            {step.description}
                                        </p>

                                        {/* Hover indicator */}
                                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-blue-500 transition-all duration-300"></div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
