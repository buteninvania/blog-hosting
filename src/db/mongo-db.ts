import {Collection, Db, MongoClient} from "mongodb";
import {SETTINGS} from "../settings";

import {BlogDbType} from "./blog-db-type";
import {PostDbType} from "./post-db-type";

const client: MongoClient = new MongoClient(SETTINGS.MONGODB_URI)
export const db: Db = client.db(SETTINGS.DB_NAME);

export const blogCollection: Collection<BlogDbType> = db.collection<BlogDbType>(SETTINGS.BLOG_COLLECTION_NAME)
export const postCollection: Collection<PostDbType> = db.collection<PostDbType>(SETTINGS.POST_COLLECTION_NAME)

export const connectToDB = async () => {
    try {
        await client.connect()
        console.log('connected to db')
        return true
    } catch (e) {
        console.log(e)
        await client.close()
        return false
    }
}
