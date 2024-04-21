import React from "react";
import { Card } from "./Card.jsx";
import { Header } from "./Header.jsx";
import { Footer } from "./Footer.jsx";

export default function Page() {
  return (
    <>
      <ul className="space-evenly">
        <Header></Header>
        <div className="flex flex-row m-8">
          <Card picture={"/hoodie.jpg"} name={"Donate"} tag={">5 Stars"} />
          <Card picture={"/business.jpg"} name={"Guidance"} tag={">25 Stars"} />
          <Card
            picture={"/technology.jpg"}
            name={"Tech Meeting"}
            tag={">50 Stars"}
          />
        </div>
        <div className="flex flex-row m-8">
          <Card picture={"/xperience.jpg"} name={"Sports"} tag={">100 Stars"} />
          <Card picture={"/teddy.jpg"} name={"Merchandise"} tag={">15 Stars"} />
          <Card picture={"/discount.jpg"} name={"Discount"} tag={">35 Stars"} />
        </div>
      </ul>
      <Footer />
    </>
  );
}
