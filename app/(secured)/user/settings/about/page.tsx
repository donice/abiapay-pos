import React from "react";
import "./style.scss";
import { CustomHeader } from "@/src/components/common/header";

const AboutPage = () => {
  return (
    <section>
      <CustomHeader
        title={"About Abiapay"}
        desc={"Information about Abiapay"}
      />
      <div className="aboutpage">
        <h2>Introducing Abiapay</h2>
        <p>
          {" "}
          Welcome to the Abia State Internal Revenue Service (IRS) Mobile
          Application - your one-stop solution for seamless and efficient tax
          management. At Abia State IRS, we are committed to revolutionizing the
          way you interact with your tax obligations. Our mobile app is more
          than just a platform; it&apos;s a commitment to providing you with a
          seamless, convenient, transparent, and user-friendly experience in
          managing your tax responsibilities.
        </p>
        <h3> Who We Are:</h3>
        <p>
          Abia State IRS is a dynamic and forward-thinking revenue agency
          dedicated to fostering economic development through effective tax
          administration. With a focus on innovation and customer satisfaction,
          we aim to simplify the tax process and enhance the overall taxpayer
          experience.
        </p>
        <h3>Our Vision:</h3>
        <p>
          To be a leading revenue agency that leverages technology to provide
          world-class tax services, contributing to the sustainable development
          of Abia State.
        </p>
        <h3>Our Mission:</h3>
        <p>
          We are dedicated to efficiently collecting, managing, and optimizing
          revenue for the development of Abia State by leveraging cutting-edge
          technology, fostering compliance, and ensuring a positive taxpayer
          experience.
        </p>
        <h2>Why Abia State IRS Mobile App</h2>
        <h3>Simplified Tax Management:</h3>
        <p>
          Our mobile app provides an intuitive platform for taxpayers to easily
          manage their tax obligations. From filing returns to making payments,
          everything you need is just a few taps away.
        </p>
        <h3> Real-Time Updates:</h3>
        <p>
          Stay informed with real-time updates on tax-related news, changes in
          regulations, and important announcements from Abia State IRS. We keep
          you in the loop, ensuring you are always up-to-date.
        </p>{" "}
        <h3>Secure and Convenient Transactions:</h3>
        <p>
          Enjoy the convenience of secure and hassle-free transactions. Our
          mobile app prioritizes the security of your information, providing a
          reliable and trusted platform for all your tax-related activities.
        </p>
        <h3>User-Friendly Interface:</h3>
        <p>
          Designed with simplicity in mind, our app is user-friendly and
          accessible to individuals and businesses alike. Whether you are a
          seasoned taxpayer or a first-time filer, our app makes the process
          smooth and straightforward.
        </p>
        <h3>Access to Resources:</h3>
        <p>
          Explore a wealth of resources, including tax guides, FAQs, and other
          educational materials. Abia State IRS is committed to empowering
          taxpayers with the knowledge they need to navigate the tax landscape
          with confidence.
        </p>
        <h3>Get Started</h3>
        <p>
          Download the Abia State IRS Mobile App today and embark on a journey
          towards a more streamlined and efficient tax experience. We are here
          to support you in fulfilling your tax responsibilities and
          contributing to the growth and development of Abia State. Thank you
          for choosing Abia State IRS - where innovati is taxation for a
          brighter future!
        </p>
      </div>
    </section>
  );
};

export default AboutPage;
