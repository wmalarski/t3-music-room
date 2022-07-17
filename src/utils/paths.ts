export const paths = {
  room: (id: string): string => `/room/${id}`,
  settings: (id: string): string => `/room/${id}/settings`,
  index: (): string => "/",
  signIn: (): string => "/signIn",
  notFound: (): string => "/notFound",
};
