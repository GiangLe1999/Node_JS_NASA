const mongoose = require("mongoose");

const launchSchema = new mongoose.Schema({
  flightNumber: { type: Number, required: true },
  launchDate: { type: Date, required: true },
  mission: { type: String, required: true },
  rocket: { type: String, required: true },
  target: {
    type: String,
  },
  customers: {
    type: [String],
  },
  upcoming: {
    type: Boolean,
    required: true,
  },
  success: {
    type: Boolean,
    required: true,
    default: true,
  },
});

// Tạo model và export model ra ngoài để sử dụng trong API
// launchSchema sẽ được assign cho "launches" Collection
// Đối số thứ nhất là Launch sẽ được lowercase, thêm số nhiều => launches và được dùng làm tên của collection
module.exports = mongoose.model("Launch", launchSchema);
