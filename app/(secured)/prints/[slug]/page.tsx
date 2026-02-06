import PrintIDComp from "@/src/components/modules/prints/id";
import PrintStickerComp from "@/src/components/modules/prints/sticker";
import { redirect } from "next/navigation";
import React from "react";

const page = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;

  if(slug !== "sticker" && slug !== "id") {
    redirect("/dashboard")
  }

  return (
    <div>
      {slug === "sticker" ? (
        <PrintStickerComp />
      ) : slug === "id" ? (
        <PrintIDComp />
      ) : null}
    </div>
  );
};

export default page;
