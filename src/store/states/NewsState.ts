export interface NewsItem {
  id: string;
  banner: { url: string };
  title: string;
  content: string;
  author: string | null;
  published: boolean;
  created_at: string;
}
