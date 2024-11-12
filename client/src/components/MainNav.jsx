import { Link } from 'react-router-dom'
import useEcomStore from '../store/ecom-store'
import { ShoppingCart } from 'lucide-react';

const MainNav = () => {
    const carts = useEcomStore((state) => state.carts)
    return (
        <nav className='bg-purple-100'>
            <div className='mx-auto px-4'>
                <div className='flex justify-between h-16'>
                    <div className='flex items-center gap-5'>
                        <Link to={'/'} className='text-2xl font-bold'>LOGO</Link>
                        <Link to={'/'}>Home</Link>
                        <Link to={'shop'}>Shop</Link>
                        {/* Badge */}
                        <Link to={'cart'} className='relative py-2'>
                            Cart
                            {
                                carts.length > 0 && (<span className='absolute bottom-5 left-4'>
                                    <p className='absolute bottom-1 left-3 bg-red-600 rounded-full w-3 h-3 text-xs text-white flex items-center 
                                    justify-center p-2 border border-white' >{carts.length}</p>
        
                                    </span>)
                            }
                            
                        </Link>
                    </div>

                    <div className='flex items-center gap-5'>
                        <Link to={'register'}>Register</Link>
                        <Link to={'login'}>Login</Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default MainNav


    // < div className = 'relative' >
    //     <ShoppingCart size={17} />
    //          <p className='absolute bottom-1 left-3 bg-red-600 rounded-full w-3 h-3 text-xs text-white flex items-center 
    //     justify-center p-2 border border-white' >2</p>
    // </ >