"use server";

import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
  }
  
  export async function updateUser({
    userId,
    bio,
    name,
    path,
    username,
    image,
  }: Params): Promise<void> {
    try {
      connectToDB();

      await User.findOneAndUpdate(
        { id: userId },
        {
          username: username.toLowerCase(),
          name,
          bio,
          image,
          onboarded: true,
        },
        { upsert: true } // update if there is already or create one
      );
    } catch (error: any) {
      throw new Error(`Failed to create/update user: ${error.message}`);
    }
  }