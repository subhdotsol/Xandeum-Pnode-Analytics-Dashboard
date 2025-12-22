"use client";

import { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

interface StakingData {
    apy: number;
    exchangeRate: number;
    totalStaked: number;
    isLoading: boolean;
    error: string | null;
}

interface WalletBalance {
    sol: number;
    xandSol: number;
    isLoading: boolean;
}

export function useStakingData() {
    const { connection } = useConnection();
    const [data, setData] = useState<StakingData>({
        apy: 0,
        exchangeRate: 1,
        totalStaked: 0,
        isLoading: true,
        error: null,
    });

    useEffect(() => {
        let isMounted = true;

        async function fetchStakingData() {
            try {
                // Try to fetch from your backend API first
                const response = await fetch('/api/staking/pool-stats');
                
                if (response.ok) {
                    const apiData = await response.json();
                    
                    if (isMounted) {
                        setData({
                            apy: apiData.apy || 7.2,
                            exchangeRate: apiData.exchange_rate || 0.98,
                            totalStaked: apiData.total_staked || 0,
                            isLoading: false,
                            error: null,
                        });
                    }
                } else {
                    // Fallback to default values if API fails
                    if (isMounted) {
                        setData({
                            apy: 7.2,
                            exchangeRate: 0.98,
                            totalStaked: 0,
                            isLoading: false,
                            error: 'Using demo data - API unavailable',
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching staking data:', error);
                
                // Use fallback values
                if (isMounted) {
                    setData({
                        apy: 7.2,
                        exchangeRate: 0.98,
                        totalStaked: 0,
                        isLoading: false,
                        error: 'Using demo data',
                    });
                }
            }
        }

        fetchStakingData();

        // Refresh every 30 seconds
        const interval = setInterval(fetchStakingData, 30000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [connection]);

    return data;
}

export function useWalletBalance() {
    const { connection } = useConnection();
    const { publicKey, connected } = useWallet();
    const [balance, setBalance] = useState<WalletBalance>({
        sol: 0,
        xandSol: 0,
        isLoading: true,
    });

    useEffect(() => {
        let isMounted = true;

        async function fetchBalance() {
            if (!publicKey || !connected) {
                setBalance({ sol: 0, xandSol: 0, isLoading: false });
                return;
            }

            try {
                setBalance(prev => ({ ...prev, isLoading: true }));
                
                // Fetch SOL balance
                const solBalance = await connection.getBalance(publicKey);
                const solInTokens = solBalance / LAMPORTS_PER_SOL;

                // TODO: Fetch XANDsol balance when you have the mint address
                // const xandSolMint = new PublicKey("YOUR_XANDSOL_MINT_ADDRESS");
                // const xandSolBalance = await getTokenBalance(connection, publicKey, xandSolMint);

                if (isMounted) {
                    setBalance({
                        sol: solInTokens,
                        xandSol: 0, // Will be updated when we have the mint address
                        isLoading: false,
                    });
                }
            } catch (error) {
                console.error('Error fetching wallet balance:', error);
                if (isMounted) {
                    setBalance({ sol: 0, xandSol: 0, isLoading: false });
                }
            }
        }

        fetchBalance();

        // Refresh balance every 10 seconds
        const interval = setInterval(fetchBalance, 10000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [connection, publicKey, connected]);

    return balance;
}
