"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "~/components/ui/button";

function SignInPage() {
  const urlParms = useSearchParams();
  const redirect_to = urlParms.get("redirect_to");

  const handleLogin = () => {
    window.location.href =
      process.env.NEXT_PUBLIC_API_URL +
      "/auth/google" +
      (redirect_to ? `?redirect_to=${redirect_to}` : "");
  };
  return (
    <div className="flex justify-center items-center h-screen bg-zinc-50">
      <div className="space-y-6">
        <h4 className="text-xl font-medium text-center text-gray-900">
          เข้าสู่ระบบ
        </h4>
        <Button
          onClick={handleLogin}
          variant="outline"
          className="w-[400px] h-12 text-gray-900"
        >
          <img
            src="/icons/google-icon.svg"
            alt="Google Icon"
            className="w-6 h-6 mr-2"
          />
          เข้าสู่ระบบด้วย Google
        </Button>
      </div>
    </div>
  );
}

export default SignInPage;
