import {Await, NavLink, useMatches} from '@remix-run/react';
import {Suspense} from 'react';

export function Header({header, isLoggedIn, cart}) {
  const {shop, menu} = header;
  return (
    <header className="header">
      <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
        {/* <strong>{shop.name}</strong> */}
        <img src={require('../../public/dignex-logo.png')} alt="" srcset="" />
      </NavLink>
      <HeaderMenu menu={menu} viewport="desktop" />
      {/* <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} /> */}
      <HeaderCtas cart={cart} />
    </header>
  );
}

export function HeaderMenu({menu, viewport}) {
  const [root] = useMatches();
  const publicStoreDomain = root?.data?.publicStoreDomain;
  const className = `header-menu-${viewport}`;

  function closeAside(event) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={closeAside}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={closeAside}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({isLoggedIn, cart}) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      {/* <NavLink prefetch="intent" to="/account" style={activeLinkStyle}>
        {isLoggedIn ? 'Account' : 'Sign in'}
      </NavLink> */}
      <SearchToggle />
      <CartToggle cart={cart} />
      <button className='cta-button-primary'>ALL PRODUCTS</button>
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  return (
    <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
      <h3>☰</h3>
    </a>
  );
}

function SearchToggle() {
  return <a href="#search-aside">Search</a>;
}

function CartBadge({count}) {
  return <a href="#cart-aside">
    <div className='cart-badge'>
      <div className='cart-btn'>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.8334 5.83332H13.3334V4.99999C13.3334 4.11593 12.9822 3.26809 12.3571 2.64297C11.7319 2.01785 10.8841 1.66666 10 1.66666C9.11599 1.66666 8.26814 2.01785 7.64302 2.64297C7.0179 3.26809 6.66671 4.11593 6.66671 4.99999V5.83332H4.16671C3.94569 5.83332 3.73373 5.92112 3.57745 6.0774C3.42117 6.23368 3.33337 6.44564 3.33337 6.66666V15.8333C3.33337 16.4964 3.59677 17.1322 4.06561 17.6011C4.53445 18.0699 5.17033 18.3333 5.83337 18.3333H14.1667C14.8297 18.3333 15.4656 18.0699 15.9345 17.6011C16.4033 17.1322 16.6667 16.4964 16.6667 15.8333V6.66666C16.6667 6.44564 16.5789 6.23368 16.4226 6.0774C16.2663 5.92112 16.0544 5.83332 15.8334 5.83332ZM8.33337 4.99999C8.33337 4.55796 8.50897 4.13404 8.82153 3.82148C9.13409 3.50892 9.55801 3.33332 10 3.33332C10.4421 3.33332 10.866 3.50892 11.1786 3.82148C11.4911 4.13404 11.6667 4.55796 11.6667 4.99999V5.83332H8.33337V4.99999ZM15 15.8333C15 16.0543 14.9122 16.2663 14.756 16.4226C14.5997 16.5789 14.3877 16.6667 14.1667 16.6667H5.83337C5.61236 16.6667 5.4004 16.5789 5.24412 16.4226C5.08784 16.2663 5.00004 16.0543 5.00004 15.8333V7.49999H6.66671V8.33332C6.66671 8.55434 6.7545 8.7663 6.91079 8.92258C7.06707 9.07886 7.27903 9.16666 7.50004 9.16666C7.72105 9.16666 7.93302 9.07886 8.0893 8.92258C8.24558 8.7663 8.33337 8.55434 8.33337 8.33332V7.49999H11.6667V8.33332C11.6667 8.55434 11.7545 8.7663 11.9108 8.92258C12.0671 9.07886 12.279 9.16666 12.5 9.16666C12.7211 9.16666 12.933 9.07886 13.0893 8.92258C13.2456 8.7663 13.3334 8.55434 13.3334 8.33332V7.49999H15V15.8333Z" fill="white"/>
        </svg>
      </div>
      <span className='cart-item-count'>{count}</span>
    </div>
    </a>;
}

function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}
