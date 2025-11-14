import type { Prisma } from "@/src/generated";

export const commentInclude = {
  user: {
    select: {
      id: true,
      namaLengkap: true,
      role: true,
    },
  },
} satisfies Prisma.CommentInclude;

export type CommentWithUser = Prisma.CommentGetPayload<{ include: typeof commentInclude }>;

export function serializeComment(comment: CommentWithUser) {
  return {
    id: comment.id,
    articleId: comment.articleId,
    userId: comment.userId,
    content: comment.content,
    createdAt: comment.createdAt,
    user: comment.user
      ? {
          id: comment.user.id,
          namaLengkap: comment.user.namaLengkap,
          role: comment.user.role,
        }
      : null,
  };
}

