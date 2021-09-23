import {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useState,
} from "react";
import { PackageCardType } from "../../components/PackageCard";
import { Controls } from "./Controls";

const CardViewContext = createContext({
  cardView: PackageCardType.Wide,
  // eslint-disable-next-line react/display-name
  CardViewControls: Controls as FunctionComponent,
  setCardView: (() => {}) as (v: PackageCardType) => void,
});

export const useCardView = () => useContext(CardViewContext);

export const CardViewProvider: FunctionComponent = ({ children }) => {
  const [viewType, setViewType] = useState(PackageCardType.Wide);

  const CardViewControls = useCallback(() => {
    return <Controls currentCardView={viewType} setCardView={setViewType} />;
  }, [viewType, setViewType]);

  return (
    <CardViewContext.Provider
      value={{
        cardView: viewType,
        setCardView: setViewType,
        CardViewControls,
      }}
    >
      {children}
    </CardViewContext.Provider>
  );
};
