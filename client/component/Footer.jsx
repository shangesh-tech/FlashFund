"use client"
import React from 'react';
import Link from 'next/link';
import { Twitter, Github, Linkedin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-white/10 bg-gray-950/80 backdrop-blur-xl">
            <div className="container mx-auto px-10 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <div className="mb-4">
                            <Link href="/">
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">FlashFund</span>
                            </Link>
                        </div>
                        <p className="text-gray-400 max-w-md">
                            Transparent, decentralized crowdfunding powered by blockchain.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/campaigns" className="text-gray-400 hover:text-white transition-colors">
                                    Browse Campaigns
                                </Link>
                            </li>
                            <li>
                                <Link href="/create" className="text-gray-400 hover:text-white transition-colors">
                                    Create Campaign
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
                        <div className="flex space-x-4">
                            <a
                                href="https://x.com/shangesh_s"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                                aria-label="Twitter"
                            >
                                <Twitter size={18} />
                            </a>
                            <a
                                href="https://github.com/shangesh-tech"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                                aria-label="Github"
                            >
                                <Github size={18} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/shangesh-s/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                                aria-label="Linkedin"
                            >
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} FlashFund. All rights reserved.
                    </p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <span className="text-gray-400 text-sm">
                            Built on Ethereum
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
