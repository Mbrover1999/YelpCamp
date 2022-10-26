const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')
const CampgroundSchema = new Schema(
    {
        title: String,
        price: Number,
        image: String,
        description: String,
        location: String,
        author:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Review'
            }
        ]
    }
);


CampgroundSchema.post('findOneAndDelete', async function(doc) {
   if(doc){
        await Review.deleteMany({
            _id : {
                $in: doc.reviews
            }
        });
   }
});

module.exports = mongoose.model('Campground', CampgroundSchema);





// main().catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://localhost:27017/');
//   console.log("Connection with mangoose made");
  
// };


