import { db } from "../datasource";
import { Post } from "../entity/Post";
import cloudinary from "../utils/cloudinary";

const postRepository = db.getRepository(Post);

type PostType = {
  caption: string;
  imageUrl: string;
  description: string;
};

async function list() {
  try {
    const result = await postRepository.find({});
    return result;
  } catch (error) {
    console.error("Error fetching posts", error);
    throw new Error("Internal server error");
  }
}

async function getPostByID(postID: number) {
  try {
    const result = await postRepository.findOne({ where: { id: postID } });
    return result;
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw new Error("Internal server error");
  }
}

// async function update(
//   postID: number,
//   { caption, imageUrl, description }: PostType
// ) {
//   try {
//     const post = await postRepository.findOneBy({ id: postID });
//     if (!post) {
//       throw new Error("Post not found");
//     }

//     if (imageUrl) {
//       const uploadRes = await cloudinary.uploader.upload(imageUrl, {
//         upload_preset: "MERNEcommerce",
//       });
//       imageUrl = uploadRes.secure_url; // Update with the new URL
//     }

//     postRepository.merge(post, { caption, imageUrl, description });
//     return await postRepository.save(post);
//   } catch (error) {
//     console.error("Error updating post:", error);
//     throw new Error("Internal server error");
//   }
// }

async function remove(postID: number) {
  try {
    const post = await postRepository.findOneBy({ id: postID });
    if (!post) {
      throw new Error("Post not found");
    }
    return await postRepository.remove(post);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Internal server error");
  }
}

export const postService = {
  list,
  getPostByID,
  remove,
};
