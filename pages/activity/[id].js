import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import axios from "axios";
import Logout from "@/components/Logout";
import { useRouter } from 'next/router';

export default function EditarAtividade() {
  const router = useRouter();
  const { id } = router.query;
  const [activity, setActivity] = useState("");
  const [describe, setDescribe] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("orlaclub_user");
    if (!user) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("orlaclub_user"));
    axios
      .get("https://api-orlaclub.vercel.app/api/admin/activities/" + id, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setActivity(res.data.activity);
        setDescribe(res.data.describe);
      })
      .catch((err) => {
        console.log(err);
        handleLogout();
      });
  },[])
  const handleLogout = () => {
    localStorage.removeItem("orlaclub_user");
    router.push("/");
  };
  const handleEditarAtividade = async (event) => {
    event.preventDefault();
    const token = JSON.parse(localStorage.getItem("orlaclub_user"));
    try {
      await axios.patch(
        "https://api-orlaclub.vercel.app/api/admin/activities/"+id,
        {
          activity,
          describe,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      router.push("/activities");
    } catch (error) {
      console.error(error);
      handleLogout();
    }
  };
  return (
    <>
      <Logout />
      <Card className="max-w-md mx-auto my-20">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl">Editar Atividade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="activity">Nome da Atividade</Label>
              <Input
                id="activity"
                placeholder="Digite o nome da atividade"
                onChange={(e) => setActivity(e.target.value)}
                value={activity}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Digite a descrição da atividade"
                onChange={(e) => setDescribe(e.target.value)}
                value={describe}
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleEditarAtividade} type="submit">
                Editar Atividade
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
