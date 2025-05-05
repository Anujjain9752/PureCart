import React from 'react'
import MainBanner from '../components/MainBanner'
import Categoires from '../components/Categoires'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewsLetter'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div className='mt-10'>
      <MainBanner/>
      <Categoires/>
      <BestSeller/>
      <BottomBanner/>
      <NewsLetter/>
     
    </div>
  )
}

export default Home
