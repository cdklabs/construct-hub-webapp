import { Link, Heading, As } from "@chakra-ui/react";
import {
  Children,
  FunctionComponent,
  useEffect,
  ReactNode,
  useState,
} from "react";
import ReactDOMServer from "react-dom/server";
import { sanitize } from "../../util/sanitize-anchor";
import { Hr } from "./Hr";

interface HeadingResolverProps {
  level: number;
  children: ReactNode;
}

export const Headings: FunctionComponent<HeadingResolverProps> = ({
  level,
  children,
}) => {
  const size: string = ["2xl", "xl", "lg", "md", "sm", "xs"][level - 1];
  const marginY: number = [10, 10, 10, 8, 8, 8][level - 1];
  const elem = `h${level}` as As<any>;

  const [dataProps, setDataProps] = useState<Record<string, any>>({});

  useEffect(() => {
    // This logic is used within a useEffect b/c we want this to run on the client before painting
    const markup = ReactDOMServer.renderToStaticMarkup(
      children as React.ReactElement
    );

    const parser = new DOMParser();
    const doc = parser.parseFromString(markup, "text/html");

    const dataElement = doc.querySelector(
      "span[data-heading-title][data-heading-id]"
    ) as HTMLElement;

    const title = (
      dataElement?.dataset.headingTitle ??
      (Children.toArray(children).reduce((accum: string, child): string => {
        if (typeof child === "string") {
          return `${accum}${child}`;
        }
        return accum;
      }, "") as string)
    ).trim();

    const id = dataElement?.dataset.headingId ?? sanitize(title);

    setDataProps({
      "data-heading-title": title,
      "data-heading-id": id,
      href: `#${id}`,
      id,
    });
  }, [children]);

  const isH3OrLarger = level < 4;

  return (
    <>
      <Heading
        as={elem}
        color="blue.800"
        level={level}
        mb={isH3OrLarger ? 0 : level}
        mt={marginY}
        size={size}
      >
        <Link
          {...dataProps}
          data-heading-level={level}
          sx={{ "> code": { color: "blue.800", fontSize: "inherit" } }}
        >
          {children}
        </Link>
      </Heading>
      {isH3OrLarger && (
        // If there's an adjacent HR from the source md, do a magic trick and make it disappear
        <Hr mb={marginY} mt={1} sx={{ "& + hr": { display: "none" } }} />
      )}
    </>
  );
};
