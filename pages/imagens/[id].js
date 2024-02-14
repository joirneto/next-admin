import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Logout from "@/components/Logout";
import LoadingSpinner from "@/components/Loading";
import ButtonHome from "@/components/ButtonHome";

export default function Imagens() {
  const router = useRouter();
  const { id } = router.query;
  const [activity, setActivity] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef();

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
        setActivity(res.data);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        handleLogout();
      });
  }, [refresh]);

  const handleDelete = (idImagem) => {
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("orlaclub_user"));
    axios
      .delete(
        `https://api-orlaclub.vercel.app/api/admin/activities/pictures/${idImagem}/remove`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setRefresh((old) => !old);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        handleLogout();
      });
  };
  const handleLogout = () => {
    localStorage.removeItem("orlaclub_user");
    router.push("/");
  };

  const handleNovaImagem = async () => {
    setLoading(true);
    const file = inputRef.current.files[0];

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const token = JSON.parse(localStorage.getItem("orlaclub_user"));
        await axios.post(
          `https://api-orlaclub.vercel.app/api/admin/activities/pictures/${id}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRefresh((old) => !old);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao enviar arquivo:", error);
        handleLogout();
      }
    } else {
      console.log("Nenhum arquivo selecionado.");
    }
  };

  return (
    <>
    <ButtonHome/>
      <Logout />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Card className="max-w-md mx-auto my-20">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">
              Imagens:{" "}
              {activity.activity ? activity.activity : "Atividade Principal"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="image">Upload Image</Label>
              <Input id="image" type="file" ref={inputRef} />
              <Button onClick={handleNovaImagem} className="ml-auto">
                Add Imagem
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {activity.pictures &&
                activity.pictures.map((image, index) => (
                  <div
                    key={index}
                    className="relative group overflow-hidden rounded-lg"
                  >
                    <img
                      alt={image.id}
                      className="object-cover w-full h-60"
                      height={300}
                      src={image.url}
                      style={{
                        aspectRatio: "400/300",
                        objectFit: "cover",
                      }}
                      width={400}
                    />
                    <Button
                      onClick={() => handleDelete(image.id)}
                      style={{
                        backgroundColor: "red",
                        position: "absolute",
                        top: 0,
                        right: 0,
                      }}
                    >
                      Deletar
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
