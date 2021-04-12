const  ws = require("websocket")
const crypto = require("crypto")

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    incoming: {
        type: Array,
        default: []
    },
    outgoing: {
        type: Array,
        default: []
    },
    accepted: {
        type: Array,
        default: []
    }
})

module.exports = websocket.model("friends",)
