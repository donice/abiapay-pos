"use client";
import { Button } from "@/src/components/common/button";
import { useRouter } from "next/navigation";
import React from "react";
import { FcOk } from "react-icons/fc";

const Page = () => {
  const router = useRouter();
  return (
    <div className="w-full h-96 flex flex-col items-center justify-center">
      <div className="mb-10 flex flex-col items-center justify-center text-center">
        <FcOk className="text-[100px]" />
        <h1 className="font-bold text-2xl">Success</h1>
        <p className="text-sm text-gray-600">
          Your transaction was successful, kindly proceed to the dashboard
        </p>
      </div>
      <Button
        text="Go to dashboard"
        onClick={() => router.push("/dashboard")}
      />
    </div>
  );
};

export default Page;
