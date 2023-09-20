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
    try{
        connectToDB();
        const createdThread = await Thread.create({
            text,
            author
        });
    
        // update the user about the thread created
        await User.findByIdAndUpdate(author, {
            $push: {threads: createdThread._id}
        });
    
        revalidatePath(path);
    }catch (error: any){
        throw new Error(`Failed to create thread: ${error.message}`);
    }
}

export async function fetchThreads(pageNumber=1, pageSize=20){
    try{
        connectToDB();

        // Calculate the number of posts to skip
        const skipAmount = (pageNumber-1)*pageSize;

        // fetch the threads that have no parent; those are top level threads
        const threadsQuery = Thread.find({parentId: { $in: [null, undefined] }})
                                .sort({createdAt: 'desc'})
                                .skip(skipAmount)
                                .limit(pageSize)
                                .populate({path: 'author', model: User})
                                .populate({path: 'children',
                                        model: Thread,
                                        populate: {
                                            path: 'author',
                                            model: User,
                                            select: "_id name parentId image"
                                        }
                                    })
        // total threads which are not comments
        const totalThreadCount = await Thread.countDocuments({parentId: { $in: [null, undefined] }});

        // Get the total count of threads
        const threads = await threadsQuery.exec();

        const isNext = totalThreadCount > skipAmount + threads.length

        return { threads, isNext };


    }catch(error: any){
        throw new Error(`Failed to create thread: ${error.message}`);
    }
}

export async function fetchThreadById(id: string){
    connectToDB();

    try{

        const thread = await Thread.findById(id)
                            .populate({
                                path: 'author',
                                model: User,
                                select: "_id id name image"
                            })
                            .populate({
                                path: 'children',
                                model: Thread,
                                populate: [
                                    {
                                        path: 'author',
                                        model: User,
                                        select: "_id name parentId image"
                                    },
                                    {
                                        path: 'children',
                                        model: Thread,
                                        populate: {
                                            path: 'author',
                                            model: User,
                                            select: "_id name parentId image"
                                        }
                                    }
                            
                            ]
                            }).exec();

        return thread;

    }catch(error: any){
        throw new Error(`Failed to fetch thread by Id: ${error.message}`);
    }
}

export async function addCommentToThread(threadId: string,
                                        commentText: string,
                                        userId: string,
                                        path: string){
    connectToDB();

    try{
        const originalThread = await Thread.findById(threadId);

        if(!originalThread){
            throw new Error("Thread not found!");
        }

       // Create the new comment thread
        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId, // Set the parentId to the original thread's ID
        });

        // Save the comment thread to the database
        const savedCommentThread = await commentThread.save();

        // Add the comment thread's ID to the original thread's children array
        originalThread.children.push(savedCommentThread._id);

        // Save the updated original thread to the database
        await originalThread.save();

        revalidatePath(path);

    }catch(error: any){
        throw new Error(`Failed to create comment: ${error.message}`);
    }
}