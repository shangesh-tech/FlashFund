"use client"
import React, { useState } from 'react';
import { Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const CampaignCard = ({
    id,
    title,
    description,
    imageUrl,
    currentAmount,
    goalAmount,
    backers,
    daysLeft,
    category,
    creator,
    status
}) => {
    const progressPercentage = (currentAmount / goalAmount) * 100;

    const getStatusColor = () => {
        switch (status) {
            case 'funded': return 'bg-green-500';
            case 'expired': return 'bg-red-500';
            default: return 'bg-blue-500';
        }
    };

    const handleDonate = () => {
        // Handle donation logic here
        console.log(`Donating ${donationAmount} ETH to campaign ${id}`);
        setIsDonateOpen(false);
        setDonationAmount('');
    };

    const handleRefund = () => {
        // Handle refund logic here
        console.log(`Requesting refund for campaign ${id}`);
        setIsRefundOpen(false);
    };

    const handleDelete = () => {
        // Handle campaign deletion logic here
        console.log(`Deleting campaign ${id}`);
        setIsDeleteOpen(false);
    };

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
                        {category}
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
                    by <span className="text-gray-300">{creator}</span>
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
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                    <div>
                        <div className="text-white font-bold text-lg">
                            {currentAmount} ETH
                        </div>
                        <div className="text-gray-400 text-xs">raised</div>
                    </div>
                    <div>
                        <div className="text-white font-bold text-lg flex items-center justify-center">
                            <Users className="w-4 h-4 mr-1" />
                            {backers}
                        </div>
                        <div className="text-gray-400 text-xs">backers</div>
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
            </div>
        </div>
    );
};

const FeaturedCampaigns = () => {
    const featuredCampaigns = [
        {
            id: '1',
            title: 'Revolutionary VR Fitness Platform',
            description: 'Transform your workout experience with immersive virtual reality technology that makes fitness fun and engaging.',
            imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500&h=300&fit=crop',
            currentAmount: 125.5,
            goalAmount: 200,
            backers: 234,
            daysLeft: 23,
            category: 'Technology',
            creator: 'TechInnovators',
            status: 'expired'
        },
        {
            id: '2',
            title: 'Sustainable Ocean Cleanup Drone',
            description: 'Autonomous drones designed to collect ocean plastic waste using solar power and AI navigation systems.',
            imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop',
            currentAmount: 89.2,
            goalAmount: 150,
            backers: 156,
            daysLeft: 12,
            category: 'Environment',
            creator: 'OceanSavers',
            status: 'funded'
        },
        {
            id: '3',
            title: 'Community Art Center Restoration',
            description: 'Help restore our historic community art center to continue supporting local artists and cultural programs.',
            imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=300&fit=crop',
            currentAmount: 78.8,
            goalAmount: 100,
            backers: 98,
            daysLeft: 8,
            category: 'Arts',
            creator: 'CommunityArts',
            status: 'active'
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Grid pattern overlay for texture */}
            <div className="absolute inset-0 bg-repeat opacity-10 z-0"></div>

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                        Featured <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Campaigns</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Discover amazing projects from creators around the world and help bring innovative ideas to life.
                    </p>
                </motion.div>

                <motion.div
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.2
                            }
                        }
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {featuredCampaigns.map((campaign, index) => (
                        <motion.div
                            key={campaign.id}
                            variants={{
                                hidden: { y: 50, opacity: 0 },
                                visible: {
                                    y: 0,
                                    opacity: 1,
                                    transition: {
                                        duration: 0.5,
                                        ease: "easeOut"
                                    }
                                }
                            }}
                        >
                            <CampaignCard {...campaign} />
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <a href="/campaigns" className="inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300">
                        Explore All Campaigns
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedCampaigns;
