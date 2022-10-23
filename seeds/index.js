const mongoose = require('mongoose');

const Campground = require('../modules/campgorund');

const cities  = require('./cities');

const collections = require('./collectionsSeed').cellections;

const axios = require('axios')

const {places, descriptors} = require('./seedHelpers');
const { ListGroupItem } = require('react-bootstrap');

main().catch(err => console.log(`Could not connect to database: ${err}`));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/yelp-camp');
  console.log("Connection with the data base made!");
  
};

const smaple =  array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 20; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground ( {
            location : `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${smaple(descriptors)} ${smaple(places)}`,
            image: await seedImg(),
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium cumque at, quia nemo sit beatae totam veritatis tempora eum consequuntur pariatur qui velit architecto doloremque inventore aliquam debitis quam explicabo.',
            price
        });
        await camp.save();
    }
    
}
 // call unsplash and return small image
 async function seedImg() {
  const collection = smaple(collections)
  console.log(collection);
    try {
      const resp = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: 'u5aDHOL27hdxTL7QCIXUcZ1wUHgsPIUDo0QrMmojfdM',
          collections: collection
        },
      })
      const result = resp.data.urls.small;
      console.log(result);
      return result;
    } catch (err) {
      console.error(err)
    }
  }

seedDB().then(() => {
    mongoose.connection.close()
});
