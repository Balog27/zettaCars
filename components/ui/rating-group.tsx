"use client";

import { RatingGroup } from "@ark-ui/react/rating-group";
import { StarIcon } from "lucide-react";

interface RatingProps {
  value: number;
  onValueChange: (value: number) => void;
  count?: number;
  allowHalf?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Rating({
  value,
  onValueChange,
  count = 5,
  allowHalf = true,
  size = "md"
}: RatingProps) {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10"
  };

  const itemSizeClasses = {
    sm: "w-6 h-6 p-0.5",
    md: "w-10 h-10 p-1",
    lg: "w-12 h-12 p-1"
  };

  return (
    <RatingGroup.Root
      count={count}
      value={value}
      onValueChange={(details: any) => onValueChange(details.value)}
      allowHalf={allowHalf}
    >
      <RatingGroup.Control className="inline-flex gap-1">
        <RatingGroup.Context>
          {(context: any) =>
            context.items.map((item: number) => (
              <RatingGroup.Item
                key={item}
                index={item}
                className={`${itemSizeClasses[size]} focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded-lg hover:scale-110 transition-transform cursor-pointer`}
              >
                <RatingGroup.ItemContext>
                  {(itemContext: any) => {
                    if (itemContext.half) {
                      return (
                        <div className={`relative ${sizeClasses[size]}`}>
                          <StarIcon className={`${sizeClasses[size]} text-gray-300 dark:text-gray-600`} />
                          <div className="absolute inset-0 overflow-hidden w-1/2">
                            <StarIcon className={`${sizeClasses[size]} text-yellow-500 fill-current`} />
                          </div>
                        </div>
                      );
                    }
                    if (itemContext.highlighted) {
                      return (
                        <StarIcon className={`${sizeClasses[size]} text-yellow-500 fill-current`} />
                      );
                    }
                    return (
                      <StarIcon className={`${sizeClasses[size]} text-gray-300 dark:text-gray-600`} />
                    );
                  }}
                </RatingGroup.ItemContext>
              </RatingGroup.Item>
            ))
          }
        </RatingGroup.Context>
        <RatingGroup.HiddenInput />
      </RatingGroup.Control>
    </RatingGroup.Root>
  );
}
