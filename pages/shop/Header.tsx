import React from "react";

export function Header() {
  return (
    <div
      className="navbar bg-base-100 bg-base-100 shadow-xl"
      style={{ borderRadius: "10px" }}
    >
      <div className="flex-1">
        <img
          alt="Trumpf Logo"
          src="/trumpf_logo.jpg"
          className="w-20 h-18 mr-2"
        />
        <a className="text-xl">MyTrumpf Sustainability Shop</a>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">🔆 108 Stars</a>
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img alt="Not existing person" src="/demo_person.jpeg" />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">Profile</a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
