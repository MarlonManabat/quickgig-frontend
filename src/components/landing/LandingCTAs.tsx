import React from "react";
import { withAppOrigin } from "@/lib/url";
import { ROUTE_FIND, ROUTE_POSTS } from "@/config/routes";

type Props = {
  findClassName?: string;
  postClassName?: string;
  showFind?: boolean;
  showPost?: boolean;
};

export default function LandingCTAs({
  findClassName = "",
  postClassName = "",
  showFind = true,
  showPost = true,
}: Props) {
  return (
    <div className="flex gap-3">
      {showFind && (
        <a href={withAppOrigin(ROUTE_FIND)} className={findClassName}>
          Find Work
        </a>
      )}
      {showPost && (
        <a href={withAppOrigin(ROUTE_POSTS)} className={postClassName}>
          Post Job
        </a>
      )}
    </div>
  );
}

