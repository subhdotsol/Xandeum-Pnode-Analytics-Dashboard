"use client";

import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { LiquidButton } from "@/components/ui/liquid-button";
import { Wallet } from "lucide-react";

export function CustomWalletButton() {
    const { setVisible } = useWalletModal();
    const { connected } = useWallet();

    if (connected) return null;

    return (
        <LiquidButton
            onClick={() => setVisible(true)}
            className="w-full py-3 px-4 rounded-xl text-white font-semibold"
        >
            <Wallet className="w-5 h-5" />
            Connect Wallet to Stake
        </LiquidButton>
    );
}
