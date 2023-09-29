import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import UserCard from "@/components/cards/UserCard";
import { fetchCommunities } from "@/lib/actions/community.actions";
import CommunityCard from "@/components/cards/CommunityCard";

async function RightSidebar() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // Fetch users
  const usersResult = await fetchUsers({
    userId: user.id,
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });

  // Fetch communities
  const commmunitiesResult = await fetchCommunities({
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>

        <div className="mt-14 flex flex-col gap-9">
          {commmunitiesResult.communities.length === 0 ? (
            <p className="no-result">No users</p>
          ) : (
            <>
              {commmunitiesResult.communities.map((community, index) => {
                if (index < 1) {
                  return (
                    <CommunityCard
                      key={community.id}
                      id={community.id}
                      name={community.name}
                      username={community.username}
                      imgUrl={community.image}
                      bio={community.bio}
                      members={community.members}
                    />
                  );
                }
              })}
            </>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>
        <div className="mt-14 flex flex-col gap-9">
          {usersResult.users.length === 0 ? (
            <p className="no-result">No users</p>
          ) : (
            <>
              {usersResult.users.map((person, index) => {
                if (index < 3) {
                  return (
                    <UserCard
                      key={person.id}
                      id={person.id}
                      name={person.name}
                      username={person.username}
                      imgUrl={person.image}
                      personType="User"
                    />
                  );
                }
              })}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default RightSidebar;
