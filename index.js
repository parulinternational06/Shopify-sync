const CLIENT_ID     = "4ec5300cb476a054a1de5155e69bf003";
const CLIENT_SECRET = "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";
const SHOP          = "parulpackaging.myshopify.com";
const REDIRECT_URI  = "https://shopify-sync-snowy.vercel.app/callback";

module.exports = async (req, res) => {
  const url  = new URL(req.url, "https://shopify-sync-snowy.vercel.app");
  const path = url.pathname;

  // Step 1: Start OAuth
  if (path === "/" || path === "") {
    const authUrl = `https://${SHOP}/admin/oauth/authorize?client_id=${CLIENT_ID}&scope=read_products,write_products&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    return res.writeHead(302, { Location: authUrl }).end();
  }

  // Step 2: Handle callback and exchange code for token
  if (path === "/callback") {
    const code = url.searchParams.get("code");
    if (!code) {
      return res.end("Error: no code returned from Shopify");
    }

    const tokenRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code:          code
      })
    });

    const data = await tokenRes.json();

    if (data.access_token) {
      return res.end(`
        <html><body style="font-family:sans-serif;max-width:600px;margin:60px auto;padding:20px">
        <h2 style="color:green">✅ Your permanent Shopify token:</h2>
        <p style="background:#e8f5e9;padding:20px;border-radius:8px;font-family:monospace;word-break:break-all;font-size:16px">
          ${data.access_token}
        </p>
        <p>Copy this token — paste it into the Google Sheets script.</p>
        </body></html>
      `);
    } else {
      return res.end("Error: " + JSON.stringify(data));
    }
  }

  res.end("Not found");
};
