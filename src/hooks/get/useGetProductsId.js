import axios from "axios"
import { useQuery } from "@tanstack/react-query"

export const useGetProductsId = (id) => {
    return useQuery({
        queryKey: ['productsId'],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:4000/products/${id}`)
            return res.data
        }
    })
}