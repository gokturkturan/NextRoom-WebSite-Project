import UserSideBar from "@/components/layout/UserSideBar";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const UserLayout = ({ children }: Props) => {
  return (
    <div>
      <div className="mt-2 mg-4 bg-light py-4">
        <h2 className="text-secondary text-center">User Settings</h2>
      </div>
      <div className="container">
        <div className="row justify-content-around">
          <div className="col-12 col-lg-3">
            <UserSideBar />
          </div>
          <div className="col-12 col-lg-8 user-dashboard">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
