import type { PropsOf, Icon } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { DotNetIcon } from "../icons/DotNetIcon";
import { GoIcon } from "../icons/GoIcon";
import { JavaIcon } from "../icons/JavaIcon";
import { NodeIcon } from "../icons/NodeIcon";
import { PythonIcon } from "../icons/PythonIcon";
import { TSIcon } from "../icons/TSIcon";

export type Language =
  | "dotnet"
  | "js"
  | "typescript"
  | "python"
  | "golang"
  | "java";

export enum Languages {
  DotNet = "dotnet",
  NodeJS = "js",
  TypeScript = "typescript",
  Python = "python",
  Go = "golang",
  Java = "java",
}

export const LANGUAGE_NAME_MAP: { [key in Languages]: string } = {
  [Languages.TypeScript]: "TypeScript",
  [Languages.Python]: "Python",
  [Languages.Java]: "Java",
  [Languages.NodeJS]: "Node.js",
  [Languages.Go]: "Go",
  [Languages.DotNet]: ".NET",
};

export const LANGUAGES: Language[] = [
  Languages.TypeScript,
  Languages.Python,
  Languages.Java,
  Languages.NodeJS,
  Languages.Go,
  Languages.DotNet,
];

export const TEMP_SUPPORTED_LANGUAGES: Language[] = [
  Languages.Python,
  Languages.TypeScript,
];

export const LANGUAGE_RENDER_MAP: Record<
  Language,
  { name: string; icon: FunctionComponent<PropsOf<typeof Icon>> }
> = {
  typescript: {
    name: LANGUAGE_NAME_MAP.typescript,
    icon: TSIcon,
  },
  python: {
    name: LANGUAGE_NAME_MAP.python,
    icon: PythonIcon,
  },
  java: {
    name: LANGUAGE_NAME_MAP.java,
    icon: JavaIcon,
  },
  js: {
    name: LANGUAGE_NAME_MAP.js,
    icon: NodeIcon,
  },
  golang: {
    name: LANGUAGE_NAME_MAP.golang,
    icon: GoIcon,
  },
  dotnet: {
    name: LANGUAGE_NAME_MAP.dotnet,
    icon: DotNetIcon,
  },
};
