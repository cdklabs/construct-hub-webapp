import { Box, Flex, Grid } from "@chakra-ui/react";
import type {
  ClassSchema,
  EnumSchema,
  InterfaceSchema,
  StructSchema,
} from "jsii-docgen";
import { FunctionComponent, useEffect, useMemo } from "react";
import {
  Route,
  Switch,
  useRouteMatch,
  useLocation,
  Redirect,
} from "react-router-dom";
import { NavTree } from "../../components/NavTree";
import { ChooseSubmodule } from "./ChooseSubmodule";
import { PACKAGE_ANALYTICS } from "./constants";
import { NavDrawer } from "./NavDrawer";
import { PackageReadme } from "./PackageReadme";
import { usePackageState } from "./PackageState";
import { PackageTypeDocs } from "./PackageTypeDocs";
import { StickyNavContainer } from "./StickyNavContainer";
import { MenuItem } from "./util";

// We want the nav to be sticky, but it should account for the sticky heading as well, which is 72px
const TOP_OFFSET = "4.5rem";
const DOCS_ROOT_ID = "apidocs_header";
const API_URL_RESOURCE = "api";

const SubmoduleSelector: FunctionComponent = () => {
  const {
    assembly: { data },
  } = usePackageState();

  return Object.keys(data?.submodules ?? {}).length > 0 ? (
    <Flex
      borderBottom="1px solid"
      borderColor="borderColor"
      justify="center"
      py={4}
    >
      <ChooseSubmodule />
    </Flex>
  ) : null;
};

const isApiPath = (path: string) => {
  const parts = path.split("/");
  return parts[parts.length - 2] === API_URL_RESOURCE;
};

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
 * // => "Bucket#Initializer.parameter.scope"
 */
const getPathHelper = (segments: number) => {
  return (id: string) =>
    id.split(".").slice(-segments).join(".").replace(".", "#");
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

const schemaToSectionItems = (
  type: ClassSchema | InterfaceSchema | StructSchema | EnumSchema
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
      const childItems = getValues(type as any).map((value) => ({
        level: 2,
        id: value.id,
        title: value.displayName,
        path: getPath(value.id),
        children: [],
      }));
      if (childItems.length > 0) {
        parentItem.children.push(...childItems);
        items.push(parentItem);
      }
    }
  }

  return items;
};

export const useSectionItems = (): MenuItem[] => {
  const { path } = useRouteMatch();
  const { jsonDocs } = usePackageState();
  const match = useRouteMatch<{ typeId: string }>(
    `${path}/${API_URL_RESOURCE}/:typeId`
  );
  const typeId = match?.params.typeId;

  const { types, metadata } = useMemo(() => {
    if (!jsonDocs.data) return { types: [] };

    const apiReference = jsonDocs.data?.apiReference;
    if (!apiReference) return { types: [] };

    return {
      types: [
        ...apiReference.classes,
        ...apiReference.constructs,
        ...apiReference.interfaces,
        ...apiReference.structs,
        ...apiReference.enums,
      ],
      metadata: jsonDocs.data.metadata,
    };
  }, [jsonDocs]);

  const typeInfo = types.find((type) => type.displayName === typeId);
  return typeInfo && metadata ? schemaToSectionItems(typeInfo) : [];
};

export const PackageDocs: FunctionComponent = () => {
  const { path } = useRouteMatch();
  const { menuItems, markdownDocs } = usePackageState();
  const sectionItems = useSectionItems();

  const { hash, pathname, search } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(
        `[data-heading-id="${hash}"]`
      ) as HTMLElement;

      target?.scrollIntoView(true);
    } else if (isApiPath(pathname)) {
      const target = document.getElementById(DOCS_ROOT_ID) as HTMLElement;
      target?.scrollIntoView(true);
    } else {
      window.scrollTo(0, 0);
    }
    // Subscribe to doc loading state so that we run this effect after docs load as well
  }, [hash, pathname, markdownDocs.isLoading]);

  return (
    <Grid
      columnGap={4}
      h="full"
      templateColumns={{
        base: "1fr",
        lg: "minmax(20rem, 1fr) 3fr minmax(16rem, 0.9fr)",
      }}
      width="100%"
    >
      <StickyNavContainer
        borderRight="1px solid"
        borderRightColor="borderColor"
        offset={TOP_OFFSET}
        pl={6}
        pr={4}
        top={TOP_OFFSET}
      >
        <SubmoduleSelector />
        <Box overflowY="auto" py={4}>
          <NavTree data-event={PACKAGE_ANALYTICS.SCOPE} items={menuItems} />
        </Box>
      </StickyNavContainer>
      <Box
        h="max-content"
        maxWidth="100%"
        overflow="hidden"
        py={4}
        sx={{
          a: {
            scrollMarginTop: TOP_OFFSET,
          },
        }}
      >
        <Switch>
          <Redirect
            exact
            from={`${path}/${API_URL_RESOURCE}`}
            to={{ pathname: path, search }}
          />
          <Route exact path={path}>
            <PackageReadme />
          </Route>
          <Route exact path={`${path}/${API_URL_RESOURCE}/:typeId`}>
            <PackageTypeDocs rootId={DOCS_ROOT_ID} />
          </Route>
        </Switch>
      </Box>
      <StickyNavContainer
        borderLeft="1px solid"
        borderLeftColor="borderColor"
        offset={TOP_OFFSET}
        pl={6}
        pr={4}
        top={TOP_OFFSET}
      >
        <Box overflowY="auto" py={4}>
          <NavTree
            data-event={PACKAGE_ANALYTICS.SCOPE}
            items={sectionItems}
            variant="sm"
          />
        </Box>
      </StickyNavContainer>
      <NavDrawer />
    </Grid>
  );
};
