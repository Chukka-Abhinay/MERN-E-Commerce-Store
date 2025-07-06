import {fetchBaseQuery,createApi} from '@reduxjs/toolkit/query/react'
import { BASE_URL } from '../feature/constants'

const baseQuery = fetchBaseQuery({baseurl : BASE_URL})

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ["Product" , "Order" , "User" , "Category"],
    endpoints: () => ({}),
})