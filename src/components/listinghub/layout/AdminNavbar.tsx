'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BsPersonCircle, BsBasket2, BsSearch, BsGeoAlt, BsSpeedometer, BsPersonLinesFill, BsJournalCheck, BsUiRadiosGrid, BsBookmarkStar, BsChatDots, BsYelp, BsWallet, BsPatchPlus, BsBoxArrowInRight, BsPersonPlus, BsQuestionCircle, BsShieldCheck, BsPersonVcard, BsCalendar2Check, BsPersonCheck, BsBlockquoteLeft, BsEnvelopeCheck, BsCoin, BsPatchQuestion, BsHourglassTop, BsInfoCircle, BsXOctagon, BsGear, BsGeoAltFill, BsX } from "react-icons/bs"
import { FiX } from 'react-icons/fi'
import { FaSortDown, FaXmark } from 'react-icons/fa6'
import { BiSolidShoppingBagAlt } from 'react-icons/bi'

export function AdminNavbar() {
    const [scroll, setScroll] = useState(false)
    const [current, setCurrent] = useState('')
    const [windowWidth, setWindowWidth] = useState(0)
    const [toggle, setIsToggle] = useState(false)

    const location = usePathname()

    useEffect(() => {
        if (typeof window === "undefined") return
        window.scrollTo(0, 0)
        setCurrent(location)

        const handlerScroll = () => {
            if (window.scrollY > 50) {
                setScroll(true)
            } else { setScroll(false) }
        }

        if (typeof window !== "undefined") {
            setWindowWidth(window.innerWidth)
        }

        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }

        window.addEventListener('scroll', handlerScroll)
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('scroll', handlerScroll)
            window.removeEventListener('resize', handleResize)
        }
    }, [windowWidth])

    return (
        <>
            <div className={`header header-dark navdark ${scroll ? 'header-fixed' : ''}`} data-sticky-element="">
                <div className="container-fluid">
                    <nav id="navigation" className={windowWidth > 991 ? "navigation navigation-landscape" : "navigation navigation-portrait"}>
                        <div className="nav-header">
                            <Link className="nav-brand" href="/"><img src='/img/logo-light.svg' className="logo" alt="" /></Link>
                            <div className="nav-toggle" onClick={() => setIsToggle(!toggle)}></div>
                            <div className="mobile_nav">
                                <ul>
                                    <li>
                                        <Link data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample" className="d-inline-flex py-0 pt-1 px-1"><div className="d-inline-flex w-8 h-8 circle overflow-hidden"><img src='/img/team-2.jpg' className="img-fluid" alt="" /></div></Link>
                                    </li>
                                    <li>
                                        <Link href="#cartSlider" className="cart-content" data-bs-toggle="offcanvas" role="button" aria-controls="cartSlider"><BsBasket2 className="" /><span className="head-cart-counter">3</span></Link>
                                    </li>
                                    <li>
                                        <Link href="#searchSlider" className="d-flex align-items-center" data-bs-toggle="offcanvas" role="button" aria-controls="searchSlider"><BsSearch className="me-1" /></Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    )
}
