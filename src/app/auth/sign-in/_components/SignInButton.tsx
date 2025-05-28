"use client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { getBasePath } from "~/lib/getBasePath";

function SignInButton() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect_to");

  const handleLogin = () => {
    const redirectParams = !!redirectTo ? `?redirect_to=${redirectTo}` : "";

    window.location.href = window.env.API_URL + "/auth/google" + redirectParams;
  };

  return (
    <Button
      onClick={handleLogin}
      variant="outline"
      className="w-[400px] h-12 text-gray-900"
    >
      <Image
        src={`/${getBasePath()}/icons/google-icon.svg`}
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
