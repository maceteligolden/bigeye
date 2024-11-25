'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"; // For App Router navigation
import { useState } from "react";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();

  const onSubmit = async (data: unknown) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrorMessage(error.message || "Registration failed");
        return;
      }

      // Redirect on success
      router.push("/auth/login");
    } catch (error) {
      setErrorMessage("Something went wrong");
    }
  };

  return (
    <section className="h-screen w-screen flex flex-row justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Signup and start monitoring.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  type="text"
                  placeholder="Enter firstname"
                  {...register("firstname", { required: "First name is required" })}
                />
                {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname.message?.toString()}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  type="text"
                  placeholder="Enter lastname"
                  {...register("lastname", { required: "Last name is required" })}
                />
                {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname.message?.toString()}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message?.toString()}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message?.toString()}</p>}
              </div>
            </div>
            {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
            <Button type="submit" className="mt-4 w-full">
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
