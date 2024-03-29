import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import LoadingSpinner from "../Loading";
import Logout from "../Logout";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("admin_user");
    if (user) {
      router.push("/activities");
    }

    const savedEmail = document.getElementById("email").value;
    const savedPassword = document.getElementById("password").value;

    if (savedEmail) {
      setEmail(savedEmail);
    }

    if (savedPassword) {
      setPassword(savedPassword);
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const url = "https://url-sua-api.vercel.app/api/";
    try {
      const response = await axios.post(url + "auth", { email, password });
      localStorage.setItem(
        "admin_user",
        JSON.stringify(response.data.access_token)
      );
      setLoading(false);
      router.push("/activities");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Logout />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Card className="max-w-md mx-auto my-20">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">Login</CardTitle>
            <CardDescription>Entre com seu email e senha</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <Button onClick={handleLogin} className="w-full">
                Login
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  );
}
