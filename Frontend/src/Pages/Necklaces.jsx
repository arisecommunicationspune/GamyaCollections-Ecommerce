import Banner from '@/components/Banner'
import ProductGrid from '@/components/ProductGrid'
import ProductDetail from '@/components/ProductDetail'

import React from 'react'
import { useParams } from 'react-router-dom'

import gif from '/assets/Images/banner/necklace1.png'

export default function Necklaces() {
  const { id } = useParams()
  
const Necklaces = () => {
  
  return (
    <div className="overflow-hidden">
      {/* Full-width banner */}
      <div className="container-fluid">
        <Banner src={gif} title="Necklaces" />
      </div>

      {/* Max-width content */}
      <div className="max-w-[1550px] mx-auto">
        <ProductDetail productId={Number(id)} />
      </div>
    </div>
  );
};

}
