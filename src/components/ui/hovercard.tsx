// components/ui/hover-card.tsx
import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

import { cn } from "@/lib/utils";

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;
const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, ...props }, ref) => (
  <HoverCardPrimitive.Content
  ref={ref}
  portalled
  sideOffset={8} // optional: 카드와 간격 띄우기
  className={cn(
    "z-[9999] w-64 rounded-md border border-gray-200 bg-white p-4 shadow-md outline-none",
    className
  )}
  {...props}
/>
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

export { HoverCard, HoverCardTrigger, HoverCardContent };
