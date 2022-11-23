import { ReactNode } from "react";

interface ModalProps {
  children: Array<ReactNode> | ReactNode;
  title: string;
}

export default function ({ children, title }: ModalProps) {
  return (
    <div className="absolute h-screen w-screen backdrop-blur-sm flex justify-center items-center">
      <div
        className="bg-white border border-rounded shadow-md w-10/12"
        style={{ maxWidth: 400 }}
      >
        <header className="p-4 border-b">
          <h3 className="text-4xl">{title}</h3>
        </header>
        <section className="p-4">{children}</section>
      </div>
    </div>
  );
}
