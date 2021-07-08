import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Link } from "react-router-dom";

export interface NextPageProps {
  nextPageUrl?: string;
}

const btnProps = {
  children: "Next Page",
  colorScheme: "blue",
  rightIcon: <ArrowForwardIcon color="white" />,
};

export const NextPage: FunctionComponent<NextPageProps> = ({ nextPageUrl }) => {
  if (!nextPageUrl) {
    return <Button {...btnProps} disabled />;
  }

  return <Button {...btnProps} as={Link} to={nextPageUrl} />;
};
