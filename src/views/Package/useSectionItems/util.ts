import type {
  ClassSchema,
  EnumSchema,
  InterfaceSchema,
  StructSchema,
} from "jsii-docgen";
import { QUERY_PARAMS } from "../../../constants/url";
import type { MenuItem } from "../util";

/**
 * Generate the path of the API that should be linked to in the nav tree based
 * on the ID of the type or method or property etc.
 *
 * This method slices from the end of the ID rather than the beginning since the
 * number of segments at the beginning can vary -- for example, a class name
 * could be the second segment:
 *   @aws-cdk/aws-s3.Bucket
 * or the third segment:
 *   aws-cdk-lib.aws_s3.Bucket (within a jsii submodule)
 * or a fourth or later segment:
 *   aws-cdk-lib.aws_s3.CfnBucket.AbortIncompleteMultipartUploadProperty (class that is defined within another class / namespace)
 *
 * Instead we assume that the number of segments from the end is always the same
 * for the particular type of field, so for example a class method is always
 * of the form `(rest of path).ClassName.method`.
 *
 * @example
 * // getPathFromId("@aws-cdk/aws-s3.Bucket.Initializer.parameter.scope", 4")
 * // => { path: "Bucket", hash: "#Initializer.parameter.scope" }
 */
const getPathHelper = (segments: number) => {
  return (id: string): { path: string; hash: string } => {
    const [path, ...rest] = id.split(".").slice(-segments);
    return { path, hash: "#" + rest.join(".") };
  };
};

/**
 * Map from fields of `jsii-docgen.Schema` to data needed to extract values and
 * render the right navigation sidebar. This is needed to make the information
 * in the JSON docs play well with the existing markdown docs, but this could be
 * refactored / dropped in the future.
 */
const docsSectionsMap = {
  initializer: {
    header: "Initializer Props",
    getValues: (e: ClassSchema) => e.initializer?.parameters ?? [],
    // @aws-cdk/aws-s3.Bucket.Initializer.parameter.scope => Bucket#Initializer.parameter.scope
    getPath: getPathHelper(4),
  },
  instanceMethods: {
    header: "Instance Methods",
    getValues: (e: ClassSchema | InterfaceSchema) => e.instanceMethods,
    // @aws-cdk/aws-s3.Bucket.addCorsRule => Bucket#addCorsRule
    getPath: getPathHelper(2),
  },
  staticMethods: {
    header: "Static Methods",
    getValues: (e: ClassSchema) => e.staticMethods,
    // @aws-cdk/aws-s3.Bucket.fromBucketArn => Bucket#fromBucketArn
    getPath: getPathHelper(2),
  },
  properties: {
    header: "Properties",
    getValues: (e: ClassSchema | StructSchema | InterfaceSchema) =>
      e.properties,
    // @aws-cdk/aws-s3.Bucket.property.bucketArn => Bucket#property.bucketArn
    getPath: getPathHelper(3),
  },
  constants: {
    header: "Constants",
    getValues: (e: ClassSchema) => e.constants,
    // @aws-cdk/aws-s3.CfnAccessPoint.property.CFN_RESOURCE_TYPE_NAME => CfnAccessPoint#property.CFN_RESOURCE_TYPE_NAME
    getPath: getPathHelper(3),
  },
  members: {
    header: "Enum Members",
    getValues: (e: EnumSchema) => e.members,
    // @aws-cdk/aws-s3.BucketAccessControl#PRIVATE => BucketAccessControl#PRIVATE
    getPath: getPathHelper(2),
  },
};

export const schemaToSectionItems = (
  type: ClassSchema | InterfaceSchema | StructSchema | EnumSchema,
  language: string,
  submodule?: string
): MenuItem[] => {
  const items: MenuItem[] = [];

  for (const [schemaKey, props] of Object.entries(docsSectionsMap)) {
    const { header, getValues, getPath } = props;
    if (schemaKey in type) {
      const parentItem: MenuItem = {
        level: 1,
        id: header,
        title: header,
        children: [],
      };
      // We aren't using a discriminated union, so the
      // "if schemaKey in type" check doesn't give TypeScript enough
      // information to infer this by itself.
      const childItems: MenuItem[] = getValues(type as any).map((value) => {
        const { path, hash } = getPath(value.id);
        let query = `?${QUERY_PARAMS.LANGUAGE}=${language}`;
        if (submodule) {
          query += `&${QUERY_PARAMS.SUBMODULE}=${submodule}`;
        }

        return {
          level: 2,
          id: hash,
          title: value.displayName,
          path: `${path}${query}${hash}`,
          children: [],
        };
      });
      if (childItems.length > 0) {
        parentItem.children.push(...childItems);
        items.push(parentItem);
      }
    }
  }

  return items;
};
