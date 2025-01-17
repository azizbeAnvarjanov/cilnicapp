import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import MainPage from "./components/MainPage";
import checkUserInDatabase from "./components/checkUserInDatabase";

export default async function Home() {
  const { getUser, getRoles } = getKindeServerSession();
  const user = await getUser();
  const role = await getRoles();
  const is_role = role[0]?.name

  checkUserInDatabase(user);

  return (
    <div>
      <MainPage user={user} role={is_role} />
    </div>
  );
}
