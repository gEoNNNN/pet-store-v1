"use client";

import { CategoryList, type Category } from "./ui/category-list";
import { useI18n } from "@/i18n/provider";

const toolMeta = [
  {
    id: "food",
    href: "/instrumente/calculator-hrana",
    icon: "bowl",
    featured: true,
  },
  {
    id: "health",
    href: "/instrumente/nivel-sanatate",
    icon: "heart",
  },
  {
    id: "finder",
    href: "/instrumente/recomandare-produse",
    icon: "compass",
  },
] as const;

const anchorIds: Record<string, string> = {
  food: "calculator-hrana",
  health: "nivel-sanatate",
  finder: "recomandare-produse",
};

export default function ToolsSection({
  headingLevel = "home",
  isPage,
  useAnchorLinks = false,
}: {
  headingLevel?: "home" | "page";
  isPage?: boolean;
  useAnchorLinks?: boolean;
}) {
  const { t } = useI18n();

  const tools: Category[] = toolMeta.map((tool) => ({
    id: tool.id,
    title: t(["tools", "list", tool.id, "title"]),
    subtitle: t(["tools", "list", tool.id, "subtitle"]),
    href: useAnchorLinks ? `#${anchorIds[tool.id]}` : tool.href,
    icon: tool.icon,
    featured: "featured" in tool ? tool.featured : undefined,
  }));

  const shouldUsePageWrapper = isPage !== undefined ? isPage : headingLevel === "page";

  return (
    <CategoryList
      title={t("tools.sectionTitle")}
      subtitle={t("tools.sectionEm")}
      categories={tools}
      headingLevel="h2"
      isPage={shouldUsePageWrapper}
    />
  );
}
