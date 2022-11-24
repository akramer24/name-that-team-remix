import classNames from "classnames";
import { MouseEventHandler, ReactNode, Ref, RefObject } from "react";

type ButtonTypes = 'default' | 'primary';

interface ButtonProps {
  children: Array<ReactNode> | ReactNode | string;
  disabled?: boolean,
  grow?: boolean,
  onClick: MouseEventHandler,
  type?: ButtonTypes,
}

export default function Button({ children, disabled = false, grow = false, onClick, type = 'default' }: ButtonProps) {
  return (
    <button
      className={
        classNames(
          'hover:transition disabled:text-gray-100 disabled:bg-gray-400 disabled:cursor-not-allowed',
          {
            'flex-1': grow,
            'bg-blue-600': type === 'primary',
            'hover:bg-blue-400': type === 'primary',
            'text-gray-100': type === 'primary',
            'border': type === 'default',
            'border-gray-200': type === 'default',
            'hover:text-blue-400': type === 'default' && !disabled,
            'hover:border-blue-400': type === 'default' && !disabled,
          }
        )
      }
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
