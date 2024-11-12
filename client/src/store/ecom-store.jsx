import axios from 'axios'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { listCategory } from '../api/Category'
import { listProduct, searchFilters } from '../api/product'
import _ from 'lodash'
const ecomStore = (set, get) => ({
    user: null,
    token: null,
    categories: [],
    products: [],
    carts: [],
    actionAddtoCart: async (product) => {
        const carts = get().carts
        const updateCart = [...carts, { ...product, count: 1 }]

        //Step Uniqe
        const uniqe = _.unionWith(updateCart, _.isEqual)

        set({ carts: uniqe })


    },

    actionUpdateQuantity: (productId, newQuantity) => {
        // console.log('Update clickk', productId, newQuantity)
        set((state) => ({
            carts: state.carts.map((item) =>
                item.id === productId
                    ? { ...item, count: Math.max(1, newQuantity) }
                    : item
            )
        }))
    },

    actionRemoveProduct: (productId) => {
        console.log('remove', productId)
        set((state)=>({
            carts: state.carts.filter((item)=>
                item.id !== productId
            )
        }))
    },
    actionSumTotalPrice: () => {
        return get().carts.reduce((total, item) => {
            return total + item.price * item.count
        }, 0)
    },



    actionLogin: async (form) => {
        const res = await axios.post('http://localhost:8000/api/login', form)
        set({
            user: res.data.payload,
            token: res.data.token
        })
        return res
    },
    getCategory: async () => {
        try {
            const res = await listCategory()
            set({ categories: res.data })
        } catch (error) {
            console.log(error)
        }
    },
    getProduct: async (count) => {
        try {
            const res = await listProduct(count)
            set({ products: res.data })
        } catch (error) {
            console.log(error)
        }
    },
    actionSearchFilters: async (arg) => {
        try {
            const res = await searchFilters(arg)
            set({ products: res.data })
        } catch (error) {
            console.log(error)
        }
    }
})

const userPersist = {
    name: 'ecom-store',
    storage: createJSONStorage(() => localStorage)
}

const useEcomStore = create(persist(ecomStore, userPersist))

export default useEcomStore

