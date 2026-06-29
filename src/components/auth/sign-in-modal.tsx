"use client";

import { useState, useActionState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginWithCredentials, registerUser } from "@/app/actions/auth";

export function SignInModal({ children }: { children?: React.ReactElement }) {
  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  const [loginState, loginAction, isLoginPending] = useActionState(loginWithCredentials, null);
  const [registerState, registerAction, isRegisterPending] = useActionState(registerUser, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={
          children || (
            <Button size="sm" className="hidden sm:flex h-9 text-xs font-semibold bg-primary hover:bg-primary/90">
              Sign In
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-[800px] w-[95vw] p-0 overflow-hidden bg-background border-none shadow-2xl sm:rounded-2xl">
        <DialogTitle className="sr-only">Sign In</DialogTitle>
        <DialogDescription className="sr-only">Sign in to your account</DialogDescription>
        
        <div className="flex flex-col md:flex-row h-[500px]">
          {/* Left Panel */}
          <div className="hidden md:flex flex-col justify-between w-[40%] bg-emerald-500 p-10 relative overflow-hidden text-white">
            {/* Topography pattern overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 border-[40px] border-white/10 rounded-full"></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 border-[40px] border-white/10 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-[40px] border-white/5 rounded-full"></div>
            
            <div className="relative z-10">
              <h2 className="text-[2.5rem] font-bold leading-tight tracking-tight mt-4">
                Simple, Free<br />Investing.
              </h2>
            </div>
            
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-2 h-2 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              <span className="text-xl font-bold tracking-tight">IPO Pulse</span>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 bg-card relative">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            
            <div className="w-full max-w-[320px] flex flex-col gap-6">
              
              <form action={isLogin ? loginAction : registerAction} className="flex flex-col gap-4">
                {!isLogin && (
                  <div className="relative">
                    <Input 
                      type="text" 
                      name="name"
                      placeholder="Your Name" 
                      autoComplete="off"
                      className="border-0 border-b border-border/60 rounded-none px-1 pb-2 focus-visible:ring-0 focus-visible:border-foreground shadow-none h-12 text-[15px] bg-transparent placeholder:text-muted-foreground/60 transition-colors [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]"
                    />
                  </div>
                )}
                <div className="relative">
                  <Input 
                    type="email" 
                    name="email"
                    placeholder="Email Address" 
                    required
                    autoComplete="off"
                    className="border-0 border-b border-border/60 rounded-none px-1 pb-2 focus-visible:ring-0 focus-visible:border-foreground shadow-none h-12 text-[15px] bg-transparent placeholder:text-muted-foreground/60 transition-colors [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]"
                  />
                </div>
                <div className="relative">
                  <Input 
                    type="password" 
                    name="password"
                    placeholder="Password" 
                    required
                    autoComplete="new-password"
                    className="border-0 border-b border-border/60 rounded-none px-1 pb-2 focus-visible:ring-0 focus-visible:border-foreground shadow-none h-12 text-[15px] bg-transparent placeholder:text-muted-foreground/60 transition-colors [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]"
                  />
                </div>

                {isLogin && loginState?.error && (
                  <p className="text-sm text-red-500">{loginState.error}</p>
                )}
                {!isLogin && registerState?.error && (
                  <p className="text-sm text-red-500">{registerState.error}</p>
                )}

                <Button type="submit" disabled={isLoginPending || isRegisterPending} className="w-full h-[52px] mt-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-[15px] shadow-sm rounded-lg transition-colors">
                  {isLogin 
                    ? (isLoginPending ? "Signing in..." : "Sign In") 
                    : (isRegisterPending ? "Creating account..." : "Register")}
                </Button>
              </form>


              <div className="text-center text-sm mt-2">
                <span className="text-muted-foreground">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="font-semibold text-emerald-500 hover:text-emerald-600 underline-offset-4 hover:underline"
                >
                  {isLogin ? "Sign up" : "Log in"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
