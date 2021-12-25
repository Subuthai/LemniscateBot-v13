import mongoose from 'mongoose'

const TicketSchema = new mongoose.Schema({
    guild_id: String,
    member_id: String,
    channel_id: String,
    ticket_id: Number
})

export default mongoose.model('tickets', TicketSchema)