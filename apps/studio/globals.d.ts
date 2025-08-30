export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      hasCreatorRole?: boolean;
    };
  }
}
