import axios from 'axios'

export default function({ route }) {
    console.log("进入中间件，是不是扯卵蛋")
    return "xxx"
        // return axios.post('http://my-stats-api.com', {
        //     url: route.fullPath
        // })
}