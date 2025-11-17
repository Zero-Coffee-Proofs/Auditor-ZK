# Main Entities

### Issuer
An individual or organization that owns a real-world asset and wants to tokenize a portion of its reserves.

### Trader
Anyone who wants to purchase tokenized real-world assets.

### Proof
A verifiable zero-knowledge statement about the issuer’s reserves. The proof can originate from various systems, such as:

- a centralized bank account
- a blockchain address
- any acceptable Source of Truth (SoT)

### Source of Truth (SoT)
The authenticated system from which the issuer obtains the reserve data used to generate a proof.

### Payment Token (PT)
Any supported token on the Midnight blockchain used to pay for RWA-backed tokens during trading.

# Use Case: Issuer Tokenizes a Real-World Asset
1. The issuer opens the *Tokenize RWA* section in the dApp.
2. The issuer connects their Lace wallet to authenticate and interact with the protocol.
3. The issuer provides access to their private local state where the reserve data will be retrieved.
4. The issuer selects the specific RWA they want to tokenize and specifies the amount of the reserve to use as backing.
5. The issuer chooses the number of tokenized units they want to mint.
6. The issuer sets the initial price per tokenized unit.
7. The issuer provides the credentials required to query the SoT.
8. The dApp retrieves the reserve information and generates a verifiable Proof.
9. The smart contract validates:
   - the proof is valid
   - the reserve amount is sufficient
   - the tokenization parameters comply with protocol rules
10. If all checks pass, the corresponding amount of RWA-backed tokens is minted and sent to the issuer's wallet.

# Use Case: Trader Purchases a Specified Amount of Tokenized RWA
1. The trader opens the *Buy Tokens* section in the dApp.
2. The trader connects their Lace wallet.
3. The trader selects the specific RWA-backed token they want to purchase.
4. The trader specifies the amount they wish to buy.
5. The dApp displays the total PT required.
6. The trader confirms the transaction.
7. The smart contract validates that:
   - the trader has enough PT to cover the purchase
   - the token supply/liquidity is sufficient
   - the transaction meets all protocol requirements
8. If the checks pass:
   - the trader pays the required PT
   - the trader receives the corresponding amount of RWA-backed tokens
