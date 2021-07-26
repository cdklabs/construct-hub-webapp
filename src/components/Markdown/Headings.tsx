import { Heading, As } from "@chakra-ui/react";
import { Children, FunctionComponent, ReactNode } from "react";
import ReactDOMServer from "react-dom/server";
import { sanitize } from "../../util/sanitize-anchor";
import { NavLink } from "../NavLink";

interface HeadingResolverProps {
  level: number;
  children: ReactNode;
}

export const Headings: FunctionComponent<HeadingResolverProps> = ({
  level,
  children,
}) => {
  const size: string = ["2xl", "xl", "lg", "md", "sm", "xs"][level - 1];
  const marginY: number = [8, 7, 6, 5, 5, 4][level - 1];
  const elem = `h${level}` as As<any>;

  // Use DOMParser to look for data attribute for link ID
  const parser = new DOMParser();
  const doc = parser.parseFromString(
    ReactDOMServer.renderToStaticMarkup(children as React.ReactElement),
    "text/html"
  );

  const dataElement = doc.querySelector(
    "span[data-heading-title][data-heading-id]"
  ) as HTMLElement;
  const title =
    dataElement?.dataset.headingTitle ??
    Children.toArray(children)
      .reduce((accum: string, child): string => {
        if (typeof child === "string") {
          return `${accum}${child}`;
        }
        return accum;
      }, "")
      .trim();

  const id = dataElement?.dataset.headingId ?? sanitize(title);

  return (
    <Heading
      _notFirst={{ mt: marginY }}
      as={elem}
      color="blue.800"
      level={level}
      mb={marginY}
      size={size}
    >
      <NavLink
        data-heading-id={id}
        data-heading-level={level}
        data-heading-title={title}
        id={id}
        replace
        sx={{ "> code": { color: "blue.800", fontSize: "inherit" } }}
        to={`#${id}`}
      >
        {children}
      </NavLink>
    </Heading>
  );
};
