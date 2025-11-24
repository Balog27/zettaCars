import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const getAll = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("blogs"),
      _creationTime: v.number(),
      title: v.string(),
      slug: v.string(),
      author: v.string(),
      description: v.string(),
      coverImage: v.optional(v.id("_storage")),
      tags: v.optional(v.array(v.string())),
      publishedAt: v.optional(v.number()),
      status: v.union(v.literal("draft"), v.literal("published")),
      readingTime: v.optional(v.number()),
      views: v.optional(v.number()),
    }),
  ),
  handler: async (ctx) => {
    // Query all blogs and filter for published ones
    // Note: We query all and filter in JS because we need to sort by _creationTime
    // which doesn't work well with indexed queries
    const allBlogs = await ctx.db.query("blogs").collect();
    
    // Filter for published blogs and sort by creation time descending
    const publishedBlogs = allBlogs
      .filter((blog) => blog.status === "published")
      .sort((a, b) => b._creationTime - a._creationTime);

    return publishedBlogs.map((blog) => ({
      _id: blog._id,
      _creationTime: blog._creationTime,
      title: blog.title,
      slug: blog.slug,
      author: blog.author,
      description: blog.description,
      coverImage: blog.coverImage,
      tags: blog.tags,
      publishedAt: blog.publishedAt,
      status: blog.status,
      readingTime: blog.readingTime,
      views: blog.views,
    }));
  },
});

export const getAllAdmin = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("blogs"),
      _creationTime: v.number(),
      title: v.string(),
      slug: v.string(),
      author: v.string(),
      description: v.string(),
      coverImage: v.optional(v.id("_storage")),
      tags: v.optional(v.array(v.string())),
      publishedAt: v.optional(v.number()),
      status: v.union(v.literal("draft"), v.literal("published")),
      readingTime: v.optional(v.number()),
      views: v.optional(v.number()),
    }),
  ),
  handler: async (ctx) => {
    const blogs = await ctx.db.query("blogs").order("desc").collect();

    return blogs.map((blog) => ({
      _id: blog._id,
      _creationTime: blog._creationTime,
      title: blog.title,
      slug: blog.slug,
      author: blog.author,
      description: blog.description,
      coverImage: blog.coverImage,
      tags: blog.tags,
      publishedAt: blog.publishedAt,
      status: blog.status,
      readingTime: blog.readingTime,
      views: blog.views,
    }));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("blogs"),
      _creationTime: v.number(),
      title: v.string(),
      slug: v.string(),
      author: v.string(),
      description: v.string(),
      content: v.string(),
      coverImage: v.optional(v.id("_storage")),
      images: v.optional(v.array(v.id("_storage"))),
      tags: v.optional(v.array(v.string())),
      publishedAt: v.optional(v.number()),
      status: v.union(v.literal("draft"), v.literal("published")),
      readingTime: v.optional(v.number()),
      views: v.optional(v.number()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const blog = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    return blog;
  },
});

export const getById = query({
  args: { id: v.id("blogs") },
  returns: v.union(
    v.object({
      _id: v.id("blogs"),
      _creationTime: v.number(),
      title: v.string(),
      slug: v.string(),
      author: v.string(),
      description: v.string(),
      content: v.string(),
      coverImage: v.optional(v.id("_storage")),
      images: v.optional(v.array(v.id("_storage"))),
      tags: v.optional(v.array(v.string())),
      publishedAt: v.optional(v.number()),
      status: v.union(v.literal("draft"), v.literal("published")),
      readingTime: v.optional(v.number()),
      views: v.optional(v.number()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    author: v.string(),
    description: v.string(),
    content: v.string(),
    coverImage: v.optional(v.id("_storage")),
    images: v.optional(v.array(v.id("_storage"))),
    tags: v.optional(v.array(v.string())),
    publishedAt: v.optional(v.number()),
    status: v.union(v.literal("draft"), v.literal("published")),
    readingTime: v.optional(v.number()),
  },
  returns: v.id("blogs"),
  handler: async (ctx, args) => {
    const existingBlog = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existingBlog) {
      throw new Error("A blog with this slug already exists");
    }

    const blogId = await ctx.db.insert("blogs", {
      title: args.title,
      slug: args.slug,
      author: args.author,
      description: args.description,
      content: args.content,
      coverImage: args.coverImage,
      images: args.images || [],
      tags: args.tags || [],
      publishedAt: args.publishedAt,
      status: args.status,
      readingTime: args.readingTime,
      views: 0,
    });

    return blogId;
  },
});

export const update = mutation({
  args: {
    id: v.id("blogs"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    author: v.optional(v.string()),
    description: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.id("_storage")),
    images: v.optional(v.array(v.id("_storage"))),
    tags: v.optional(v.array(v.string())),
    publishedAt: v.optional(v.number()),
    status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
    readingTime: v.optional(v.number()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;


    if (updates.slug) {
      const existingBlog = await ctx.db
        .query("blogs")
        .withIndex("by_slug", (q) => q.eq("slug", updates.slug!))
        .first();

      if (existingBlog && existingBlog._id !== id) {
        throw new Error("A blog with this slug already exists");
      }
    }

    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("blogs") },
  returns: v.null(),
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.id);

    if (!blog) {
      throw new Error("Blog not found");
    }

    // Attempt to delete cover image (if any) and surface helpful errors
    if (blog.coverImage) {
      try {
        await ctx.storage.delete(blog.coverImage);
      } catch (e: any) {
        // Rethrow with more context so the Convex function logs and client error
        // show the underlying issue (e.g. invalid storage id, permission issue)
        throw new Error(
          `Failed to delete coverImage (${String(blog.coverImage)}): ${
            e?.message || String(e)
          }`
        );
      }
    }

    // Attempt to delete any additional images; surface the first failing one
    if (blog.images && blog.images.length > 0) {
      for (const imageId of blog.images) {
        try {
          await ctx.storage.delete(imageId);
        } catch (e: any) {
          throw new Error(
            `Failed to delete blog image (${String(imageId)}): ${
              e?.message || String(e)
            }`
          );
        }
      }
    }

    // Finally delete the DB record and surface DB-level issues as well
    try {
      await ctx.db.delete(args.id);
    } catch (e: any) {
      throw new Error(`Failed to delete blog DB record (${String(args.id)}): ${e?.message || String(e)}`);
    }
  },
});

export const uploadImages = action({
  args: {
    blogId: v.optional(v.id("blogs")),
    images: v.array(v.any()),
  },
  returns: v.array(v.id("_storage")),
  handler: async (ctx, args) => {
    const { images } = args;

    const uploadedImageIds: Id<"_storage">[] = [];

    for (const imageBuffer of images) {
      const blob = new Blob([imageBuffer]);
      const storageId = await ctx.storage.store(blob);
      uploadedImageIds.push(storageId);
    }

    return uploadedImageIds;
  },
});

export const removeImage = mutation({
  args: {
    blogId: v.id("blogs"),
    imageId: v.id("_storage"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { blogId, imageId } = args;

    const blog = await ctx.db.get(blogId);

    if (!blog) {
      throw new Error("Blog not found");
    }

    const currentImages = blog.images || [];

    const updatedImages = currentImages.filter((id) => id !== imageId);

    const updates: any = {
      images: updatedImages,
    };

    if (blog.coverImage === imageId) {
      updates.coverImage = undefined;
    }

    await ctx.db.patch(blogId, updates);

    await ctx.storage.delete(imageId);
  },
});

export const getImageUrl = query({
  args: { imageId: v.id("_storage") },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.imageId);
  },
});

export const incrementViews = mutation({
  args: { slug: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const blog = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!blog) {
      throw new Error("Blog not found");
    }

    const currentViews = blog.views || 0;
    await ctx.db.patch(blog._id, { views: currentViews + 1 });
  },
});
