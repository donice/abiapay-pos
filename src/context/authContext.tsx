import React, {
  createContext,
  useContext,
  useReducer,
  Dispatch,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { setToken } from "../services/setToken";
import { isBrowser } from "@/src/utils/isBrowser";
import { useRouter } from 'next/router';

interface LoginResponse {
  status: number;
  token: string;
  body: {
    user_cat: string;
    email: string;
    phone: string;
    name: string;
    lga: string;
    update_by: string;
    state_id?: string;
  };
}

interface AuthState {
  isSubmitting: boolean;
  token: string | null;
  errors: string | null;
}

// Initial state

const savedToken = isBrowser && window.sessionStorage.getItem("TOKEN")
  ? window.sessionStorage.getItem("TOKEN")
  : null;

const initialState: AuthState = {
  isSubmitting: false,
  token: savedToken,
  errors: null,
};


type AuthAction =
  | { type: "SET_LOGIN_SUBMITTING"; payload: boolean }
  | { type: "LOGIN"; payload: string }
  | { type: "SET_LOGIN_ERRORS"; payload: string | null }
  | { type: "LOGOUT" };

interface AuthProviderProps {
  children: ReactNode;
}

const AuthStateContext = createContext<AuthState | undefined>(undefined);
const AuthDispatchContext = createContext<Dispatch<AuthAction> | undefined>(
  undefined
);

const url = process.env.NEXT_PUBLIC_BASE_URL;

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOGIN_SUBMITTING":
      return { ...state, isSubmitting: action.payload };
    case "LOGIN":
      return { ...state, token: action.payload, errors: null };
    case "SET_LOGIN_ERRORS":
      return { ...state, errors: action.payload };
    case "LOGOUT":
      return { ...state, token: null };
    default:
      throw new Error(`Unhandled action type`);
    // throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.token) {
      setToken(state.token);
    }
  }, [state.token]);

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = (): AuthState => {
  const state = useContext(AuthStateContext);
  if (state === undefined) {
    throw new Error("useAuthState must be used within an AuthProvider");
  }
  return state;
};

export const useAuthDispatch = (): Dispatch<AuthAction> => {
  const dispatch = useContext(AuthDispatchContext);
  if (dispatch === undefined) {
    throw new Error("useAuthDispatch must be used within an AuthProvider");
  }
  return dispatch;
};

export const login = async (
  dispatch: Dispatch<AuthAction>,
  data: { email: string; password: string }
) => {
  dispatch({ type: "SET_LOGIN_SUBMITTING", payload: true });
  try {
    const response = await axios.post(`${url}/user/login`, data);
    const { token, body }: LoginResponse = response.data;
    dispatch({ type: "LOGIN", payload: token });

    setToken(token);
    toast.success(response?.data?.message);
    isBrowser && sessionStorage.setItem("TOKEN", token);
    isBrowser && sessionStorage.setItem("USER_DATA", JSON.stringify(body));

  } catch (error: any) {
    dispatch({
      type: "SET_LOGIN_ERRORS",
      payload: "Invalid login credentials",
    });
    toast.error(error?.response?.data?.message);
  } finally {
    dispatch({ type: "SET_LOGIN_SUBMITTING", payload: false });
  }
};

export const loginMDA = async (
  dispatch: Dispatch<AuthAction>,
  data: { email: string; password: string }
) => {
  dispatch({ type: "SET_LOGIN_SUBMITTING", payload: true });
  try {
    const response = await axios.post(`${url}/user/mda-login`, data);
    const { token, body }: LoginResponse = response.data;
    dispatch({ type: "LOGIN", payload: token });

    setToken(token);
    toast.success(response?.data?.message);
    isBrowser && sessionStorage.setItem("TOKEN", token);
    isBrowser && sessionStorage.setItem("USER_DATA", JSON.stringify(body));

  } catch (error: any) {
    dispatch({
      type: "SET_LOGIN_ERRORS",
      payload: "Invalid login credentials",
    });
    toast.error(error?.response?.data?.message);
  } finally {
    dispatch({ type: "SET_LOGIN_SUBMITTING", payload: false });
  }
};

export const logout = (dispatch: Dispatch<AuthAction>) => {
  dispatch({ type: "LOGOUT" });
  setToken(null);
  isBrowser && sessionStorage.clear();
};
