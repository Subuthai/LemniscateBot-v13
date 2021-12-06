import { getDir } from "file-ez";
import { client } from "../bot.js";

export default {
    loadEvents: async function () {
        const events = await getDir('../events').recursive()

        for (const file of events) {
            const event = await file.import()
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args))
            } else client.on(event.name, (...args) => event.execute(...args))
        }
    }
}
