import { Metadata } from "next";
import UserAccountComponent from "@/src/components/modules/settings";

export const metadata: Metadata = {
  title: "Add Ticket",
  description: "Agents Portal Tickets Page",
};

const Settings = () => {
  return (
    <div><UserAccountComponent/></div>
  )
}

export default Settings