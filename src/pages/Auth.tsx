
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signUp } = useAuth();

  const handleAuth = async (action: "signin" | "signup") => {
    try {
      if (action === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
        toast({
          title: "Check your email",
          description: "We sent you a confirmation link.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <Tabs defaultValue="signin">
          <CardHeader>
            <CardTitle>Welcome to SupplyLink</CardTitle>
            <CardDescription>Sign in to manage your inventory</CardDescription>
            <TabsList className="grid w-full grid-cols-2 mt-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="space-y-4 mt-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <TabsContent value="signin" className="w-full">
              <Button 
                className="w-full" 
                onClick={() => handleAuth("signin")}
                disabled={!email || !password}
              >
                Sign In
              </Button>
            </TabsContent>
            <TabsContent value="signup" className="w-full">
              <Button 
                className="w-full" 
                onClick={() => handleAuth("signup")}
                disabled={!email || !password}
              >
                Sign Up
              </Button>
            </TabsContent>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
}
