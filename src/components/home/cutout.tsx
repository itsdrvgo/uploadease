import { cn } from "@/lib/utils";
import { GenericProps } from "@/types";

interface CutOutProps extends GenericProps {
    isReversed?: boolean;
}

function CutOut({ className, isReversed, ...props }: CutOutProps) {
    return (
        <div
            className={cn("h-[5px] bg-gray-300", className)}
            style={{
                backgroundImage: isReversed
                    ? "url(./waves_reversed.png)"
                    : "url(./waves_normal.png)",
                backgroundRepeat: "repeat-x",
                backgroundPosition: "center",
                backgroundSize: "contain",
            }}
            {...props}
        />
    );
}

export default CutOut;
