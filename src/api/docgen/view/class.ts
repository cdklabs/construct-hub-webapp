import * as reflect from "jsii-reflect";
import { Markdown } from "../render/markdown";
import { Transpile } from "../transpile/transpile";
import { Initializer } from "./initializer";
import { InstanceMethod } from "./instance-method";
import { Property } from "./property";
import { StaticFunction } from "./static-function";

/**
 * Reflects on a jsii class to generate a view.
 */
export class Class {
  private readonly instanceMethods: reflect.Method[] =
    new Array<reflect.Method>();
  private readonly staticFunctions: reflect.Method[] =
    new Array<reflect.Method>();
  private readonly constants: reflect.Property[] =
    new Array<reflect.Property>();

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

    for (const property of klass.ownProperties) {
      if (property.const) {
        this.constants.push(property);
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
        ifaces.push(
          `[${Markdown.code(this.transpile.type(iface).fqn)}](#${iface.fqn})`
        );
      }
      md.bullet(`${Markdown.emphasis("Implements:")} ${ifaces.join(", ")}`);
      md.lines("");
    }

    if (this.klass.docs) {
      md.docs(this.klass.docs);
    }

    md.section(this.renderInitializer());
    md.section(this.renderMethods());
    md.section(this.renderStaticFunctions());
    md.section(this.renderConstants());
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
    const md = new Markdown({ header: { title: "Static Functions" } });

    if (this.staticFunctions.length === 0) {
      return Markdown.EMPTY;
    }

    for (const method of this.staticFunctions) {
      md.section(new StaticFunction(this.transpile, method).markdown);
    }

    return md;
  }

  private renderConstants(): Markdown {
    const md = new Markdown({ header: { title: "Constants" } });

    if (this.constants.length === 0) {
      return Markdown.EMPTY;
    }

    for (const constant of this.constants) {
      md.section(new Property(this.transpile, constant).markdown);
    }
    return md;
  }
}
