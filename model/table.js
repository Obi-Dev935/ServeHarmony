const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema({
    restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    people: { type: Number, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // Could also use Date if you include time in a Date object
    specialRequests: { type: String, required: false }
});

module.exports = mongoose.model('Reservation', reservationSchema);
