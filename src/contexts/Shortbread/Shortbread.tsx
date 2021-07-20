import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import * as shortbread from "../../lib/shortbread";

const { initialize, ...publicAPI } = shortbread;

const ShortbreadContext = createContext<Partial<typeof publicAPI>>({});

export const useShortBread = () => useContext(ShortbreadContext);

export const ShortbreadProvider: FunctionComponent = ({ children }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    initialize()
      .then(() => {
        if (!isCancelled) {
          publicAPI.checkForCookieConsent();
          setIsReady(true);
        }
      })
      .catch((e) => {
        console.error(e);

        if (!isCancelled) {
          setIsReady(false);
        }
      });

    return () => {
      isCancelled = true;
      setIsReady(false);
    };
  }, []);

  return (
    <ShortbreadContext.Provider value={isReady ? publicAPI : {}}>
      {children}
    </ShortbreadContext.Provider>
  );
};
