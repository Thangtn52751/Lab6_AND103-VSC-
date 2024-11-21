const mongoose = require('mongoose');

const CakeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Cake name is required'],
        trim: true,
    },
    description: {
        type: String,
        default: "",
        trim: true,
        maxlength: [500, 'Description cannot be longer than 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be less than 0'],
        validate: {
            validator: function(value) {
                return value >= 0;
            },
            message: 'Price must be a positive number',
        }
    },
    distributor: {
        type: String,
        required: [true, 'Distributor is required'],
        trim: true,
        maxlength: [100, 'Distributor name cannot be longer than 100 characters'],
    },
    image: {
        type: String,  // Lưu URL hoặc đường dẫn tới ảnh
        required: [true, 'Image URL is required'],  // Nếu yêu cầu có ảnh
    }
}, { 
    timestamps: true  // Tự động thêm thời gian tạo và cập nhật
});

// Tạo Model từ Schema
const CakeModel = mongoose.model('Cake', CakeSchema);

module.exports = CakeModel;
