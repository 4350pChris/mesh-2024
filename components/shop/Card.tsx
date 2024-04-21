import React from "react";

interface CardProps {
  picture: string; // Prop for the image URL
  name: string; // Prop for the image name
  tag: string; // Prop for the image tag
}

export const Card: React.FC<CardProps> = ({ picture, name, tag }) => {
  return (
    <>
      <div className="card w-96 bg-base-100 shadow-xl m-4 btn-ghost">
        <figure>
          <img src={picture} alt={name} className="h-52 object-fit" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{name}</h2>
          <div className="card-actions justify-end">
            <div
              className="badge badge-outline"
              style={{ backgroundColor: "#bbd03a" }}
            >
              {tag}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
