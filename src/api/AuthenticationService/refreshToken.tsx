/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import axios from '../baseAPI';

const applicationHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
}

class RefreshTokenSingleton {
    private static instance: RefreshTokenSingleton;
    private refreshTokenRequest: Promise<AxiosResponse<any>> | null = null;

    private constructor() {}

    public static getInstance(): RefreshTokenSingleton {
        if(!RefreshTokenSingleton.instance){
            RefreshTokenSingleton.instance = new RefreshTokenSingleton();
        }
        return RefreshTokenSingleton.instance;
    }

    public accessTokenByRefreshToken = (refreshToken: string) => {
        if(!this.refreshTokenRequest){
            this.refreshTokenRequest = this._accessTokenByRefreshToken(refreshToken);
            this.refreshTokenRequest.then(this.resetAuthTokenRequest, this.resetAuthTokenRequest)
        }
        return this.refreshTokenRequest
    }

    private resetAuthTokenRequest = () => {
        this.refreshTokenRequest = null;
    }

    private _accessTokenByRefreshToken = (refreshToken: string): Promise<AxiosResponse<any>> => {
        console.log("ammmsjm")
        if(!refreshToken){
            throw new Error('User not authentiated');
        }
        console.log(refreshToken, "refreshToken")
        const config = {
            headers: { ...applicationHeaders},
            _skipRetry: true,
            _skipAuthHeaders: true,
            _skipTransId: true
        };
        return axios.post('http://13.234.239.70:3000/v1/auth/refresh-tokens', {refreshToken: refreshToken}, config);
    }

}

const refreshToken = {
    accessTokenByRefreshToken: RefreshTokenSingleton.getInstance().accessTokenByRefreshToken,
};

export default refreshToken;