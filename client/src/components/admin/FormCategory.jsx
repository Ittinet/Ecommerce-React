import { useState, useEffect } from 'react'
import { createCategory, removeCategory } from '../../api/Category'
import useEcomStore from '../../store/ecom-store'
import { toast } from 'react-toastify';


const FormCategory = () => {
    const token = useEcomStore((state) => state.token)
    const [name, setName] = useState('')
    // const [category, setCategory] = useState([])
    const categories = useEcomStore((state) => state.categories)
    const getCategory = useEcomStore((state) => state.getCategory)
    useEffect(() => {
        getCategory(token)
    }, [])




    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name) {
            return toast.warning('Please fill data')
        }
        try {
            const res = await createCategory(token, { name })
            getCategory(token)
            toast.success(`Add ${res.data.name} Success!!`)
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    const removebutton = async (id) => {
        try {
            const res = await removeCategory(token, id)
            toast.success(`Deleted ${res.data.name} Success!!`)
            getCategory(token)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='container bg-white p-4 mx-auto shadow-md'>
            <h1>Category Management</h1>
            <form className='my-5 flex items-center' onSubmit={handleSubmit}>
                <div className='flex h-full mr-5'>
                    <input type="text" className='border max-w-sm w-full h-8' onChange={(e) => setName(e.target.value)} />
                </div>
                <button className='bg-blue-400 p-1 max-w-40 text-sm rounded'>Add Category</button>
            </form>
            <hr />
            <ul>
                {
                    categories.map((item, index) => (
                        <li key={index} className='flex justify-between my-4'>
                            <div className='flex justify-between'>
                                <span className='mr-20 w-5'>{item.id}</span>
                                <span>{item.name}</span>
                            </div>
                            <button onClick={() => removebutton(item.id)} className='bg-red-400 p-1 text-sm'>Delete</button></li>
                    ))
                }
            </ul>
        </div>
    )
}




































// const FormCategory = () => {
//     const token = useEcomStore((state) => state.token)
//     const [name, setName] = useState('')
//     const [category, setCategory] = useState([])

//     useEffect(() => {
//         getCategory(token)
//     }, [])

//     const getCategory = async (token) => {
//         try {
//             const res = await listCategory(token)
//             setCategory(res.data)
//         } catch (error) {
//             console.log(error)
//         }
//     }


//     const handleSubmit = async (e) => {
//         e.preventDefault()
//         if (!name) {
//             return toast.warning('Please fill data')
//         }
//         try {
//             const res = await createCategory(token, { name })
//             console.log(res.data.name)
//             toast.success(`Add Category ${res.data.name} success!!!`)
//             getCategory(token)
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const handleRemove = async (id) => {
//         console.log(id)
//         try {
//             const res = await removeCategory(token, id)
//             console.log(res)
//             toast.success(`Deleted ${res.data.name} success`)
//             getCategory(token)
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     return (
//         <div className='container mx-auto p-4 bg-white shadow-md'>
//             <h1>Category Management</h1>
//             <form className='my-4' onSubmit={handleSubmit}>
//                 <input onChange={(e) => setName(e.target.value)} type="text" className='border' />
//                 <button className='bg-green-400 p-1'>Add Category</button>
//             </form>
//             <hr />

//             <ul className=''>
//                 {
//                     category.map((item, index) =>
//                         <li key={index} className='flex justify-between my-2'>
//                             <div className='flex gap-5'><span>{item.id}</span><span>{item.name}</span></div>
//                             <button className='bg-red-600 p-1' onClick={() => handleRemove(item.id)}>Delete</button>
//                         </li>
//                     )
//                 }


//             </ul>

//         </div>
//     )
// }

export default FormCategory