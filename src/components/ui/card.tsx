import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className = "" }: CardProps) => (
  <div className={`bg-white shadow-md rounded-2xl p-4 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }: CardProps) => (
  <div className={`space-y- text-black ${className}`}>{children}</div>
);
