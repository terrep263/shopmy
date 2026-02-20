'use client'
import React, { useState,useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

import { BsPersonCircle,BsBasket2,BsSearch, BsGeoAlt, BsSpeedometer, BsPersonLinesFill, BsJournalCheck, BsUiRadiosGrid, BsBookmarkStar, BsChatDots, BsYelp, BsWallet, BsPatchPlus, BsBoxArrowInRight, BsPersonPlus, BsQuestionCircle, BsShieldCheck, BsPersonVcard, BsCalendar2Check, BsPersonCheck, BsBlockquoteLeft, BsEnvelopeCheck, BsCoin, BsPatchQuestion, BsHourglassTop, BsInfoCircle, BsXOctagon, BsGear, BsGeoAltFill, BsX } from "react-icons/bs";
import { FiX } from 'react-icons/fi';
import { FaSortDown, FaXmark } from 'react-icons/fa6'
import { BiSolidShoppingBagAlt } from 'react-icons/bi'
import MainNavigation from '@/components/navigation/MainNavigation'


export default function AdminNavbar() {
    const [scroll,setScroll] = useState(false);
    const [current , setCurrent] = useState('');
    const [windowWidth, setWindowWidth] = useState(0);
    const [toggle, setIsToggle] = useState(false);

    const location = usePathname(); 
    
    useEffect(()=>{
            if (typeof window === "undefined") return;
            window.scrollTo(0,0)
            setCurrent(location)
    
            const handlerScroll=()=>{
                if(window.scrollY > 50){
                    setScroll(true)
                }else{setScroll(false)}
            }
    
            if (typeof window !== "undefined") {
                setWindowWidth(window.innerWidth);
            }
    
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
                };
    
            window.addEventListener('scroll',handlerScroll)
            window.addEventListener('resize', handleResize);
    
            return () => {
                window.removeEventListener('scroll',handlerScroll)
                window.removeEventListener('resize', handleResize);
                };
        },[windowWidth])

  return (
    <>
        <div className={`header header-dark navdark ${scroll ? 'header-fixed' : ''}`} data-sticky-element="">
            <div className="container-fluid">
                <nav id="navigation" className={windowWidth > 991 ? "navigation navigation-landscape" : "navigation navigation-portrait"}>
                    <div className="nav-header">
                        <Link className="nav-brand" href="/"><img src='/img/logo-light.svg' className="logo" alt=""/></Link>
                        <div className="nav-toggle" onClick={()=>setIsToggle(!toggle)}></div>
                        <div className="mobile_nav">
                            <ul>
                                <li>
                                    <Link data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample" className="d-inline-flex py-0 pt-1 px-1"><div className="d-inline-flex w-8 h-8 circle overflow-hidden"><img src='/img/team-2.jpg' className="img-fluid" alt=""/></div></Link>
                                </li>
                                <li>
                                    <Link href="#cartSlider" className="cart-content" data-bs-toggle="offcanvas" role="button" aria-controls="cartSlider"><BsBasket2 className=""/><span className="head-cart-counter">3</span></Link>
                                </li>
                                <li>
                                    <Link href="#searchSlider" className="d-flex align-items-center" data-bs-toggle="offcanvas" role="button" aria-controls="searchSlider"><BsSearch className="me-1"/></Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={`nav-menus-wrapper  ${toggle ? 'nav-menus-wrapper-open' : ''}`} style={{transitionProperty:toggle ? 'none' : 'left'}}>
                        <div className='mobLogos'>
                            <img src='/img/logo.svg' className='img-fluid lightLogo' alt='Logo'/>
                        </div>
                        <span className='nav-menus-wrapper-close-button'  onClick={()=>setIsToggle(!toggle)}>✕</span>
                        <MainNavigation />

                        <ul className="nav-menu nav-menu-social align-to-right">
                            <li>
                                <Link href="#cartSlider" className="cart-content" data-bs-toggle="offcanvas" role="button" aria-controls="cartSlider"><BsBasket2 className=""/><span className="head-cart-counter">3</span></Link>
                            </li>
                            <li>
                                <div className="btn-group account-drop">
                                    <Link href="#" className="nav-link btn-order-by-filt" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <div className="d-inline-flex w-8 h-8 circle overflow-hidden"><img src='/img/team-2.jpg' className="img-fluid" alt=""/></div>
                                        <span className="fw-medium d-inline-flex ms-2 text-light">Shreethemes<FaSortDown className="ms-1"/></span>
                                    </Link>
                                    <div className="dropdown-menu pull-right animated flipInX">
                                        <div className="drp_menu_headr bg-primary">
                                            <h4>Hi, Shreethemes</h4>
                                            <div className="drp_menu_headr-right"><button type="button" className="btn btn-whites text-dark">My Profile</button></div>
                                        </div>
                                        <ul>
                                            <li><Link href="/dashboard-user"><BsSpeedometer className="me-2"/>Dashboard Area</Link></li>
                                            <li><Link href="/dashboard-my-profile"><BsPersonLinesFill className="me-2"/>My Profile</Link></li>
                                            <li><Link href="/dashboard-my-bookings"><BsJournalCheck className="me-2"/>My Bookings</Link></li>
                                            <li><Link href="/dashboard-my-listings"><BsUiRadiosGrid className="me-2"/>My Listings</Link></li>
                                            <li><Link href="/dashboard-bookmarks"><BsBookmarkStar className="me-2"/>Bookmarkes</Link></li>
                                            <li><Link href="/dashboard-messages"><BsChatDots className="me-2"/>Messages<span className="notti_coun style-1">3</span></Link></li>
                                            <li><Link href="/dashboard-reviews"><BsYelp className="me-2"/>Reviews</Link></li>
                                            <li><Link href="/dashboard-wallet"><BsWallet className="me-2"/>Wallet</Link></li>
                                            <li><Link href="/dashboard-add-listing"><BsPatchPlus className="me-2"/>Add Listing</Link></li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                            <li className="list-buttons">
                                <Link href="/register"><BsGeoAlt className="fs-6 me-1"/>Add Listing</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
        <div className="clearfix"></div>

        <div className="offcanvas offcanvas-end" data-bs-scroll="true" tabIndex="-1" id="cartSlider" aria-labelledby="cartSliderLabel">
            <div className="offcanvas-header border-bottom d-flex justify-content-between">
                <h6 className="offcanvas-title" id="cartSliderLabel">Your cart Items</h6>
                <Link href="#" className="square--35 circle text-muted-2 border" data-bs-dismiss="offcanvas" aria-label="Close"><FiX className=""/></Link>
            </div>
            <div className="offcanvas-body">
                <div className="cartItems w-100">
                    <div className="d-flex align-items-center justify-content-start flex-column gap-3">
                        
                        <div className="singleCartitem d-flex align-items-center justify-content-between gap-4 w-100">
                            <div className="d-flex align-items-center justify-content-start gap-3">
                                <div className="cartiteThumb"><figure className="d-block m-0"><img src='/img/list-3.jpg' className="img-fluid rounded-2" width="60" alt=""/></figure></div>
                                <div className="cartCaption">
                                    <h6 className="lh-base m-0">Spicy Burger</h6>
                                    <p className="m-0">1x$25.50</p>
                                </div>
                            </div>
                            
                            <div className="removeItemcart"><Link href="#" className="square--35 circle badge-secondary"><FiX className=""/></Link></div>
                        </div>
                        
                        <div className="singleCartitem d-flex align-items-center justify-content-between gap-3 w-100">
                            <div className="d-flex align-items-center justify-content-start gap-3">
                                <div className="cartiteThumb"><figure className="d-block m-0"><img src='/img/list-4.jpg' className="img-fluid rounded-2" width="60" alt=""/></figure></div>
                                <div className="cartCaption">
                                    <h6 className="lh-base m-0">Premium Package</h6>
                                    <p className="m-0">1x$22.10</p>
                                </div>
                            </div>
                            
                            <div className="removeItemcart"><Link href="#" className="square--35 circle badge-secondary"><FiX className=""/></Link></div>
                        </div>
                        
                        <div className="singleCartitem d-flex align-items-center justify-content-between gap-3 w-100">
                            <div className="d-flex align-items-center justify-content-start gap-3">
                                <div className="cartiteThumb"><figure className="d-block m-0"><img src='/img/list-5.jpg' className="img-fluid rounded-2" width="60" alt=""/></figure></div>
                                <div className="cartCaption">
                                    <h6 className="lh-base m-0">Platinum Plaster</h6>
                                    <p className="m-0">1x$17.40</p>
                                </div>
                            </div>
                            
                            <div className="removeItemcart"><Link href="" className="square--35 circle badge-secondary"><FiX className=""/></Link></div>
                        </div>
                    
                    </div>
                    
                    <div className="cartSubtotal w-100 py-3 border-top mt-3">
                        <h6 className="m-0">Subtotal: $128.75</h6>
                    </div>
                    
                </div>
                
                <div className="cartButtons w-100 py-2">
                    <div className="d-flex align-items-center justify-content-center flex-wrap gap-2">
                        <a href="/viewcart" className="btn btn-md btn-light-primary fw-medium flex-fill">View Cart</a>
                        <a href="/checkout-page" className="btn btn-md btn-primary fw-medium flex-fill">Checkout</a>
                    </div>
                </div>
            </div>
        </div>

        <div className="offcanvas offcanvas-end offcanvas-menu" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
				<div className="offcanvas-header">
					<button type="button" className="btn-closes" data-bs-dismiss="offcanvas" aria-label="Close"><FaXmark className=""/></button>
				</div>
				<div className="offcanvas-body" id="offcanvasExampleLabel">
                    <ul>
                        <li><a href="/dashboard-user"><BsSpeedometer className="me-2"/>Dashboard Area</a></li>
                        <li><a href="/dashboard-my-profile"><BsPersonLinesFill className="me-2"/>My Profile</a></li>
                        <li><a href="/dashboard-my-bookings"><BsJournalCheck className="me-2"/>My Bookings</a></li>
                        <li><a href="/dashboard-my-listings"><BsUiRadiosGrid className="me-2"/>My Listings</a></li>
                        <li><a href="/dashboard-bookmarks"><BsBookmarkStar className="me-2"/>Bookmarkes</a></li>
                        <li><a href="/dashboard-messages"><BsChatDots className="me-2"/>Messages<span className="notti_coun style-1">3</span></a></li>
                        <li><a href="/dashboard-reviews"><BsYelp className="me-2"/>Reviews</a></li>
                        <li><a href="/dashboard-wallet"><BsWallet className="me-2"/>Wallet</a></li>
                        <li><a href="/dashboard-add-listing"><BsPatchPlus className="me-2"/>Add Listing</a></li>
                    </ul>
				</div>
			</div>
            <div className="offcanvas offcanvas-top h-auto" tabIndex="-1" id="searchSlider" aria-labelledby="searchSliderLabel">
				<div className="offcanvas-body" id="searchSliderLabel">
					<div className="searchForm w-100 mb-3">
						<div className="p-2 ps-3 rounded border d-flex align-items-center justify-content-between gap-2">
							<div className="searchicons"><span><BsSearch className="fs-4 opacity-75"/></span></div>
							<div className="flex-fill"><input type="search" className="form-control border-0 ps-0" placeholder="What are you looking for?"/></div>
							<div className="closeSlides"><Link href="#" className="square--35 circle text-muted-2 border" data-bs-dismiss="offcanvas" aria-label="Close"><BsX /></Link></div>
						</div>
					</div>
					<div className="popularSearches d-flex align-items-center justify-content-center gap-2 flex-wrap">
						<div className="singleItem"><Link href="#" className="badge badge-xs badge-primary rounded-pill">Real Estate</Link></div>	
						<div className="singleItem"><Link href="#" className="badge badge-xs badge-primary rounded-pill">Eat & Drink</Link></div>	
						<div className="singleItem"><Link href="#" className="badge badge-xs badge-primary rounded-pill">Shopping</Link></div>	
						<div className="singleItem"><Link href="#" className="badge badge-xs badge-primary rounded-pill">Nightlife</Link></div>	
						<div className="singleItem"><Link href="#" className="badge badge-xs badge-primary rounded-pill">Services</Link></div>	
					</div>
				</div>
			</div>
    </>
  )
}
