import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import MainPage from "./components/MainPage";
import checkUserInDatabase from "./components/checkUserInDatabase";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  checkUserInDatabase(user);

  return (
    <div>
      <MainPage user={user} />
    </div>
  );
}
