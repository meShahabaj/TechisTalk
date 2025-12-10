import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Auth {
    id: string;
    username: string;
}

interface AuthState {
    auth: Auth;
    isAuthenticated: boolean;
}
const initialAuth = {
    id: "",
    username: "",
}

const initialState: AuthState = {
    auth: initialAuth,
    isAuthenticated: false,
};

const userSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        authAdd: (state, action: PayloadAction<Auth>) => {
            state.auth = action.payload;
            state.isAuthenticated = !!action.payload;
        }
    },
});

export const { authAdd } = userSlice.actions;
export default userSlice.reducer;
