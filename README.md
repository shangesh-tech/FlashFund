# FlashFund - Decentralized Crowdfunding Platform

FlashFund is a modern, decentralized crowdfunding platform built on Ethereum that enables transparent, secure, and efficient fundraising campaigns. The platform combines the power of blockchain technology with a sleek, user-friendly interface to revolutionize how projects get funded.

## 🚀 Features

### Core Functionality
- **Campaign Creation**: Create detailed crowdfunding campaigns with customizable goals, descriptions, and timelines
- **Secure Donations**: Make donations using cryptocurrency with full transparency and security
- **Smart Refunds**: Automatic refund system for failed or cancelled campaigns
- **Fund Management**: Campaign creators can claim funds once goals are met
- **Real-time Tracking**: Live progress tracking for all campaigns
- **Campaign Cancellation**: Creators can cancel campaigns with automatic refund processing

### Security Features
- **Reentrancy Protection**: Built-in protection against reentrancy attacks
- **Access Control**: Role-based permissions for different user types
- **Emergency Pause**: Contract can be paused in emergency situations
- **Minimum Donation Limits**: Prevents spam donations
- **Platform Fee Management**: Transparent fee structure with owner controls

### User Experience
- **Wallet Integration**: Support for MetaMask and WalletConnect
- **Responsive Design**: Modern, mobile-friendly interface
- **Real-time Notifications**: Toast notifications for all transactions
- **Campaign Discovery**: Browse and search through active campaigns
- **Progress Visualization**: Visual progress bars and statistics

## 🛠 Tech Stack

### Blockchain & Smart Contracts
- **Solidity ^0.8.28**: Smart contract development
- **Hardhat**: Development framework and testing environment
- **OpenZeppelin**: Security-focused contract libraries
  - ReentrancyGuard: Reentrancy attack prevention
  - Ownable: Access control management
  - Pausable: Emergency pause functionality
- **Ethers.js**: Ethereum library for blockchain interactions

### Frontend
- **Next.js 15.3.3**: React framework with App Router
- **React 19**: Latest React version with modern features
- **Tailwind CSS 4**: Utility-first CSS framework
- **Framer Motion**: Animation and motion library
- **Zustand**: Lightweight state management
- **React Hot Toast**: Toast notification system
- **Lucide React**: Modern icon library

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Hardhat Toolbox**: Comprehensive Hardhat plugin suite
- **Dotenv**: Environment variable management

### Blockchain Networks
- **Ethereum Sepolia Testnet**: Testing and development
- **Local Hardhat Network**: Local development environment
- **Alchemy**: RPC provider for Ethereum interactions
- **Etherscan**: Contract verification and exploration

## 📖 Usage Guide

### For Campaign Creators

1. **Connect Wallet**: Click "Connect Wallet" and select MetaMask or WalletConnect
2. **Create Campaign**: 
   - Navigate to the "Create Campaign" page
   - Fill in campaign details (title, description, goal amount, duration)
   - Upload campaign image
   - Submit transaction to create campaign
3. **Manage Campaign**:
   - Monitor donations and progress
   - Claim funds when goal is reached after deadline
   - Cancel campaign if needed (before deadline)

### For Donors

1. **Connect Wallet**: Connect your crypto wallet
2. **Browse Campaigns**: Explore active campaigns on the campaigns page
3. **Make Donations**:
   - Select a campaign you want to support
   - Enter donation amount (minimum 0.001 ETH)
   - Confirm transaction
4. **Track Contributions**: View your donation history and campaign progress
5. **Claim Refunds**: Get refunds for failed or cancelled campaigns

### For Platform Administrators

1. **Fee Management**: Update platform fee percentage (max 10%)
2. **Emergency Controls**: Pause/unpause contract in emergencies
3. **Fee Withdrawal**: Withdraw accumulated platform fees

## 📁 Project Structure

```
flashfund/
├── contracts/                 # Smart contracts
│   └── FlashFund.sol         # Main crowdfunding contract
├── scripts/                  # Deployment and interaction scripts
│   ├── deploy.js            # Contract deployment script
│   └── interact.js          # Contract interaction examples
├── test/                    # Smart contract tests
├── client/                  # Next.js frontend application
│   ├── app/                 # App router pages
│   │   ├── campaigns/       # Campaign listing page
│   │   ├── create/          # Campaign creation page
│   │   └── page.js          # Home page
│   ├── component/           # React components
│   │   ├── Home/           # Home page components
│   │   ├── Header.jsx      # Navigation header
│   │   ├── Footer.jsx      # Site footer
│   │   └── TransactionModal.jsx # Transaction modal
│   └── lib/                # Utilities and state management
│       └── store.js        # Zustand store with Web3 integration
├── ignition/               # Hardhat Ignition deployment
├── hardhat.config.js       # Hardhat configuration
└── package.json           # Project dependencies
```

## 🔒 Security Features

- **Reentrancy Protection**: All state-changing functions protected against reentrancy attacks
- **Access Control**: Owner-only functions for administrative tasks
- **Input Validation**: Comprehensive validation for all user inputs
- **Emergency Pause**: Contract can be paused to prevent operations during emergencies
- **Minimum Donation**: Prevents spam with minimum donation requirements
- **Creator Restrictions**: Campaign creators cannot donate to their own campaigns
- **Deadline Enforcement**: Strict deadline checks for all time-sensitive operations

## 💰 Platform Economics

- **Platform Fee**: 2.5% (250 basis points) on successful campaigns
- **Minimum Donation**: 0.001 ETH
- **Campaign Duration**: 1-365 days
- **Fee Cap**: Maximum 10% platform fee (owner adjustable)

## 🌐 Supported Networks

- **Ethereum Sepolia Testnet** (Chain ID: 11155111)
- **Local Hardhat Network** (Chain ID: 31337)
- **Ethereum Mainnet** (configurable)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shangesh S**

