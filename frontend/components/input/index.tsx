import { forwardRef } from "react";

import styles from "./index.module.scss";

type InputProps = {
  label: string;
} & React.ComponentPropsWithoutRef<"input">;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(props, ref) {
    const { label, children, ...otherProps } = props;

    return (
      <div className={styles.Input}>
        <label>{label}</label>
        <input className={styles.PrimaryButton} ref={ref} {...otherProps} />
      </div>
    );
  },
);
