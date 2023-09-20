import ThreadCard from "@/components/cards/ThreadCard"
import { fetchThreadById } from "@/lib/validations/actions/thread.actions";
import { fetchUser } from "@/lib/validations/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Comment from "@/components/forms/Comment";


const Page = async ({params } : {params: {id: string}}) => {
    if(!params.id) return null;
    const user = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding');

    const thread = await fetchThreadById(params.id);
    return(
        <section>
            <div>
            <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={user?.id}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                createdAt={thread.createdAt}
                comments={thread.children}
            />
            </div>

            <div className='mt-7'>
                <Comment
                    threadId={params.id}
                    currentUserImg={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>
        </section>
    )
}

export default Page;