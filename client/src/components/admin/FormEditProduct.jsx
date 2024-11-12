import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useEcomStore from '../../store/ecom-store'
import { readProduct, updateProduct } from '../../api/product'
import { toast } from 'react-toastify'
import UploadFile from './UploadFile'

const initialState = {
    title: "",
    description: "",
    price: 0,
    quantity: 0,
    categoryId: "",
    images: []
}

const FormEditPorduct = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const token = useEcomStore((state) => state.token)
    const getCategory = useEcomStore((state) => state.getCategory)
    const categories = useEcomStore((state) => state.categories)

    const [form, setForm] = useState(initialState)

    useEffect(() => {
        getCategory()
        fetchProduct(token, id)
    }, [])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const fetchProduct = async (token, id) => {
        try {
            const res = await readProduct(token, id)
            setForm({
                title: res.data.title,
                description: res.data.description,
                price: res.data.price,
                quantity: res.data.quantity,
                categoryId: res.data.categoryId,
                images: res.data.images

            })
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    const validateValue = () => {
        let notError = true

        if (!form.title) {
            toast.error('Please enter Title.')
            notError = false;
        }
        if (!form.price) {
            toast.error('Please enter Price.')
            notError = false;
        }
        if (!form.quantity) {
            toast.error('Please enter Quantity.')
            notError = false;
        }
        if (!form.categoryId) {
            toast.error('Please enter Category.')
            notError = false;
        }
        return notError;
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateValue()) {
            return;
        }
        try {
            const res = await updateProduct(token, id, form)
            toast.success(`Update Complete for ${res.data.title}`)
            navigate('/admin/product')
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className='container bg-white p-4 mx-auto shadow-md'>
            <form onSubmit={handleSubmit}>
                <h1>เพิ่มข้อมูลสินค้า</h1>
                <input className='border' type='text' name='title' placeholder='title' value={form.title} onChange={handleChange} />
                <input className='border' type='text' name='description' placeholder='description' value={form.description} onChange={handleChange} />
                <input className='border' type='number' name='price' placeholder='price' value={form.price} onChange={handleChange} />
                <input className='border' type='number' name='quantity' placeholder='quantity' value={form.quantity} onChange={handleChange} />
                <select className='border' name='categoryId' value={form.categoryId} onChange={handleChange}>
                    <option value="" >Please Select</option>
                    {
                        categories.map((item, index) =>
                            <option key={index} value={item.id}>{item.name}</option>
                        )
                    }

                </select>
                <UploadFile form={form} setForm={setForm} />
                <button className='bg-blue-500 p-1'>เพิ่มสินค้า</button>
            </form>
            <hr />
            <br />
        </div>
    )
}

export default FormEditPorduct