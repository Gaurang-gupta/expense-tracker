import { SignedOut, SignIn } from '@clerk/clerk-react';

const SignInPage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <SignedOut>
      <SignIn 
      signUpUrl={"/sign-up"} 
      path="/sign-in" routing="path" />
      </SignedOut>
    </div>
  </div>
);

export default SignInPage;