"use server";

import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { revalidatePath } from "next/cache";

interface Params{
    text: String,
    author: string,
    communityId: string | null,
    path: string
}
export async function createThread({text, author, communityId, path}: Params){
    connectToDB();

    const createdThread = await Thread.create({
        text,
        author,
        community: null,
    });

    // update the user about the thread created
    await User.findByIdAndUpdate(author, {
        $push: {threads: createdThread._id}
    })

    revalidatePath(path);
}