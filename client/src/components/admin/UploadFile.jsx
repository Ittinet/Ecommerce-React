import { useState } from 'react'
import { toast } from 'react-toastify'
import Resize from 'react-image-file-resizer'
import { removeFiles, uploadFiles } from '../../api/product'
import useEcomStore from '../../store/ecom-store'
import { Loader } from 'lucide-react';
import { X } from 'lucide-react';


const UploadFile = ({ form, setForm }) => {

    const token = useEcomStore((state) => state.token)
    const [isLoading, setIsLoading] = useState(false)

    const handleOnChange = (e) => {
        setIsLoading(true)
        const files = e.target.files
        if (files) {
            setIsLoading(true)
            let allFiles = form.images
            for (let i = 0; i < files.length; i++) {
                const file = files[i]

                if (!file.type.startsWith('image/')) {
                    toast.error(`ไฟล์ "${file.name}" ไม่ใช่รูปภาพ !!`)
                    continue
                }

                // Image Resize
                Resize.imageFileResizer(
                    files[i],
                    720, //ความกว้าง
                    720, //ความสูง
                    "PNG",
                    100, //คุณภาพรูป-ภาพ
                    0,
                    (data) => {
                        //endpoint Backend
                        // console.log('data', data)
                        uploadFiles(token, data)
                            .then((res) => {
                                console.log(res)
                                allFiles.push(res.data)
                                setForm({
                                    ...form,
                                    images: allFiles

                                })
                                setIsLoading(false)
                                toast.success('Upload image Success!!')
                            })
                            .catch((error) => {
                                console.log(error)
                                setIsLoading(false)
                            })
                    }, "base64"
                )

            }
        }



    }
    // console.log('Form Images:', form.images);

    const handleDelete = (public_id) => {
        const images = form.images
        setIsLoading(true)
        removeFiles(token, public_id)
            .then((res) => {
                setIsLoading(true)
                console.log(res)
                const filterImages = images.filter((item, index) => {
                    return item.public_id !== public_id
                })
                console.log(filterImages)
                setIsLoading(false)
                toast.success(res.data.message)
                setForm({
                    ...form,
                    images: filterImages
                })
            })
            .catch((error) => {
                console.log(error)
                setIsLoading(false)
            })
    }


    return (
        <div>
            <div className='flex mx-4 gap-4 my-4 '>
                {
                    isLoading && <Loader className='w-15 h-15 animate-spin' />
                }

                {
                    form.images?.map((item, index) =>
                        <div key={index} className='relative max-w-40 max-h-40 '>
                            <img src={item.url} alt="" className='w-full h-full border object-cover hover:scale-105' />
                            <X onClick={() => handleDelete(item.public_id)} className='text-white absolute top-1 right-1 bg-red-600 p-0.5 rounded w-5 h-5' />
                        </div>
                    )

                }
            </div>


            <div>
                <input onChange={handleOnChange} type='file' name='images' multiple />
            </div>
        </div>
    )
}

export default UploadFile