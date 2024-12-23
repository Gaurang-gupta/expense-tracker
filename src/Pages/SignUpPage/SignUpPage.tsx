import { SignUp } from '@clerk/clerk-react';

const SignUpPage = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <SignUp 
      signInUrl={"/sign-in"} 
      path="/sign-up" 
      routing="path" />
    </div>
  </div>
);

export default SignUpPage;