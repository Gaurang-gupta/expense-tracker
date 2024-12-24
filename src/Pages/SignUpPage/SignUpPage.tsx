import { SignUp, SignedOut } from '@clerk/clerk-react';

const SignUpPage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <SignedOut>
        <SignUp 
        signInUrl={"/sign-in"} 
        path="/sign-up" 
        routing="path" />
      </SignedOut>
      
    </div>
  </div>
);

export default SignUpPage;