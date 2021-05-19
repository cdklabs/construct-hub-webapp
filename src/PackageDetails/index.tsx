import { Grid } from "semantic-ui-react";

interface PackageDetailsProps {
  name: string;
  scope?: string;
  version: string;
}

export default function PackageDetails({
  name,
  scope,
  version,
}: PackageDetailsProps) {
  return (
    <Grid celled>
      <Grid.Row>
        <Grid.Column>
          {scope}/{name}@{version}asdasdasdasdadsadsadsasd
        </Grid.Column>
        <Grid.Column>Getting Started</Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column>Navigation</Grid.Column>
        <Grid.Column>Content</Grid.Column>
        <Grid.Column>Metadata</Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
