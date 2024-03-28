/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import { ThunkAPI } from "./store";
import AuthenticationService from "../api/AuthenticationService";

dayjs.extend(utc);

const AUTH_TOKEN = 'auth';
const AUTH_TOKEN_SAVE = `${AUTH_TOKEN}/save`;
const AUTH_TOKEN_SAVE_FULFILLED = `${AUTH_TOKEN_SAVE}/fulfilled`;

const LOGIN_BASE = 'login';
const LOGIN_BASE_SAVE = `${LOGIN_BASE}/save`;
const LOGIN_BASE_SAVE_FULFILLED = `${LOGIN_BASE_SAVE}/fulfilled`;

interface AuthState {
    loading: string;
    accessToken: string;
    accessTokenExpiration: string;
    refreshToken: string;
    isAuthenticated?: boolean;
    invalidCredentials: boolean;
    loginServerError: boolean;
    userName: string;
    userEmail: string;
}

interface loginResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

interface AxiosDetailsResponse {
    data: loginResponse;
}

interface LoginRequest {
    email: string;
    password: string;
}

const defaultExpiration = dayjs().subtract(1, 's').utc().format();

const initialState: AuthState = {
    loading: 'idle',
    accessToken: '',
    accessTokenExpiration: defaultExpiration,
    refreshToken: '',
    isAuthenticated: false,
    invalidCredentials: false,
    loginServerError: false,
    userName: '',
    userEmail: ''
}

export interface LoginTokens {
    accessToken: string;
    refreshToken: string;
    expiresInSec: number;
}

const saveLoginTokens = createAsyncThunk<void, LoginTokens, ThunkAPI>(
    AUTH_TOKEN_SAVE,
    async (loginTokens, { dispatch }) => {
        await dispatch(saveAllTokens(loginTokens));
        return;
    }
)

const login = createAsyncThunk<AxiosDetailsResponse, LoginRequest, ThunkAPI>(
    LOGIN_BASE_SAVE,
    async (body, thunkApi)=>{
        const {email, password } = body;
        const loginRequestBody = {
            email: email,
            password: password
        };
        const res: any = await AuthenticationService.login(loginRequestBody);
        console.log(res, "isAuthenticated")
        if(res.isErr()){
            return Promise.reject(res.err)
        } else {
            console.log("ame", res.value)
            const response = res.value;
            const refreshToken = response.data.tokens.refresh.token;
            const accessToken = response.data.tokens.access.token;
            const expiresInSec = response.data.tokens.access.expires;
            const userName = response.data.user.name;
            const userEmail = response.data.user.email
            console.log("setting here")
            thunkApi.dispatch(saveLoginTokens({accessToken, refreshToken, expiresInSec}));
            thunkApi.dispatch(setUser({userName,userEmail }))
            return;
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        saveAllTokens: (state, action) => {
            const {accessToken, expiresInSec, refreshToken} = action.payload;
            console.log("setting this")
            return {
                ...state,
                isAuthenticated: true,
                accessToken,
                accessTokenExpiration: dayjs()
                    .add(expiresInSec as number, 's')
                    .utc()
                    .format(),
                refreshToken,
            };
        },
        setUser: (state, action) => {
            state.userName = action.payload.name
            state.userEmail = action.payload.email
          },
        clearAll: () => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = 'pending';
                state.loginServerError = false;
            })
            .addCase(login.fulfilled, (state) => {
                state.loading = 'succeeded';
                console.log("suu")
            })
            .addCase(login.rejected, (state) => {
                state.loading = 'failed';
                state.loginServerError = true
            })
    }
})

export const { saveAllTokens, clearAll, setUser } = authSlice.actions;
export { authSlice, login, LOGIN_BASE_SAVE_FULFILLED, saveLoginTokens, AUTH_TOKEN_SAVE_FULFILLED}