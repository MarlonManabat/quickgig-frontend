import React from "react";
import { withAppOrigin } from "@/lib/url";
import { ROUTE_FIND, ROUTE_POSTS } from "@/config/routes";

type Props = {
  findClassName?: string;
  postClassName?: string;
};

export default function LandingCTAs({ findClassName = "", postClassName = "" }: Props) {
  return (
    <div className="flex gap-3">
      <a href={withAppOrigin(ROUTE_FIND)} className={findClassName}>
        Find Work
      </a>
      <a href={withAppOrigin(ROUTE_POSTS)} className={postClassName}>
        Post Job
      </a>
    </div>
  );
}
