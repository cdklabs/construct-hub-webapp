import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { Fragment, FunctionComponent } from "react";
import { ExternalLink } from "../ExternalLink";
import { NavLink } from "../NavLink";
import type { IMenuItems, ILink } from "../NavPopover";

const linkProps = {
  color: "blue.500",
  py: 2,
  w: "full",
};

const Link: FunctionComponent<ILink> = ({ display, isNavLink, url }) =>
  isNavLink ? (
    <NavLink to={url} {...linkProps}>
      {display}
    </NavLink>
  ) : (
    <ExternalLink
      alignItems="center"
      display="flex"
      hasWarning={false}
      href={url}
      justifyContent="space-between"
      {...linkProps}
    >
      {display}
    </ExternalLink>
  );

interface MobileNavLinksContentProps {
  testId?: string;
  title: string;
  items: IMenuItems;
}

const MobileNavLinksContent: FunctionComponent<MobileNavLinksContentProps> = ({
  title,
  items,
  testId,
}) => (
  <AccordionItem data-testid={testId} w="full">
    <AccordionButton px={0} py={4}>
      <Box flex="1" textAlign="left">
        <Heading as="h3" size="sm">
          {title}
        </Heading>
      </Box>

      <AccordionIcon />
    </AccordionButton>

    <AccordionPanel p={0} w="full">
      <Flex direction="column" w="full">
        {items.map((item, itemIdx) => {
          if ("links" in item) {
            return (
              <Fragment key={`${item.display}-${itemIdx}`}>
                <Heading as="h4" borderBottom="base" pb={2} pt={4} size="xs">
                  {item.display}
                </Heading>

                {item.links.map((link, linkIdx) => (
                  <Link {...link} key={`${link.display}-${linkIdx}`} />
                ))}
              </Fragment>
            );
          }

          return <Link {...item} key={`${item.display}-${itemIdx}`} />;
        })}
      </Flex>
    </AccordionPanel>
  </AccordionItem>
);

interface MobileNavLinksProps {
  sections: MobileNavLinksContentProps[];
}

export const MobileNavLinks: FunctionComponent<MobileNavLinksProps> = ({
  sections,
}) => (
  <Accordion
    allowMultiple
    allowToggle
    defaultIndex={sections.map((_, i) => i)}
    w="full"
  >
    {sections.map((section, idx) => (
      <MobileNavLinksContent key={`section-${idx}`} {...section} />
    ))}
  </Accordion>
);
