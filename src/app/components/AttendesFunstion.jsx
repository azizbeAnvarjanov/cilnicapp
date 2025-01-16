"use client";
import React from "react";

import withIpCheck from "../hoc/withIpCheck";

const AttendesFunstion = ({ user }) => {
  return <div>AttendesFunstion - {user.email}</div>;
};

export default withIpCheck(AttendesFunstion);
