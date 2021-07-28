/**
 * @fileoverview An experimental implementation of markdown
 * that attempts to implement windowing via intersection observers and chunking the README
 */
import { Box, IdProvider, useId } from "@chakra-ui/react";
import {
  FunctionComponent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactMarkdown, { ReactMarkdownOptions } from "react-markdown";

export interface ExpMarkdownProps extends ReactMarkdownOptions {
  children: string;
}

export interface ChunkProps extends ExpMarkdownProps {
  visibilityMap: Record<string, boolean>;
}

const Chunk: FunctionComponent<ChunkProps> = ({
  children,
  visibilityMap,
  ...props
}) => {
  const id = useId();

  const ready = visibilityMap[id];

  return useMemo(
    () => (
      <Box data-chunk data-id={id}>
        {ready ? (
          <ReactMarkdown {...props}>{children}</ReactMarkdown>
        ) : (
          <Box as="span" opacity={0}>
            {children}
          </Box>
        )}
      </Box>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children, ready]
  );
};

const separator = `
---
`;

export const ExperimentalMarkdownRenderer: FunctionComponent<ExpMarkdownProps> =
  ({ children, ...props }) => {
    const root = useRef<HTMLDivElement>(null);
    const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>(
      {}
    );
    const chunks = children.split(separator);

    useLayoutEffect(() => {
      const rootEl = root.current ?? document; // Redundancy to be safe

      // Instantiate IntersectionObserver
      const observer = new IntersectionObserver((entries, obs) => {
        let updatesToMake: Record<string, boolean> = {};

        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-id") ?? "";
          if (entry.isIntersecting && !visibilityMap[id]) {
            updatesToMake[id] = true;
            obs.unobserve(entry.target);
          }
        });

        if (Object.keys(updatesToMake).length) {
          window.requestAnimationFrame(() => {
            setVisibilityMap((current) => ({ ...current, ...updatesToMake }));
          });
        }
      });

      // Observe the targets
      rootEl.querySelectorAll("[data-chunk]").forEach((chunk) => {
        observer.observe(chunk);
      });
    }, [children]);

    return (
      <IdProvider>
        <Box ref={root}>
          {chunks.map((chunk, i) => (
            <Chunk key={i} visibilityMap={visibilityMap} {...props}>
              {`${chunk}${i < chunks.length - 1 ? separator : ""}`}
            </Chunk>
          ))}
        </Box>
      </IdProvider>
    );
  };
