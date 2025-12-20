"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { loginUser, registerUser } from "@/api/auth";
import useUser from "@/store/user-store";
import { LInput } from "./custom-input";
import { PasswordInput } from "./password-input";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export const AuthPopup = ({ children }: { children: React.ReactNode }) => {
  const { setUser, setToken } = useUser();
  const router = useRouter();

  const loginTestUser = () => {
    setEmail("test@test.com");
    setPassword("test");
  };

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [type, setType] = useState<"Register" | "Login">("Login");
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      const response = await registerUser(email, username, password);
      setEmail("");
      setPassword("");
      setUsername("");

      setUser(response.user);
      setOpen(false);
      router.push("/profile");
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await loginUser(email, password);
      setEmail("");
      setPassword("");

      setToken(response.token);
      setUser(response.user);
      setOpen(false);
      router.push("/profile");
      toast.success("Logged in successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {type === "Register" ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>{children}</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-left">
                Create An Account
              </DialogTitle>
            </DialogHeader>
            <LInput
              placeholder="Enter your email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              disabled={isLoading}
            />
            <LInput
              isRequired
              placeholder="Enter your username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              disabled={isLoading}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <span className="text-black">
                <Button
                  variant={"link"}
                  className="p-0"
                  onClick={() => setType("Login")}
                  disabled={isLoading}
                >
                  Login
                </Button>
              </span>
            </p>
            <Button onClick={handleRegister} disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin" size={16} />}
              Submit
            </Button>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>{children}</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle
                className="text-2xl font-semibold cursor-pointer"
                onDoubleClick={loginTestUser}
              >
                Login to your account
              </DialogTitle>
            </DialogHeader>
            <LInput
              isRequired
              placeholder="Enter your email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              disabled={isLoading}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 flex gap-1 items-center">
              New here??{" "}
              <span className="text-black">
                <Button
                  variant={"link"}
                  className="p-0"
                  onClick={() => setType("Register")}
                  disabled={isLoading}
                >
                  Create an account
                </Button>
              </span>
            </p>
            <p className="text-sm text-gray-500">
              <span className="text-black"></span>
            </p>
            <Button onClick={handleLogin} disabled={isLoading}>
              {isLoading && <Loader2 className="animate-spin" size={16} />}
              Submit
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
