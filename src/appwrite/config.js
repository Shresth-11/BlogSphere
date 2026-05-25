import conf from "../conf/conf";
import { Client, ID, Databases, Storage, Query, Account } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;
  account;
  schemaKeys = {
    featuredImage: null,
    userId: null,
    author: null,
    status: null
  };

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
    this.account = new Account(this.client);

    // Load schema keys from localStorage if present
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        const cached = window.localStorage.getItem("appwrite_schema_keys");
        if (cached) {
          this.schemaKeys = JSON.parse(cached);
          console.log("Appwrite service :: Loaded cached schema keys:", this.schemaKeys);
        }
      } catch (e) {
        console.warn("Appwrite service :: Failed to load schema keys from localStorage:", e);
      }
    }
  }

  saveSchemaKeys() {
    if (typeof window !== "undefined" && window.localStorage) {
      try {
        window.localStorage.setItem("appwrite_schema_keys", JSON.stringify(this.schemaKeys));
      } catch (e) {
        console.warn("Appwrite service :: Failed to save schema keys to localStorage:", e);
      }
    }
  }

  updateSchemaCacheFromPayload(payload) {
    const imageKeys = ["featuredImage", "featuredimage", "featured_image", "featureImage", "featureimage", "feature_image", "featuredimg", "featureimg", "image", "img", "thumbnail", "postImage", "postimage", "post_image"];
    const authorKeys = ["author", "authorName", "userName", "name"];
    const userIdKeys = ["userId", "userid", "user_id"];
    const statusKeys = ["status", "state", "postStatus", "poststatus"];
    
    let changed = false;
    for (const key of Object.keys(payload)) {
      if (imageKeys.includes(key) && this.schemaKeys.featuredImage !== key) {
        this.schemaKeys.featuredImage = key;
        changed = true;
      }
      if (authorKeys.includes(key) && this.schemaKeys.author !== key) {
        this.schemaKeys.author = key;
        changed = true;
      }
      if (userIdKeys.includes(key) && this.schemaKeys.userId !== key) {
        this.schemaKeys.userId = key;
        changed = true;
      }
      if (statusKeys.includes(key) && this.schemaKeys.status !== key) {
        this.schemaKeys.status = key;
        changed = true;
      }
    }
    if (changed) {
      this.saveSchemaKeys();
      console.log("Appwrite service :: Schema cache updated from payload:", this.schemaKeys);
    }
  }

  mapDocument(doc) {
    if (doc) {
      // 1. Map and auto-discover image
      const imageKeys = [
        "featuredImage",
        "featuredimage",
        "featured_image",
        "featureImage",
        "featureimage",
        "feature_image",
        "featuredimg",
        "featureimg",
        "image",
        "img",
        "thumbnail",
        "postImage",
        "postimage",
        "post_image"
      ];
      let foundImage = false;
      for (const key of imageKeys) {
        if (doc[key] !== undefined && doc[key] !== null) {
          doc.featuredImage = doc[key];
          foundImage = true;
          if (this.schemaKeys.featuredImage !== key) {
            this.schemaKeys.featuredImage = key;
            this.saveSchemaKeys();
            console.log("Appwrite service :: mapDocument :: Auto-detected featuredImage key:", key);
          }
          break;
        }
      }
      if (!foundImage) {
        // Fallback to the document's own $id as the image ID
        doc.featuredImage = doc.$id;
      }

      // 2. Map and auto-discover author
      const authorKeys = ["author", "authorName", "userName", "name"];
      for (const key of authorKeys) {
        if (doc[key] !== undefined && doc[key] !== null) {
          doc.author = doc[key];
          if (this.schemaKeys.author !== key) {
            this.schemaKeys.author = key;
            this.saveSchemaKeys();
            console.log("Appwrite service :: mapDocument :: Auto-detected author key:", key);
          }
          break;
        }
      }

      // 3. Map and auto-discover userId
      const userIdKeys = ["userId", "userid", "user_id"];
      for (const key of userIdKeys) {
        if (doc[key] !== undefined && doc[key] !== null) {
          doc.userId = doc[key];
          if (this.schemaKeys.userId !== key) {
            this.schemaKeys.userId = key;
            this.saveSchemaKeys();
            console.log("Appwrite service :: mapDocument :: Auto-detected userId key:", key);
          }
          break;
        }
      }

      // 4. Map and auto-discover status key and map to frontend active/inactive values
      const statusKeys = ["status", "state", "postStatus", "poststatus"];
      let statusKey = "status";
      for (const key of statusKeys) {
        if (doc[key] !== undefined && doc[key] !== null) {
          statusKey = key;
          if (this.schemaKeys.status !== key) {
            this.schemaKeys.status = key;
            this.saveSchemaKeys();
            console.log("Appwrite service :: mapDocument :: Auto-detected status key:", key);
          }
          break;
        }
      }

      const currentStatus = doc[statusKey];
      if (currentStatus === "published" || currentStatus === "active") {
        doc.status = "active";
      } else if (currentStatus === "draft" || currentStatus === "inactive") {
        doc.status = "inactive";
      }
    }
    return doc;
  }

  async createPost({ title, slug, content, featuredImage, status, userId, author }) {
    console.log("Appwrite service :: createPost :: Starting write...", { title, slug, featuredImage, status, userId, author });

    // Try to dynamically retrieve userId and author from session if missing
    if (!userId || !author) {
      try {
        const user = await this.account.get();
        if (user) {
          if (!userId && user.$id) {
            userId = user.$id;
            console.log("Appwrite service :: createPost :: Dynamically retrieved missing userId from session:", userId);
          }
          if (!author && user.name) {
            author = user.name;
            console.log("Appwrite service :: createPost :: Dynamically retrieved missing author from session:", author);
          }
        }
      } catch (authErr) {
        console.error("Appwrite service :: createPost :: Failed to dynamically fetch user session", authErr);
      }
    }

    // High-safety fallbacks to satisfy Appwrite's strict "Required Attribute" validations
    userId = userId || "user_" + ID.unique();
    author = author || "Anonymous Writer";

    // Build optimized payload dynamically using cached schema keys first!
    let payload = { title, content };

    // Apply cached featuredImage key or default to "featuredImage"
    const imageKey = this.schemaKeys.featuredImage || "featuredImage";
    payload[imageKey] = featuredImage;

    // Apply cached userId key or default to "userId"
    const userIdKey = this.schemaKeys.userId || "userId";
    payload[userIdKey] = userId;

    // Apply cached author key if known
    if (this.schemaKeys.author) {
      payload[this.schemaKeys.author] = author;
    } else if (this.schemaKeys.author === undefined) {
      // Checked and found not present in schema
    } else {
      payload.author = author;
    }

    // Apply status key
    const statusKey = this.schemaKeys.status || "status";
    payload[statusKey] = status;

    // Clean up undefined fields
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    const maxRetries = 10;
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt++;
      try {
        console.log(`Appwrite service :: createPost :: Attempt ${attempt} with payload keys:`, Object.keys(payload));
        const res = await this.databases.createDocument(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId,
          slug,
          payload
        );
        console.log(`Appwrite service :: createPost :: Write succeeded!`);
        this.updateSchemaCacheFromPayload(payload);
        return this.mapDocument(res);
      } catch (error) {
        const errorMsg = error?.message || "";
        console.warn(`Appwrite service :: createPost :: Attempt ${attempt} failed:`, errorMsg);

        // 1. If it's a rate limit error, throw a friendly user-facing message
        if (error?.code === 429 || errorMsg.includes("Rate limit") || errorMsg.includes("rate_limit")) {
          throw new Error("Appwrite rate limit exceeded. Please wait a few seconds and try again.");
        }

        // 2. Check if the error is due to status enum mismatch
        const statusMatch = errorMsg.match(/Attribute\s*"status"\s*has\s*invalid\s*format.*Value\s*must\s*be\s*one\s*of\s*\(([^)]+)\)/i);
        if (statusMatch && statusMatch[1]) {
          const allowed = statusMatch[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
          console.log(`Appwrite service :: createPost :: Status enum mismatch. Allowed values:`, allowed);
          
          if (payload[statusKey] === "active") {
            payload[statusKey] = allowed.includes("published") ? "published" : (allowed.includes("draft") ? "draft" : allowed[0]);
          } else if (payload[statusKey] === "inactive") {
            payload[statusKey] = allowed.includes("draft") ? "draft" : (allowed.includes("archived") ? "archived" : allowed[0]);
          } else {
            payload[statusKey] = allowed[0];
          }
          continue; // Retry with modified status
        }

        // 3. Check if the error tells us about an unknown attribute we sent
        const unknownMatch = errorMsg.match(/Unknown attribute:\s*"([^"]+)"/) || errorMsg.match(/attribute\s*"([^"]+)"\s*is\s*unknown/i) || errorMsg.match(/attribute\s*"([^"]+)"\s*not\s*found/i);
        if (unknownMatch && unknownMatch[1]) {
          const unknownKey = unknownMatch[1];
          console.log(`Appwrite service :: createPost :: Dynamically removing unknown attribute: "${unknownKey}"`);
          delete payload[unknownKey];
          
          if (unknownKey === "featuredImage") {
            payload.featuredimage = featuredImage;
          } else if (unknownKey === "featuredimage") {
            payload.featured_image = featuredImage;
          } else if (unknownKey === "featured_image") {
            payload.image = featuredImage;
          } else if (unknownKey === "image") {
            payload.img = featuredImage;
          } else if (unknownKey === "img") {
            this.schemaKeys.featuredImage = undefined;
            this.saveSchemaKeys();
          }
          
          if (unknownKey === "userId") {
            payload.userid = userId;
          } else if (unknownKey === "userid") {
            payload.user_id = userId;
          } else if (unknownKey === "user_id") {
            this.schemaKeys.userId = undefined;
            this.saveSchemaKeys();
          }
          
          if (unknownKey === "author") {
            payload.authorName = author;
          } else if (unknownKey === "authorName") {
            payload.name = author;
          } else if (unknownKey === "name") {
            this.schemaKeys.author = undefined;
            this.saveSchemaKeys();
          }
          
          continue; // Retry with modified payload
        }

        // 4. Check if it tells us about a missing required attribute that we forgot to send
        const missingMatch = errorMsg.match(/Missing required attribute\s*"([^"]+)"/) || errorMsg.match(/attribute\s*"([^"]+)"\s*is\s*required/i);
        if (missingMatch && missingMatch[1]) {
          const requiredKey = missingMatch[1];
          console.log(`Appwrite service :: createPost :: Dynamically adding required attribute: "${requiredKey}"`);
          
          if (requiredKey.toLowerCase().includes("user")) {
            payload[requiredKey] = userId;
          } else if (requiredKey.toLowerCase().includes("image") || requiredKey.toLowerCase().includes("img")) {
            payload[requiredKey] = featuredImage;
          } else if (requiredKey.toLowerCase().includes("author")) {
            payload[requiredKey] = author;
          } else {
            payload[requiredKey] = ""; // default fallback string
          }
          continue; // Retry with modified payload
        }

        throw error;
      }
    }

    throw new Error("Failed to create post after multiple adaptive retries.");
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    console.log("Appwrite service :: updatePost :: Starting update...", { slug, title, featuredImage, status });
    
    let payload = { title, content };

    // Apply cached featuredImage key or default to "featuredImage"
    const imageKey = this.schemaKeys.featuredImage || "featuredImage";
    payload[imageKey] = featuredImage;

    // Apply status key
    const statusKey = this.schemaKeys.status || "status";
    payload[statusKey] = status;

    // Clean up undefined fields
    Object.keys(payload).forEach(key => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    const maxRetries = 10;
    let attempt = 0;

    while (attempt < maxRetries) {
      attempt++;
      try {
        console.log(`Appwrite service :: updatePost :: Attempt ${attempt} with payload keys:`, Object.keys(payload));
        const res = await this.databases.updateDocument(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId,
          slug,
          payload
        );
        console.log(`Appwrite service :: updatePost :: Update succeeded!`);
        this.updateSchemaCacheFromPayload(payload);
        return this.mapDocument(res);
      } catch (error) {
        const errorMsg = error?.message || "";
        console.warn(`Appwrite service :: updatePost :: Attempt ${attempt} failed:`, errorMsg);

        if (error?.code === 429 || errorMsg.includes("Rate limit") || errorMsg.includes("rate_limit")) {
          throw new Error("Appwrite rate limit exceeded. Please wait a few seconds and try again.");
        }

        // Check if status enum mismatch occurs during update
        const statusMatch = errorMsg.match(/Attribute\s*"status"\s*has\s*invalid\s*format.*Value\s*must\s*be\s*one\s*of\s*\(([^)]+)\)/i);
        if (statusMatch && statusMatch[1]) {
          const allowed = statusMatch[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
          console.log(`Appwrite service :: updatePost :: Status enum mismatch. Allowed values:`, allowed);
          
          if (payload[statusKey] === "active") {
            payload[statusKey] = allowed.includes("published") ? "published" : (allowed.includes("draft") ? "draft" : allowed[0]);
          } else if (payload[statusKey] === "inactive") {
            payload[statusKey] = allowed.includes("draft") ? "draft" : (allowed.includes("archived") ? "archived" : allowed[0]);
          } else {
            payload[statusKey] = allowed[0];
          }
          continue;
        }

        const unknownMatch = errorMsg.match(/Unknown attribute:\s*"([^"]+)"/) || errorMsg.match(/attribute\s*"([^"]+)"\s*is\s*unknown/i) || errorMsg.match(/attribute\s*"([^"]+)"\s*not\s*found/i);
        if (unknownMatch && unknownMatch[1]) {
          const unknownKey = unknownMatch[1];
          console.log(`Appwrite service :: updatePost :: Dynamically removing unknown attribute: "${unknownKey}"`);
          delete payload[unknownKey];
          
          if (unknownKey === "featuredImage") {
            payload.featuredimage = featuredImage;
          } else if (unknownKey === "featuredimage") {
            payload.featured_image = featuredImage;
          } else if (unknownKey === "featured_image") {
            payload.image = featuredImage;
          } else if (unknownKey === "image") {
            payload.img = featuredImage;
          } else if (unknownKey === "img") {
            this.schemaKeys.featuredImage = undefined;
            this.saveSchemaKeys();
          }
          continue;
        }

        throw error;
      }
    }

    throw new Error("Failed to update post after multiple adaptive retries.");
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
      const mappedQueries = queries.map(q => {
        if (q && typeof q === "object" && q.attribute === "status") {
          return Query.equal(this.schemaKeys.status || "status", ["active", "published"]);
        }
        if (typeof q === "string") {
          // Rewrite status query to target both active and published statuses
          if (q.includes('equal("status", ["active"])') || q.includes('equal("status", "active")')) {
            return 'equal("status", ["active", "published"])';
          }
        }
        return q;
      });

      const res = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        mappedQueries,
      );
      if (res && res.documents) {
        res.documents = res.documents.map((doc) => this.mapDocument(doc));
      }
      return res;
    } catch (error) {
      console.warn("Appwrite service :: getPosts :: Query failed (possibly due to missing indexes or permission issues). Falling back to fetching all documents and filtering in-memory.", error);
      try {
        const res = await this.databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId,
          []
        );
        if (res && res.documents) {
          let docs = res.documents.map((doc) => this.mapDocument(doc));
          // Filter out inactive/draft posts if status query was requested
          const hasStatusQuery = queries.some(q => {
            if (q && typeof q === "object" && q.attribute === "status") return true;
            if (typeof q === "string" && q.includes("status")) return true;
            return false;
          });
          if (hasStatusQuery) {
            docs = docs.filter(doc => doc.status === "active" || doc.status === "published");
          }
          res.documents = docs;
          return res;
        }
      } catch (fallbackErr) {
        console.error("Appwrite service :: getPosts :: Fallback also failed:", fallbackErr);
      }
      return false;
    }
  }

  // file upload service

  async uploadFile(file, fileId = ID.unique()) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        fileId,
        file,
      );
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error", error, "for fileId:", fileId);
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
    if (!fileId || typeof fileId !== "string" || fileId.trim() === "") {
      return "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?auto=format&fit=crop&w=1200&q=80";
    }
    try {
      // High-speed compressed preview for ultra-fast page rendering (600x375 thumbnail)
      return this.bucket.getFilePreview(conf.appwriteBucketId, fileId, 600, 375).toString();
    } catch (e) {
      console.warn("Appwrite service :: getFilePreview :: error", e);
      return "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?auto=format&fit=crop&w=1200&q=80";
    }
  }

  getFileViewUrl(fileId) {
    if (!fileId || typeof fileId !== "string" || fileId.trim() === "") {
      return "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?auto=format&fit=crop&w=1200&q=80";
    }
    try {
      // Direct raw file stream as a robust fallback bypassing the transformation engine
      return this.bucket.getFileView(conf.appwriteBucketId, fileId).toString();
    } catch (e) {
      console.warn("Appwrite service :: getFileViewUrl :: error", e);
      return "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?auto=format&fit=crop&w=1200&q=80";
    }
  }
}

const service = new Service();

export default service;
