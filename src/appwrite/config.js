import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  mapDocument(doc) {
    if (doc) {
      doc.featuredImage = doc.featuredImage || doc.featuredimage || doc.featured_image || doc.image;
    }
    return doc;
  }

  async handleCreateErrorFallback(error, { title, slug, content, featuredImage, status, userId }) {
    const errorMsg = error?.message || "";
    if (errorMsg.includes("featuredImage") || errorMsg.includes("featuredimage") || errorMsg.includes("featured_image") || errorMsg.includes("image")) {
      // Attempt 1: Try lowercase 'featuredimage'
      console.log("Appwrite service :: createPost :: Retrying with lowercase 'featuredimage'...");
      try {
        const res = await this.databases.createDocument(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId,
          slug,
          { title, content, featuredimage: featuredImage, status, userId }
        );
        return this.mapDocument(res);
      } catch (err1) {
        console.log("Appwrite service :: createPost :: lowercase 'featuredimage' failed", err1);
        
        // Attempt 2: Try underscore 'featured_image'
        console.log("Appwrite service :: createPost :: Retrying with underscore 'featured_image'...");
        try {
          const res = await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            slug,
            { title, content, featured_image: featuredImage, status, userId }
          );
          return this.mapDocument(res);
        } catch (err2) {
          console.log("Appwrite service :: createPost :: underscore 'featured_image' failed", err2);
          
          // Attempt 3: Try simple 'image'
          console.log("Appwrite service :: createPost :: Retrying with 'image'...");
          try {
            const res = await this.databases.createDocument(
              conf.appwriteDatabaseId,
              conf.appwriteCollectionId,
              slug,
              { title, content, image: featuredImage, status, userId }
            );
            return this.mapDocument(res);
          } catch (err3) {
            console.log("Appwrite service :: createPost :: simple 'image' failed", err3);
            throw err3;
          }
        }
      }
    }
    throw error;
  }

  async createPost({ title, slug, content, featuredImage, status, userId, author }) {
    let payload = { title, content, featuredImage, status, userId, author };
    try {
      const res = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        payload
      );
      return this.mapDocument(res);
    } catch (error) {
      console.log("Appwrite service :: createPost :: error", error);
      const errorMsg = error?.message || "";
      
      // Fallback: If missing 'author' attribute, retry without it but keep primary featuredImage
      if (errorMsg.includes("author") || errorMsg.includes("Attribute not found")) {
        console.log("Appwrite service :: createPost :: Retrying without 'author'...");
        try {
          const res = await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            slug,
            { title, content, featuredImage, status, userId }
          );
          return this.mapDocument(res);
        } catch (retryError) {
          return await this.handleCreateErrorFallback(retryError, { title, slug, content, featuredImage, status, userId });
        }
      }
      
      return await this.handleCreateErrorFallback(error, { ...payload, slug });
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      const res = await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        },
      );
      return this.mapDocument(res);
    } catch (error) {
      console.log("Appwrite service :: updatePost :: error", error);
      const errorMsg = error?.message || "";
      if (errorMsg.includes("featuredImage") || errorMsg.includes("featuredimage") || errorMsg.includes("featured_image") || errorMsg.includes("image")) {
        // Attempt 1: Try lowercase 'featuredimage'
        try {
          const res = await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            slug,
            { title, content, featuredimage: featuredImage, status }
          );
          return this.mapDocument(res);
        } catch (err1) {
          // Attempt 2: Try underscore 'featured_image'
          try {
            const res = await this.databases.updateDocument(
              conf.appwriteDatabaseId,
              conf.appwriteCollectionId,
              slug,
              { title, content, featured_image: featuredImage, status }
            );
            return this.mapDocument(res);
          } catch (err2) {
            // Attempt 3: Try simple 'image'
            try {
              const res = await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                { title, content, image: featuredImage, status }
              );
              return this.mapDocument(res);
            } catch (err3) {
              throw err3;
            }
          }
        }
      }
      throw error;
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
      );
      return true;
    } catch (error) {
      console.log("Appwrite service :: deletePost :: error", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      const res = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
      );
      return this.mapDocument(res);
    } catch (error) {
      console.log("Appwrite service :: getPost :: error", error);
    }
  }

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      const res = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries,
      );
      if (res && res.documents) {
        res.documents = res.documents.map((doc) => this.mapDocument(doc));
      }
      return res;
    } catch (error) {
      console.log("Appwrite service :: getPosts :: error", error);
      return false;
    }
  }

  // file upload service

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file,
      );
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteFile :: error", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
  }
}

const service = new Service();

export default service;
