import React, { Suspense } from "react";
import SignInButton from "./_components/SignInButton";
import Alert from "./_components/Alert";

function SignInPage() {
  return (
    <>
      <Suspense>
        <Alert />
      </Suspense>
      <div className="flex justify-center items-center h-screen bg-zinc-50">
        <div className="space-y-6">
          <h4 className="text-xl font-medium text-center text-gray-900">
            เข้าสู่ระบบ
          </h4>
          <Suspense>
            <SignInButton />
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default SignInPage;
