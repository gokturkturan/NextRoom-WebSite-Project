"use client";

import { useForgotPasswordMutation } from "@/redux/api/authApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ButtonLoader from "../layout/ButtonLoader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [forgotPassword, { isLoading, isSuccess, error }] =
    useForgotPasswordMutation();

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) return toast.error("Please fill the email box");

    forgotPassword({ email });
  };

  useEffect(() => {
    if (error && "data" in error) toast.error(error?.data?.errMessage);

    if (isSuccess) {
      toast.success("Email sent successfully");

      setEmail("");
    }
  }, [error, isSuccess]);

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form className="shadow rounded bg-body" onSubmit={submitHandler}>
          <h2 className="mb-4">Forgot Password</h2>
          <div className="mb-3">
            <label htmlFor="email_field" className="form-label">
              {" "}
              Enter Email{" "}
            </label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="form-btn w-100 py-2"
            disabled={isLoading}
          >
            {isLoading ? <ButtonLoader /> : "Send Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
