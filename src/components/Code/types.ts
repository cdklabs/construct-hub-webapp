import type Highlight from "prism-react-renderer";
import type { ComponentPropsWithoutRef } from "react";

// Unfortunately not exported by prism-react-renderer
type PrismRenderProps = Parameters<
  ComponentPropsWithoutRef<typeof Highlight>["children"]
>[0];

export type RendererProps = PrismRenderProps & { code: string };
