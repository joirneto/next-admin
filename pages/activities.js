import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Logout from "@/components/Logout";
import { useRouter } from "next/router";
import LoadingSpinner from "@/components/Loading";

export default function Activities() {
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleEditar = (id) => {
    router.push("/activity/" + id);
  };

  const handleImagem = (id) => {
    router.push("/imagens/" + id);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_user");
    router.push("/");
  };

  const handleNovaAtividade = () => {
    router.push("/nova-atividade");
  };

  const handleDelete = (id) => {
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("admin_user"));
    axios
      .delete("https://url-sua-api.vercel.app/api/admin/activities/" + id, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setRefresh((old) => !old);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        handleLogout();
      });
  };

  useEffect(() => {
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("admin_user"));
    if (!token) {
      router.push("/");
    }

    axios
      .get("https://url-sua-api.vercel.app/api/admin/activities", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setActivities(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        handleLogout();
      });
  }, [refresh]);
  return (
    <>
      <Logout />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Card className="mx-auto">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">Atividades</CardTitle>
            <CardDescription>Lista de Atividades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleNovaAtividade} className="ml-auto">
              Add Nova Atividade
            </Button>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>Atividade</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Criado em:</TableHead>
                    <TableHead>Editado em:</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>{activity.id}</TableCell>
                      <TableCell className="font-medium">
                        {activity.activity}
                      </TableCell>
                      <TableCell className="font-medium">
                        {activity.describe}
                      </TableCell>
                      <TableCell>
                        {moment(activity.createdAt).format("HH:mm DD/MM/YYYY")}
                      </TableCell>
                      <TableCell>
                        {moment(activity.updatedAt).format("HH:mm DD/MM/YYYY")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div style={{ display: "flex", direction: "row" }}>
                          <Button
                            style={{ marginRight: "10px" }}
                            variant="outline"
                            onClick={() => {
                              handleImagem(activity.id);
                            }}
                          >
                            Imagens
                          </Button>
                          <Button
                            style={{ marginRight: "10px" }}
                            variant="outline"
                            onClick={() => {
                              handleEditar(activity.id);
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            onClick={() => handleDelete(activity.id)}
                            variant="outline"
                          >
                            Deletar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
