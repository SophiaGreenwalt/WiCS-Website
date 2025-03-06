const mongoose = require('mongoose');

// Define the need for event
const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },    // title 
  description: String,                          // description
  start: { type: Date, required: true },        // start time
  end: { type: Date, required: true }           // end time
});

// export the model to be used in event routes
module.exports = mongoose.model('Event', EventSchema);