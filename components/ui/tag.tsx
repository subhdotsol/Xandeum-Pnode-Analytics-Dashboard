import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export function Tag(props: HTMLAttributes<HTMLDivElement>) {
    const { className, children, ...otherProps } = props;
    return (
        <div
            className={twMerge(
                "inline-flex border border-accent gap-2 text-accent px-3 py-1 rounded-full uppercase items-center text-xs font-semibold",
                className
            )}
            {...otherProps}
        >
            <span>&#10038;</span>
            <span>{children}</span>
        </div>
    );
}
