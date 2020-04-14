const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    _uid:{ type: mongoose.ObjectId, require: true},
    name:{
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    created:{
        type: Date,
        required: true,
        default: Date.now
    },
    updated:{
        type: Date,
        required: true,
        default: Date.now
    }
})

//.model(export-name , schema, collection-name)
module.exports = mongoose.model('Events',eventSchema)