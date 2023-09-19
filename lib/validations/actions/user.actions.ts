"use server";

import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";

interface Params {
    name: string;
    username: string;
    userId: string;
    bio: string;
    image: string;
  }
  
  export async function updateUser({
    name,
    username,
    userId,
    bio,
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
        { upsert: true,
          writeConcern: { w: 'majority' }  }, // update if there is already or create one
      );
    } catch (error: any) {
      throw new Error(`Failed to create/update user: ${error.message}`);
    }
  }

  export async function fetchUser(userId: string){
    try{
      connectToDB();

      return await User
                    .findOne({id: userId})
                    // .populate({
                    //   path: 'communitites'
                    //   model: Community
                    // })
    }catch(error){
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

