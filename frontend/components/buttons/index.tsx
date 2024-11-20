import { forwardRef, ReactNode } from "react";
import { FiLoader } from "react-icons/fi";

import styles from "./index.module.scss";

type ButtonProps = {
  icon?: ReactNode;
  children?: ReactNode;
  loading?: boolean;
} & React.ComponentPropsWithoutRef<"button">;

export const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  function PrimaryButton(props, ref) {
    const { loading, icon, className, children, ...otherProps } = props;

    return (
      <button className={styles.PrimaryButton} ref={ref} {...otherProps}>
        {loading && <FiLoader className={styles.Rotate} />}
        {!loading && icon}
        {children}
      </button>
    );
  },
);
