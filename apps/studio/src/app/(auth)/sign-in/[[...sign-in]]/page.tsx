import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn
        component="Sign In"
        signUpUrl={undefined}
        path="/sign-in"
        routing="path"
      />
    </div>
  );
}
