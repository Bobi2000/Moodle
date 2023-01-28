import Navbar from "@/shared/components/navbar";
import { createContext, ReactNode, Reducer, useReducer } from "react";

type State = {
  isLogged: boolean;
};

type Action =
  | {
      type: "LOGGIN";
    }
  | { type: "LOGOUT" };

type ContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const defaultContext: ContextType = {
  state: {
    isLogged: false,
  },
  dispatch: () => null,
};

const UserContext = createContext<ContextType>(defaultContext);

const userReducer: Reducer<State, Action> = (
  prevState: State,
  action: Action
) => {
  switch (action.type) {
    case "LOGGIN":
      return {
        ...prevState,
        isLogged: true,
      };
    case "LOGOUT":
      return {
        ...prevState,
        isLogged: false,
      };
  }
};

const UserContextProvider: React.FC<any> = ({ children }: any) => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(
    userReducer,
    defaultContext.state
  );

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Navbar isLogged={state.isLogged} />
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
