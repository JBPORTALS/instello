export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      hasCreatorRole?: boolean;
    };
  }
}

declare module "@clerk/types" {
  interface JwtSessionClaims extends CustomJwtSessionClaims {
    metadata: {
      hasCreatorRole?: boolean;
    };
  }
}
