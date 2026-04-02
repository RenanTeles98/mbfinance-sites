import type { Metadata } from "next";
import BlogAdminApp from "@/components/admin/BlogAdminApp";

export const metadata: Metadata = {
  title: "Admin do Blog | MB Finance",
  description: "Painel oficial para editar e publicar os conteudos do blog.",
};

export default function AdminPage() {
  return <BlogAdminApp />;
}
