import * as reflect from "jsii-reflect";
import { renderDocs } from "../helpers";
import { Markdown } from "../render/markdown";
import { Transpile } from "../transpile/transpile";
import { Initializer } from "./initializer";
import { InstanceMethod } from "./instance-method";
import { StaticFunction } from "./static-function";
import { View } from "./view";

/**
 * Reflects on a jsii class to generate a view.
 */
export class Class implements View {
  private readonly instanceMethods: reflect.Method[] =
    new Array<reflect.Method>();
  private readonly staticFunctions: reflect.Method[] =
    new Array<reflect.Method>();

  constructor(
    private readonly transpile: Transpile,
    private readonly klass: reflect.ClassType
  ) {
    for (const method of klass.ownMethods.sort((m1, m2) =>
      m1.name.localeCompare(m2.name)
    )) {
      if (method.protected) {
        // TODO - is this right?
        continue;
      }
      if (method.static) {
        this.staticFunctions.push(method);
      } else {
        this.instanceMethods.push(method);
      }
    }
  }

  /**
   * Generate markdown.
   */
  public get markdown(): Markdown {
    const md = new Markdown({
      id: this.klass.fqn,
      header: { title: this.klass.name },
    });

    if (this.klass.interfaces.length > 0) {
      const ifaces = [];
      for (const iface of this.klass.interfaces) {
        ifaces.push(`[${this.transpile.type(iface).fqn}](#${iface.fqn})`);
      }
      md.lines(`- *Implements:* ${ifaces.join(", ")}`);
      md.lines("");
    }

    if (this.klass.docs) {
      renderDocs(this.klass.docs, md);
    }

    md.section(this.renderInitializer());
    md.section(this.renderMethods());
    md.section(this.renderStaticFunctions());
    return md;
  }

  private renderInitializer(): Markdown {
    if (!this.klass.initializer) {
      return Markdown.EMPTY;
    }
    return new Initializer(this.transpile, this.klass.initializer).markdown;
  }

  private renderMethods(): Markdown {
    const md = new Markdown({ header: { title: "Methods" } });

    if (this.instanceMethods.length === 0) {
      return Markdown.EMPTY;
    }

    for (const method of this.instanceMethods) {
      md.section(new InstanceMethod(this.transpile, method).markdown);
    }

    return md;
  }

  private renderStaticFunctions(): Markdown {
    const md = new Markdown({ header: { title: "Functions" } });

    if (this.staticFunctions.length === 0) {
      return Markdown.EMPTY;
    }

    for (const method of this.staticFunctions) {
      md.section(new StaticFunction(this.transpile, method).markdown);
    }

    return md;
  }
}
