import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";

const GetUserFS = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  return user;
};

export default GetUserFS;
