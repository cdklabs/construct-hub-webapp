import type { PropsOf, Icon } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { DotNetIcon } from "../icons/DotNetIcon";
import { GoIcon } from "../icons/GoIcon";
import { JavaIcon } from "../icons/JavaIcon";
import { PythonIcon } from "../icons/PythonIcon";
import { TSIcon } from "../icons/TSIcon";

export enum Language {
  DotNet = "dotnet",
  TypeScript = "typescript",
  Python = "python",
  Go = "golang",
  Java = "java",
}

/**
 * The sorted list of all available languages.
 */
export const LANGUAGES: readonly Language[] = [
  Language.TypeScript,
  Language.Python,
  Language.Java,
  Language.Go,
  Language.DotNet,
];

export const LANGUAGE_NAME_MAP: { readonly [key in Language]: string } = {
  [Language.TypeScript]: "TypeScript",
  [Language.Python]: "Python",
  [Language.Java]: "Java",
  [Language.Go]: "Go",
  [Language.DotNet]: ".NET",
};

export const TEMP_SUPPORTED_LANGUAGES: ReadonlySet<Language> = new Set([
  Language.Python,
  Language.TypeScript,
  Language.Java,
]);

export const LANGUAGE_RENDER_MAP: {
  readonly [key in Language]: {
    readonly name: string;
    readonly icon: FunctionComponent<PropsOf<typeof Icon>>;
  };
} = {
  [Language.TypeScript]: {
    name: LANGUAGE_NAME_MAP.typescript,
    icon: TSIcon,
  },
  [Language.Python]: {
    name: LANGUAGE_NAME_MAP.python,
    icon: PythonIcon,
  },
  [Language.Java]: {
    name: LANGUAGE_NAME_MAP.java,
    icon: JavaIcon,
  },
  [Language.Go]: {
    name: LANGUAGE_NAME_MAP.golang,
    icon: GoIcon,
  },
  [Language.DotNet]: {
    name: LANGUAGE_NAME_MAP.dotnet,
    icon: DotNetIcon,
  },
};
