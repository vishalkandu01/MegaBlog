import { Client, ID, Databases, Storage, Query } from "appwrite";
import conf from "../conf/conf"

export class Service {
    client = new Client();
    databases;

    constructor() {
        this.client
            .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
            .setProject('5df5acd0d48c2') // Your project ID
            this.databases = new Databases(this.client);
            this.bucket = new Storage(this.client);
    }

    async createPost({slug, userId, title, featuredImage, content, status}) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId, 
                conf.appwriteCollectionId, 
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    userId
                }
            )
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
            return false;
        }
    }

    async updatePost(slug, {title, featuredImage, content, status}) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title, 
                    content,
                    featuredImage,
                    status
                }
            )
        } catch (error) {
            console.log("appwrite service :: update post :: error", error);
            return false;
        }
    }

    async deletePost(slug) {
        try {
            await this.bucket.deleteBucket(slug);
            return true;
        } catch (error) {
            console.log("appwrite :: delete post :: error", error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
        } catch (error) {
            console.log("appwrite service :: getPost :: error", error)
            return false;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            )
        } catch (error) {
            console.log("appwrite service :: getPosts :: error", error);
            return false;   
        }
    }

    async uploadFile(file) {
        try {
            return await this.bucket.createFile (
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false;
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteBucketId,
                fileId
            )
            return true
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }
}

const service = new Service()
export default service