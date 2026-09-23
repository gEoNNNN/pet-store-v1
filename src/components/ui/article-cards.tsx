import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ArticleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The category tag (e.g. 'CÂINI', 'PISICI', 'ROZĂTOARE'). */
  category: string;
  /** The main title of the card. */
  title: string;
  /** Optional subtitle or description. */
  description?: string;
  /** The price if applicable. */
  price?: number;
  /** Custom button label (defaults to 'Vezi produse' or 'Read for $X'). */
  actionText?: string;
  /** The URL for the background image. */
  imageUrl: string;
  /** The gradient classes for the overlay. */
  gradient: string;
}

export const ArticleCard = React.forwardRef<HTMLDivElement, ArticleCardProps>(
  (
    {
      category,
      title,
      description,
      price,
      actionText,
      imageUrl,
      gradient,
      className,
      ...props
    },
    ref
  ) => {
    const buttonLabel =
      actionText ||
      (typeof price === "number" ? `De la ${price.toFixed(2)} MDL` : "Vezi produse");

    return (
      <div
        ref={ref}
        className={cn(
          "group relative flex h-88 cursor-pointer flex-col justify-between overflow-hidden rounded-2xl p-6 text-white shadow-md transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-2xl",
          className
        )}
        {...props}
      >
        {/* Background Image Container */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-108"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />

        {/* Gradient Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t opacity-85 transition-opacity duration-300 group-hover:opacity-90",
            gradient
          )}
        />

        {/* Subtle Dark Vignette for guaranteed readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 flex h-full flex-col justify-between">
          {/* Top Section: Category Pill */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/95 backdrop-blur-md border border-white/10">
              {category}
            </span>
          </div>

          {/* Bottom Section: Title, Description & Action Button */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug drop-shadow-sm">
                {title}
              </h3>
              {description && (
                <p className="mt-1.5 text-xs sm:text-sm text-white/80 line-clamp-2 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            <div className="pt-1">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md border border-white/20 transition-all duration-300 group-hover:bg-white group-hover:text-slate-900 group-hover:border-white shadow-sm">
                <span>{buttonLabel}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ArticleCard.displayName = "ArticleCard";
