"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";

function SignInButton() {
  const urlParms = useSearchParams();
  const redirect_to = urlParms.get("redirect_to");

  const handleLogin = () => {
    window.location.href =
      process.env.NEXT_PUBLIC_API_URL +
      "/auth/google" +
      (redirect_to ? `?redirect_to=${redirect_to}` : "");
  };

  return (
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
  );
}

export default SignInButton;
