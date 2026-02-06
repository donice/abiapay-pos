// This componemt is written using tailwind because of time. Please follow through with it

import Image from "next/image";
import React from "react";
import { TbUser } from "react-icons/tb";
import { MdOutlineShareLocation } from "react-icons/md";
import Link from "next/link";

const ViewAllIndividualABSSIN = (data: any) => {
  console.log(data?.data?.data, "data");
  const ABSSINs = data?.data?.data;

  return (
    <div>
      {ABSSINs?.map((abssin: any, idx: number) => (
        <Link
          href={`/identity/view/individual/${abssin?.state_id}`}
          key={idx}
          className="border-b border-gray-300 py-4 grid  gap-4"
        >
          <div className="">
            {/* {abssin?.PhotoID ? <Image src={abssin?.PhotoID  || '/images/default.png'} alt={""} width={100} height={100} className="object-cover"/> : <div></div>} */}
            {abssin?.PhotoID ? (
              <TbUser className="text-3xl text-gray-400" />
            ) : null}
          </div>
          <div className="col-span-2 text-sm flex flex-col justify-between">
            <div>
              <h2 className="font-semibold text-green-500">
                {abssin?.state_id}
              </h2>
              <p className="font-[600] capitalize text-gray-600">
                {abssin?.surname} {abssin?.first_name} {abssin?.middle_name}{" "}
              </p>
              <p className="text-gray-400 text-[10px]">{abssin?.email}</p>
              <p className="text-gray-400 text-[10px]">
                Date of birth: {abssin?.birth_date}
              </p>
            </div>

            <div>
              <p className="text-gray-400 flex items-center gap-1 text-[10px]">
                <MdOutlineShareLocation className="text-sm" /> {abssin?.lga}
              </p>
              <p className="text-gray-400">{abssin?.address}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ViewAllIndividualABSSIN;
