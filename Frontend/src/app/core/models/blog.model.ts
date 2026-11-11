export interface Blog {
  id: number;
  title: string;
  coverImageUrl: string | null;
  url: string;
  tag: string;
}

export interface DevToArticleResponse {
  id: number;
  title: string;
  cover_image: string | null;
  url: string;
  tag_list: string[];
}
