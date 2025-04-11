import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export const Button = ({ children, ...props }: ButtonProps) => (
  <button
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
    {...props}
  >
    {children}
  </button>
);
