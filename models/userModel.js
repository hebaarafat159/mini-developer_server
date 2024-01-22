import 'dotenv/config';
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    name:{type: String, required: true},
    email:{type: String, required: true},
    lastLoggedinTime:
    {
      type: Number, 
      required: true ,
      default: function(){
        return new Date().getTime();
      }
    } 
},{
    timestamp: true
});
 
export default mongoose.model('customers', userSchema);