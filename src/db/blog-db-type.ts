export type BlogDbType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string,
    isMembership: boolean
}

type BlogDbTypeKeys = keyof BlogDbType;
export const blogDbKeys: BlogDbTypeKeys[] = ['id', 'name', 'description', 'websiteUrl', 'createdAt', 'isMembership'];
