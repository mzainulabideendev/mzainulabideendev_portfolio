export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
}

export interface GithubPushEvent {
  type: string;
  created_at: string;
  payload?: {
    commits?: Array<unknown>;
  };
}

export interface CommitDayPoint {
  date: string;
  count: number;
}
