# ListingHub Component Dependency Report
## Complete Trace of 7 Pages

---

## 1. COMPLETE COMPONENT FILE LIST (22 files)

All paths relative to `ListingHub/ListingHub_NextJs (Javascript)/src/app/`

### Navbar Components (3 files)
| File | Used By |
|------|---------|
| `components/navbar/navbar-dark.jsx` | page.js, single-listing-04, booking-page, blog |
| `components/navbar/nav-light-two.jsx` | grid-layout-04, list-layout-02 |
| `components/navbar/admin-navbar.jsx` | dashboard-user |

### Form Components (1 file)
| File | Used By |
|------|---------|
| `components/form/form-one.jsx` | page.js (homepage) |

### Category Components (1 file)
| File | Used By |
|------|---------|
| `components/categories/category-one.jsx` | page.js (homepage) |

### Listing Components (2 files)
| File | Used By |
|------|---------|
| `components/popular-listing-one.jsx` | page.js (homepage) |
| `components/filter-one.jsx` | grid-layout-04, list-layout-02 |

### Misc Page Components (4 files)
| File | Used By |
|------|---------|
| `components/brand-image.jsx` | page.js (homepage) |
| `components/client-one.jsx` | page.js (homepage) |
| `components/blog-one.jsx` | page.js (homepage) |
| `components/range-slider.jsx` | (sub-dep of filter-one) |

### List Detail Components (7 files)
| File | Used By |
|------|---------|
| `components/list-detail/descriptions.jsx` | single-listing-04 |
| `components/list-detail/features.jsx` | single-listing-04 |
| `components/list-detail/galleries.jsx` | single-listing-04 |
| `components/list-detail/maps.jsx` | single-listing-04 |
| `components/list-detail/reviews.jsx` | single-listing-04 |
| `components/list-detail/list.jsx` | single-listing-04 |
| `components/list-detail/single-sidebar-four.jsx` | single-listing-04 |

### Admin Components (2 files)
| File | Used By |
|------|---------|
| `components/admin/admin-sidebar.jsx` | dashboard-user |
| `components/admin/recent-activity.jsx` | dashboard-user |

### Shared Layout Components (3 files)
| File | Used By |
|------|---------|
| `components/footer-top.jsx` | ALL pages except dashboard-user |
| `components/footer/footer.jsx` | ALL pages except dashboard-user |
| `components/back-to-top.jsx` | ALL 7 pages |

### Data File (1 file)
| File | Used By |
|------|---------|
| `data/data.js` | 12 components + 3 pages directly |

---

## 2. PER-COMPONENT IMPORT BREAKDOWN

### `components/navbar/navbar-dark.jsx`
```
'use client'
- react (useState, useEffect)
- next/navigation (usePathname, useRouter)
- next/link
- next/image
- react-icons/bs: BsPersonCircle, BsBasket2, BsSearch, BsGeoAlt, BsSpeedometer, BsPersonLinesFill,
  BsJournalCheck, BsUiRadiosGrid, BsBookmarkStar, BsChatDots, BsYelp, BsWallet, BsPatchPlus,
  BsBoxArrowInRight, BsPersonPlus, BsQuestionCircle, BsShieldCheck, BsPersonVcard, BsCalendar2Check,
  BsPersonCheck, BsBlockquoteLeft, BsEnvelopeCheck, BsCoin, BsPatchQuestion, BsHourglassTop,
  BsInfoCircle, BsXOctagon, BsGear, BsGeoAltFill, BsX
- react-icons/fi: FiX
- react-icons/bi: BiSolidShoppingBagAlt
Images: /img/logo.svg, /img/brand/logo-1.png, /img/brand/logo-2.png, /img/brand/logo-3.png,
        /img/list-3.jpg, /img/list-4.jpg, /img/list-5.jpg, /img/google.png, /img/facebook.png
```

### `components/navbar/nav-light-two.jsx`
```
'use client'
- react (useState, useEffect)
- next/link
- next/navigation (usePathname)
- react-icons/bs: BsPersonCircle, BsBasket2, BsSearch, BsGeoAlt, BsSpeedometer, BsPersonLinesFill,
  BsJournalCheck, BsUiRadiosGrid, BsBookmarkStar, BsChatDots, BsYelp, BsWallet, BsPatchPlus,
  BsBoxArrowInRight, BsPersonPlus, BsQuestionCircle, BsShieldCheck, BsPersonVcard, BsCalendar2Check,
  BsPersonCheck, BsBlockquoteLeft, BsEnvelopeCheck, BsCoin, BsPatchQuestion, BsHourglassTop,
  BsInfoCircle, BsXOctagon, BsGear, BsGeoAltFill, BsX
- react-icons/fi: FiX
- react-icons/bi: BiSolidShoppingBagAlt
Images: /img/logo-light.svg, /img/logo.svg, /img/brand/logo-1.png, /img/brand/logo-2.png,
        /img/brand/logo-3.png, /img/list-3.jpg, /img/list-4.jpg, /img/list-5.jpg,
        /img/google.png, /img/facebook.png
```

### `components/navbar/admin-navbar.jsx`
```
'use client'
- react (useState, useEffect)
- next/link
- next/navigation (usePathname)
- react-icons/bs: BsPersonCircle, BsBasket2, BsSearch, BsGeoAlt, BsSpeedometer, BsPersonLinesFill,
  BsJournalCheck, BsUiRadiosGrid, BsBookmarkStar, BsChatDots, BsYelp, BsWallet, BsPatchPlus,
  BsBoxArrowInRight, BsPersonPlus, BsQuestionCircle, BsShieldCheck, BsPersonVcard, BsCalendar2Check,
  BsPersonCheck, BsBlockquoteLeft, BsEnvelopeCheck, BsCoin, BsPatchQuestion, BsHourglassTop,
  BsInfoCircle, BsXOctagon, BsGear, BsGeoAltFill, BsX
- react-icons/fi: FiX
- react-icons/fa6: FaSortDown, FaXmark
- react-icons/bi: BiSolidShoppingBagAlt
Images: /img/logo-light.svg, /img/logo.svg, /img/team-2.jpg,
        /img/list-3.jpg, /img/list-4.jpg, /img/list-5.jpg
```

### `components/form/form-one.jsx`
```
'use client'
- react
- next/dynamic → react-select (SSR disabled)
- react-icons/fa6: FaLocationDot
- react-icons/bi: BiSearch
NO sub-component imports. NO data imports. NO images.
```

### `components/brand-image.jsx`
```
'use client'
- react
- next/image
- swiper/react: Swiper, SwiperSlide
- swiper/modules: Autoplay
- swiper/css
Images: /img/brand/logo-1.png, /img/brand/logo-2.png, /img/brand/logo-3.png,
        /img/brand/logo-4.png, /img/brand/logo-5.png, /img/brand/logo-6.png
```

### `components/categories/category-one.jsx`
```
'use client'
- react
- next/link
- swiper/react: Swiper, SwiperSlide
- swiper/modules: Autoplay
- swiper/css
- ../../data/data: { categoryData }
NO sub-component imports.
Images: Referenced via categoryData (catt-1..catt-10 .jpg from /img/cats/)
```

### `components/popular-listing-one.jsx`
```
'use client'
- react
- next/link
- next/image
- ../data/data: { listData }
- swiper/react: Swiper, SwiperSlide
- swiper/modules: Autoplay, Pagination
- swiper/css, swiper/css/pagination
- react-icons/bs: BsGeoAlt, BsPatchCheckFill, BsStar, BsSuitHeart, BsTelephone
NO sub-component imports.
Images: Referenced via listData (list-1..list-9.jpg, team-1..team-9.jpg)
```

### `components/client-one.jsx`
```
'use client'
- react
- next/image
- ../data/data: { reviewData }
- swiper/react: Swiper, SwiperSlide
- swiper/modules: Autoplay, Pagination
- swiper/css, swiper/css/pagination
NO sub-component imports.
Images: Referenced via reviewData (team-1..team-6.jpg)
```

### `components/blog-one.jsx`
```
- react
- next/link
- next/image
- ../data/data: { blogData }
- react-icons/bs: BsCalendar2, BsEyeFill
NO sub-component imports.
Images: Referenced via blogData (blog-1..blog-6.jpg)
```

### `components/filter-one.jsx`
```
'use client'
- react (useState)
- next/link
- react-icons/bs: BsFunnel, BsList, BsStarFill, BsUiRadiosGrid
- ./range-slider (SUB-COMPONENT — see below)
NO data imports.
```

### `components/range-slider.jsx` (sub-dependency of filter-one)
```
'use client'
- react (useState)
- rc-slider: Slider
- rc-slider/assets/index.css (via node_modules path)
```

### `components/footer-top.jsx`
```
- react
- react-icons/bi: BiPaperPlane
Images: /img/brand-section.png (background)
```

### `components/footer/footer.jsx`
```
- react
- next/link
- next/image
- react-icons/fa: FaFacebookF, FaHeart, FaInstagram, FaTwitter
- react-icons/fa6: FaLinkedin
- ../../data/data: { footerLink1, footerLink2, footerLink3 }
- react-icons/bs: BsGeoAltFill, BsTelephoneOutbound
Images: /img/logo-light.svg
```

### `components/back-to-top.jsx`
```
'use client'
- react (useState, useEffect)
- next/link
- react-icons/fi: FiArrowUp
```

### `components/list-detail/descriptions.jsx`
```
- react
- next/link
NO external imports. Pure JSX text content.
```

### `components/list-detail/features.jsx`
```
- react
- next/link
- react-icons/fa6: FaDroplet, FaDumpsterFire, FaFan, FaHouseFire, FaMaskVentilator,
  FaOilCan, FaPlug, FaSmoking, FaToiletPaper, FaWheelchair, FaWifi
NO data imports. Data is inline const.
```

### `components/list-detail/galleries.jsx`
```
'use client'
- react (useState)
- next/link
- next/image
- yet-another-react-lightbox: Lightbox
- yet-another-react-lightbox/styles.css
Images: /img/gal-1.jpg..gal-6.jpg
```

### `components/list-detail/maps.jsx`
```
- react
- next/link
NO imports. Embeds Google Maps iframe.
```

### `components/list-detail/reviews.jsx`
```
'use client'
- react
- next/link
- next/image
- next/dynamic → react-select (SSR disabled)
- react-icons/fa6: FaStar
Images: /img/team-6.jpg, /img/team-4.jpg, /img/team-7.jpg
```

### `components/list-detail/list.jsx`
```
'use client'
- react
- next/link
- next/image
- ../../data/data: { listData }
- swiper/react: Swiper, SwiperSlide
- swiper/modules: Autoplay, Pagination
- swiper/css
- react-icons/bs: BsGeoAlt, BsPatchCheckFill, BsStar, BsStarFill, BsSuitHeart, BsTelephone
Images: Referenced via listData
```

### `components/list-detail/single-sidebar-four.jsx`
```
'use client'
- react (useState)
- next/link
- next/image
- next/dynamic → react-select (SSR disabled)
- react-icons/bs: BsBrowserChrome, BsCalendar, BsEnvelope, BsFacebook, BsInstagram,
  BsSuitHeart, BsTwitterX, BsWhatsapp, BsYoutube
- react-icons/bi: BiPhone
- react-icons/fa6: FaMinus, FaPlus
Images: /img/avatar-bg.jpg, /img/team-4.jpg
```

### `components/admin/admin-sidebar.jsx`
```
'use client'
- react (useEffect, useState)
- next/link
- next/image
- next/navigation (usePathname)
- react-icons/bs: BsBookmarkStar, BsChatDots, BsJournalCheck, BsPatchPlus,
  BsPersonLinesFill, BsSpeedometer, BsUiRadiosGrid, BsWallet, BsYelp
Images: /img/team-2.jpg
```

### `components/admin/recent-activity.jsx`
```
- react
- next/link
- react-icons/bs: BsCheckCircle, BsHeart, BsStar
```

---

## 3. DATA FILE EXPORTS

File: `data/data.js` — **27 named exports**

### Exports used by the 7 pages:
| Export | Type | Used By |
|--------|------|---------|
| `categoryData` | Array of 12 objects | category-one.jsx |
| `listData` | Array of 9 objects | popular-listing-one, list.jsx, grid-layout-04/page, list-layout-02/page |
| `reviewData` | Array of 6 objects | client-one.jsx |
| `blogData` | Array of 6 objects | blog-one.jsx, blog/page.jsx |
| `footerLink1` | Array of 4 strings | footer.jsx |
| `footerLink2` | Array of 5 strings | footer.jsx |
| `footerLink3` | Array of 5 strings | footer.jsx |
| `adminCounter` | Array of 4 objects | dashboard-user/page.jsx |
| `chatData` | Array of 5 objects | dashboard-user/page.jsx |
| `invoiceData` | Array of 4 objects | dashboard-user/page.jsx |

### Exports NOT used by these 7 pages (available for other pages):
`cityData`, `eventData`, `workData`, `reviewData2`, `bookingData`, `adminListing`,
`message`, `adminReview`, `earning`, `counterData`, `teamData`, `mostViewBlog`,
`blogTag`, `blogSocial`, `helpData`, `articles`, `faqData1`, `faqData2`, `faqData3`

---

## 4. ALL IMAGE/ASSET PATHS REFERENCED

### Static images used directly in components/pages:
```
/img/logo.svg                    — navbar-dark, nav-light-two, admin-navbar
/img/logo-light.svg              — nav-light-two, admin-navbar, footer
/img/logo-4.png                  — single-listing-04/page.jsx
/img/tick.svg                    — single-listing-04/page.jsx
/img/single-4.jpg                — single-listing-04/page.jsx (background)
/img/banner-1.jpg                — page.js (homepage hero background)
/img/title-banner.jpg            — blog/page.jsx (background)
/img/blog-5.jpg                  — blog/page.jsx (inline featured blog)
/img/list-4.jpg                  — booking-page/page.jsx (sidebar)
/img/brand-section.png           — footer-top.jsx (background)
/img/avatar-bg.jpg               — single-sidebar-four.jsx (background)
/img/team-2.jpg                  — admin-navbar, admin-sidebar
/img/team-4.jpg                  — single-sidebar-four, reviews
/img/team-6.jpg                  — reviews
/img/team-7.jpg                  — reviews
/img/google.png                  — navbar-dark, nav-light-two (login modal)
/img/facebook.png                — navbar-dark, nav-light-two (login modal)
/img/gal-1.jpg .. /img/gal-6.jpg — galleries.jsx
/img/list-3.jpg .. /img/list-5.jpg — navbar cart offcanvas (all 3 navbars)
/img/brand/logo-1.png .. logo-6.png — brand-image.jsx, navbar modals
```

### Images referenced via data.js:
```
/img/list-1.jpg .. /img/list-9.jpg   — listData[].image
/img/team-1.jpg .. /img/team-9.jpg   — listData[].user, reviewData[].image, chatData[].image
/img/blog-1.jpg .. /img/blog-6.jpg   — blogData[].image
/img/cats/catt-1.jpg .. catt-10.jpg  — categoryData[].image
```

---

## 5. EXTERNAL NPM PACKAGES REQUIRED

| Package | Version (from package.json) | Used In |
|---------|----------------------------|---------|
| `react` | ^19.2.4 | All components |
| `react-dom` | ^19.2.4 | Framework |
| `next` | ^16.1.6 | Framework (Link, Image, dynamic, usePathname, useRouter) |
| `react-icons` | ^5.5.0 | Nearly all components (bs, fa, fa6, fi, bi submodules) |
| `swiper` | ^12.1.0 | brand-image, category-one, popular-listing-one, client-one, list.jsx |
| `react-select` | ^5.10.2 | form-one, reviews, single-sidebar-four (via next/dynamic SSR:false) |
| `react-countup` | ^6.5.3 | dashboard-user/page.jsx |
| `rc-slider` | ^11.1.9 | range-slider.jsx (sub-dep of filter-one) |
| `yet-another-react-lightbox` | ^3.28.0 | galleries.jsx |
| `bootstrap` | ^5.3.8 | layout.js CSS import + CDN JS bundle |
| `animate.css` | ^4.1.1 | layout.js CSS import |
| `sass` | ^1.97.3 | Build-time (style/scss/style.scss in layout.js) |

### Packages in package.json NOT used by these 7 pages:
- `@react-google-maps/api` — used in half-map pages
- `rc-tooltip` — used elsewhere
- `react-apexcharts` — used in dashboard charts
- `react-dropzone` — used in add-listing forms
- `react-scroll` — used elsewhere

---

## 6. LAYOUT FILE DEPENDENCIES

`layout.js` imports (required by ALL pages):
```
bootstrap/dist/css/bootstrap.css      — npm: bootstrap
./style/scss/style.scss                — local SCSS (needs sass compiler)
animate.css/animate.css                — npm: animate.css
CDN: bootstrap 5.3.3 JS bundle        — <script> in <head>
CDN: font-awesome 6.7.2               — <link> in <head>
```

---

## 7. COMPLETE DEPENDENCY TREE PER PAGE

### Page 1: `page.js` (Homepage)
```
├── components/navbar/navbar-dark.jsx
├── components/form/form-one.jsx
│   └── react-select (dynamic)
├── components/brand-image.jsx
│   └── swiper
├── components/categories/category-one.jsx
│   ├── swiper
│   └── data/data.js → categoryData
├── components/popular-listing-one.jsx
│   ├── swiper
│   └── data/data.js → listData
├── components/client-one.jsx
│   ├── swiper
│   └── data/data.js → reviewData
├── components/blog-one.jsx
│   └── data/data.js → blogData
├── components/footer-top.jsx
├── components/footer/footer.jsx
│   └── data/data.js → footerLink1, footerLink2, footerLink3
└── components/back-to-top.jsx
```

### Page 2: `grid-layout-04/page.jsx`
```
├── components/navbar/nav-light-two.jsx
├── components/filter-one.jsx
│   └── components/range-slider.jsx → rc-slider
├── data/data.js → listData (direct page import)
├── components/footer-top.jsx
├── components/footer/footer.jsx
│   └── data/data.js → footerLink1, footerLink2, footerLink3
└── components/back-to-top.jsx
```

### Page 3: `list-layout-02/page.jsx`
```
├── components/navbar/nav-light-two.jsx
├── components/filter-one.jsx
│   └── components/range-slider.jsx → rc-slider
├── data/data.js → listData (direct page import)
├── components/footer-top.jsx
├── components/footer/footer.jsx
│   └── data/data.js → footerLink1, footerLink2, footerLink3
└── components/back-to-top.jsx
```

### Page 4: `single-listing-04/page.jsx`
```
├── components/navbar/navbar-dark.jsx
├── components/list-detail/descriptions.jsx
├── components/list-detail/features.jsx
├── components/list-detail/galleries.jsx → yet-another-react-lightbox
├── components/list-detail/maps.jsx
├── components/list-detail/reviews.jsx → react-select (dynamic)
├── components/list-detail/list.jsx
│   ├── swiper
│   └── data/data.js → listData
├── components/list-detail/single-sidebar-four.jsx → react-select (dynamic)
├── components/footer-top.jsx
├── components/footer/footer.jsx
│   └── data/data.js → footerLink1, footerLink2, footerLink3
└── components/back-to-top.jsx
```

### Page 5: `booking-page/page.jsx`
```
├── components/navbar/navbar-dark.jsx
├── components/footer-top.jsx
├── components/footer/footer.jsx
│   └── data/data.js → footerLink1, footerLink2, footerLink3
└── components/back-to-top.jsx
(No other component imports — form is inline)
```

### Page 6: `blog/page.jsx`
```
├── components/navbar/navbar-dark.jsx
├── data/data.js → blogData (direct page import)
├── components/footer-top.jsx
├── components/footer/footer.jsx
│   └── data/data.js → footerLink1, footerLink2, footerLink3
└── components/back-to-top.jsx
```

### Page 7: `dashboard-user/page.jsx`
```
├── components/navbar/admin-navbar.jsx
├── components/admin/admin-sidebar.jsx
├── components/admin/recent-activity.jsx
├── data/data.js → adminCounter, chatData, invoiceData (direct page import)
├── react-countup (CountUp component)
└── components/back-to-top.jsx
(No footer-top or footer — dashboard has its own layout)
```

---

## 8. SUMMARY COUNTS

| Category | Count |
|----------|-------|
| Component files needed | 22 |
| Data files needed | 1 |
| Total source files | 23 + layout.js + style/scss/style.scss |
| Unique npm packages used | 12 (including react/next) |
| Unique image paths (static) | ~55+ |
| Pages using `'use client'` | 2 (grid-layout-04, dashboard-user) |
| Components using `'use client'` | 14 of 22 |

### react-icons submodules used:
- `react-icons/bs` — 50+ icons (most used module)
- `react-icons/fa6` — FaStar, FaStarHalfStroke, FaDumbbell, FaLocationDot, FaArrowLeft, FaArrowRight, FaHeart, FaSortDown, FaXmark, FaMinus, FaPlus, FaLinkedin, FaDroplet, FaDumpsterFire, FaFan, FaHouseFire, FaMaskVentilator, FaOilCan, FaPlug, FaSmoking, FaToiletPaper, FaWheelchair, FaWifi
- `react-icons/fi` — FiX, FiArrowUp
- `react-icons/bi` — BiSolidShoppingBagAlt, BiSearch, BiPaperPlane, BiPhone
- `react-icons/fa` — FaFacebookF, FaHeart, FaInstagram, FaTwitter
- `react-icons/md` — MdArrowForwardIos
