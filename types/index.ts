export type Article = {
  title: string;
  published: boolean;
  body_markdown: string;
  tags: string[];
  series?: string;
  canonical_url?: string;
};

export type Post = {
  type_of: string;
  id: number;
  title: string;
  description: string;
  cover_image: string;
  published: true;
  published_at: string;
  tag_list: string[];
  slug: string;
  path: string;
  url: string;
  canonical_url: string;
  comments_count: number;
  positive_reactions_count: number;
  page_views_count: number;
  published_timestamp: string;
  body_markdown: string;
  user: {
    name: string;
    username: string;
    twitter_username: string;
    github_username: string;
    website_url: string;
    profile_image: string;
    profile_image_90: string;
  };
  organization: {
    name: string;
    username: string;
    slug: string;
    profile_image: string;
    profile_image_90: string;
  };
  flare_tag: {
    name: string;
    bg_color_hex: string;
    text_color_hex: string;
  };
};
