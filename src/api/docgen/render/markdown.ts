import * as reflect from "jsii-reflect";

export interface MarkdownHeaderOptions {
  readonly size?: number;
  readonly title?: string;
  readonly sup?: string;
  readonly code?: boolean;
  readonly deprecated?: boolean;
}

export interface MarkdownOptions {
  readonly bullet?: boolean;
  readonly header?: MarkdownHeaderOptions;
  readonly id?: string;
}

export class Markdown {
  public static readonly EMPTY = new Markdown();

  public static sanitize(line: string): string {
    let sanitized = line.trim();

    if (line.startsWith("-")) {
      sanitized = sanitized.substring(1, line.length).trim();
    }

    return sanitized;
  }

  public static bold(text: string): string {
    return `**${text}**`;
  }

  public static code(text: string): string {
    return `\`${text}\``;
  }

  public static emphasis(text: string) {
    return `*${text}*`;
  }

  private readonly _lines = new Array<string>();
  private readonly _sections = new Array<Markdown>();

  private readonly id?: string;
  private readonly header?: string;

  constructor(private readonly options: MarkdownOptions = {}) {
    this.id = options.id ?? options.header?.title;
    this.header = this.formatHeader();
  }

  public docs(docs: reflect.Docs) {
    if (docs.summary) {
      this.lines(Markdown.sanitize(docs.summary));
      this.lines("");
    }
    if (docs.remarks) {
      this.lines(Markdown.sanitize(docs.remarks));
      this.lines("");
    }

    if (docs.docs.see) {
      this.quote(docs.docs.see);
    }

    const customLink = docs.customTag("link");
    if (customLink) {
      this.quote(`[${customLink}](${customLink})`);
    }
  }

  public quote(line: string) {
    this.lines(`> ${line}`);
    this.lines("");
  }

  public bullet(line: string) {
    this.lines(`- ${line}`);
  }

  public snippet(language: string, ...snippet: string[]) {
    this.lines(`\`\`\`${language}`, ...snippet, "```");
    this.lines("");
  }

  public lines(...lines: string[]) {
    this._lines.push(...lines);
  }

  public split() {
    this.lines("---");
    this.lines("");
  }

  public section(section: Markdown) {
    this._sections.push(section);
  }

  public render(headerSize: number = 0): string {
    if (headerSize > 6) {
      throw new Error(`Unable to render markdown. Header limit (6) reached.`);
    }

    const indent = this.options.bullet ? "  " : "";
    const content: string[] = [];
    if (this.header) {
      const heading = `${"#".repeat(headerSize)} ${this.header}`;
      content.push(
        `${this.options.bullet ? "- " : ""}${heading} <a name="${this.id}"></a>`
      );
      content.push("");
    }

    for (const line of this._lines) {
      for (const subline of line.split("\n")) {
        content.push(`${indent}${subline}`);
      }
    }

    for (const section of this._sections) {
      content.push(section.render(headerSize + 1));
    }
    return content.join("\n");
  }

  private formatHeader(): string | undefined {
    if (!this.options.header?.title) {
      return undefined;
    }
    let caption = this.options.header.title;

    if (this.options.header?.code ?? false) {
      caption = `\`${caption}\``;
    }

    if (this.options.header?.deprecated ?? false) {
      caption = `~~${caption}~~`;
    }

    if (this.options.header?.sup) {
      caption = `${caption}<sup>${this.options.header?.sup}</sup>`;
    }

    return caption;
  }
}
