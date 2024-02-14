import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function Logout() {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("orlaclub_user");
    router.push("/");
  };

  return (
    <div style={{ display: "flex", alignItems: "end", margin: "20px" }}>
      <Button onClick={handleLogout} className="ml-auto mt-4 lg:mt-0">
        Logout
      </Button>
    </div>
  );
}
