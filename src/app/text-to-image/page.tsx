"use client";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import ImageStudio from "@/components/text-to-image";

import {
    Authenticated,
    AuthLoading,
    Unauthenticated,
} from "convex/react";
import { useState } from "react";

export default function TextToImage() {
    const [showSignIn, setShowSignIn] = useState(false);

    return (
        <>
            <Authenticated>
                < ImageStudio />
            </Authenticated>
            <Unauthenticated>
                {showSignIn ? (
                    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
                ) : (
                    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
                )}
            </Unauthenticated>
            <AuthLoading>
                <div>Loading...</div>
            </AuthLoading>
        </>
    );
}
