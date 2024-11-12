import { useState, useEffect } from 'react'
import { listUserCart, saveAddress } from '../../api/user';
import useEcomStore from '../../store/ecom-store';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';

const SummaryCard = () => {
    const token = useEcomStore((state) => state.token)
    const [products, setProducts] = useState([]);
    const [cartTotal, setCatTotal] = useState(0)

    const [address, setAddress] = useState('')
    const [addressSaved, setAddressSaved] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        handleGetUserCart()
    }, [])

    const handleGetUserCart = () => {
        listUserCart(token)
            .then((res) => {
                console.log(res)
                setProducts(res.data.products)
                setCatTotal(res.data.cartTotal)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleSaveAddress = () => {
        if (!address) {
            return toast.warning('กรุณาใส่ที่อยู่สำหรับจัดส่ง')
        }
        saveAddress(token, address)
            .then((res) => {
                console.log(res)
                toast.success('อัพเดทที่อยู่สำเร็จ!')
                setAddressSaved(true)
            })
            .catch((error) => {
                console.log(error)
            })

        console.log(products)
    }

    const handleGoToPayment = () => {
        if (!addressSaved) {
            return toast.error('กรุณาใส่ที่อยู่สำหรับจัดส่ง')
        } else {
            navigate('/user/payment')
        }
    }

    return (
        <div className='mx-auto'>
            <div className='flex gap-4'>
                {/* Left */}
                <div className='w-2/4'>
                    <div className='bg-gray-100 p-4 rounded-md border shadow-md space-y-2'>
                        <h1 className='font-bold text-lg'>ที่อยู่ในการจัดส่ง</h1>
                        <textarea onChange={(e) => setAddress(e.target.value)} className='w-full px-2' placeholder='กรุณากรอกที่อยู่' required></textarea>
                        <button onClick={handleSaveAddress} className='bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700'>Save Address</button>
                    </div>
                </div>

                {/* Right */}
                <div className='w-2/4'>
                    <div className='bg-gray-100 p-4 rounded-md border shadow-md space-y-4'>
                        <h1 className='text-lg font-bold'>คำสั่งซื้อของคุณ</h1>

                        {/* Item List */}
                        {
                            products?.map((item, index) =>
                                <div key={index}>
                                    <div className='flex justify-between items-end'>
                                        <div>
                                            <p className='font-bold'>{item.product.title}</p>
                                            <p className='text-sm'>จำนวน: {item.count} x {item.product.price}</p>
                                        </div>
                                        <div>
                                            <p className='text-red-500 font-bold'>{item.count * item.product.price}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }


                        <hr />

                        <div>
                            <div className='flex justify-between'>
                                <p>ค่าจัดส่ง:</p>
                                <p>0.00</p>
                            </div>
                            <div className='flex justify-between'>
                                <p>ส่วนลด:</p>
                                <p>0.00</p>
                            </div>
                        </div>

                        <hr />

                        <div>
                            <div className='flex justify-between'>
                                <p className='font-bold'>ยอดรวมสุทธิ:</p>
                                <p className='text-red-500 font-bold text-lg'>{cartTotal}</p>
                            </div>
                        </div>

                        <hr />

                        <div>
                            <button onClick={handleGoToPayment} className='bg-green-500 w-full p-2 rounded-md shadow-md text-white hover:bg-green-700'>ดำเนินการชำระเงิน</button>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
};
export default SummaryCard