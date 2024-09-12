"use client";
import { useEffect, useState, type ReactNode } from "react";
import { useMediaQuery } from "usehooks-ts";
import SideBar from "./components/SideBar";
import { LoaderCircle } from "lucide-react";
import Hamburger from "./components/Hamburger";

interface Props {
  children: ReactNode;
  name: string;
}
function Client({ children, name }: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-white">
          <LoaderCircle className="animate-spin" size="1.5rem" />
        </div>
      )}
      <div className="bg-[#F5F7F8] min-h-screen">
        {isMobile ? <Hamburger {...{ name }} /> : <SideBar {...{ name }} />}

        <div
          className="p-4"
          style={{
            marginLeft: isMobile ? 0 : 260,
            paddingTop: isMobile ? 80 : 40,
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export default Client;
