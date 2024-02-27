import NewPassword from "@/components/user/NewPassword";
import React from "react";

export const metadata = {
  title: "Reset Password",
};

interface Props {
  params: { resetToken: string };
}

const NewPasswordPage = ({ params }: Props) => {
  return <NewPassword resetToken={params?.resetToken} />;
};

export default NewPasswordPage;
