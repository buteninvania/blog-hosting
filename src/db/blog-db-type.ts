export interface BlogDbType {
  createdAt: string;
  description: string;
  id: string;
  isMembership: boolean;
  name: string;
  websiteUrl: string;
}

type BlogDbTypeKeys = keyof BlogDbType;
export const blogDbKeys: BlogDbTypeKeys[] = ["id", "name", "description", "websiteUrl", "createdAt", "isMembership"];
