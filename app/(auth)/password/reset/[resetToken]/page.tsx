import NewPassword from "@/components/user/NewPassword";
import React from "react";

export const metadata = {
  title: "Reset Password",
};

interface Props {
  params: { resetToken: string };
}

const NewPasswordPage = ({ params }: Props) => {
  return (
    <div>
      <NewPassword resetToken={params?.resetToken} />
    </div>
  );
};

export default NewPasswordPage;
