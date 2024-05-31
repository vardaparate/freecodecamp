const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://gofood:gofoodproject@cluster0.qisnkyn.mongodb.net/freeCodeCamp?retryWrites=true&w=majority&appName=Cluster0"
// const mongoDB = () => {
//     mongoose.connect(mongoURI
//         , () => {
//     console.log("connected");}
// );
// }

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const fetched_data = await mongoose.connection.db.collection("list");
    const data = await fetched_data.find({}).toArray();
    global.list_items = data;


  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = mongoDB;