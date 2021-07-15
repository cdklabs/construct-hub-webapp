import type { Story } from "@storybook/react";
import { Language } from "../../constants/languages";
import { Code, CodeProps } from "./Code";

export default {
  title: "Components / Code",
  component: Code,
};

export const SingleLine: Story<CodeProps> = ({ code, language }) => (
  <Code code={code} language={language} />
);

SingleLine.args = {
  code: "npm install @aws-cdk/region-info@1.113.0",
  language: Language.TypeScript,
};

export const MultiLine: Story<CodeProps> = ({ code, language }) => (
  <Code code={code} language={language} />
);

MultiLine.args = {
  code: `
# Example automatically generated without compilation. See https://github.com/aws/jsii/issues/826
from aws_cdk.region_info import RegionInfo

# Get the information for "eu-west-1":
region = RegionInfo.get("eu-west-1")

# Access attributes:
region.s3_static_website_endpoint# s3-website-eu-west-1.amazonaws.com
region.service_principal("logs.amazonaws.com")
  `,
  language: Language.Python,
};
