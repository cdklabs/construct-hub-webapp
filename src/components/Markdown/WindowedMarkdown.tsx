/**
 * @fileoverview An experimental implementation of markdown
 * that attempts to implement windowing via intersection observers and chunking the README
 */
import { Box } from "@chakra-ui/react";
import { memo, useLayoutEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown, { ReactMarkdownOptions } from "react-markdown";

export interface WindowedMarkdownProps extends ReactMarkdownOptions {
  children: string;
}

export interface ChunkProps extends WindowedMarkdownProps {
  isReady: boolean;
  id: number;
}

const Chunk = memo<ChunkProps>(({ children, isReady, id, ...props }) => {
  return (
    <Box data-chunk data-id={id}>
      {isReady ? (
        <ReactMarkdown {...props}>{children}</ReactMarkdown>
      ) : (
        <Box as="span" opacity={0}>
          {children}
        </Box>
      )}
    </Box>
  );
});

Chunk.displayName = "Chunk";

const separator = `
---
`;

export const WindowedMarkdown = memo<WindowedMarkdownProps>(
  ({ children, ...props }) => {
    const root = useRef<HTMLDivElement>(null);

    const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>(
      {}
    );

    const chunks = useMemo(() => children.split(separator), [children]);

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

      return () => observer.disconnect();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [children]);

    return (
      <Box ref={root}>
        {chunks.map((chunk, i) => (
          <Chunk
            id={i}
            isReady={i === 0 || visibilityMap[i]}
            key={i}
            {...props}
          >
            {`${chunk}${i < chunks.length - 1 ? separator : ""}`}
          </Chunk>
        ))}
      </Box>
    );
  }
);
