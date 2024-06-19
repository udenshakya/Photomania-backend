import { Request, Response } from "express";
import { postService, usersService } from "../services";
import jwt from "jsonwebtoken";
import { db } from "../datasource";
import { JwtPayload } from "jsonwebtoken";
import * as yup from "yup";
import { Post } from "../entity/Post";
import cloudinary from "../utils/cloudinary";
import { UploadedFile } from "express-fileupload";
import { singleUpload } from "../middlewares/multer";
import fs from "fs";
const postRepository = db.getRepository(Post);

async function list(req: Request, res: Response) {
  // console.log((req as any).user);
  try {
    const data = await postService.list();
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getAllPosts(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize as string) || 10; // Default to 10 items per page if not provided

    const [data, total] = await postRepository.findAndCount({
      relations: ["user"],
      take: pageSize,
      skip: (page - 1) * pageSize,
      order: { createdAt: "DESC" },
    });

    return res.status(200).json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function create(req: Request, res: Response) {
  try {
    const { caption, description } = req.body;
    const image = req.file;

    // Check if file was uploaded successfully
    if (!image) {
      return res.status(400).json({ error: "Image file is required" });
    }

    // Upload the file to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(image.path, {
      upload_preset: "MERNEcommerce",
    });

    fs.unlink(image.path, function (err) {
      if (err) console.log(err);
    });

    if (uploadRes.secure_url) {
      // Create post in the database
      const post = postRepository.create({
        caption,
        imageUrl: uploadRes.secure_url, // Storing only the URL
        description,
        publicId: uploadRes.public_id,
        user: {
          // @ts-ignore
          id: req.user.id,
        },
      });

      // Save the post to the database
      await postRepository.save(post);

      return res
        .status(201)
        .json({ success: true, message: "Post created", post });
    } else {
      return res
        .status(500)
        .json({ error: "Failed to upload image to Cloudinary" });
    }
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
async function getPostByID(req: Request, res: Response) {
  try {
    const postID = parseInt(req.params.id);
    if (isNaN(postID)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const data = await postService.getPostByID(postID);
    if (!data) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deletePost(req: Request, res: Response) {
  try {
    const postID = parseInt(req.params.id);
    if (isNaN(postID)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await postRepository.findOne({
      where: {
        id: postID,
        user: {
          id: (req as any).user.id,
        },
      },
      relations: ["user"], // Ensure we also load the user relation
    });

    if (!post) {
      return res.status(404).json({
        error: "You are not authorized to delete this post or post not found",
      });
    }

    if (post.user.id !== (req as any).user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this post" });
    }

    // Delete the image from Cloudinary if the public_id exists
    if (post.publicId) {
      await cloudinary.uploader.destroy(post.publicId);
    }

    // Remove the post from the database
    await postRepository.remove(post);

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updatePost(req: Request, res: Response) {
  try {
    const postID = parseInt(req.params.id);
    const { caption, description } = req.body;
    const image = req.file; // Assuming Multer is used for file uploads

    if (isNaN(postID)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await postRepository.findOne({
      where: {
        id: postID,
        user: {
          id: (req as any).user.id,
        },
      },
      relations: ["user"], // Ensure we also load the user relation
    });

    if (!post) {
      return res.status(404).json({
        error: "You are not authorized to update this post or post not found",
      });
    }

    if (image) {
      // Delete the old image from Cloudinary if it exists
      if (post.publicId) {
        await cloudinary.uploader.destroy(post.publicId);
      }

      // Upload the new file to Cloudinary
      const uploadRes = await cloudinary.uploader.upload(image.path, {
        upload_preset: "MERNEcommerce",
      });

      // Delete the local file
      fs.unlink(image.path, (err) => {
        if (err) console.error("Failed to delete local image file:", err);
      });

      // Merge new image details with existing post entity
      postRepository.merge(post, {
        imageUrl: uploadRes.secure_url,
        publicId: uploadRes.public_id,
        caption,
        description,
      });
    } else {
      // If no new image is uploaded, update only caption and description
      postRepository.merge(post, {
        caption,
        description,
      });
    }

    await postRepository.save(post);

    return res
      .status(200)
      .json({ success: true, message: "Post updated", post });
  } catch (error) {
    console.error("Error updating post:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function search(req: Request, res: Response) {
  try {
    const { caption, description, userId } = req.query;

    // Create a query builder instance
    let query = postRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.user", "user");

    // Add conditions based on query parameters
    if (caption) {
      query = query.andWhere("post.caption ILIKE :caption", {
        caption: `%${caption}%`,
      });
    }

    if (description) {
      query = query.andWhere("post.description ILIKE :description", {
        description: `%${description}%`,
      });
    }

    if (userId) {
      query = query.andWhere("post.user.id = :userId", { userId });
    }

    // Execute the query and get the results
    const posts = await query.getMany();

    return res.status(200).json({ posts });
  } catch (error) {
    console.error("Error searching posts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const postController = {
  list,
  create,
  getPostByID,
  updatePost,
  deletePost,
  getAllPosts,
  search,
};
