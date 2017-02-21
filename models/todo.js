const mongoose = require("mongoose");

const Todo = mongoose.model("Todo", {
    text: {
        type: String,
        required: true,
        trim: true,
        minlenght: 3
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});
