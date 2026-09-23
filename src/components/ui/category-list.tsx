"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Bone, Compass, HeartPulse } from "lucide-react";
import styles from "./category-list.module.css";

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  featured?: boolean;
  icon?: "bowl" | "heart" | "compass";
}

export interface CategoryListProps {
  title: string;
  subtitle?: string;
  categories: Category[];
  headingLevel?: "h1" | "h2";
  isPage?: boolean;
}

const iconMap = {
  bowl: Bone,
  heart: HeartPulse,
  compass: Compass,
};

export function CategoryList({ title, subtitle, categories, headingLevel = "h2", isPage = false }: CategoryListProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const Heading = headingLevel;

  return (
    <div className={`${styles.wrapper} ${isPage ? styles.pageWrapper : ""}`}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <Heading className={styles.title}>{title}</Heading>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>

        <div className={styles.list}>
          {categories.map((category) => {
            const Icon = category.icon ? iconMap[category.icon] : ArrowRight;
            const isHovered = hoveredItem === category.id;
            return (
              <Link
                key={category.id}
                href={category.href}
                className={`${styles.item} ${isHovered ? styles.itemHovered : ""} ${category.featured ? styles.itemFeatured : ""}`}
                onMouseEnter={() => setHoveredItem(category.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onFocus={() => setHoveredItem(category.id)}
              >
                {isHovered && (
                  <>
                    <span className={`${styles.bracket} ${styles.bracketTopLeft}`} aria-hidden="true" />
                    <span className={`${styles.bracket} ${styles.bracketBottomRight}`} aria-hidden="true" />
                  </>
                )}
                <span className={styles.itemContent}>
                  <span className={styles.itemCopy}>
                    <span className={styles.itemTitle}>{category.title}</span>
                    <span className={styles.itemSubtitle}>{category.subtitle}</span>
                  </span>
                  <span className={`${styles.itemIcon} ${isHovered ? styles.itemIconVisible : ""}`} aria-hidden="true">
                    <Icon />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
