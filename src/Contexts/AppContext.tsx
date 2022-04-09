import React, { createContext } from "react";
import { Subject } from "rxjs";

export interface IAppContext {
  service: Subject<string>;
}

const initialState = {
  service: new Subject<string>() /** Initialize service. */,
};

export const AppContext = createContext<IAppContext>(initialState);

const AppContextProvider: React.FC = ({ children }) => {
  return (
    <AppContext.Provider value={initialState}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
