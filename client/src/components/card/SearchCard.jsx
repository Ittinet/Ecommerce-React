import { useEffect, useState } from 'react'
import useEcomStore from '../../store/ecom-store'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const SearchCard = () => {
    const getProduct = useEcomStore((state) => state.getProduct)
    const products = useEcomStore((state) => state.products)
    const actionSearchFilters = useEcomStore((state) => state.actionSearchFilters)
    

    const getCategory = useEcomStore((state) => state.getCategory)
    const categorise = useEcomStore((state) => state.categories)

    const [text, setText] = useState('')
    const [categorySelected, setCategorySelected] = useState([])

    const [pricebefore, setPriceBefore] = useState([0, 100000])
    const [price, setPrice] = useState([0, 100000])
    const [ok, setOk] = useState(false)

    useEffect(() => {
        getCategory()
    }, [])


    //Step 1 Search โดย Text

    useEffect(() => {
        const delay = setTimeout(() => {
            if (text.trim()) {
                actionSearchFilters({ query: text })
            } else {
                getProduct()
            }
        }, 300)
        return () => clearTimeout(delay)
    }, [text])

    //Step 2 Search by Category
    const handleCheck = (e) => {
        const inCheck = e.target.value
        const inState = [...categorySelected]
        const findCheck = inState.indexOf(inCheck)

        if (findCheck === -1) {
            inState.push(inCheck)
        } else {
            inState.splice(findCheck, 1)
        }
        setCategorySelected(inState)
        if (inState.length > 0) {
            actionSearchFilters({ category: inState })
        } else {
            getProduct()
        }

    }
    // console.log(categorySelected)

    //Step 3 Search by Price
    useEffect(() => {
        actionSearchFilters({ price: price })
    }, [ok, price])

    const handlePrice = (value) => {
        setPrice(value)
        setTimeout(() => {
            setOk(!ok)
        }, 300)
        // console.log(value)
    }




    //ตรวจสอบค่าใน input Onchange
    const handlePriceInput = (index) => (e) => {
        const value = e.target.value
        const PriceState = [...pricebefore]
        if (value === '') {
            PriceState[index] = ''
        } else if (isNaN(value)) {
            PriceState[index] = Number(0)
        } else {
            PriceState[index] = Number(value);
        }
        setPriceBefore(PriceState)


    }
    //ตรวจสอบค่าใน input OnBlur
    const confirmPriceInput = () => {
        const newPrice = [
            pricebefore[0] === '' ? 0 : Number(pricebefore[0]),
            pricebefore[1] === '' ? 100000 : Number(pricebefore[1]),
        ];
        setPrice(newPrice)
        setPriceBefore(newPrice)
    }
    // console.log(price)
    // console.log('pricebefore', pricebefore)

    return (
        <div>


            <h1 className='text-xl font-bold mb-4'>ค้นหาสินค้า</h1>

            {/* Search by text */}
            <input type='text' onChange={(e) => setText(e.target.value)} placeholder='ค้นหาสินค้า....' className='border rounded-md w-full mb-4 px-2' />
            <hr />

            {/* Search by Category */}
            <div>
                <h1 className='text-xl font-bold'>หมวดหมู่สินค้า</h1>
                <div className='mt-2'>
                    {
                        categorise.map((item, index) =>
                            <div key={index} className='flex gap-2'>
                                <input value={parseInt(item.id, 10)} type="checkbox" onChange={handleCheck} />
                                <label>{item.name}</label>
                            </div>
                        )
                    }
                </div>
            </div>
            <hr />
            {/* Search by Price */}
            <div>
                <h1>ค้นหาราคา</h1>
                <div>
                    <div className='flex justify-between'>
                        <span>Min : <input onChange={handlePriceInput(0)} onBlur={confirmPriceInput} type="text" value={pricebefore[0]} className='w-20 px-2' /></span>
                        <span>Max : <input onChange={handlePriceInput(1)} onBlur={confirmPriceInput} type="text" value={pricebefore[1]} className='w-20 px-2' /></span>
                    </div>
                    <Slider onChange={handlePrice} range min={0} max={100000} value={price} />
                </div>
            </div>

        </div>
    )
}

export default SearchCard