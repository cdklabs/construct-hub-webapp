import * as reflect from "jsii-reflect";
import { Markdown } from "./render/markdown";

export function renderDocs(docs: reflect.Docs, md: Markdown) {
  if (docs.summary) {
    md.lines(Markdown.sanitize(docs.summary));
    md.lines("");
  }
  if (docs.remarks) {
    md.lines(Markdown.sanitize(docs.remarks));
    md.lines("");
  }

  if (docs.docs.see) {
    md.quote(docs.docs.see);
  }

  const customLink = docs.customTag("link");
  if (customLink) {
    md.quote(`[${customLink}](${customLink})`);
  }
}

export function propertyToParameter(
  callable: reflect.Callable,
  property: reflect.Property
): reflect.Parameter {
  return {
    docs: property.docs,
    method: callable,
    name: property.name,
    optional: property.optional,
    parentType: property.parentType,
    spec: property.spec,
    system: property.system,
    type: property.type,
    variadic: false,
  };
}
