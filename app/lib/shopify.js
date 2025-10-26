// app/lib/shopify.js
export async function fetchProduct(url) {
  try {
    const handle = url.split('/').pop();
    const shop = url.split('/')[2];

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

    if (!res.ok) {
      throw new Error(`Shopify Error: ${res.status}`);
    }

    const json = await res.json();
    const p = json.data.productByHandle;

    if (!p) {
      throw new Error('Product not found');
    }

    return {
      title: p.title,
      image: p.images.edges[0]?.node.originalSrc ?? '',
      price: p.priceRange.minVariantPrice.amount,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error; // Re-throw the error to handle it in the API route
  }
}
