"use client";

import { FC, ReactNode, useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    CoinbaseWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Default styles for wallet modal
import "@solana/wallet-adapter-react-ui/styles.css";

export const SolanaWalletProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // Use mainnet-beta for production, devnet for development
    const network = WalletAdapterNetwork.Mainnet;

    // You can also provide a custom RPC endpoint
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // Configure supported wallets
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new CoinbaseWalletAdapter(),
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};
