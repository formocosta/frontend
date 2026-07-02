import axios from 'axios'
import ENV from "./env.utils"

const apiClinet = axios.create({
    baseURL: ENV.BASE_URL_API,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default apiClinet