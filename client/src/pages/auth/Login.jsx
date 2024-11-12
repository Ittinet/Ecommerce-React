import { useState } from 'react';
import { toast } from 'react-toastify';
import useEcomStore from '../../store/ecom-store';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  //Javascript
  const navigate = useNavigate()
  const actionLogin = useEcomStore((state) => state.actionLogin)
  // console.log(user)
  const [form, setform] = useState({
    email: "",
    password: "",
  })

  const handlechange = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await actionLogin(form)
      console.log('res', res)
      const role = res.data.payload.role
      console.log('role', role)
      roleRedirect(role)
      toast.success('Welcome Back')
    } catch (error) {
      console.log(error)
      const errMsg = error.response?.data?.message;
      toast.error(errMsg)
    }
  }

  const roleRedirect = (role) => {
    if (role === 'admin') {
      navigate('/admin')
    } else {
      navigate(-1)
    }
  }

  return (
    <div className='mt-20'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col max-w-2xl mx-auto gap-3 bg-pink-100 p-5'>
          <div><img src='' alt="" /></div>
          <p className='mx-auto font-bold text-xl'>Login</p>

          Email
          <input type="email" name='email' className='border' onChange={handlechange} />

          Password
          <input type="password" name='password' className='border' onChange={handlechange} />

          <button className='bg-gray-300 rounded-md p-1 max-w-xs w-full mx-auto mt-5' type='submit'>Submit</button>
        </div>
      </form>
    </div>
  )
}

export default Login