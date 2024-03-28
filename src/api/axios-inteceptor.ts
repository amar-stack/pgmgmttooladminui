/* eslint-disable @typescript-eslint/no-explicit-any */
import store from '../stores/store';
import { Axios, AxiosResponse } from 'axios';
import RefreshTokenService from './AuthenticationService/refreshToken';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import Router from 'next/router';
import { saveLoginTokens } from '../stores/authSlice';

export const INVALID_REFRESH_TOKEN = 'Invalid Refresh Token';

const invalidAccessToken = (accessTokenExpiration: string) => {
    const dateExpired = dayjs(accessTokenExpiration);
    const diffSeconds = dateExpired.diff(dayjs(), 'second');
    return diffSeconds <= 1;
}


const refreshAccessToken = async () => {
    console.log(store.getState()?.auth?.refreshToken, "store.getState()?.auth?.refreshToken")
    try {
        if(store.getState()?.auth?.refreshToken == 'refresh token not available'){
            //navigate to login
            Router.replace('/login')
        }
        else{
            const res = await RefreshTokenService.accessTokenByRefreshToken(store.getState()?.auth?.refreshToken);
            console.log(res, "ressss")
            store.dispatch(
                saveLoginTokens({
                    accessToken: res?.data?.tokens.access.token,
                    refreshToken: res?.data?.tokens.access.token,
                    expiresInSec: res?.data?.tokens.access.expires,
                })
            );
        }
    } catch(err){
        // naviagte to login page
        // store.dispatch(clear());
        Router.replace('/login')
        throw new Error(INVALID_REFRESH_TOKEN)
    }
};

const addAuthHeadersToConfig = (config: any, accessToken: string) => {
    if(!config.headers){
        config.headers = {};
    }

    if(!config._skipTransId && !config.headers['meta-transid']){
        config.headers['meta-transid'] = uuidv4();
    }

    if(config.headers['Authorization']){
        config.headers['Authorization'] = 'Bearer ' + accessToken
    } else if(accessToken){
        console.log("cammemj")
        config.headers['Authorization'] = 'Bearer ' + accessToken
    }
    console.log(config)
    return config;
}

const setupAxiosInterceptor = (instance: Axios) => {
    console.log("akjsak")
    const onRequestSuccess: any = (config: any) => {
        console.log(config, "con")
        if(!config._skipAuthHeaders){
            const {accessToken, accessTokenExpiration} = store.getState().auth;
            if(accessToken && accessTokenExpiration){
                if(invalidAccessToken(accessTokenExpiration)){
                    return refreshAccessToken().then(()=>onRequestSuccess(config));
                }
            }
            addAuthHeadersToConfig(config, accessToken);
        }
        return config;
    }
    const onResponseSuccess = (response: AxiosResponse) => response;
    const onResponseError = async (err: any) => {
        console.log("ame error")
        const config = err.config;
        const status = err.response?.status || 401;
        if(status === 401 && config && !config._skipRetry){
            try {
                await refreshAccessToken();
                config._skipRetry = true;
                return await instance.request(config)
            } catch(err_1){
                return await Promise.reject(err_1)
            }
        }
        return Promise.reject(err)
    }
    console.log("tets")
    instance.interceptors.request.use(onRequestSuccess);
    instance.interceptors.response.use(onResponseSuccess, onResponseError);
};

export { setupAxiosInterceptor}