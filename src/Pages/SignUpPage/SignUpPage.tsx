import { SignUp, SignedOut } from '@clerk/clerk-react';
import { Link } from 'react-router';

const SignUpPage = () => (
  <SignedOut>
    <div className="flex items-center justify-center min-h-screen bg-gray-500">
      <div className="text-center">
        <SignUp 
          signInUrl={"/sign-in"} 
          path="/sign-up" 
          routing="path" 
          appearance={{
            elements: {
              footer: {
                display: "none"
              },
              card: "bg-gray-50"
            }
          }}
        />
        <div className='w-full mt-5 border rounded-xl py-3 shadow-lg bg-gray-50'>
Already have an account. <Link className='font-bold' to={"/sign-in"}>Sign in</Link>
        </div>
      </div>
    </div>
  </SignedOut>
);

export default SignUpPage;