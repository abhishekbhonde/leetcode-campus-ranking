"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const variants = {
    initial: { backgroundPosition: "0 50%" },
    animate: { backgroundPosition: ["0, 50%", "100% 50%", "0 50%"] },
  };

  return (
    <div className={cn("relative p-[1px] group", containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? { duration: 5, repeat: Infinity, repeatType: "reverse" }
            : undefined
        }
        style={{ backgroundSize: animate ? "400% 400%" : undefined }}
        className={cn(
          "absolute inset-0 rounded-xl z-[1] opacity-40 group-hover:opacity-80 blur-xl transition duration-500",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,rgba(255,255,255,0.08),transparent),radial-gradient(circle_farthest-side_at_100%_0,rgba(255,255,255,0.06),transparent),radial-gradient(circle_farthest-side_at_100%_100%,rgba(255,255,255,0.04),transparent),radial-gradient(circle_farthest-side_at_0_0,rgba(255,255,255,0.1),transparent)]"
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? { duration: 5, repeat: Infinity, repeatType: "reverse" }
            : undefined
        }
        style={{ backgroundSize: animate ? "400% 400%" : undefined }}
        className={cn(
          "absolute inset-0 rounded-xl z-[1]",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,rgba(255,255,255,0.05),transparent),radial-gradient(circle_farthest-side_at_100%_0,rgba(255,255,255,0.04),transparent),radial-gradient(circle_farthest-side_at_100%_100%,rgba(255,255,255,0.03),transparent),radial-gradient(circle_farthest-side_at_0_0,rgba(255,255,255,0.06),transparent)]"
        )}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
