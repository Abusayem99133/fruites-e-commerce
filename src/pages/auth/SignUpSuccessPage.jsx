import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, LogIn } from "lucide-react";

function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Registration Successful!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Your account has been created successfully.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              You can now sign in with your email and password to start
              shopping.
            </p>
            <Link to="/signin">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpSuccessPage;
