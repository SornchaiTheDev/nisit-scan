"use client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";

function SignInButton() {
  const urlParms = useSearchParams();
  const redirect_to = urlParms.get("redirect_to");

  const handleLogin = () => {
    window.location.href =
      window.API_URL +
      "/auth/google" +
      (redirect_to ? `?redirect_to=${redirect_to}` : "");
  };

  return (
    <Button
      onClick={handleLogin}
      variant="outline"
      className="w-[400px] h-12 text-gray-900"
    >
      <Image
        src="/icons/google-icon.svg"
        alt="Google Icon"
        width={24}
        height={24}
        className="mr-2"
      />
      เข้าสู่ระบบด้วย Google
    </Button>
  );
}

export default SignInButton;
