import React from "react";

export function Footer() {
  return (
    <>
      <div className="join p-5">
        <button className="join-item btn">1</button>
        <button className="join-item btn btn-active">2</button>
        <button className="join-item btn">3</button>
        <button className="join-item btn">4</button>
      </div>
      <footer
        className="footer p-10 bg-neutral text-neutral-content"
        style={{ borderRadius: "10px", backgroundColor: "#0033bb" }}
      >
        <nav>
          <h6 className="footer-title">Services</h6>
          <a className="link link-hover">Laser</a>
          <a className="link link-hover">Systems</a>
          <a className="link link-hover">Smart Factory</a>
          <a className="link link-hover">Machines</a>
        </nav>
        <nav>
          <h6 className="footer-title">Company</h6>
          <a className="link link-hover">Feedback</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
        </nav>
        <nav>
          <h6 className="footer-title">Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </footer>
    </>
  );
}
