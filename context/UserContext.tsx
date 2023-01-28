import Navbar from "@/shared/components/navbar";
import { createContext, Reducer, useEffect, useReducer } from "react";

type State = {
  isLogged: boolean;
  isAdmin: boolean;
};

type Action =
  | {
      type: "LOGGIN";
    }
  | {
      type: "ISADMIN";
    }
  | {
      type: "ISNTADMIN";
    }
  | { type: "LOGOUT" };

type ContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

const defaultContext: ContextType = {
  state: {
    isLogged: false,
    isAdmin: false,
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
    case "ISADMIN":
      return {
        ...prevState,
        isAdmin: true,
      };
    case "ISNTADMIN":
      return {
        ...prevState,
        isAdmin: false,
      };
    case "LOGOUT":
      return {
        ...prevState,
        isLogged: false,
        isAdmin: false,
      };
  }
};

const UserContextProvider: React.FC<any> = ({ children }: any) => {
  const [state, dispatch] = useReducer<Reducer<State, Action>>(
    userReducer,
    defaultContext.state
  );

  useEffect(() => {
    if (localStorage.getItem("userId") ? true : false) {
      state.isLogged = true;
      dispatch({ type: "LOGGIN" });
    } else {
      state.isLogged = false;
      dispatch({ type: "LOGOUT" });
    }

    if (localStorage.getItem("isAdmin") ? true : false) {
      state.isAdmin = true;
      dispatch({ type: "ISADMIN" });
    } else {
      state.isAdmin = false;
      dispatch({ type: "ISNTADMIN" });
    }
  }, []);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Navbar isLogged={state.isLogged} isAdmin={state.isAdmin} />
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
