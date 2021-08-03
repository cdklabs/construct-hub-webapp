import type { Story } from "@storybook/react";
import catalogFixture from "../../__fixtures__/catalog.json";
import { CatalogPackage } from "../../api/package/packages";
import { CatalogCard, CatalogCardProps } from "./CatalogCard";

export default {
  title: "Components / CatalogCard",
  component: CatalogCard,
};

export const Primary: Story<CatalogCardProps> = ({ pkg }) => {
  return <CatalogCard pkg={pkg} />;
};

export const Skeleton = () => <CatalogCard />;

Primary.args = {
  pkg: catalogFixture.packages[0] as CatalogPackage,
};
