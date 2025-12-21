export default function SwapDocsPage() {
    return (
        <article>
            <h1>Token Swap</h1>
            <p>
                Trade XAND tokens directly from the dashboard using Jupiter Exchange,
                the leading DEX aggregator on Solana.
            </p>

            <h2>How It Works</h2>
            <ol>
                <li>Connect your Solana wallet (Phantom, Solflare, etc.)</li>
                <li>Select the token you want to swap from</li>
                <li>Enter the amount</li>
                <li>XAND is pre-selected as the output token</li>
                <li>Review the rate and click Swap</li>
                <li>Confirm the transaction in your wallet</li>
            </ol>

            <h2>XAND Token</h2>
            <table>
                <tbody>
                    <tr>
                        <td><strong>Name</strong></td>
                        <td>Xandeum</td>
                    </tr>
                    <tr>
                        <td><strong>Symbol</strong></td>
                        <td>XAND</td>
                    </tr>
                    <tr>
                        <td><strong>Network</strong></td>
                        <td>Solana Mainnet</td>
                    </tr>
                    <tr>
                        <td><strong>Token Address</strong></td>
                        <td><code>XANDuUoVoUqniKkpcKhrxmvYJybpJvUxJLr21Gaj3Hx</code></td>
                    </tr>
                </tbody>
            </table>

            <h2>Jupiter Integration</h2>
            <p>
                Jupiter aggregates liquidity from multiple DEXs to find you the best
                rate including:
            </p>
            <ul>
                <li>Raydium</li>
                <li>Orca</li>
                <li>Meteora</li>
                <li>And many more...</li>
            </ul>

            <h2>Fees</h2>
            <ul>
                <li><strong>Platform fee</strong>: 0% (we don't charge)</li>
                <li><strong>Jupiter fee</strong>: 0.5-1% (varies by route)</li>
                <li><strong>Solana network fee</strong>: ~0.00001 SOL</li>
            </ul>
        </article>
    );
}
