export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserDetails {
    name: string;
    email: string;
    role: string;
}

interface Tokens {
    token: string;
    expires: string;
}

export interface UserTokens {
    access: Tokens;
    refresh: Tokens;
}

export interface LoginResponse {
    user: UserDetails;
    tokens: UserTokens;
}