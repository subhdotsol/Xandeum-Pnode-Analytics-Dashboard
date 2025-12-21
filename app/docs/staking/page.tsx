export default function StakingDocsPage() {
    return (
        <article>
            <h1>Stake SOL</h1>
            <p>
                Stake your SOL to receive XANDsol, a liquid staking token that earns
                staking rewards while remaining liquid for DeFi.
            </p>

            <h2>What is Liquid Staking?</h2>
            <p>
                Traditional staking locks your SOL for the duration of the epoch.
                Liquid staking gives you a receipt token (XANDsol) that:
            </p>
            <ul>
                <li>Earns staking rewards automatically</li>
                <li>Can be traded, used as collateral, or sold</li>
                <li>Remains liquid - no unbonding period</li>
            </ul>

            <h2>How It Works</h2>
            <ol>
                <li>Connect your Solana wallet</li>
                <li>Enter the amount of SOL to stake</li>
                <li>Click "Stake SOL"</li>
                <li>Receive XANDsol tokens (1:~0.98 ratio)</li>
                <li>Hold or use XANDsol in DeFi</li>
            </ol>

            <h2>Rewards</h2>
            <table>
                <tbody>
                    <tr>
                        <td><strong>Current APY</strong></td>
                        <td>~7.2%</td>
                    </tr>
                    <tr>
                        <td><strong>Rewards frequency</strong></td>
                        <td>Every epoch (~2 days)</td>
                    </tr>
                    <tr>
                        <td><strong>Compound?</strong></td>
                        <td>Yes, auto-compounded</td>
                    </tr>
                </tbody>
            </table>

            <h2>Unstaking</h2>
            <p>
                To unstake, simply swap your XANDsol back to SOL. The exchange rate
                will reflect any earned rewards.
            </p>

            <h2>Risks</h2>
            <ul>
                <li><strong>Smart contract risk</strong>: As with all DeFi protocols</li>
                <li><strong>Slashing risk</strong>: Minimal on Solana</li>
                <li><strong>Price risk</strong>: XANDsol may trade at slight discount</li>
            </ul>
        </article>
    );
}
