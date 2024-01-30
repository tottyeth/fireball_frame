// TODO:
// - replace '<replace-with-your-app>' with your Vercel app in code chunks below
// - replace arguments in call to 'syndicate.transact.sendTransaction' below
// - set following arguments in Vercel deployment (won't work without them):
// - SYNDICATE_API_KEY: The API key for your Syndicate project. If you're on the
// demo plan, DM @Will on Farcaster/@WillPapper on Twitter to get upgraded.
// - NEYNAR_API_KEY: The API key for your Neynar project. Without this,
// addresses won't be able to be extracted from FIDs for minting
import { VercelRequest, VercelResponse } from "@vercel/node";
import { SyndicateClient } from "@syndicateio/syndicate-node";

const nullAddress = "0x0000000000000000000000000000000000000000";

const syndicate = new SyndicateClient({
  token: () => {
    const apiKey = process.env.SYNDICATE_API_KEY;
    if (typeof apiKey === "undefined") {
      // If you receive this error, you need to define the SYNDICATE_API_KEY in
      // your Vercel environment variables. You can find the API key in your
      // Syndicate project settings under the "API Keys" tab.
      throw new Error(
        "SYNDICATE_API_KEY is not defined in environment variables."
      );
    }
    return apiKey;
  },
});

export default async function (req: VercelRequest, res: VercelResponse) {
  // Farcaster Frames will send a POST request to this endpoint when the user
  // clicks the button. If we receive a POST request, we can assume that we're
  // responding to a Farcaster Frame button click.

  if (req.method == "POST") {
    try {
      // A full version of this would have auth, but we're not dealing with any
      // sensitive data or funds here. If you'd like, you could validate the
      // Farcaster signature here
      const fid = req.body.untrustedData.fid;
      const addressFromFid = await getAddrByFid(fid);
      console.log(
        "Extracting address from FID ", fid, " passed to Syndicate: ",
        addressFromFid
      );

      // Enforce that the user has to recast the cast containing this frame   
      // first before allowing them to mint.
      const hasFidRecasted = await hasRecasted(fid);
      if (!hasFidRecasted) {
        res.status(200).setHeader("Content-Type", "text/html").send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width" />
              <meta property="og:title" content="Mint _fireball_" />
              <meta
                property="og:image"
                content="https://<replace-with-your-app>.vercel.app/img/art-gif-long.gif"
              />
              <meta property="fc:frame" content="vNext" />
              <meta
                property="fc:frame:image"
                content="https://<replace-with-your-app>.vercel.app/img/art-gif-long.gif"
              />
              <meta property="fc:frame:button:1" content="Need to recast first! Try again" />
              <meta
                name="fc:frame:post_url"
                content="https://<replace-with-your-app>.vercel.app/api/fireball-mint"
              />
            </head>
          </html>
          `);
        return;
      }

      // Don't hit the API if we can't resolve their address.
      if (addressFromFid != nullAddress) {
        // Mint the NFT. We're not passing in any arguments, since the
        // amount will always be 1
        const mintTx = await syndicate.transact.sendTransaction({
          projectId: "<your project id from Syndicate>",
          contractAddress: "<your contract address>",
          chainId: 84532, // Base Sepolia ChainId, change to your network
          functionSignature: "mint(address to)",
          args: {
            // Mint to user's connected address.
            to: addressFromFid,
          },
        });
        console.log("Syndicate Transaction ID: ", mintTx.transactionId);
        
        res.status(200).setHeader("Content-Type", "text/html").send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <meta name="viewport" content="width=device-width" />
              <meta property="og:title" content="Mint _fireball_" />
              <meta
                property="og:image"
                content="https://<replace-with-your-app>.vercel.app/img/art-gif-long.gif"
              />
              <meta property="fc:frame" content="vNext" />
              <meta
                property="fc:frame:image"
                content="https://<replace-with-your-app>.vercel.app/img/art-gif-long.gif"
              />
              <meta property="fc:frame:button:1" content="Mint queued! Will appear in your wallet soon..." />
              <meta
                name="fc:frame:post_url"
                content="https://<replace-with-your-app>.vercel.app/api/fireball-mint"
              />
            </head>
          </html>
          `);
      } else {
        res.status(200).setHeader("Content-Type", "text/html").send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width" />
            <meta property="og:title" content="Mint _fireball_" />
            <meta
              property="og:image"
              content="https://<replace-with-your-app>.vercel.app/img/art-still-long.png"
            />
            <meta property="fc:frame" content="vNext" />
            <meta
              property="fc:frame:image"
              content="https://<replace-with-your-app>.vercel.app/img/art-still-long.png"
            />
            <meta property="fc:frame:button:1" content="Error minting... click to try again" />
            <meta
              name="fc:frame:post_url"
              content="https://<replace-with-your-app>.vercel.app/api/fireball-mint"
            />
          </head>
        </html>
        `);
      }
    } catch (error) {
      console.log("error happened ");
      console.log(error);
      res.status(500).send(`Error: ${error.message}`);
    }
  } else {
    // If the request is not a POST, we know that we're not dealing with a
    // Farcaster Frame button click. Therefore, we should send the Farcaster Frame
    // content
    res.status(200).setHeader("Content-Type", "text/html").send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <meta property="og:title" content="Mint _fireball_" />
        <meta
          property="og:image"
          content="https://<replace-with-your-app>.vercel.app/img/art-still-long.png"
        />
        <meta property="fc:frame" content="vNext" />
        <meta
          property="fc:frame:image"
          content="https://<replace-with-your-app>.vercel.app/img/art-still-long.png"
        />
        <meta
          property="fc:frame:button:1"
          content="Mint an edition of 999 (one per wallet)"
        />
        <meta
          name="fc:frame:post_url"
          content="https://<replace-with-your-app>.vercel.app/api/fireball-mint"
        />
      </head>
    </html>
  `);
  }
}

async function hasRecasted(fid: number) {
  const options = {
    method: "GET",
    url: `https://api.neynar.com/v2/farcaster/casts?casts=0xf2feefcccdcc7fd7e9cd8593860bcda4ba597057`,
    headers: {
      accept: "application/json",
      api_key: process.env.NEYNAR_API_KEY || "",
    },
  };
  const resp = await fetch(options.url, { headers: options.headers });
  const responseBody = await resp.json(); // Parse the response body as JSON
  var hasRecasted = false;
  try {
    const recasts = responseBody.result.casts[0].reactions.recasts;
    hasRecasted = recasts.some(item => item.fid === fid);
    console.log("has recast? ", fid, " ", hasRecasted);
  } catch (error) {
    console.log("error happened in hasRecasted", error);
  }

  return hasRecasted;
}

// Based on https://github.com/coinbase/build-onchain-apps/blob/b0afac264799caa2f64d437125940aa674bf20a2/template/app/api/frame/route.ts#L13
async function getAddrByFid(fid: number) {
  console.log("Extracting address for FID: ", fid);
  const options = {
    method: "GET",
    url: `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
    headers: {
      accept: "application/json",
      api_key: process.env.NEYNAR_API_KEY || "",
    },
  };
  console.log("Fetching user address from Neynar API");
  const resp = await fetch(options.url, { headers: options.headers });
  console.log("Neynar Addr Response: ", resp);
  const responseBody = await resp.json(); // Parse the response body as JSON
  if (responseBody.users) {
    const userVerifications = responseBody.users[0];
    if (userVerifications.verifications) {
      console.log(
        "User address from Neynar API: ",
        userVerifications.verifications[0]
      );
      if (userVerifications.verifications[0] != null) {
        return userVerifications.verifications[0].toString();
      } else {
        return nullAddress;
      }
      
    }
  }
  console.log("Could not fetch user address from Neynar API for FID: ", fid);
  return nullAddress;
}
