import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Register = () => {
  //Javascript
  const [form, setform] = useState({
    email: "",
    password: "",
    confirmpassword: "",
  })

  const handlechange = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmpassword) {
      return toast.error('Confirm Password is not match !!')
    }
    console.log(form)

    // Send to Backend
    try {
      const res = await axios.post('http://localhost:8000/api/register', form)
      toast.success(res.data.message)
    } catch (error) {
      if (error.response) {
        const errMsg = error.response?.data?.message || 'เกิดข้อผิดพลาดบางอย่างที่ไม่คาดคิด!!'
        toast.error(errMsg)
        console.log(errMsg)
      } else {
        console.log(error.message)
      }
    }
  }

  return (
    <div className='mt-20'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col max-w-2xl mx-auto gap-3 bg-pink-100 p-5'>
          <div><img src='' alt="" /></div>
          <p className='mx-auto font-bold text-xl'>Register</p>

          Email
          <input type="email" name='email' className='border' onChange={handlechange} />

          Password
          <input type="password" name='password' className='border' onChange={handlechange} />

          ConfirmPassword
          <input type="password" name='confirmpassword' className='border' onChange={handlechange} />

          <button className='bg-gray-300 rounded-md p-1 max-w-xs w-full mx-auto mt-5' type='submit'>Submit</button>
        </div>
      </form>
    </div>
  )
}

export default Register