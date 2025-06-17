"use client"
import React, { useState } from 'react'
import { Plus, Menu, X, Wallet } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useFlashFundStore from '@/lib/store';

const WalletConnectionModal = ({ isOpen, onClose }) => {
    const { connectWallet } = useFlashFundStore();

    if (!isOpen) return null;

    const handleConnect = (walletType) => {
        connectWallet(walletType);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        <X className="size-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => handleConnect('metamask')}
                        className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                        <div className="flex items-center">
                            <div className="w-10 h-10 mr-4 flex-shrink-0 relative">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 507.83 470.86">
                                    <defs>
                                        <style>
                                            {`.a{fill:#e2761b;stroke:#e2761b;}.a,.b,.c,.d,.e,.f,.g,.h,.i,.j{strokeLinecap:round;strokeLinejoin:round;}.b{fill:#e4761b;stroke:#e4761b;}.c{fill:#d7c1b3;stroke:#d7c1b3;}.d{fill:#233447;stroke:#233447;}.e{fill:#cd6116;stroke:#cd6116;}.f{fill:#e4751f;stroke:#e4751f;}.g{fill:#f6851b;stroke:#f6851b;}.h{fill:#c0ad9e;stroke:#c0ad9e;}.i{fill:#161616;stroke:#161616;}.j{fill:#763d16;stroke:#763d16;}`}
                                        </style>
                                    </defs>
                                    <title>metamask</title>
                                    <polygon className="a" points="482.09 0.5 284.32 147.38 320.9 60.72 482.09 0.5" />
                                    <polygon className="b" points="25.54 0.5 221.72 148.77 186.93 60.72 25.54 0.5" />
                                    <polygon className="b" points="410.93 340.97 358.26 421.67 470.96 452.67 503.36 342.76 410.93 340.97" />
                                    <polygon className="b" points="4.67 342.76 36.87 452.67 149.57 421.67 96.9 340.97 4.67 342.76" />
                                    <polygon className="b" points="143.21 204.62 111.8 252.13 223.7 257.1 219.73 136.85 143.21 204.62" />
                                    <polygon className="b" points="364.42 204.62 286.91 135.46 284.32 257.1 396.03 252.13 364.42 204.62" />
                                    <polygon className="b" points="149.57 421.67 216.75 388.87 158.71 343.55 149.57 421.67" />
                                    <polygon className="b" points="290.88 388.87 358.26 421.67 348.92 343.55 290.88 388.87" />
                                    <polygon className="c" points="358.26 421.67 290.88 388.87 296.25 432.8 295.65 451.28 358.26 421.67" />
                                    <polygon className="c" points="149.57 421.67 212.18 451.28 211.78 432.8 216.75 388.87 149.57 421.67" />
                                    <polygon className="d" points="213.17 314.54 157.12 298.04 196.67 279.95 213.17 314.54" />
                                    <polygon className="d" points="294.46 314.54 310.96 279.95 350.71 298.04 294.46 314.54" />
                                    <polygon className="e" points="149.57 421.67 159.11 340.97 96.9 342.76 149.57 421.67" />
                                    <polygon className="e" points="348.72 340.97 358.26 421.67 410.93 342.76 348.72 340.97" />
                                    <polygon className="e" points="396.03 252.13 284.32 257.1 294.66 314.54 311.16 279.95 350.91 298.04 396.03 252.13" />
                                    <polygon className="e" points="157.12 298.04 196.87 279.95 213.17 314.54 223.7 257.1 111.8 252.13 157.12 298.04" />
                                    <polygon className="f" points="111.8 252.13 158.71 343.55 157.12 298.04 111.8 252.13" />
                                    <polygon className="f" points="350.91 298.04 348.92 343.55 396.03 252.13 350.91 298.04" />
                                    <polygon className="f" points="223.7 257.1 213.17 314.54 226.29 382.31 229.27 293.07 223.7 257.1" />
                                    <polygon className="f" points="284.32 257.1 278.96 292.87 281.34 382.31 294.66 314.54 284.32 257.1" />
                                    <polygon className="g" points="294.66 314.54 281.34 382.31 290.88 388.87 348.92 343.55 350.91 298.04 294.66 314.54" />
                                    <polygon className="g" points="157.12 298.04 158.71 343.55 216.75 388.87 226.29 382.31 213.17 314.54 157.12 298.04" />
                                    <polygon className="h" points="295.65 451.28 296.25 432.8 291.28 428.42 216.35 428.42 211.78 432.8 212.18 451.28 149.57 421.67 171.43 439.55 215.75 470.36 291.88 470.36 336.4 439.55 358.26 421.67 295.65 451.28" />
                                    <polygon className="i" points="290.88 388.87 281.34 382.31 226.29 382.31 216.75 388.87 211.78 432.8 216.35 428.42 291.28 428.42 296.25 432.8 290.88 388.87" />
                                    <polygon className="j" points="490.44 156.92 507.33 75.83 482.09 0.5 290.88 142.41 364.42 204.62 468.37 235.03 491.43 208.2 481.49 201.05 497.39 186.54 485.07 177 500.97 164.87 490.44 156.92" />
                                    <polygon className="j" points="0.5 75.83 17.39 156.92 6.66 164.87 22.56 177 10.44 186.54 26.34 201.05 16.4 208.2 39.26 235.03 143.21 204.62 216.75 142.41 25.54 0.5 0.5 75.83" />
                                    <polygon className="g" points="468.37 235.03 364.42 204.62 396.03 252.13 348.92 343.55 410.93 342.76 503.36 342.76 468.37 235.03" />
                                    <polygon className="g" points="143.21 204.62 39.26 235.03 4.67 342.76 96.9 342.76 158.71 343.55 111.8 252.13 143.21 204.62" />
                                    <polygon className="g" points="284.32 257.1 290.88 142.41 321.1 60.72 186.93 60.72 216.75 142.41 223.7 257.1 226.09 293.27 226.29 382.31 281.34 382.31 281.74 293.27 284.32 257.1" />
                                </svg>
                            </div>
                            <span className="text-white font-medium">MetaMask</span>
                        </div>
                        <span className="text-sm text-gray-400">Popular</span>
                    </button>

                    <button
                        onClick={() => handleConnect('brave')}
                        className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                        <div className="flex items-center">
                            <div className="w-10 h-10 mr-4 flex-shrink-0 relative">
                                <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 436.49 511.97">
                                    <defs>
                                        <style>
                                            {`.cls-1{fill:url(#linear-gradient);}.cls-2{fill:#fff;}`}
                                        </style>
                                        <linearGradient id="linear-gradient" x1="-18.79" y1="359.73" x2="194.32" y2="359.73" gradientTransform="matrix(2.05, 0, 0, -2.05, 38.49, 992.77)" gradientUnits="userSpaceOnUse">
                                            <stop offset="0" stopColor="#f1562b" />
                                            <stop offset="0.3" stopColor="#f1542b" />
                                            <stop offset="0.41" stopColor="#f04d2a" />
                                            <stop offset="0.49" stopColor="#ef4229" />
                                            <stop offset="0.5" stopColor="#ef4029" />
                                            <stop offset="0.56" stopColor="#e83e28" />
                                            <stop offset="0.67" stopColor="#e13c26" />
                                            <stop offset="1" stopColor="#df3c26" />
                                        </linearGradient>
                                    </defs>
                                    <title>brave-browser</title>
                                    <path className="cls-1" d="M436.49,165.63,420.7,122.75l11-24.6A8.47,8.47,0,0,0,430,88.78L400.11,58.6a48.16,48.16,0,0,0-50.23-11.66l-8.19,2.89L296.09.43,218.25,0,140.4.61,94.85,50.41l-8.11-2.87A48.33,48.33,0,0,0,36.19,59.3L5.62,90.05a6.73,6.73,0,0,0-1.36,7.47l11.47,25.56L0,165.92,56.47,380.64a89.7,89.7,0,0,0,34.7,50.23l111.68,75.69a24.73,24.73,0,0,0,30.89,0l111.62-75.8A88.86,88.86,0,0,0,380,380.53l46.07-176.14Z" />
                                    <path className="cls-2" d="M231,317.33a65.61,65.61,0,0,0-9.11-3.3h-5.49a66.08,66.08,0,0,0-9.11,3.3l-13.81,5.74-15.6,7.18-25.4,13.24a4.84,4.84,0,0,0-.62,9l22.06,15.49q7,5,13.55,10.76l6.21,5.35,13,11.37,5.89,5.2a10.15,10.15,0,0,0,12.95,0l25.39-22.18,13.6-10.77,22.06-15.79a4.8,4.8,0,0,0-.68-8.93l-25.36-12.8L244.84,323ZM387.4,175.2l.8-2.3a61.26,61.26,0,0,0-.57-9.18,73.51,73.51,0,0,0-8.19-15.44l-14.35-21.06-10.22-13.88-19.23-24a69.65,69.65,0,0,0-5.7-6.67h-.4L321,84.25l-42.27,8.14a33.49,33.49,0,0,1-12.59-1.84l-23.21-7.5-16.61-4.59a70.52,70.52,0,0,0-14.67,0L195,83.1l-23.21,7.54a33.89,33.89,0,0,1-12.59,1.84l-42.22-8-8.54-1.58h-.4a65.79,65.79,0,0,0-5.7,6.67l-19.2,24Q77.81,120.32,73,127.45L58.61,148.51l-6.78,11.31a51,51,0,0,0-1.94,13.35l.8,2.3A34.51,34.51,0,0,0,52,179.81l11.33,13,50.23,53.39a14.31,14.31,0,0,1,2.55,14.34L107.68,280a25.23,25.23,0,0,0-.39,16l1.64,4.52a43.58,43.58,0,0,0,13.39,18.76l7.89,6.43a15,15,0,0,0,14.35,1.72L172.62,314A70.38,70.38,0,0,0,187,304.52l22.46-20.27a9,9,0,0,0,3-6.36,9.08,9.08,0,0,0-2.5-6.56L159.2,237.18a9.83,9.83,0,0,1-3.09-12.45l19.66-36.95a19.21,19.21,0,0,0,1-14.67A22.37,22.37,0,0,0,165.58,163L103.94,139.8c-4.44-1.6-4.2-3.6.51-3.88l36.2-3.59a55.9,55.9,0,0,1,16.9,1.5l31.5,8.8a9.64,9.64,0,0,1,6.74,10.76L183.42,221a34.72,34.72,0,0,0-.61,11.41c.5,1.61,4.73,3.6,9.36,4.73l19.19,4a46.38,46.38,0,0,0,16.86,0l17.26-4c4.64-1,8.82-3.23,9.35-4.85a34.94,34.94,0,0,0-.63-11.4l-12.45-67.59a9.66,9.66,0,0,1,6.74-10.76l31.5-8.83a55.87,55.87,0,0,1,16.9-1.5l36.2,3.37c4.74.44,5,2.2.54,3.88L272,162.79a22.08,22.08,0,0,0-11.16,10.12,19.3,19.3,0,0,0,1,14.67l19.69,36.95A9.84,9.84,0,0,1,278.45,237l-50.66,34.23a9,9,0,0,0,.32,12.78l.15.14,22.49,20.27a71.46,71.46,0,0,0,14.35,9.47l28.06,13.35a14.89,14.89,0,0,0,14.34-1.76l7.9-6.45a43.53,43.53,0,0,0,13.38-18.8l1.65-4.52a25.27,25.27,0,0,0-.39-16l-8.26-19.49a14.4,14.4,0,0,1,2.55-14.35l50.23-53.45,11.3-13a35.8,35.8,0,0,0,1.54-4.24Z" />
                                </svg>
                            </div>
                            <span className="text-white font-medium">Brave Wallet</span>
                        </div>
                        <span className="text-sm text-gray-400">Browser</span>
                    </button>

                    <button
                        onClick={() => handleConnect('walletconnect')}
                        className="w-full flex items-center justify-between p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                        <div className="flex items-center h-10">
                            <div className="h-8 w-10 scale-150 mr-4 flex-shrink-0 relative">
                                <svg version="1.0" id="katman_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                    viewBox="0 0 824 618" style={{ enableBackground: "new 0 0 824 618" }} xmlSpace="preserve">
                                    <style type="text/css">
                                        {`.st0{fillRule:evenodd;clipRule:evenodd;fill:url(#SVGID_1_);}
                                        .st1{fill:#FFFFFF;}`}
                                    </style>
                                    <g>
                                        <radialGradient id="SVGID_1_" cx="13.2793" cy="609.416" r="1" gradientTransform="matrix(512 0 0 -512 -6643 312330)" gradientUnits="userSpaceOnUse">
                                            <stop offset="0" style={{ stopColor: "#5D9DF6" }} />
                                            <stop offset="1" style={{ stopColor: "#006FFF" }} />
                                        </radialGradient>
                                        <path className="st0" d="M412,53c141.4,0,256,114.6,256,256S553.4,565,412,565S156,450.4,156,309S270.6,53,412,53z" />
                                        <path className="st1" d="M318.7,250.7c51.5-50.3,135.1-50.3,186.6,0l6.2,6.1c2.6,2.5,2.6,6.6,0,9.1l-21.2,20.7c-1.3,1.3-3.4,1.3-4.7,0
		l-8.5-8.3c-36-35.1-94.2-35.1-130.2,0l-9.1,8.9c-1.3,1.3-3.4,1.3-4.7,0l-21.2-20.7c-2.6-2.5-2.6-6.6,0-9.1L318.7,250.7z
		 M549.2,293.5l18.9,18.4c2.6,2.5,2.6,6.6,0,9.1l-85.1,83.1c-2.6,2.5-6.8,2.5-9.3,0c0,0,0,0,0,0l-60.4-59c-0.6-0.6-1.7-0.6-2.3,0
		c0,0,0,0,0,0l-60.4,59c-2.6,2.5-6.8,2.5-9.3,0c0,0,0,0,0,0L255.9,321c-2.6-2.5-2.6-6.6,0-9.1l18.9-18.4c2.6-2.5,6.8-2.5,9.3,0
		l60.4,59c0.6,0.6,1.7,0.6,2.3,0c0,0,0,0,0,0l60.4-59c2.6-2.5,6.8-2.5,9.3,0c0,0,0,0,0,0l60.4,59c0.6,0.6,1.7,0.6,2.3,0l60.4-59
		C542.4,291,546.6,291,549.2,293.5L549.2,293.5z"/>
                                    </g>
                                </svg>
                            </div>
                            <span className="text-white font-medium">WalletConnect</span>
                        </div>
                        <span className="text-sm text-gray-400">Mobile</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [walletModalOpen, setWalletModalOpen] = useState(false);
    const pathname = usePathname();

    const {
        account,
        disconnectWallet
    } = useFlashFundStore();

    const formatAddress = (address) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const handleWalletAction = () => {
        if (account) {
            disconnectWallet();
        } else {
            setWalletModalOpen(true);
        }
    };

    const isActive = (path) => {
        return pathname === path;
    };

    return (
        <>
            <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-gray-950/80 border-b border-white/60">
                <div className="px-10 section-container h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 hover:scale-110">
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">FlashFund</span>
                    </Link>

                    <div className='flex gap-10'>
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6 text-xl">
                            <Link
                                href="/"
                                className={`font-medium transition-colors duration-300 ${isActive('/')
                                    ? 'text-white font-semibold border-b-2 border-blue-400'
                                    : 'text-gray-300 hover:text-white'
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/campaigns"
                                className={`font-medium transition-colors duration-300 ${isActive('/campaigns')
                                    ? 'text-white font-semibold border-b-2 border-blue-400'
                                    : 'text-gray-300 hover:text-white'
                                    }`}
                            >
                                Explore
                            </Link>
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link href="/create">
                                <button
                                    className={`flex items-center px-4 py-2 rounded-lg ${isActive('/create')
                                        ? 'bg-gray-600 text-white'
                                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                                        } font-medium transition-all duration-300 group`}
                                >
                                    <Plus className="size-6 mr-2 transition-transform duration-300 group-hover:rotate-90" />
                                    Create Campaign
                                </button>
                            </Link>
                            <button
                                onClick={handleWalletAction}
                                className="flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium transition-all duration-300"
                            >
                                <Wallet className="size-6 mr-2" />
                                {account ? formatAddress(account) : 'Connect Wallet'}
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-lg bg-white duration-300"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="mx-10 md:hidden border-t border-white/10 bg-gray-950/95 backdrop-blur-xl">
                        <nav className="section-container py-6 space-y-4">
                            <Link
                                href="/"
                                className={`text-lg font-semibold block ${isActive('/')
                                    ? 'text-white border-l-4 border-blue-400 pl-3'
                                    : 'text-gray-300 hover:text-white'
                                    } transition-colors duration-300 py-2 font-medium`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/campaigns"
                                className={`text-lg font-semibold block ${isActive('/campaigns')
                                    ? 'text-white border-l-4 border-blue-400 pl-3'
                                    : 'text-gray-300 hover:text-white'
                                    } transition-colors duration-300 py-2 font-medium`}
                            >
                                Explore Campaigns
                            </Link>
                            <div className="pt-4 space-y-3">
                                <Link href="/create" className="block">
                                    <button
                                        className={`w-full flex items-center justify-center px-4 py-2 rounded-lg ${isActive('/create')
                                            ? 'bg-gray-600 text-white'
                                            : 'bg-gray-700 hover:bg-gray-600 text-white'
                                            } font-medium transition-all duration-300`}
                                    >
                                        <Plus className="size-6 mr-2" />
                                        Create Campaign
                                    </button>
                                </Link>
                                <button
                                    onClick={handleWalletAction}
                                    className="w-full flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-medium transition-all duration-300"
                                >
                                    <Wallet className="size-6 mr-2" />
                                    {account ? formatAddress(account) : 'Connect Wallet'}
                                </button>
                            </div>
                        </nav>
                    </div>
                )}
            </header>

            {/* Wallet Connection Modal */}
            <WalletConnectionModal
                isOpen={walletModalOpen}
                onClose={() => setWalletModalOpen(false)}
            />
        </>
    );
};

export default Header