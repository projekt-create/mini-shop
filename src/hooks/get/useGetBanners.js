import axios from "axios"
import { useQuery } from "@tanstack/react-query"

export const useGetBaners = () => {
    return useQuery({
        queryKey: ['baners'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:4000/banners')
            return res.data
        }
    })
}