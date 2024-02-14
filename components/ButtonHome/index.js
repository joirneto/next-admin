import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

export default function ButtonHome() {
  const router = useRouter();
  const handleHome = () => {
    router.push("/activities");
  };

  return (
    <div style={{ display: "flex", alignItems: "start", margin: "20px" }}>
      <Button onClick={handleHome}>
        Home
      </Button>
    </div>
  );
}
