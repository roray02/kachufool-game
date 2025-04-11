import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = (props: InputProps) => (
  <input
    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
    {...props}
  />
);
