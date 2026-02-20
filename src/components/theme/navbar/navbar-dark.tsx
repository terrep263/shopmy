'use client'
import React, { useState,useEffect } from 'react'
import { usePathname,useRouter } from 'next/navigation'

import { BsPersonCircle,BsBasket2,BsSearch, BsGeoAlt, BsSpeedometer, BsPersonLinesFill, BsJournalCheck, BsUiRadiosGrid, BsBookmarkStar, BsChatDots, BsYelp, BsWallet, BsPatchPlus, BsBoxArrowInRight, BsPersonPlus, BsQuestionCircle, BsShieldCheck, BsPersonVcard, BsCalendar2Check, BsPersonCheck, BsBlockquoteLeft, BsEnvelopeCheck, BsCoin, BsPatchQuestion, BsHourglassTop, BsInfoCircle, BsXOctagon, BsGear, BsGeoAltFill, BsX, } from "react-icons/bs";
import { FiX } from 'react-icons/fi';
import { BiSolidShoppingBagAlt } from 'react-icons/bi'
import Link from 'next/link';
import Image from 'next/image';
import MainNavigation from '@/components/navigation/MainNavigation'

export default function NavbarDark() {
    const [scroll,setScroll] = useState(false);
    const [current , setCurrent] = useState('');
    const [windowWidth, setWindowWidth] = useState(0);
    const [toggle, setIsToggle] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [currentUser, setCurrentUser] = useState<{ userId: string; role: string } | null>(null);

    const location = usePathname();
    const router = useRouter();

    const loadCurrentUser = () => {
        fetch('/api/auth/me', { credentials: 'include' })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => (data ? setCurrentUser({ userId: data.userId, role: data.role }) : setCurrentUser(null)))
            .catch(() => setCurrentUser(null));
    };

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginError('');
        const form = e.currentTarget;
        const email = (form.querySelector('#email01') as HTMLInputElement)?.value?.trim();
        const password = (form.querySelector('#pass01') as HTMLInputElement)?.value;
        if (!email || !password) {
            setLoginError('Please enter email and password.');
            return;
        }
        setLoginLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setLoginError(data?.error || 'Invalid credentials');
                setLoginLoading(false);
                return;
            }
            setLoginLoading(false);
            const modalEl = document.getElementById('login');
            if (modalEl) {
                const Modal = (window as unknown as { bootstrap?: { Modal: { getInstance: (el: Element) => { hide: () => void } } } }).bootstrap?.Modal?.getInstance(modalEl);
                Modal?.hide();
            }
            loadCurrentUser();
            router.push('/');
            router.refresh();
        } catch {
            setLoginError('Login failed. Please try again.');
            setLoginLoading(false);
        }
    };

    useEffect(() => {
        loadCurrentUser();
    }, []);

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
        <div className={`header header-light ${scroll ? 'header-fixed' : ''} `} data-sticky-element="">
            <div className="container-fluid">
                <nav id="navigation" className={windowWidth > 991 ? "navigation navigation-landscape" : " navigation navigation-portrait "}>
                    <div className="nav-header">
                        <Link className="nav-brand" href="/"><Image src='/img/logo.svg' width={0} height={0} sizes='100vw' style={{width:'166px', height:'auto'}} className="logo" alt=""/></Link>
                        <div className="nav-toggle" onClick={()=>setIsToggle(!toggle)}></div>
                        <div className="mobile_nav">
                            <ul>
                                {currentUser?.role === 'admin' && (
                                    <li>
                                        <Link href="/admin/dashboard" className="d-flex align-items-center" title="Admin"><BsShieldCheck className="me-1"/></Link>
                                    </li>
                                )}
                                <li>
                                    <Link href="#login" className="d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#login"><BsPersonCircle className="me-1"/></Link>
                                </li>
                                <li>
                                    <Link href="#cartSlider" className="cart-content" data-bs-toggle="offcanvas" role="button" aria-controls="cartSlider"><BsBasket2  className=""/><span className="head-cart-counter">3</span></Link>
                                </li>
                                <li>
                                    <Link href="#searchSlider" className="d-flex align-items-center" data-bs-toggle="offcanvas" role="button" aria-controls="searchSlider"><BsSearch className="me-1"/></Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={`nav-menus-wrapper  ${toggle ? 'nav-menus-wrapper-open' : ''}`} style={{transitionProperty:toggle ? 'none' : 'left'}}>
                        <div className='mobLogos'>
                            <Image src='/img/logo.svg' width={0} height={0} sizes='100vw' style={{width:'140px', height:'auto'}} className='img-fluid lightLogo' alt='Logo'/>
                        </div>
                        <span className='nav-menus-wrapper-close-button'  onClick={()=>setIsToggle(!toggle)}>✕</span>
                        <MainNavigation />

                        <ul className="nav-menu nav-menu-social align-to-right">
                            {currentUser?.role === 'admin' && (
                                <li className={current === '/admin/dashboard' || current.startsWith('/admin/') ? 'active' : ''}>
                                    <Link href="/admin/dashboard" className="d-flex align-items-center"><BsShieldCheck className="fs-6 me-1"/><span className="navCl">Admin</span></Link>
                                </li>
                            )}
                            <li>
                                <Link href="#login" className="d-flex align-items-center" data-bs-toggle="modal" data-bs-target="#login"><BsPersonCircle className="fs-6 me-1"/><span className="navCl">SignUp or SignIn</span></Link>
                            </li>
                            <li>
                                <Link href="#cartSlider" className="cart-content" data-bs-toggle="offcanvas" role="button" aria-controls="cartSlider"><BsBasket2  className=""/><span className="head-cart-counter">3</span></Link>
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

        <div className="modal fade" id="login" tabIndex={-1} role="dialog" aria-labelledby="loginmodal" aria-hidden="true">
            <div className="modal-dialog" id="loginmodal">
                <div className="modal-content">
                    <div className="modal-header justify-content-end border-0 pb-0">
                        <Link href="#" className="square--30 circle bg-light-danger text-danger" data-bs-dismiss="modal" aria-label="Close"><FiX className=""/></Link>
                    </div>
                    
                    <div className="modal-body px-4">
                        <div className="text-center mb-5">
                            <h2>Welcome Back</h2>
                            <p className="fs-6">Login to manage your account.</p>
                        </div>

                        <form className="needs-validation px-lg-2" noValidate onSubmit={handleLoginSubmit}>
                            {loginError && (
                                <div className="alert alert-danger py-2 mb-3" role="alert">
                                    {loginError}
                                </div>
                            )}
                            <div className="row align-items-center justify-content-between g-3 mb-4">
                                <div className="col-xl-6 col-lg-6 col-md-6"><Link href="#" className="btn btn-outline-secondary border rounded-3 text-md px-lg-2 full-width"><img src='/img/google.png' className="img-fluid me-2" width="16" alt=""/>Login with Google</Link></div>
                                <div className="col-xl-6 col-lg-6 col-md-6"><Link href="#" className="btn btn-outline-secondary border rounded-3 text-md px-lg-2 full-width"><img src='/img/facebook.png' className="img-fluid me-2" width="16" alt=""/>Login with Facebook</Link></div>
                            </div>
                            
                            <div className="form-group form-border mb-4">
                                <label className="form-label" htmlFor="email01">Your email</label>
                                <input type="email" className="form-control" id="email01" name="email" placeholder="email@site.com" required disabled={loginLoading}/>
                                <span className="invalid-feedback">Please enter a valid email address.</span>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <label className="form-label" htmlFor="pass01">Password</label>
                                    <Link href="/forgot-password" className="link fw-medium text-primary">Forgot Password?</Link>
                                </div>

                                <div className="input-group-merge form-group form-border ">
                                    <input type="password" className="form-control" id="pass01" name="password" placeholder="8+ characters required" required disabled={loginLoading}/>
                                </div>

                                <span className="invalid-feedback">Please enter a valid password.</span>
                            </div>

                            <div className="d-grid mb-3">
                                <button type="submit" className="btn btn-primary fw-medium" disabled={loginLoading}>
                                    {loginLoading ? 'Signing in…' : 'Log in'}
                                </button>
                            </div>

                            <div className="text-center">
                                <p>Don&apos;t have an account yet? <Link className="link fw-medium text-primary" href="/register">Sign up here</Link></p>
                            </div>
                        </form>
                    </div>
                    
                    <div className="modal-footer p-3 border-top">
                        <div className="d-flex align-items-center justify-content-between gap-3">
                            <div className="brand px-lg-4 px-3"><Image src='/img/brand/logo-1.png' width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}}  className="img-fluid" alt=""/></div>
                            <div className="brand px-lg-4 px-3"><Image src="/img/brand/logo-2.png" width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="img-fluid" alt=""/></div>
                            <div className="brand px-lg-4 px-3"><Image src="/img/brand/logo-3.png" width={0} height={0} sizes='100vw' style={{width:'100%', height:'auto'}} className="img-fluid" alt=""/></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="offcanvas offcanvas-end" data-bs-scroll="true" tabIndex={-1} id="cartSlider" aria-labelledby="cartSliderLabel">
            <div className="offcanvas-header border-bottom d-flex justify-content-between">
                <h6 className="offcanvas-title" id="cartSliderLabel">Your cart Items</h6>
                <Link href="#" className="square--35 circle text-muted-2 border" data-bs-dismiss="offcanvas" aria-label="Close"><FiX className=""/></Link>
            </div>
            <div className="offcanvas-body">
                <div className="cartItems w-100">
                    <div className="d-flex align-items-center justify-content-start flex-column gap-3">
                        
                        <div className="singleCartitem d-flex align-items-center justify-content-between gap-4 w-100">
                            <div className="d-flex align-items-center justify-content-start gap-3">
                                <div className="cartiteThumb"><figure className="d-block m-0"><Image src="/img/list-3.jpg" width={0} height={0} sizes='100vw' style={{width:'60px', height:'auto'}} className="img-fluid rounded-2" alt=""/></figure></div>
                                <div className="cartCaption">
                                    <h6 className="lh-base m-0">Spicy Burger</h6>
                                    <p className="m-0">1x$25.50</p>
                                </div>
                            </div>
                            
                            <div className="removeItemcart"><Link href="#" className="square--35 circle badge-secondary"><FiX className=""/></Link></div>
                        </div>
                        
                        <div className="singleCartitem d-flex align-items-center justify-content-between gap-3 w-100">
                            <div className="d-flex align-items-center justify-content-start gap-3">
                                <div className="cartiteThumb"><figure className="d-block m-0"><Image src="/img/list-4.jpg" width={0} height={0} sizes='100vw' style={{width:'60px', height:'auto'}} className="img-fluid rounded-2" alt=""/></figure></div>
                                <div className="cartCaption">
                                    <h6 className="lh-base m-0">Premium Package</h6>
                                    <p className="m-0">1x$22.10</p>
                                </div>
                            </div>
                            
                            <div className="removeItemcart"><Link href="#" className="square--35 circle badge-secondary"><FiX className=""/></Link></div>
                        </div>
                        
                        <div className="singleCartitem d-flex align-items-center justify-content-between gap-3 w-100">
                            <div className="d-flex align-items-center justify-content-start gap-3">
                                <div className="cartiteThumb"><figure className="d-block m-0"><Image src="/img/list-5.jpg" width={0} height={0} sizes='100vw' style={{width:'60px', height:'auto'}} className="img-fluid rounded-2" alt=""/></figure></div>
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
                        <a href="/viewcart"  className="btn btn-md btn-light-primary fw-medium flex-fill">View Cart</a>
                        <a href="/checkout-page" className="btn btn-md btn-primary fw-medium flex-fill">Checkout</a>
                    </div>
                </div>
            </div>
        </div>
        <div className="offcanvas offcanvas-top h-auto" tabIndex={-1} id="searchSlider" aria-labelledby="searchSliderLabel">
            <div className="offcanvas-body" id="searchSliderLabel">
                <div className="searchForm w-100 mb-3">
                    <div className="p-2 ps-3 rounded border d-flex align-items-center justify-content-between gap-2">
                        <div className="searchicons"><span><BsSearch className="fs-4 opacity-75"/></span></div>
                        <div className="flex-fill"><input type="search" className="form-control border-0 ps-0" placeholder="What are you looking for?"/></div>
                        <div className="closeSlides"><Link href="#" className="square--35 circle text-muted-2 border" data-bs-dismiss="offcanvas" aria-label="Close"><BsX/></Link></div>
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
