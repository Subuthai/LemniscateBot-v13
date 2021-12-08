import Mongoose from 'mongoose'

export default {
    connect: async function (url) {
        try {
            Mongoose.connect(url, () => {
                console.log('Database connection successful.')
            })
        } catch (error) {
            console.log(`There was an error connecting to the database.\n\n${error}`)
        }
    }
}