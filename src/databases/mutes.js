import mongoose from 'mongoose'

const MuteSchema = new mongoose.Schema({
    member_id: String,
    unmute_at: Number
})

export default mongoose.model('mutes', MuteSchema)