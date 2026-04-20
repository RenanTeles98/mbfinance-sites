export type BlogCategory =
  | "credito"
  | "gestao"
  | "conta-pj"
  | "mercado"
  | "antecipacao"
  | "noticias";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory | string;
  categoryLabel: string;
  excerpt: string;
  image: string;
  content: string;
  readTime: string;
  date: string;
  featured: boolean;
  published: boolean;
  seoTitle?: string;
  seoDesc?: string;
  keywords?: string;
  time?: string;
}
