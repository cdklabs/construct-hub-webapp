import { render, cleanup } from "@testing-library/react";
import catalogFixture from "../../__fixtures__/catalog.json";
import type { CatalogPackage } from "../../api/package/packages";
import { LANGUAGES } from "../../constants/languages";
import { CatalogCard, testIds } from "./CatalogCard";

const [pkg] = catalogFixture.packages;

describe("<CatalogCard />", () => {
  afterEach(cleanup);

  const renderCard = () => render(<CatalogCard pkg={pkg as CatalogPackage} />);

  it("renders expected elements", () => {
    const { queryByTestId, queryAllByTestId } = renderCard();

    // Top details
    expect(queryByTestId(testIds.name)).not.toBeNull();
    expect(queryByTestId(testIds.tags)).not.toBeNull();
    expect(queryByTestId(testIds.description)).not.toBeNull();

    // Bottom details
    expect(queryByTestId(testIds.author)).not.toBeNull();
    expect(queryByTestId(testIds.date)).not.toBeNull();
    expect(queryAllByTestId(testIds.language)).toHaveLength(LANGUAGES.length);
  });
});
