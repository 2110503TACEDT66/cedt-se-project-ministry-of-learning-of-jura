import { prop } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";

class Discount{
    public _id!: ObjectId

    @prop({
        required: true
    })
    public name!: string

    @prop({
        required: true
    })
    public description!: string

    @prop({
        required:true
    })
    public points!: number

    @prop({
        required:true
    })
    public isValid!: boolean
}
// const discount = {
//     // _id:true,
//     name:{
//         type: String,
//         required:true
//     },
//     description:{
//         type: String,
//         required:true
//     },
//     points: {
//         type:Number,
//         min: 1,
//         max: 500,
//         required:true
//     },
//     isValid: {
//         type: Boolean
//     }
// }
export default Discount;