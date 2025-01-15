import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import AttendesFunstion from "./components/AttendesFunstion";
import GetLocation from "./components/GetLocation";
import checkUserInDatabase from "./components/checkUserInDatabase";

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  checkUserInDatabase(user);

  return (
    <div className="flex items-center justify-between">
      <GetLocation/>
      <AttendesFunstion />
    </div>
  );
}
