import { SignedOut, SignIn } from '@clerk/clerk-react';

const SignInPage = () => (
  <SignedOut>
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <SignIn 
        signUpUrl={"/sign-up"} 
        path="/sign-in" routing="path" />
      </div>
    </div>
  </SignedOut>
);

export default SignInPage;