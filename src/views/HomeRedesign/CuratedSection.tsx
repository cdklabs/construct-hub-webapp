import { Flex, Heading, SimpleGrid } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { CatalogPackage } from "../../api/package/packages";
import { PackageCard } from "../../components/PackageCard";

export interface CuratedSectionProps {
  heading: string;
  items: CatalogPackage[];
}

export const CuratedSection: FunctionComponent<CuratedSectionProps> = ({
  heading,
  items,
}) => (
  <Flex>
    <Heading>{heading}</Heading>

    <SimpleGrid>
      {items.map((item) => (
        <PackageCard key={item.name} pkg={item} />
      ))}
    </SimpleGrid>
  </Flex>
);
