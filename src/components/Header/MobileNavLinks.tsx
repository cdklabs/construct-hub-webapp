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
import { useAnalytics } from "../../contexts/Analytics";
import { clickEvent, eventName } from "../../contexts/Analytics/util";
import { ExternalLink } from "../ExternalLink";
import { NavLink } from "../NavLink";
import type { IMenuItems, ILink } from "../NavPopover";

const linkProps = {
  color: "blue.500",
  py: 2,
  w: "full",
};

const Link: FunctionComponent<ILink & { "data-event"?: string }> = ({
  "data-event": dataEvent,
  display,
  isNavLink,
  url,
}) => {
  const event = dataEvent ? eventName(dataEvent, "Link", display) : undefined;

  return isNavLink ? (
    <NavLink data-event={event} to={url} {...linkProps}>
      {display}
    </NavLink>
  ) : (
    <ExternalLink
      alignItems="center"
      data-event={event}
      display="flex"
      hasWarning={false}
      href={url}
      justifyContent="space-between"
      {...linkProps}
    >
      {display}
    </ExternalLink>
  );
};

interface MobileNavLinksContentProps {
  dataEvent?: string;
  testId?: string;
  title: string;
  items: IMenuItems;
}

const MobileNavLinksContent: FunctionComponent<MobileNavLinksContentProps> = ({
  title,
  items,
  testId,
  dataEvent,
}) => {
  const { trackCustomEvent } = useAnalytics();
  return (
    <AccordionItem data-testid={testId} w="full">
      <AccordionButton
        onClick={() => {
          if (dataEvent) {
            trackCustomEvent(
              clickEvent({ name: eventName(dataEvent, "Menu") })
            );
          }
        }}
        px={0}
        py={4}
      >
        <Box flex="1" textAlign="left">
          <Heading as="h3" color="blue.800" size="sm">
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
                    <Link
                      data-event={dataEvent}
                      {...link}
                      key={`${link.display}-${linkIdx}`}
                    />
                  ))}
                </Fragment>
              );
            }

            return (
              <Link
                data-event={dataEvent}
                {...item}
                key={`${item.display}-${itemIdx}`}
              />
            );
          })}
        </Flex>
      </AccordionPanel>
    </AccordionItem>
  );
};

interface MobileNavLinksProps {
  sections: MobileNavLinksContentProps[];
}

export const MobileNavLinks: FunctionComponent<MobileNavLinksProps> = ({
  sections,
}) => (
  <Accordion allowMultiple allowToggle w="full">
    {sections.map((section, idx) => (
      <MobileNavLinksContent key={`section-${idx}`} {...section} />
    ))}
  </Accordion>
);
