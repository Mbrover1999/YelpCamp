const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CampgroundSchema = new Schema(
    {
        title: String,
        price: String,
        image: String,
        description: String,
        location: String
    }
);
module.exports = mongoose.model('Campground', CampgroundSchema);




// main().catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://localhost:27017/');
//   console.log("Connection with mangoose made");
  
// };


