const mongoose = require("mongoose") // 因爲每個檔案是獨立的，因此需要重新載入mongoose

// Setup a schema
const roomSchema = {
    name:String,
    price: {
        type:Number,
        required: [true,"Don't leave it empty"]
    },
    rating: Number
}
// Setup a schema with default option
const roomSchemaB = new mongoose.Schema (
    {
        name:String,
        price: {
            type:Number,
            required: [true,"Don't leave it empty"]
        },
        rating: Number,
        createdAt: { // 自定义时间戳格式，这是只要createdAt而不要updatedAt的设置
            type: Date,
            default: Date.now, // 如果没有传入时间，则使用当前时间
            select: false //若前台使用find()，不会回传显示，保密资料。有些資料沒有必要給前前台，以免被爬走
        },
    },
    {//下面是default option
        versionKey: false, // 不加versionKey
        // collection: 'room' // 自定collection名称，不受model自动更名影响，不过建议DB名称加s以区分instance
        timestamps:false //创建和修改资料时加入时间戳。若有自定义时间戳，要将此处设为false
    }
)

// 下面是Model，model由schema（相當於資料的守門員）和collection（資料本身）組成。Model設計好之後，我們就能用Model開資料
// 如果Schema不做设定，则Collection的命名会自动：大写转小写且结尾加s，比如“Room”的變成rooms
const Room = mongoose.model('Room',roomSchemaB)

//Add information, add a new instance regularied by  the schema and model
// const testRoom = new Room (
//     {
//         name: "Kitty room",
//         price: 2100,
//         rating: 4.5
//     }
// )
// 首先new出一个实例，然后用save储存
//  testRoom.save()
//     .then(() => {
//         console.log('Success add a new recording')
//     })
//     .catch(error => {
//         console.log(error)
//     })

module.exports = Room // 導出才能用