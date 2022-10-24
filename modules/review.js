const mongoose = require('mongoose');
const { campgorundSchema } = require('../schemas');
const campgorund = require('./campgorund');
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        body: String,
        rating: Number
    }
);

module.exports = mongoose.model("Review", reviewSchema);