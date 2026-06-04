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

type AuthDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("অ্যাকাউন্ট তৈরি সফল হয়েছে। দয়া করে আপনার ইমেইল যাচাই করুন।");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("লগইন সফল হয়েছে!");
        onOpenChange(false);
      }
    } catch (error: any) {
      toast.error(error.message);
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
            {isSignUp ? "নতুন অ্যাকাউন্ট" : "ক্লাউড লগইন"}
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            আপনার প্রজেক্ট ক্লাউডে সেভ করতে লগইন করুন।
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAuth} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">ইমেইল (Email)</label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-neutral-800 border-neutral-700 focus:border-amber-500"
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
          <Button type="submit" disabled={isLoading} className="mt-2 bg-amber-600 hover:bg-amber-700 text-white">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSignUp ? "সাইন আপ (Sign Up)" : "লগইন (Login)"}
          </Button>
          <div className="text-center text-sm mt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-amber-500 hover:underline"
            >
              {isSignUp ? "ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন" : "অ্যাকাউন্ট নেই? সাইন আপ করুন"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
