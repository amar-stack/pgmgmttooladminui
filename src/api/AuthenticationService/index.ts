/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import axios from '../baseAPI';
import { ResultAsync } from "neverthrow";
import {v4 as uuidv4 } from 'uuid';
import { LoginRequest, LoginResponse } from "./types";

axios.defaults.headers.common['Accept'] = 'application/json';
const headersValidateRequest = {
    'Content-Type': 'application/json'
}

const login = (data: LoginRequest): ResultAsync<AxiosResponse<LoginResponse>, any> => {
    const config = {
        headers: headersValidateRequest,
        _skipAuthHeaders: true,
        _skipRetry: true
    };
    return ResultAsync.fromPromise(axios.post<LoginResponse>('http://43.204.30.219:3000/v1/auth/login', data, config), (err: any)=>{
        return err as any
    })
}

const AuthenticationService = {
    login
}

export default AuthenticationService;