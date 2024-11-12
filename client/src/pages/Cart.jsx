import React from 'react'
import ListCart from '../components/card/ListCart'

const Cart = () => {
  return (
    <div className='w-full flex items-center justify-center'>
      <div className='w-3/4 flex bg-red-100'>
        <ListCart />
      </div>
    </div>
  )
}

export default Cart