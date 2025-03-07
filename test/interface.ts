export interface CreateAccountResponse {
  body: {
    data: {
      createUser: {
        ok: boolean;
        error: string | null;
      };
    };
  };
}
export interface LoginResponse {
  body: {
    data: {
      login: {
        ok: boolean;
        error: string | null;
        token: string | null;
      };
    };
  };
}
