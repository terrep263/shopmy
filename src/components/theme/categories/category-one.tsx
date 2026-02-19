'use client'
import React from 'react'

import Link from 'next/link';
import { categoryData } from '@/lib/theme-data';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { IconType } from 'react-icons';

export interface CategoryDataItem {
    image: string;
    icon: IconType;
    title: string;
    list: string;
}

interface CategoryOneProps {
  categories?: CategoryDataItem[];
}

export default function CategoryOne({ categories }: CategoryOneProps) {
  const data = categories ?? categoryData;
  return (
    <div className="row align-items-center justify-content-center">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
             <Swiper
                      slidesPerView={6}
                      spaceBetween={30}
                      modules={[Autoplay]}
                      loop={data.length > 0}
                      autoplay={{delay: 2100, disableOnInteraction: false,}}
                      breakpoints={{
                        320: { slidesPerView: 1 },
                        640: { slidesPerView: 3 },
                        1024: { slidesPerView: 5 },
                      }}
                    >
                {data.map((item: CategoryDataItem,index:number)=>{
                    let Icon = item.icon
                    return(
                        <SwiperSlide className="singleCategory" key={index}>
                            <div className="category-small-wrapper light">
                                <Link href="#" className="categoryBox">
                                    <div className="categoryCapstions">
                                        <div className="catsIcons"><div className="icoBoxx"><Icon /></div></div>
                                        <div className="catsTitle"><h5>{item.title}</h5></div>
                                        <div className="CatsLists"><span className="categorycounter">{item.list}</span></div>
                                    </div>
                                </Link>
                            </div>	
                        </SwiperSlide>
                    )
                })}
                
            </Swiper>
        </div>
    </div>
  )
}
