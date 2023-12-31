import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/validations/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// import PostThread from "@/components/forms/PostThread";
// import { fetchUser } from "@/lib/actions/user.actions";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className='head-text'>Do you have any opinion?</h1>

      <PostThread userId={JSON.parse(JSON.stringify(userInfo._id))} />
    </>
  );
}

export default Page;