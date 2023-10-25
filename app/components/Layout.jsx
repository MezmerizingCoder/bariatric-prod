import {Await} from '@remix-run/react';
import {Suspense} from 'react';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import { useRef } from 'react';

export function Layout({cart, children = null, footer, header, isLoggedIn}) {
  const topRef = useRef(null);

  const executeScroll = () => {
    // topRef.current.scrollIntoView({ behavior: 'smooth' });   
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  } 
  

  return (
    <>
      <div ref={topRef}></div>
      <div className='announcement-section'>
        <a href="tel:2345678765">
          <div className='announcement-item'> 
            <div className='icon-wrapper'>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.1609 7.66579L8.58454 6.51134L8.57743 6.50806C8.44368 6.45085 8.29778 6.4279 8.15292 6.44126C8.00807 6.45463 7.86884 6.5039 7.74782 6.58462C7.73357 6.59403 7.71987 6.60426 7.7068 6.61525L6.37571 7.75001C5.53243 7.3404 4.6618 6.47634 4.25219 5.644L5.3886 4.29267C5.39954 4.279 5.40993 4.26532 5.41977 4.25056C5.49875 4.12986 5.54668 3.99152 5.55927 3.84782C5.57187 3.70413 5.54874 3.55956 5.49196 3.42696V3.4204L4.33422 0.839699C4.25916 0.666484 4.13009 0.522191 3.96628 0.428361C3.80247 0.33453 3.61271 0.296193 3.42532 0.319074C2.68429 0.416585 2.00409 0.78051 1.51177 1.34288C1.01944 1.90524 0.748665 2.62759 0.750005 3.37501C0.750005 7.7172 4.28282 11.25 8.625 11.25C9.37242 11.2514 10.0948 10.9806 10.6571 10.4883C11.2195 9.99593 11.5834 9.31573 11.6809 8.5747C11.7039 8.38737 11.6656 8.19766 11.5719 8.03386C11.4782 7.87005 11.334 7.74095 11.1609 7.66579ZM8.625 10.375C6.76911 10.373 4.98981 9.63484 3.6775 8.32252C2.36518 7.0102 1.62703 5.2309 1.625 3.37501C1.62295 2.84098 1.81535 2.32446 2.16627 1.92191C2.51719 1.51936 3.00264 1.25831 3.53196 1.18751C3.53174 1.18969 3.53174 1.19189 3.53196 1.19407L4.6804 3.76439L3.55 5.11736C3.53853 5.13056 3.52811 5.14464 3.51883 5.15946C3.43654 5.28575 3.38826 5.43115 3.37868 5.58158C3.3691 5.732 3.39854 5.88235 3.46415 6.01806C3.95961 7.03142 4.98063 8.04478 6.00493 8.5397C6.14163 8.60469 6.29285 8.63312 6.44382 8.62219C6.59479 8.61126 6.74034 8.56136 6.86625 8.47736C6.8803 8.4679 6.89381 8.45767 6.90672 8.44673L8.23618 7.31251L10.8065 8.46368H10.8125C10.7426 8.99375 10.4819 9.48018 10.0793 9.83197C9.67666 10.1838 9.15966 10.3768 8.625 10.375Z" fill="#8D8BA7"/>
              </svg>
            </div>
            <span>(+1) 234 567 8765</span>
          </div>
        </a>
        <a href="mailto:info@dignexmedical.com">
          <div className='announcement-item'> 
            <div className='icon-wrapper'>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.76477 7.30321C8.76477 7.80721 8.90817 8.00821 9.28317 8.00821C10.119 8.00821 10.6512 6.94321 10.6512 5.17201C10.6512 2.46481 8.67837 1.16881 6.21537 1.16881C3.68157 1.16881 1.37697 2.86801 1.37697 6.07921C1.37697 9.14641 3.39297 10.8168 6.48897 10.8168C7.54017 10.8168 8.24577 10.7016 9.32517 10.3416L9.55677 11.3058C8.49117 11.652 7.35237 11.7522 6.47457 11.7522C2.41377 11.7522 0.23877 9.52021 0.23877 6.07861C0.23877 2.60821 2.75937 0.246613 6.22977 0.246613C9.84417 0.246613 11.7588 2.40661 11.7588 5.05621C11.7588 7.30261 11.0538 9.01621 8.83617 9.01621C7.82757 9.01621 7.16577 8.61301 7.07937 7.71961C6.82017 8.71321 6.12897 9.01621 5.19237 9.01621C3.93957 9.01621 2.88837 8.05081 2.88837 6.10741C2.88837 4.14901 3.81057 2.93941 5.46657 2.93941C6.34497 2.93941 6.89217 3.28501 7.13577 3.83221L7.55397 3.06901H8.76357V7.30321H8.76477ZM6.99417 5.40241C6.99417 4.61101 6.40317 4.27921 5.91357 4.27921C5.38077 4.27921 4.79097 4.71061 4.79097 5.97841C4.79097 6.98641 5.23737 7.54801 5.91357 7.54801C6.38877 7.54801 6.99417 7.24561 6.99417 6.41041V5.40241Z" fill="#8D8BA7"/>
              </svg>
            </div>
            <span>info@dignexmedical.com</span>
          </div>
        </a>
      </div>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside menu={header.menu} />
      <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />
      <main>{children}</main>
      <Suspense>
        <Await resolve={footer}>
          {(footer) => <Footer menu={footer.menu} />}
        </Await>
      </Suspense>

      
        <div onClick={executeScroll} className='scroll-top-btn'>
          {/* <a href='#top-page'> */}
          <svg width="31" height="31" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.3125 22.1875L35.5 4.4375M35.5 4.4375L57.6875 22.1875M35.5 4.4375V66.5625" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          {/* </a> */}
        </div>
      
    </>
  );
}

function CartAside({cart}) {
  return (
    <Aside id="cart-aside" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  return (
    <Aside id="search-aside" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <PredictiveSearchForm>
          {({fetchResults, inputRef}) => (
            <div>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
              />
              &nbsp;
              <button type="submit">Search</button>
            </div>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>
    </Aside>
  );
}

function MobileMenuAside({menu}) {
  return (
    <Aside id="mobile-menu-aside" heading="MENU">
      <HeaderMenu menu={menu} viewport="mobile" />
    </Aside>
  );
}
