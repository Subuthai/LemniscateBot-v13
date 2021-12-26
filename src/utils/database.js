import Mongoose from 'mongoose'
import zaq from 'zaq';

export default {
    connect: async function (url) {
        try {
            Mongoose.connect(url, () => {
                zaq.ok('Database connection successful.')
            })
        } catch (error) {
            zaq.err(`There was an error connecting to the database.\n\n${error}`)
        }
    }
}