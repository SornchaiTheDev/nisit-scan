"use client";
import { useAtomValue } from "jotai";
import { LoaderCircle } from "lucide-react";
import { loadingAtom } from "~/atoms/loading";

function Loading() {
  const isLoading = useAtomValue(loadingAtom);
  return (
    <div
      className="fixed top-0 bg-gray-900 shadow-md transition-all duration-500 ease-in-out w-full flex justify-center items-center z-50 rounded-b-xl"
      style={{
        opacity: isLoading ? 1 : 0,
        transform: `translateY(${isLoading ? 0 : -100}%)`,
      }}
    >
      <LoaderCircle className="text-white animate-spin" size="1rem" />
      <h5 className="text-sm text-white p-2">กำลังโหลด...</h5>
    </div>
  );
}

export default Loading;
