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
        createdAt: {
            type: Date,
            default: Date.now,
            select: false
        },
    },
    {//下面是default option
        versionKey: false,
        timestamps:false
    }
)

const Room = mongoose.model('Room',roomSchemaB)

module.exports = Room // 導出才能用