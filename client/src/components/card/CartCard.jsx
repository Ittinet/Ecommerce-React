import React from 'react'
import { Trash2 } from 'lucide-react'
import useEcomStore from '../../store/ecom-store'
import { Link } from "react-router-dom"

const CartCard = () => {
    const actionRemoveProduct = useEcomStore((state) => state.actionRemoveProduct)
    const carts = useEcomStore((state) => state.carts)
    const actionUpdateQuantity = useEcomStore((state) => state.actionUpdateQuantity)
    const actionSumTotalPrice = useEcomStore((state) => state.actionSumTotalPrice)

    return (
        <div>
            <h1 className='text-2xl font-bold'>ตะกร้าสินค้า</h1>
            {/* Border */}
            <div className='border p-2 flex flex-col gap-5'>
                {/* Card */}
                {
                    carts.map((item, index) =>

                        <div className='bg-white p-2 shadow-md' key={index}>
                            {/* Row 1 */}
                            <div className='flex justify-between'>
                                {/* left */}
                                <div className='flex gap-2 justify-center items-center'>

                                    {
                                        item.images && item.images.length > 0
                                            ? <div className='bg-gray-200 w-16 h-16 rounded-md flex items-center justify-center text-center'>
                                                <img src={item.images[0].url} alt="" />

                                            </div>
                                            : <div className='bg-gray-200 w-16 h-16 rounded-md flex items-center justify-center text-center'>

                                            </div>
                                    }

                                    <div>
                                        <p className='text-xl font-bold'>{item.title}</p>
                                        <p className='text-sm'>{item.description}</p>
                                    </div>
                                </div>
                                {/* right */}
                                <div onClick={() => actionRemoveProduct(item.id)}>
                                    <Trash2 />
                                </div>
                            </div>
                            {/* Row 2 */}
                            <div className='flex justify-between mt-2'>
                                {/* left */}
                                <div className='flex border p-1 rounded-md'>
                                    <button className='bg-gray-200 w-6 rounded-md' onClick={() => actionUpdateQuantity(item.id, item.count - 1)}>-</button>
                                    <span className='w-10 text-center text'>{item.count}</span>
                                    <button className='bg-gray-200 w-6 rounded-md' onClick={() => actionUpdateQuantity(item.id, item.count + 1)}>+</button>
                                </div>
                                {/* right */}
                                <div>
                                    <p>{item.price * item.count}</p>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Total */}
                <div className='flex justify-between px-1'>
                    <span>รวม</span>
                    <span>{actionSumTotalPrice()}</span>
                </div>
                <div>
                    <Link to="/cart">
                        <button className='w-full bg-green-500 rounded-md py-2 text-white hover:bg-green-600'>ดำเนินการชำระเงิน</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default CartCard