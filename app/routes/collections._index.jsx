import {useLoaderData, Link} from '@remix-run/react';
import {defer, json} from '@shopify/remix-oxygen';
import {Pagination, getPaginationVariables, Image} from '@shopify/hydrogen';
import { BoxedSection } from '~/components/BoxedSection';
import { FullSection } from '~/components/FullSection';
import { Grid } from '~/components/Grid';
import { Suspense } from 'react';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
import { useRef, useEffect } from 'react';
// register Swiper custom elements
register();

// export async function loader({context, request}) {
//   const paginationVariables = getPaginationVariables(request, {
//     pageBy: 4,
//   });

//   const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
//     variables: paginationVariables,
//   });

//   return json({collections});
// }

export async function loader({context}) {
  const {storefront} = context;
  const bariatricDiaperCollection = await storefront.query(BARIATRIC_DIAPER_COLLECTION_QUERY);
  const otherAdultDiaperCollection = await storefront.query(OTHER_ADULT_DIAPER_COLLECTION_QUERY);

  return defer({bariatricDiaperCollection, otherAdultDiaperCollection});
}

export default function Collections() {
  const data = useLoaderData();

  return (
    // <div className="collections">
    //   <h1>Collections</h1>
    //   <Pagination connection={collections}>
    //     {({nodes, isLoading, PreviousLink, NextLink}) => (
    //       <div>
    //         <PreviousLink>
    //           {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
    //         </PreviousLink>
    //         <CollectionsGrid collections={nodes} />
    //         <NextLink>
    //           {isLoading ? 'Loading...' : <span>Load more ↓</span>}
    //         </NextLink>
    //       </div>
    //     )}
    //   </Pagination>
    // </div>
    <>
      <BoxedSection>
        <h1 className='page-title'>Shop by Catagories</h1>
        <div className='flex-section justify-center'>
            <div className='category-card'>
              <img />
              <h3 className='category-title'>5 Protective Layers</h3>
            </div>
            <div className='category-card'>
              <img />
              <h3 className='category-title'>5 Protective Layers</h3>
            </div>
            <div className='category-card'>
              <img />
              <h3 className='category-title'>5 Protective Layers</h3>
            </div>
        </div>
      </BoxedSection>

      <FullSection>
        <div className='curve-container'>
          <svg className='curve-path' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#272D6A" fill-opacity="1" d="M0,0L80,5.3C160,11,320,21,480,58.7C640,96,800,160,960,154.7C1120,149,1280,75,1360,37.3L1440,0L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
          <div className='main-container bg-dark-purple'>
            <BoxedSection>
              <h2 className='section-title'>Bariatric Diapers</h2>
              {/* <swiper-container>
                <swiper-slide>Slide 1</swiper-slide>
                <swiper-slide>Slide 2</swiper-slide>
                <swiper-slide>Slide 3</swiper-slide>
              </swiper-container> */}

              <GetCollection textColor='light' products={data.bariatricDiaperCollection.collection.products.nodes} />

              {/* <GetCollection products={data.productsCollection.collection.products.nodes} /> */}
            </BoxedSection>
          </div>
        </div>
      </FullSection>
      <BoxedSection>
        <h2 className='section-title'>Other Adult Diapers</h2>
        <GetCollection products={data.bariatricDiaperCollection.collection.products.nodes} />

      </BoxedSection>

      <FullSection>
        <div className='curve-container-v2 '>
          
          <div className='main-container bg-dark-blue' style={{paddingTop: '30px'}}>
            <BoxedSection>
              <h2 className='section-title'>Adult Wet Wipes</h2>
              <div className='featured-product'>
                <div className='featured-images-contaner'>
                  <div className='featured-image-items-container'>
                    <img className='featured-image-items' src="https://cdn.shopify.com/s/files/1/0782/1911/6834/products/Bariattrics_4XL-8_0692554f-1265-473b-a15a-1e27164f38fe.jpg?v=1689010719"/>
                  </div>
                  <div>
                  <img className='main-featured-image' src="https://cdn.shopify.com/s/files/1/0782/1911/6834/products/Bariattrics_4XL-8_0692554f-1265-473b-a15a-1e27164f38fe.jpg?v=1689010719"/>
                  </div>
                </div>
                <div className='featured-description-container'>
                  <div>
                    <a href=''><p className='featured-product-title'>Dignex Bariatrics</p></a>
                    <p className='featured-product-description'>Lorem ipsum dolor sit amet consectetur. Bibendum non quam ut ac at.</p>
                    <button className='cta-button-primary '>BUY NOW</button>
                  </div>
                </div>
              </div>
            </BoxedSection>
          </div>
          <div className='curve-path-bottom flip-hor-vert '>
            <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 -100 1440 320">
              <path fill="#1178BA" fill-opacity="1" d="M0,0L80,5.3C160,11,320,21,480,58.7C640,96,800,160,960,154.7C1120,149,1280,75,1360,37.3L1440,0L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>
          </div>
        </div>
      </FullSection>
      <BoxedSection>
        <div className='container'>
          <div className='section-details'>
            <h2 className='section-title'>Browse Our Blogs</h2>
            <p className='section-description'>Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar elementum tempus hac tellus libero accumsan. </p>
          </div>
          <Grid>
            <div className='blog-card'>
              {/* <img src="https://cdn.shopify.com/s/files/1/0782/1911/6834/products/Bariattrics_4XL-8_0692554f-1265-473b-a15a-1e27164f38fe.jpg?v=1689010719" alt="" srcset="" /> */}
              <svg style={{width: "100%", background: '#F9F9FF'}} width="344" height="220" viewBox="0 0 344 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.0209961" width="343.792" height="220" rx="10" fill="#F9F9FF"/>
              <path d="M172.159 145.239C160.44 145.239 148.721 145.239 137.002 145.239C136.429 145.239 135.849 145.239 135.274 145.18C132.341 144.906 131.161 142.929 132.412 140.257C133.498 137.95 134.682 135.702 135.832 133.42C141.261 122.673 146.689 111.927 152.118 101.184C152.286 100.856 152.461 100.527 152.656 100.214C154.023 98.023 156.243 97.7145 157.993 99.6046C159.227 100.927 160.27 102.413 161.371 103.846C166.964 111.155 172.557 118.467 178.15 125.783C180.593 128.966 183.67 129.138 186.54 126.276C187.964 124.855 189.355 123.397 190.796 121.988C193.395 119.446 196.343 119.599 198.465 122.562C202.724 128.509 206.877 134.535 211.05 140.541C211.376 141.012 211.626 141.532 211.79 142.081C212.195 143.46 211.622 144.57 210.223 144.938C209.346 145.148 208.445 145.245 207.543 145.227C195.755 145.246 183.96 145.251 172.159 145.239Z" fill="#D4D2E3"/>
              <path d="M198.441 86.3516C198.438 88.6454 197.754 90.8867 196.475 92.7914C195.197 94.696 193.382 96.1781 191.26 97.0499C189.138 97.9217 186.806 98.1439 184.557 97.6882C182.309 97.2326 180.247 96.1197 178.632 94.4906C177.017 92.8615 175.922 90.7896 175.487 88.5376C175.051 86.2855 175.293 83.9548 176.184 81.8408C177.074 79.7268 178.572 77.9247 180.488 76.6631C182.403 75.4015 184.651 74.7371 186.944 74.7542C189.999 74.793 192.916 76.0305 195.066 78.2C197.217 80.3694 198.429 83.297 198.441 86.3516Z" fill="#D4D2E3"/>
              </svg>

              <div>
                <a href="" ><p className='blog-title'>Dignex Bariatrics</p></a>
                <p className='blog-description'>Lorem ipsum dolor sit amet consecte tur adipiscing elit semper dalaracc lacus vel facilisis volutpat est velitolm.</p>
                <a href="">
                  <div className='blog-link'>
                  Learn more 
                  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.4282 2.94922L18.4789 9.99994L11.4282 17.0507" stroke="#8D8BA7" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.4789 10L3.479 10" stroke="#8D8BA7" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  </div>
                </a>
              </div>
            </div>
          </Grid>
        </div>
      </BoxedSection>
    </>
    
  );
}

function CollectionsGrid({collections}) {
  return (
    <div className="collections-grid">
      {collections.map((collection, index) => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          index={index}
        />
      ))}
    </div>
  );
}

function CollectionItem({collection, index}) {
  return (
    <Link
      className="collection-item"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      {collection?.image && (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="1/1"
          data={collection.image}
          loading={index < 3 ? 'eager' : undefined}
        />
      )}
      <h5>{collection.title}</h5>
    </Link>
  );
}

const GetCollection = ({products, textColor}) => {
  const getCollectionRef = useRef(null);

  useEffect(() => {
    // listen for Swiper events using addEventListener
    getCollectionRef.current.addEventListener('progress', (e) => {
      const [swiper, progress] = e.detail;
      console.log(progress);
    });

    getCollectionRef.current.addEventListener('slidechange', (e) => {
      console.log('slide changed');
    });
  }, []);

  return (
    <swiper-container
      ref={getCollectionRef}
      slides-per-view="3"
      navigation="true"
      pagination="true"
    >
      {/* <swiper-slide>Slide 1</swiper-slide>
      <swiper-slide>Slide 2</swiper-slide>
      <swiper-slide>Slide 3</swiper-slide> */}
      {products.map((product) => (
        <swiper-slide>
          <Link
            key={product.id}
            to={`/products/${product.handle}`}
          >
            <div className={`product-card ${textColor}`}>
              <Image
                data={product.images.nodes[0]}
                aspectRatio="1/1"
              />
              <h4 className='product-title'>{product.title}</h4>
              <p className='product-price'>{product.variants.nodes[0].priceV2.amount}</p>
              <button className='cta-button-primary product-button'>SHOP NOW</button>
            </div>
          </Link>
        </swiper-slide>
      ))}
    </swiper-container>
  );
};

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

const BARIATRIC_DIAPER_COLLECTION_QUERY = `#graphql
  query  {
    collection(handle: "bariatrics") {
      products(first: 8) {
        nodes {
          id
          title
          publishedAt
          handle
          images(first: 1) {
            nodes {
              id
              url
              altText
              width
              height
            }
          }
          variants(first: 1) {
            nodes {
              id
              image {
                url
                altText
                width
                height
              }
              priceV2 {
                amount
                currencyCode
              }
              compareAtPriceV2 {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

const OTHER_ADULT_DIAPER_COLLECTION_QUERY = `#graphql
  query  {
    collection(handle: "adult-diaper") {
      products(first: 8) {
        nodes {
          id
          title
          publishedAt
          handle
          images(first: 1) {
            nodes {
              id
              url
              altText
              width
              height
            }
          }
          variants(first: 1) {
            nodes {
              id
              image {
                url
                altText
                width
                height
              }
              priceV2 {
                amount
                currencyCode
              }
              compareAtPriceV2 {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

