import React from "react";

const Button: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <button className={`px-4 py-2 rounded ${className}`}>{children}</button>
);

export default Button