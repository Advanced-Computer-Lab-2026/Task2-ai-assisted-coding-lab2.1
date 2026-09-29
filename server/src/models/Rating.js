import mongoose from 'mongoose';

// TODO: define the Rating schema per README.md section 1.

const ratingSchema = new mongoose.Schema(
  {
    "bookCode" : {type : String,required: true , unique:true},
    "rating" : {type:number , required : true},
    "note" : {type:String,required : false},
    "rateBy" : {type:String,required:false,unique:true}
  },
  { timestamps: true }
);

// TODO: add the compound uniqueness constraint described in README.md section 1.

export const Rating = mongoose.model('Rating', ratingSchema);
