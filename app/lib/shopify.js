export async function fetchProduct(url) {
  console.log('Fetching product for URL:', url); // Log the URL

  const handle = url.split('/').pop();
  const shop = url.split('/')[2];

  console.log('Extracted handle:', handle); // Log the extracted handle
  console.log('Extracted shop:', shop); // Log the extracted shop

  const gql = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        title
        images(first: 1) { edges { node { originalSrc } } }
        priceRange { minVariantPrice { amount } }
      }
    }
  `;

  try {
    const res = await fetch(`https://${shop}/api/2023-07/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query: gql, variables: { handle } }),
    });

    console.log('Shopify API Response Status:', res.status); // Log the response status

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Shopify API Error:', errorData);
      throw new Error(`Shopify Error ${res.status}: ${errorData.message || 'Unknown error'}`);
    }

    const json = await res.json();
    const p = json.data.productByHandle;

    if (!p) {
      console.error('Product data from Shopify:', json); // Log the full response for inspection
      throw new Error('Product not found');
    }

    return {
      title: p.title,
      image: p.images.edges[0]?.node.originalSrc ?? '',
      price: p.priceRange.minVariantPrice.amount,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}
