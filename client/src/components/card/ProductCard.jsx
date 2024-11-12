import { ShoppingCart } from 'lucide-react';
import useEcomStore from '../../store/ecom-store';

const ProductCard = ({ item }) => {


    const actionAddtoCart = useEcomStore((state) => state.actionAddtoCart)
    return (
        <div className='border rounded-md shadow-md p-2 w-56 '>
            <div className='object-cover h-40 p-2 hover:scale-110 hover:duration-300'>
                {
                    item.images && item.images.length > 0 ? (
                        <img src={item.images[0].url} alt="" className='w-full object-cover h-full' />
                    ) : (
                        <div className='w-full bg-gray-100 h-full rounded-md flex text-center items-center justify-center shadow-md'>
                            No image
                        </div>
                    )
                }

            </div>

            <div className='py-2'>
                <p className='text-xl font-bold'>{item.title}</p>
                <p className='text-sm text-gray-500'>{item.description}</p>
            </div>

            <div className='flex justify-between items-center'>
                <span className='text-md font-bold'>{item.price}</span>
                <button className='bg-blue-500 rounded-md p-1 hover:bg-blue-800' onClick={() => actionAddtoCart(item)}><ShoppingCart /></button>
            </div>
        </div>
    )
}

export default ProductCard