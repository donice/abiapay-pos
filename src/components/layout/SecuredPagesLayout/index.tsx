import React from "react";
import SideNav from "./components/nav/SideNav";
import TopNav from "./components/nav/TopNav";
import BottomNav from "./components/nav/ButtomNav";
import AuthGuard from "@/src/routes/AuthGuard";
import "./style.scss";
import { getCurrentYear } from "@/src/utils/getCurrentYear";

const SecuredPagesLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AuthGuard>
      <TopNav />
      <div>
        <SideNav />
        <section className="main-section">
          {children}
          <footer>
            © {getCurrentYear()} Abia State Government. <br /> All rights reserved.
          </footer>
        </section>
      </div>
      <BottomNav />
    </AuthGuard>
  );
};

export default SecuredPagesLayout;
