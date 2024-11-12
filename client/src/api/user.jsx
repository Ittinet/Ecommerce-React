import axios from 'axios'


export const createUserCart = async (token, cart) => {
    return axios.post('http://localhost:8000/api/user/cart', cart, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listUserCart = async (token) => {
    return axios.get('http://localhost:8000/api/user/cart', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const saveAddress = async (token, address) => {
    return axios.post('http://localhost:8000/api/user/address', { address }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

