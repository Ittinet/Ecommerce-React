import { useEffect, useState } from 'react'
import useEcomStore from '../../store/ecom-store'
import { createProduct, deleteProduct } from '../../api/product'
import { toast } from 'react-toastify'
import UploadFile from './UploadFile'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const initialState = {
    title: "",
    description: "",
    price: 0,
    quantity: 0,
    categoryId: "",
    images: []
}

const FormPorduct = () => {
    const token = useEcomStore((state) => state.token)
    const getCategory = useEcomStore((state) => state.getCategory)
    const categories = useEcomStore((state) => state.categories)
    const getProduct = useEcomStore((state) => state.getProduct)
    const Products = useEcomStore((state) => state.products)
    // console.log(Products)
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: 0,
        quantity: 0,
        categoryId: "",
        images: []
    })

    useEffect(() => {
        getCategory()
        getProduct(100)
    }, [])
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
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
            const res = await createProduct(token, form)
            toast.success(`Add Complete for ${res.data.title}`)
            setForm(initialState)
            getProduct()
            console.log(res)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async (id, productName) => {
        try {
            const ShowAlert = await MySwal.fire({
                title: <strong>คำเตือน!</strong>,
                html: <p>คุณต้องการที่จะลบ <strong>{productName}</strong> จริงๆใช่หรือไม่ ?</p>,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'ตกลง',
                cancelButtonText: 'ยกเลิก'
            })
            if (ShowAlert.isConfirmed) {
                const res = await deleteProduct(token, id);
                console.log(res)
                await MySwal.fire({
                    title: 'สำเร็จ!',
                    text: 'ลบสินค้าสำเร็จ!',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                toast.success('Deleted สินค้าเรียบร้อยแล้ว!!')
                getProduct()
            }
        } catch (error) {
            console.log(error)
            toast.error('เกิดข้อผิดพลาดในการลบสินค้า!');
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
                <button className='bg-blue-500 p-1 hover:scale-102 hover:-translate-y-2 hover:duration-100'>เพิ่มสินค้า</button>
            </form>
            <hr />
            <br />
            <table className="table w-full">
                <thead>
                    <tr>
                        <th scope="col" className="px-4 py-2 text-center">No.</th>
                        <th scope="col" className="px-4 py-2 text-center">รูปภาพ</th>
                        <th scope="col" className="px-4 py-2 text-center">ชื่อสินค้า</th>
                        <th scope="col" className="px-4 py-2 text-center">รายระเอียด</th>
                        <th scope="col" className="px-4 py-2 text-center">ราคา</th>
                        <th scope="col" className="px-4 py-2 text-center">จำนวน</th>
                        <th scope="col" className="px-4 py-2 text-center">จำนวนที่ขายได้</th>

                        <th scope="col" className="px-4 py-2 text-center">วันที่อัพเดท</th>
                        <th scope="col" className="px-4 py-2 text-center">จัดการ</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        Products.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row" >{index + 1}</th>
                                    <td className="px-4 py-2 text-center w-24">
                                        {
                                            Array.isArray(item.images) && item.images.length > 0 ? (   //ตรวจสอบว่าเป็น Array ไหม
                                                item.images.map((item, index) => {
                                                    return <div key={index}>
                                                        <img src={item.url} alt="Not Read" className='' />
                                                    </div>;
                                                })
                                            ) : (
                                                <div className=' flex bg-gray-200 w-24 h-24 rounded-lg text-sm items-center justify-center'>No images</div>
                                            )
                                        }
                                    </td>
                                    <td className="px-4 py-2 text-center">{item.title}</td>
                                    <td className="px-4 py-2 text-center">{item.description}</td>
                                    <td className="px-4 py-2 text-center">{item.price}</td>
                                    <td className="px-4 py-2 text-center">{item.quantity}</td>
                                    <td className="px-4 py-2 text-center">{item.sold}</td>
                                    <td className="px-4 py-2 text-center">{item.updatedAt}</td>
                                    <td className="px-4 py-2 text-center">
                                        <p><Link to={`/admin/product/${item.id}`}>แก้ไข</Link></p>
                                        <p onClick={() => handleDelete(item.id, item.title)}>ลบ</p>
                                    </td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>
        </div>
    )
}

export default FormPorduct