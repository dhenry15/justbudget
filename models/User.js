const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    registerDate: {
        type: Date,
        default: Date.now()
    },
    transactions: {
        type: Array,
        default: []
    },
    budgets: {
        type: Object,
        default: {
            weekly: {"budget": 0, "actual": 0, "categories": []},
            monthly: {"budget": 0, "actual": 0 , "categories": []},
            yearly: {"budget": 0, "actual": 0, "categories": []}
        }
    },
    history: {
        weekly: [],
        monthly: [],
        yearly: []
    }
});

module.exports = User = mongoose.model("users", UserSchema);