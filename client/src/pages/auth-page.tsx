import { useState, useEffect } from "react";
import { useLocation, useSearch, Link, Redirect } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, loginSchema, registerSchema } from "@/hooks/use-auth";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialTab = params.get("tab") === "register" ? "register" : "login";
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Define the form for login
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Define the form for registration
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // Handle login form submission
  function handleLogin(values: z.infer<typeof loginSchema>) {
    loginMutation.mutate(values);
  }

  // Handle registration form submission
  function handleRegister(values: z.infer<typeof registerSchema>) {
    registerMutation.mutate(values);
  }

  // Update the URL when tab changes
  useEffect(() => {
    const newParams = new URLSearchParams(search);
    if (activeTab === "register") {
      newParams.set("tab", "register");
    } else {
      newParams.delete("tab");
    }
    window.history.replaceState({}, "", `${window.location.pathname}?${newParams}`);
  }, [activeTab, search]);

  // Redirect if user is already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid gap-6 md:grid-cols-2">
          {/* Left side - Auth form */}
          <div className="space-y-6">
            <div className="text-center md:text-left mb-8">
              <Link href="/" className="inline-flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary w-8 h-8 mr-2">
                  <path d="M5 8l5 3l5 -3l5 3v6l-5 3l-5 -3l-5 3v-6l5 -3z"></path>
                  <path d="M10 6l5 -3l5 3"></path>
                </svg>
                <span className="text-xl font-semibold text-gray-900">PinyinHub</span>
              </Link>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Welcome to PinyinHub</CardTitle>
                <CardDescription>
                  Enter your details to {activeTab === "login" ? "sign in to" : "create"} your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  {/* Login Tab */}
                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                        <FormField
                          control={loginForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your email"
                                  type="email"
                                  {...field}
                                  disabled={loginMutation.isPending}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your password"
                                  type="password"
                                  {...field}
                                  disabled={loginMutation.isPending}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="remember" />
                            <label
                              htmlFor="remember"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Remember me
                            </label>
                          </div>
                          <a href="#" className="text-sm font-medium text-primary hover:text-primary-700">
                            Forgot password?
                          </a>
                        </div>
                        
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={loginMutation.isPending}
                        >
                          {loginMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Signing in...
                            </>
                          ) : (
                            "Sign in"
                          )}
                        </Button>
                      </form>
                    </Form>
                    
                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <Button variant="outline" type="button" disabled>
                          <svg className="mr-2 h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                          </svg>
                          Google
                        </Button>
                        <Button variant="outline" type="button" disabled>
                          <svg className="mr-2 h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          Facebook
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Register Tab */}
                  <TabsContent value="register">
                    <Form {...registerForm}>
                      <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Choose a username"
                                  {...field}
                                  disabled={registerMutation.isPending}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your email"
                                  type="email"
                                  {...field}
                                  disabled={registerMutation.isPending}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={registerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Create a password"
                                  type="password"
                                  {...field}
                                  disabled={registerMutation.isPending}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox id="terms" />
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I accept the{" "}
                            <a href="#" className="text-primary hover:text-primary-700">
                              terms and conditions
                            </a>
                          </label>
                        </div>
                        
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={registerMutation.isPending}
                        >
                          {registerMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            "Create account"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-500">
                  {activeTab === "login" ? (
                    <>
                      Don't have an account?{" "}
                      <button
                        onClick={() => setActiveTab("register")}
                        className="font-medium text-primary hover:text-primary-700"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        onClick={() => setActiveTab("login")}
                        className="font-medium text-primary hover:text-primary-700"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </CardFooter>
            </Card>
          </div>
          
          {/* Right side - Hero content */}
          <div className="hidden md:flex md:items-center">
            <div className="bg-primary/5 rounded-lg p-8 space-y-6">
              <div className="bg-white rounded-lg p-2 w-16 h-16 flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary w-10 h-10">
                  <path d="M5 8l5 3l5 -3l5 3v6l-5 3l-5 -3l-5 3v-6l5 -3z"></path>
                  <path d="M10 6l5 -3l5 3"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-bold">Unlock Chinese Music with PinyinHub</h2>
              <p className="text-gray-600">
                Learn Chinese through music with our innovative platform. Get instant pinyin transliteration and English translations for your favorite Chinese songs.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-600">AI-powered translations that capture the meaning and nuance of lyrics</p>
                </div>
                <div className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-600">Accurate pinyin with tone marks to improve your pronunciation</p>
                </div>
                <div className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-600">Contribute to a growing community of language learners</p>
                </div>
              </div>
              <div className="pt-4">
                <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600">
                  "Learning Chinese through songs has never been easier. PinyinHub has transformed how I study the language!"
                  <footer className="mt-2 text-sm font-medium">— Sarah, Mandarin Student</footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} PinyinHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
