
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  onClick,
  ...props
}) => {
  let baseStyles = 'font-bold rounded-xl h-12 flex items-center justify-center transition-all duration-200 ease-in-out whitespace-nowrap';
  let variantStyles = '';
  let sizeStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-primary text-textLight hover:bg-primary/90 dark:bg-primary-dark dark:hover:bg-primary-dark/90';
      break;
    case 'secondary':
      variantStyles = 'bg-secondary text-textLight hover:bg-secondary/90';
      break;
    case 'accent':
      variantStyles = 'bg-accent text-textLight hover:bg-accent/90';
      break;
    case 'outline':
      variantStyles = 'border-2 border-primary text-primary hover:bg-primary/10 dark:border-primary-dark dark:text-primary-dark dark:hover:bg-primary-dark/10';
      break;
  }

  switch (size) {
    case 'small':
      sizeStyles = 'px-4 text-label'; // 16px padding
      break;
    case 'medium':
      sizeStyles = 'px-6 text-body'; // 24px padding
      break;
    case 'large':
      sizeStyles = 'px-8 text-h2'; // 32px padding
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
