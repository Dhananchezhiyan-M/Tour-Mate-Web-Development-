const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const campGroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,//Stores the ID of the user.
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

campGroundSchema.post('findOneDelete', async function (doc) {//It is triggered after a findOneAndDelete() operation on a Campground
    if(doc) {
        await review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', campGroundSchema);