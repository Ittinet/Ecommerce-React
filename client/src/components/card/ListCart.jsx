import React from 'react'
import { ListCheck } from 'lucide-react'
import useEcomStore from '../../store/ecom-store'
import { Link, useNavigate } from 'react-router-dom'
import { createUserCart } from '../../api/user'
import { toast } from 'react-toastify'
const ListCart = () => {
    const token = useEcomStore((state) => state.token)
    const cart = useEcomStore((state) => state.carts)
    const actionSumTotalPrice = useEcomStore((state) => state.actionSumTotalPrice)
    const user = useEcomStore((state) => state.user)

    const navigate = useNavigate()

    const handleSaveCart = async () => {
        await createUserCart(token, { cart })
            .then((res) => {
                console.log(res)
                toast.success('บันทึกใส่ตะกร้าเรียบร้อย')
                navigate('/checkout')
            })
            .catch((error) => {
                console.log(error)
            })
    }


    console.log(user)
    return (
        <div className='bg-gray-200 p-3 w-full'>
            {/* Header */}
            <div className='flex gap-4'>
                <ListCheck size={36} />
                <p className='text-xl font-bold'>รายการสินค้า {cart.length} รายการ</p>
            </div>
            {/* List */}
            <div className='grid lg:grid-cols-3 gap-4'>
                {/* Left */}
                <div className='flex flex-col gap-3 lg:col-span-2'>
                    {/* Card */}
                    {
                        cart.map((item, index) =>

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
                                            <p className='text-sm'>{item.price} x {item.count}</p>
                                        </div>
                                    </div>
                                    {/* right */}
                                    <div>
                                        <div>
                                            <p>{item.price * item.count}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>

                {/* Right */}
                <div className='bg-white p-3 rounded-md space-y-4 w-full col-span-1 h-52'>
                    <p className='text-2xl font-bold'>ยอดรวม</p>
                    <div className='flex justify-between'>
                        <p>รวมสุทธิ</p>
                        <p>{actionSumTotalPrice()}</p>
                    </div>
                    <div className='flex flex-col gap-3'>
                        {
                            user
                                ? <Link>
                                    <button onClick={handleSaveCart} className='bg-red-500 w-full py-2 rounded-md text-white shadow-md hover:bg-red-700'>สั้งซื้อ</button>
                                </Link>
                                : <Link to={'/login'}>
                                    <button className='bg-blue-500 w-full py-2 rounded-md text-white shadow-md hover:bg-blue-700'>Login</button>
                                </Link>
                        }


                        <Link to={'/shop'}>
                            <button className='bg-gray-500 w-full py-2 rounded-md text-white shadow-md hover:bg-gray-700'>แก้ไขรายการสินค้า</button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListCart