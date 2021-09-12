const mongoose = require('mongoose')

const allowedFieldsTask = ['description', 'completed']
const Task = mongoose.model('Task', {
    description: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
})

exports.module = { Task, allowedFieldsTask }
