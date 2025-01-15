import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import React from "react";
import GetUserFS from "../components/GetUserFS";

const Navbar = async () => {
  const user = await GetUserFS();

  return (
    <div>
      {!user ? (
        <>
          <div>
            <LoginLink>
              <button className="bg-blue-600 px-5 py-2 rounded-lg text-white">
                Login
              </button>
            </LoginLink>
          </div>
        </>
      ) : (
        <div className="flex gap-5 p-5 items-center justify-between border">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="border w-[60px] h-[60px] rounded-full overflow-hidden shadow-md relative">
                {user.picture ? (
                  <>
                    <Image
                      className="object-cover"
                      fill
                      src={user?.picture}
                      alt=""
                    />
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className="font-bold text-2xl">
                {user.family_name} {user.given_name}
                <p className="text-gray-500 !font-light text-sm">
                  {user.email}
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}
          <LogoutLink>
            <button className="bg-red-600 px-5 py-2 rounded-lg text-white">
              Log out
            </button>
          </LogoutLink>
        </div>
      )}
    </div>
  );
};

export default Navbar;
