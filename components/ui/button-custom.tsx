import { cva } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";

const classes = cva("border h-12 rounded-full px-6 font-medium transition-all active:scale-95", {
    variants: {
        variant: {
            primary: "bg-accent text-background border-accent hover:bg-accent/90",
            secondary: "border-foreground text-foreground bg-transparent hover:bg-foreground/10",
        },
        size: {
            sm: "h-10 px-4 text-sm",
        },
    },
});

export function Button(
    props: {
        variant: "primary" | "secondary";
        size?: "sm";
    } & ButtonHTMLAttributes<HTMLButtonElement>
) {
    const { variant, size, className, ...otherProps } = props;
    return (
        <button
            className={classes({
                variant,
                className,
                size,
            })}
            {...otherProps}
        />
    );
}
