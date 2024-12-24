import { SignedOut, SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router';

const SignInPage = () => (
  <SignedOut>
    <div className="flex items-center justify-center min-h-screen bg-gray-500">
      <div className="text-center">
        <SignIn 
        signUpUrl={"/sign-up"} 
        path="/sign-in" routing="path" 
        appearance={{
          elements: {
            footer: {
              display: "none"
            },
            card: "bg-gray-50"
          }
        }}
        />
        <div className='w-full mt-10 border rounded-xl py-3 shadow-lg bg-gray-50'>
New to Expense Tracker. <Link className='font-bold' to={"/sign-up"}>Sign Up</Link>
        </div>
      </div>
    </div>
  </SignedOut>
);

export default SignInPage;