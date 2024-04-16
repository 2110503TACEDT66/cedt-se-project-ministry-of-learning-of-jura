const discount = {
    _id:false,
    name:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    points: {
        type:Number,
        min: 1,
        max: 500,
        required:true
    },
    isValid: {
        type: Boolean
    }
}

module.exports = discount