import DyamicView from "@/src/components/modules/identity/view/individual/DyamicView";
import React from "react";

const page = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  console.log(id);
  // console.log(params.id);

  return <DyamicView id={id} />;
};

export default page;
