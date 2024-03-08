import { Schema, model } from "mongoose"

const bookSchema = Schema ({
    name: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    state: {
        enum: ['BORROWED', 'AVAILABLE'],
        default: 'AVAILABLE',
        required: true
    }
},
{
    versionKey: false
})

export default model('book', bookSchema)