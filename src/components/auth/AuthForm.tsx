"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterSchema,
  RegisterInput,
  LoginSchema,
  LoginInput,
} from "@/src/lib/validators/auth.schema";

export interface AuthFormProps {
  onSuccess: () => void;
}

export const AuthForm: FC<AuthFormProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const isSignUp = mode === "signup";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<RegisterInput | LoginInput>({
    resolver: zodResolver(isSignUp ? RegisterSchema : LoginSchema),
  });

  const toggleMode = () => {
    setMode(isSignUp ? "signin" : "signup");
    reset(); // Clear form after switched
  };

  const onSubmit = async (data: RegisterInput | LoginInput) => {
    try {
      // If signup, register first
      if (isSignUp) {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const result = await res.json();
          setError("root", { message: result.error });
          return;
        }
      }
      //Sign in
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError("root", { message: "Invalid email or password" });
        return;
      }

      onSuccess();
    } catch (error) {
      console.error("Auth error:", error);
      setError("root", { message: "Something went wrong" });
    }
  };

  const handleGoogleAccount = () => {
    signIn("google");
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-start items-center space-y-4"
      >
        <h3 className="text-xl font-semibold">
          {mode === "signup" ? "Sign Up" : "Sign In"}
        </h3>

        {/* Root error */}
        {errors.root && (
          <p className="text-sm text-red-500">{errors.root.message}</p>
        )}

        {isSignUp && (
          <div className="w-full">
            <label htmlFor="name" className="text-sm">
              Name
            </label>
            <input
              id="name"
              type="name"
              placeholder="Enter your email address"
              {...register("name")}
              className={`px-2 py-1 w-full border-2 rounded-lg outline-none focus:border-black ${
                "name" in errors && errors.name
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            />
            {"name" in errors && errors.name?.message && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
        )}
        <div className="w-full">
          <label htmlFor="email" className="text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email address"
            {...register("email")}
            className={`px-2 py-1 w-full border-2 rounded-lg outline-none focus:border-black ${
              errors.email ? "border-red-500" : "border-gray-200"
            } `}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="w-full">
          <label htmlFor="password" className="text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            className={`px-2 py-1 w-full border-2 rounded-lg outline-none focus:border-black ${
              errors.password ? "border-red-500" : "border-gray-200"
            } `}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full px-1 py-2 rounded-lg text-white cursor-pointer  ${
            isSubmitting ? "bg-gray-900" : "bg-black"
          }`}
        >
          Sign In
        </button>
      </form>
      {/* Devided Line */}
      <div className="flex flex-row justify-center items-center gap-0.5 mt-4 w-full">
        <div className="w-full h-0.5 bg-gray-200" />
        <span className="text-sm font-semibold text-gray-200">OR</span>
        <div className="w-full h-0.5 bg-gray-200" />
      </div>
      {/* Third part auth TODO: add color google icon */}
      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleGoogleAccount}
        className={`mt-4 w-full px-1 py-2 border border-gray-200 rounded-lg  bg-white cursor-pointer ${
          isSubmitting ? "text-gray-200" : "text-black"
        }`}
      >
        Continue with Google
      </button>
      {/* Toggle form */}
      <div className="mx-auto mt-4 flex flex-row justify-center items-center gap-1 text-xs">
        <span className="text-gray-400">
          {isSignUp ? "Already have an account?" : "Don't have an account yet?"}
        </span>
        <button
          type="button"
          onClick={toggleMode}
          className="underline font-semibold text-black cursor-pointer"
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </div>
    </div>
  );
};
