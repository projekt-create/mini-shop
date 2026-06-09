import axios from "axios"
import { useQuery } from "@tanstack/react-query"

export const useGetUsers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:4000/users')
            return res.data
        }
    })
}
