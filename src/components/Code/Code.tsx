import Highlight, { defaultProps, Language } from "prism-react-renderer";
import { FunctionComponent } from "react";

interface CodeProps {
  code: string;
  language: Language;
}

export const Code: FunctionComponent<CodeProps> = ({ code, language }) => {
  return (
    <Highlight {...defaultProps} code={code} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
