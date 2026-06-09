import React from 'react'
import './MyPage.css'
import ProfileBanner from '../component/ProfileBanner'
import InfoCard from '../component/InfoCard'
import IconGrid from '../component/IconGrid'
import BannerAd from '../component/BannerAd'
import GiftCardCarousel from '../component/GiftCardCarousel'
import OrdersPreview from '../component/OrdersPreview'

export default function MyPage() {
  return (
    <div className="my-page-root">
      <ProfileBanner />
      <div className="my-page-inner">
        <InfoCard />
        <IconGrid />
        <BannerAd />

        <div className="section-title">送礼品卡</div>
        <GiftCardCarousel />

        <OrdersPreview />
      </div>
    </div>
  )
}
