import {Suspense} from 'react';
import {defer, redirect} from '@shopify/remix-oxygen';
import {Await, Link, useLoaderData} from '@remix-run/react';

import {
  Image,
  Money,
  VariantSelector,
  getSelectedProductOptions,
  CartForm,
  ShopPayButton,
} from '@shopify/hydrogen';
import {getVariantUrl} from '~/utils';
import { useState } from 'react';
import { BoxedSection } from '~/components/BoxedSection';

export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data.product.title}`}];
};

export async function loader({params, request, context}) {
  const {handle} = params;
  const {storefront} = context;

  const selectedOptions = getSelectedProductOptions(request).filter(
    (option) =>
      // Filter out Shopify predictive search query params
      !option.name.startsWith('_sid') &&
      !option.name.startsWith('_pos') &&
      !option.name.startsWith('_psq') &&
      !option.name.startsWith('_ss') &&
      !option.name.startsWith('_v') &&
      // Filter out third party tracking params
      !option.name.startsWith('fbclid'),
  );

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  // await the query for the critical product data
  const {shop, product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option) => option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      return redirectToFirstVariant({product, request});
    }
  }

  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = storefront.query(VARIANTS_QUERY, {
    variables: {handle},
  });

  return defer({product, storeDomain: shop.primaryDomain.url, variants});
}

function redirectToFirstVariant({product, request}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  throw redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {
      status: 302,
    },
  );
}

export default function Product() {
  const {product, variants, storeDomain} = useLoaderData();
  const {selectedVariant, media} = product;

  console.log("Products: ", product)
  const Label = props => {
    return(
      <div className="product">
        <ProductImage image={selectedVariant?.image} gallery={media.nodes} />
        <ProductMain
          selectedVariant={selectedVariant}
          product={product}
          variants={variants}
          storeDomain={storeDomain}
        />
      </div>
    );
  }
  return (
    <div style={{marginTop: "8px"}}>
    {/* <div className="product">
      <ProductImage image={selectedVariant?.image} />
      <ProductMain
        selectedVariant={selectedVariant}
        product={product}
        variants={variants}
      /> */}
      <BoxedSection>
        <h1>{product.title}</h1>
        <ProductTabs form={<Label />} description={product.descriptionHtml}/>
      </BoxedSection>
    </div>
  );
}

function ProductImage({image, gallery}) {
  console.log("Test: " + gallery[0])
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className="product-image">
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
      <div>
      {gallery.map((items) => 
        <Image 
          alt={items.alt || 'Product Image'}
          aspectRatio="1/1"
          data={items.image}
          key={items.id}
          style={{width: "100px"}}
        />
      )}
      </div>
      
    </div>
  );
}

function ProductMain({selectedVariant, product, variants, storeDomain}) {
  const {title, descriptionHtml} = product;
  return (
    <div className="product-main">
      {/* <h1>{title}</h1> */}
      <ProductPrice selectedVariant={selectedVariant} />
      <br />
      <Suspense
        fallback={
          <ProductForm
            product={product}
            selectedVariant={selectedVariant}
            variants={[]}
          />
        }
      >
        <Await
          errorElement="There was a problem loading product variants"
          resolve={variants}
        >
          {(data) => (
            <ProductForm
              product={product}
              selectedVariant={selectedVariant}
              variants={data.product?.variants.nodes || []}
              storeDomain={storeDomain}
            />
          )}
        </Await>
      </Suspense>
      <div className='share-product-socials'>
      <p>Share: </p>
      <a href="">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.6359 0.837128L12.3215 0.833313C9.72134 0.833313 8.04102 2.60422 8.04102 5.34517V7.42544H5.71401C5.51293 7.42544 5.3501 7.5929 5.3501 7.79946V10.8135C5.3501 11.0201 5.51312 11.1874 5.71401 11.1874H8.04102V18.7928C8.04102 18.9994 8.20386 19.1666 8.40494 19.1666H11.441C11.6421 19.1666 11.8049 18.9992 11.8049 18.7928V11.1874H14.5258C14.7268 11.1874 14.8897 11.0201 14.8897 10.8135L14.8908 7.79946C14.8908 7.70028 14.8524 7.6053 14.7842 7.53511C14.7161 7.46492 14.6232 7.42544 14.5267 7.42544H11.8049V5.66197C11.8049 4.81437 12.0016 4.38409 13.0764 4.38409L14.6355 4.38352C14.8364 4.38352 14.9992 4.21606 14.9992 4.00969V1.21095C14.9992 1.00478 14.8366 0.837509 14.6359 0.837128Z" fill="#787A80"/>
        </svg>
      </a>
      <a href="">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.75 4.81042C18.1059 5.0837 17.4148 5.26904 16.6887 5.35178C17.4301 4.92665 17.9976 4.25233 18.2666 3.45131C17.5711 3.845 16.8035 4.13088 15.9855 4.28585C15.3305 3.61676 14.3988 3.20001 13.3653 3.20001C11.3827 3.20001 9.77523 4.73923 9.77523 6.63656C9.77523 6.90565 9.80694 7.16847 9.86819 7.41979C6.88501 7.27632 4.23973 5.90778 2.46928 3.82825C2.1598 4.33505 1.98374 4.92558 1.98374 5.55595C1.98374 6.74859 2.618 7.80092 3.58033 8.41658C2.992 8.39775 2.43866 8.24278 1.95423 7.98519V8.02812C1.95423 9.69298 3.19213 11.0825 4.83353 11.3987C4.5328 11.4762 4.21568 11.5191 3.88761 11.5191C3.6558 11.5191 3.43161 11.4971 3.2118 11.4552C3.66889 12.8217 4.99429 13.8154 6.56463 13.8426C5.33657 14.7641 3.7881 15.3117 2.10624 15.3117C1.81646 15.3117 1.53103 15.2949 1.25 15.2646C2.83893 16.2415 4.7253 16.8111 6.75273 16.8111C13.3566 16.8111 16.9665 11.5736 16.9665 7.03132L16.9544 6.58631C17.6597 6.10462 18.2699 5.49941 18.75 4.81042Z" fill="#787A80"/>
        </svg>
      </a>
      <a href="">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.2512 0.833313C5.19014 0.834077 2.5 4.05391 2.5 7.5648C2.5 9.19267 3.4162 11.2239 4.8832 11.8678C5.30168 12.055 5.24629 11.8266 5.60631 10.4592C5.63478 10.3454 5.62016 10.2468 5.52785 10.1407C3.43082 7.73209 5.1186 2.78049 9.95192 2.78049C16.9469 2.78049 15.6399 12.3919 11.1689 12.3919C10.0165 12.3919 9.15803 11.4935 9.42959 10.3821C9.75883 9.05822 10.4035 7.63508 10.4035 6.68096C10.4035 4.27621 6.7956 4.63295 6.7956 7.81918C6.7956 8.80384 7.14639 9.46843 7.14639 9.46843C7.14639 9.46843 5.98556 14.1252 5.77017 14.9952C5.40553 16.468 5.8194 18.8522 5.85556 19.0577C5.87787 19.1707 6.00556 19.2066 6.07711 19.1134C6.19173 18.9645 7.59488 16.9768 7.98797 15.5399C8.13106 15.0166 8.71801 12.893 8.71801 12.893C9.10495 13.5866 10.2204 14.1672 11.4089 14.1672C14.9445 14.1672 17.5 11.081 17.5 7.2516C17.4877 3.5803 14.3237 0.833313 10.2512 0.833313V0.833313Z" fill="#787A80"/>
        </svg>
      </a>
      </div>
      {/* <br />
      <br />
      <p>
        <strong>Description</strong>
      </p>
      <br />
      <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
      <br /> */}
    </div>
  );
}

function ProductPrice({selectedVariant}) {
  return (
    <div className="product-price">
      {selectedVariant?.compareAtPrice ? (
        <>
          <p>Sale</p>
          <br />
          <div className="product-price-on-sale">
            {selectedVariant ? <Money data={selectedVariant.price} /> : null}
            <s>
              <Money data={selectedVariant.compareAtPrice} />
            </s>
          </div>
        </>
      ) : (
        selectedVariant?.price && <Money className='selected-variant-price' data={selectedVariant?.price} />
      )}
    </div>
  );
}

function ProductForm({product, selectedVariant, variants, storeDomain}) {
  return (
    <div className="product-form">
      <VariantSelector
        handle={product.handle}
        options={product.options}
        variants={variants}
      >
        {({option}) => <ProductOptions key={option.name} option={option} />}
      </VariantSelector>
      <br />
      <div className={`order-action-section ${!selectedVariant?.availableForSale ? 'sold-out' : ''}`}>
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          window.location.href = window.location.href + '#cart-aside';
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
      {selectedVariant?.availableForSale && (
        <div className='checkout-button'>
        <ShopPayButton
          width="100%"
          variantIds={[selectedVariant?.id]}
          storeDomain={storeDomain}
        />
        </div>
      )} 
      
      </div>
    </div>
  );
}

function ProductOptions({option}) {
  return (
    <div className="product-options" key={option.name}>
      <h5>{option.name}</h5>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              className="product-options-item"
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
              style={{
                border: isActive ? '1px solid black' : '1px solid transparent',
                opacity: isAvailable ? 1 : 0.3,
              }}
            >
              {value}
            </Link>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function AddToCartButton({analytics, children, disabled, lines, onClick}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            style={{width: "100%", height: "42px"}}
            className='cta-outlined-button-primary'
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

function ProductTabs({form, description, reviews}) {
  const [selected, setSelected] = useState("tab1");
  const onOptionChange = e => {
    setSelected(e.target.value)
  }
  return(
    <div className="tabset">
      <input type="radio" name="tabset" id="tab1" value="tab1" aria-controls="marzen" checked={selected === "tab1"} onChange={onOptionChange}/>
      <label for="tab1">GENERAL INFORMATION</label>

      <span>|</span>

      <input type="radio" name="tabset" id="tab2" value="tab2" aria-controls="rauchbier" checked={selected === "tab2"} onChange={onOptionChange}/>
      <label for="tab2">PRODUCT DETAIL</label>

      {reviews && (
      <>
        <span>|</span>
        <input type="radio" name="tabset" id="tab3" value="tab3" aria-controls="dunkles" checked={selected === "tab3"} onChange={onOptionChange}/>
        <label for="tab3">REVIEWS</label>
      </>
      )}
      
      <div className="tab-panels">
        <section id="product-general-info" className="tab-panel">
          {form}
        </section>
        <section id="product-details" className="tab-panel">
        <div dangerouslySetInnerHTML={{__html: description}} />
        </section>
        {reviews && (
        <section id="product-reviews" className="tab-panel">
          <h2>6C. Dunkles Bock</h2>
          <p><strong>Overall Impression:</strong> A dark, strong, malty German lager beer that emphasizes the malty-rich and somewhat toasty qualities of continental malts without being sweet in the finish.</p>
          <p><strong>History:</strong> Originated in the Northern German city of Einbeck, which was a brewing center and popular exporter in the days of the Hanseatic League (14th to 17th century). Recreated in Munich starting in the 17th century. The name “bock” is based on a corruption of the name “Einbeck” in the Bavarian dialect, and was thus only used after the beer came to Munich. “Bock” also means “Ram” in German, and is often used in logos and advertisements.</p>
        </section>
        )}
      </div>
      
    </div>
  );
}

function ProductGalery(){

  return(
    <>

    </>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
`;
const MEDIA_FRAGMENT = `#graphql
  fragment Media on Media {
    __typename
    mediaContentType
    alt
    previewImage {
      url
    }
    ... on MediaImage {
      id
      image {
        id
        url
        width
        height
      }
    }
    ... on Video {
      id
      sources {
        mimeType
        url
      }
    }
    ... on Model3d {
      id
      sources {
        mimeType
        url
      }
    }
    ... on ExternalVideo {
      id
      embedUrl
      host
    }
  }
`;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    options {
      name
      values
    }
    selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    variants(first: 1) {
      nodes {
        ...ProductVariant
      }
    }
    seo {
      description
      title
    }
    media(first: 15) {
      nodes {
        ...Media
      }
    }
  }
  ${MEDIA_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
      
    }
    shop {
      name
      primaryDomain {
        url
      }
      shippingPolicy {
        body
        handle
      }
      refundPolicy {
        body
        handle
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const PRODUCT_VARIANTS_FRAGMENT = `#graphql
  fragment ProductVariants on Product {
    variants(first: 250) {
      nodes {
        ...ProductVariant
      }
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
`;

const VARIANTS_QUERY = `#graphql
  ${PRODUCT_VARIANTS_FRAGMENT}
  query ProductVariants(
    $country: CountryCode
    $language: LanguageCode
    $handle: String!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductVariants
    }
  }
`;

