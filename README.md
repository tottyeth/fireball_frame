# Fireball by [totty.eth](https://warpcast.com/totty.eth)
Exclusive art mint by [totty.eth](https://warpcast.com/totty.eth) for Farcaster early(ish) adopters during the Frambrian explosion.

Made possible by heavily reusing [On-Chain-Cow-Farcaster-Frame](https://github.com/WillPapper/On-Chain-Cow-Farcaster-Frame) by [@will/@WillPapper](https://warpcast.com/will)

**Note that this code is hacked together and there will quickly be better open-source examples of minting frames.**

## Build instructions

- Follow instructions in comment on top of `fireball-mint.ts`.
  - Set up a Syndicate account along with a Neynar account. If you're hacking right as I'm posting this (1/30/2024) you can get a discount on Neynar API keys [here](https://warpcast.com/rish/0xc00fa676).
- Compile your contract first and verify it on Etherscan. 
  - Foundry build stuff is located in the `contracts` subfolder but I didn't have experience with this and just used [Remix](https://remix.ethereum.org/) instead LOL
  - Feel free to use the Fireball contract itself for testing but *would prefer you don't upload a copy with the same art and name to Base or ETH mainnet.* If you plan on using it for a more serious project I would swap it out with a better standard from an ETH mainnet project or something, this contract was meant as a proof of concept hack.
    - On-chain Cows which this project is forked from has a [simpler contract you can clone](https://github.com/WillPapper/On-Chain-Cow-Farcaster-Frame/blob/main/contracts/src/OnChainCow.sol).
- Connect your contract to a project on Syndicate and fund the minting wallet.
  - Syndicate is used to organize all minting from the frame through a single wallet that mints for users. You need to fund this with ETH to allow for absolutely free minting.
- Use Vercel for hosting.
  - I set the install script to `yarn install`
  - Set up your environment variables for the Syndicate and Neynar API keys correctly following instructions on top of `fireball-mint.ts`. WILL NOT WORK WITHOUT THIS!
- When sharing the frame, do so by sharing the `api/fireball-mint` path, i.e. `mytestappwoohoo.vercel.app/api/fireball-mint`.

Good luck!
