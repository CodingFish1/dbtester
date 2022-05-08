const http = require('http')
const Room = require('./room.js')
const mongoose = require('mongoose')

const dotenv = require('dotenv')
dotenv.config({path:"./config.env"})

// 使用環境變數管理機密資料，並帶入mongoose.connect
const DB = process.env.DB.replace(
    '<password>',
    process.env.PWD
)

// Connect to DB by Mongoose
mongoose.connect(DB)
        .then(() => {
            console.log('Connected to the DB...')
        })
        .catch((err) => {
            console.log(err);
        })

// // Setup a schema
// const roomSchema = {
//     name:String,
//     price: {
//         type:Number,
//         required: [true,"Don't leave it empty"]
//     },
//     rating: Number
// }
// // Setup a schema with default option
// const roomSchemaB = new mongoose.Schema (
//     {
//         name:String,
//         price: {
//             type:Number,
//             required: [true,"Don't leave it empty"]
//         },
//         rating: Number,
//         createdAt: { // 自定义时间戳格式，这是只要createdAt而不要updatedAt的设置
//             type: Date,
//             default: Date.now, // 如果没有传入时间，则使用当前时间
//             select: false //若前台使用find()，不会回传显示，保密资料
//         },
//     },
//     {//下面是default option
//         versionKey: false, // 不加versionKey
//         // collection: 'room' // 自定collection名称，不受model自动更名影响，不过建议DB名称加s以区分instance
//         timestamps:false //创建和修改资料时加入时间戳。若有自定义时间戳，要将此处设为false
//     }
// )

// // Model for schema
// // 如果Schema不做设定，则Collection的命名会自动：大写转小写且结尾加s，“Room”的例子就是rooms
// const Room = mongoose.model('Room',roomSchemaB)

// //Add information, add a new instance regularied by  the schema and model
// // const testRoom = new Room (
// //     {
// //         name: "Kitty room",
// //         price: 2100,
// //         rating: 4.5
// //     }
// // )
// // 首先new出一个实例，然后用save储存
// //  testRoom.save()
// //     .then(() => {
// //         console.log('Success add a new recording')
// //     })
// //     .catch(error => {
// //         console.log(error)
// //     })

// 新增资料的第二种方式
Room.create(
    {
        name: "ABC room",
        price: 2100,
        rating: 4.5
    }
    ).then (() => {
        console.log('第二种方式资料写入成功')
    }
    ).catch(() => {
        console.log('失败了')
    })








const requestListener = async (req, res) => {
// Receive data remotely
    let body = ''
    req.on('data', chunk => {
    body += chunk
})

    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
       'Content-Type': 'application/json'
     }
    if(req.url==="/rooms" && req.method === "GET") {
        const rooms = await Room.find() //非同步，等到數據庫結果，await和async（上層）搭配使用的（成對出現）
        res.writeHead(200,headers)
        res.write(JSON.stringify ({
            "status":"success",
            rooms
        }))
        res.end()
    } else if (req.url = '/room' && req.method === 'POST') { // POST方式
        req.on('end', async()=>{
            try {
                const data = JSON.parse(body)
                console.log(data)
                const newRoom = await Room.create( // 往數據庫寫入資料，這裏加await之後，上一層必須要加async
                //mongoose的create相當於insertOne
                    {
                        name: data.name,
                        price: data.price,
                        rating: data.rating
                    },
                    // ).then (() => {
                    //     console.log('數據庫寫入成功')
                    // }
                    // ).catch(() => {
                    //     console.log('數據庫寫入失败了')
                    // }
                    )
                res.writeHead(200,headers)
                res.write(JSON.stringify ({
                    "status":"success",
                    rooms:newRoom
                }))
                res.end()
            } catch (error) {
                res.writeHead(400,headers)
                res.write(JSON.stringify ({
                    "status":"false",
                    "message":"欄位錯誤",
                    "錯誤詳情":error
                }))
                res.end()
            }
        })
    } else if (req.url="/rooms" && req.method ==="DELETE") {
        const rooms = await Room.deleteMany({})
        res.writeHead(200,headers)
        res.write(JSON.stringify({
            "status":"delete success",
            room:[] //回傳空陣列防止前端看到刪除訊息
        }))
        res.end()
    }
} 

const server = http.createServer(requestListener)
server.listen(process.env.PORT) // 使用環境變數
console.log('Running')