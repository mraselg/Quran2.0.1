import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { Cloud, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Map username to a pseudo-email for Supabase
      let email = username.trim();
      if (!email.includes("@")) {
        email = `${email}@alqalam.local`;
      }

      // Try logging in
      let { error } = await supabase.auth.signInWithPassword({ email, password });

      // Auto-provision initial rasel88990 user if it doesn't exist
      if (
        error &&
        error.message.includes("Invalid login credentials") &&
        username.trim() === "rasel88990" &&
        password === "rasel88990"
      ) {
        const signUpRes = await supabase.auth.signUp({ email, password });
        if (!signUpRes.error) {
          // Retry login after successful sign-up
          error = null;
          await supabase.auth.signInWithPassword({ email, password });
        }
      }

      if (error) throw error;
      
      toast.success("লগইন সফল হয়েছে!");
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "লগইন ব্যর্থ হয়েছে। ইউজারনেম বা পাসওয়ার্ড সঠিক নয়।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800 text-neutral-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-500">
            <Cloud className="w-5 h-5" />
            ক্লাউড লগইন
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            আপনার প্রজেক্ট ক্লাউডে সেভ করতে লগইন করুন।
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAuth} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="username" className="text-sm font-medium">ইউজারনেম (Username)</label>
            <Input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-neutral-800 border-neutral-700 focus:border-amber-500"
              placeholder="যেমন: rasel88990"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium">পাসওয়ার্ড (Password)</label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-neutral-800 border-neutral-700 focus:border-amber-500"
            />
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox 
              id="keepLoggedIn" 
              checked={keepLoggedIn}
              onCheckedChange={(checked) => setKeepLoggedIn(checked as boolean)}
              className="border-neutral-600 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
            />
            <label
              htmlFor="keepLoggedIn"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              লগইন অবস্থায় থাকুন (Keep me logged in)
            </label>
          </div>
          <Button type="submit" disabled={isLoading} className="mt-4 bg-amber-600 hover:bg-amber-700 text-white">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            লগইন (Login)
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
