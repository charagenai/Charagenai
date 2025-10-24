// app/lib/shopify.js
export async function fetchProduct(url) {
  // Beispiel-URL: https://voxcart-dev.myshopify.com/products/wasserflasche
  const handle = url.split('/').pop(); // "wasserflasche"
  const shop = url.split('/')[2]; // "voxcart-dev.myshopify.com"

  const gql = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        title
        images(first: 1) { edges { node { originalSrc } } }
        priceRange { minVariantPrice { amount } }
      }
    }
  `;

  const res = await fetch(`https://${shop}/api/2023-07/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query: gql, variables: { handle } }),
  });

  if (!res.ok) throw new Error('Shopify Error ' + res.status);
  const json = await res.json();
  const p = json.data.productByHandle;
  return {
    title: p.title,
    image: p.images.edges[0]?.node.originalSrc ?? '',
    price: p.priceRange.minVariantPrice.amount,
  };
}
