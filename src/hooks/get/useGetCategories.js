import axios from "axios"
import { useQuery } from "@tanstack/react-query"

export const useGetCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:4000/categories')
            return res.data
        }
    })
}