import mongoose from 'mongoose'

const EconomySchema = new mongoose.Schema({
    member_id: String,
    balance: Number
})

export default mongoose.model('economy', EconomySchema, 'economy')