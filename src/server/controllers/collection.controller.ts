import { CollectionItemStatus, CollectionReadConfiguration } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { constants } from '~/server/common/constants';
import { Context } from '~/server/createContext';
import { collectedContentReward } from '~/server/rewards';
import { GetByIdInput, UserPreferencesInput } from '~/server/schema/base.schema';
import {
  AddCollectionItemInput,
  AddSimpleImagePostInput,
  BulkSaveCollectionItemsInput,
  CollectionMetadataSchema,
  FollowCollectionInputSchema,
  GetAllCollectionItemsSchema,
  GetAllCollectionsInfiniteSchema,
  GetAllUserCollectionsInputSchema,
  GetCollectionPermissionDetails,
  GetUserCollectionItemsByItemSchema,
  UpdateCollectionCoverImageInput,
  UpdateCollectionItemsStatusInput,
  UpsertCollectionInput,
} from '~/server/schema/collection.schema';
import { ImageMetaProps } from '~/server/schema/image.schema';
import { imageSelect } from '~/server/selectors/image.selector';
import {
  addContributorToCollection,
  bulkSaveItems,
  deleteCollectionById,
  getAllCollections,
  getCollectionById,
  getCollectionCoverImages,
  getCollectionItemCount,
  getCollectionItemsByCollectionId,
  getContributorCount,
  getUserCollectionItemsByItem,
  getUserCollectionPermissionsById,
  getUserCollectionsWithPermissions,
  removeContributorFromCollection,
  saveItemInCollections,
  updateCollectionCoverImage,
  updateCollectionItemsStatus,
  upsertCollection,
} from '~/server/services/collection.service';
import { addPostImage, createPost } from '~/server/services/post.service';
import {
  throwAuthorizationError,
  throwDbError,
  throwNotFoundError,
} from '~/server/utils/errorHandling';
import { updateEntityMetric } from '~/server/utils/metric-helpers';
import { DEFAULT_PAGE_SIZE } from '~/server/utils/pagination-helpers';
import { isDefined } from '~/utils/type-guards';
import { dbRead } from '../db/client';

export const getAllCollectionsInfiniteHandler = async ({
  input,
  ctx,
}: {
  input: GetAllCollectionsInfiniteSchema;
  ctx: Context;
}) => {
  input.limit = input.limit ?? constants.collectionFilterDefaults.limit;
  const limit = input.limit + 1;

  try {
    const items = await getAllCollections({
      input: { ...input, limit },
      select: {
        id: true,
        name: true,
        read: true,
        type: true,
        userId: true,
        nsfwLevel: true,
        image: { select: imageSelect },
        mode: true,
      },
      user: ctx.user,
    });

    let nextCursor: number | undefined;
    if (items.length > input.limit) {
      const nextItem = items.pop();
      nextCursor = nextItem?.id;
    }

    const { cursor, sort, privacy, types, userId, ids, ...userPreferences } = input;
    const collectionRequiringImages = items.filter((item) => !item.image).map((i) => i.id);
    const collectionImages = await getCollectionCoverImages({
      collectionIds: collectionRequiringImages,
      imagesPerCollection: 10, // Some fallbacks
    });

    // Get Item Counts
    const collectionIds = items.map((item) => item.id);
    const collectionItemCounts = Object.fromEntries(
      (
        await getCollectionItemCount({
          collectionIds,
          status: CollectionItemStatus.ACCEPTED,
        })
      ).map((c) => [c.id, Number(c.count)])
    );

    // Get Contributor Counts
    const contributorCounts = Object.fromEntries(
      (await getContributorCount({ collectionIds })).map((c) => [c.id, Number(c.count)])
    );

    return {
      nextCursor,
      items: items.map((item) => {
        const collectionImageItems = collectionImages.filter((ci) => ci.id === item.id);
        return {
          ...item,
          _count: {
            items: collectionItemCounts[item.id] ?? 0,
            contributors: contributorCounts[item.id] ?? 0,
          },
          image: item.image
            ? {
                ...item.image,
                meta: item.image.meta as ImageMetaProps | null,
                tags: item.image.tags.map((t) => t.tag),
              }
            : null,
          images: collectionImageItems.map((ci) => ci.image).filter(isDefined) ?? [],
          srcs: collectionImageItems.map((ci) => ci.src).filter(isDefined) ?? [],
        };
      }),
    };
  } catch (error) {
    throw throwDbError(error);
  }
};

export const getAllUserCollectionsHandler = async ({
  ctx,
  input,
}: {
  ctx: DeepNonNullable<Context>;
  input: GetAllUserCollectionsInputSchema;
}) => {
  const { user } = ctx;

  try {
    const collections = await getUserCollectionsWithPermissions({
      input: {
        ...input,
        userId: user.id,
      },
    });

    return collections;
  } catch (error) {
    throw throwDbError(error);
  }
};

export const getCollectionByIdHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: GetByIdInput;
}) => {
  const { user } = ctx;

  try {
    const permissions = await getUserCollectionPermissionsById({
      ...input,
      userId: user?.id,
      isModerator: user?.isModerator,
    });

    // If the user has 0 permission over this collection, they have no business asking for it.
    if (!permissions.read && !permissions.write && !permissions.manage) {
      return {
        collection: null,
        permissions,
      };
    }

    const collection = await getCollectionById({ input });

    return { collection, permissions };
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw throwDbError(error);
  }
};

export const saveItemHandler = async ({
  ctx,
  input,
}: {
  ctx: DeepNonNullable<Context>;
  input: AddCollectionItemInput;
}) => {
  const { user } = ctx;
  try {
    const status = await saveItemInCollections({
      input: { ...input, userId: user.id, isModerator: user.isModerator },
    });

    if (status === 'added' && input.type) {
      const entityId = [input.articleId, input.modelId, input.postId, input.imageId].find(
        isDefined
      );

      if (entityId) {
        await collectedContentReward.apply(
          {
            collectorId: user.id,
            entityType: input.type,
            entityId,
          },
          ctx.ip
        );
      }
    }

    // nb: this will count in review / rejected additions
    if (input.type === 'Image' && !!input.imageId) {
      await updateEntityMetric({
        ctx,
        entityType: 'Image',
        entityId: input.imageId,
        metricType: 'Collection',
        amount: status === 'added' ? 1 : -1,
      });
    }
  } catch (error) {
    throw throwDbError(error);
  }
};

export const bulkSaveItemsHandler = async ({
  ctx,
  input,
}: {
  ctx: DeepNonNullable<Context>;
  input: BulkSaveCollectionItemsInput;
}) => {
  const { id: userId, isModerator } = ctx.user;
  try {
    const permissions = await getUserCollectionPermissionsById({
      id: input.collectionId,
      userId,
      isModerator,
    });

    const resp = await bulkSaveItems({ input: { ...input, userId }, permissions });

    for (const imgId of resp.imageIds) {
      await updateEntityMetric({
        ctx,
        entityType: 'Image',
        entityId: imgId,
        metricType: 'Collection',
        amount: 1,
      });
    }

    return { count: resp.count };
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw throwDbError(error);
  }
};

export const upsertCollectionHandler = async ({
  input,
  ctx,
}: {
  input: UpsertCollectionInput;
  ctx: DeepNonNullable<Context>;
}) => {
  const { user } = ctx;

  try {
    const collection = await upsertCollection({
      input: { ...input, userId: user.id, isModerator: user.isModerator },
    });

    return collection;
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw throwDbError(error);
  }
};

export const updateCollectionCoverImageHandler = async ({
  input,
  ctx,
}: {
  input: UpdateCollectionCoverImageInput;
  ctx: DeepNonNullable<Context>;
}) => {
  const { user } = ctx;

  try {
    const collection = await updateCollectionCoverImage({
      input: { ...input, userId: user.id, isModerator: user.isModerator },
    });

    return collection;
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw throwDbError(error);
  }
};

export const getUserCollectionItemsByItemHandler = async ({
  input,
  ctx,
}: {
  input: GetUserCollectionItemsByItemSchema;
  ctx: DeepNonNullable<Context>;
}) => {
  const { user } = ctx;

  try {
    const collectionItems = await getUserCollectionItemsByItem({
      input: { ...input, userId: user.id, isModerator: user.isModerator },
    });
    return collectionItems;
  } catch (error) {
    throw throwDbError(error);
  }
};

export const deleteUserCollectionHandler = async ({
  input,
  ctx,
}: {
  input: GetByIdInput;
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    const { user } = ctx;
    await deleteCollectionById({ id: input.id, userId: user.id, isModerator: user.isModerator });
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    else throw throwDbError(error);
  }
};

export const followHandler = ({
  ctx,
  input,
}: {
  ctx: DeepNonNullable<Context>;
  input: FollowCollectionInputSchema;
}) => {
  const { user } = ctx;
  const { collectionId } = input;

  try {
    return addContributorToCollection({
      targetUserId: input.userId || user?.id,
      userId: user?.id,
      collectionId,
    });
  } catch (error) {
    throw throwDbError(error);
  }
};

export const unfollowHandler = ({
  ctx,
  input,
}: {
  ctx: DeepNonNullable<Context>;
  input: FollowCollectionInputSchema;
}) => {
  const { user } = ctx;
  const { collectionId } = input;

  try {
    return removeContributorFromCollection({
      targetUserId: input.userId || user?.id,
      userId: user?.id,
      collectionId,
    });
  } catch (error) {
    throw throwDbError(error);
  }
};

export const collectionItemsInfiniteHandler = async ({
  input,
  ctx,
}: {
  input: GetAllCollectionItemsSchema & UserPreferencesInput;
  ctx: Context;
}) => {
  input.limit = input.limit ?? DEFAULT_PAGE_SIZE;
  // Safeguard against missing items that might be in collection but return null.
  // due to preferences and/or other statuses.
  const limit = 2 * input.limit;
  let collectionItems = await getCollectionItemsByCollectionId({
    input: { ...input, limit },
    user: ctx.user,
  });

  let nextCursor: number | undefined;

  if (collectionItems.length > input.limit) {
    const nextItem = collectionItems[input.limit + 1];
    nextCursor = nextItem?.id;
    collectionItems = collectionItems.slice(0, input.limit);
  }

  return {
    nextCursor,
    collectionItems,
  };
};

export const updateCollectionItemsStatusHandler = async ({
  input,
  ctx,
}: {
  input: UpdateCollectionItemsStatusInput;
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    return updateCollectionItemsStatus({
      input,
      userId: ctx.user.id,
      isModerator: ctx.user.isModerator,
    });
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    throw throwDbError(error);
  }
};

export const addSimpleImagePostHandler = async ({
  input: { collectionId, images },
  ctx,
}: {
  input: AddSimpleImagePostInput;
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    const { id: userId, isModerator } = ctx.user;
    const collection = await getCollectionById({ input: { id: collectionId } });
    if (!collection) throw throwNotFoundError(`No collection with id ${collectionId}`);

    const permissions = await getUserCollectionPermissionsById({
      id: collection.id,
      userId,
      isModerator,
    });
    if (!(permissions.write || permissions.writeReview))
      throw throwAuthorizationError('You do not have permission to add items to this collection.');

    // create post
    const post = await createPost({
      title: `${collection.name} Images`,
      userId,
      collectionId: collection.id,
      publishedAt: collection.read === CollectionReadConfiguration.Public ? new Date() : undefined,
    });
    const postImages = await Promise.all(
      images.map((image, index) =>
        addPostImage({
          ...image,
          postId: post.id,
          index,
          user: ctx.user,
        })
      )
    );
    const imageIds = postImages.map((image) => image.id);
    await bulkSaveItems({ input: { collectionId, imageIds, userId }, permissions });

    return {
      post,
      permissions,
    };
  } catch (error) {
    if (error instanceof TRPCError) throw error;
    else throw throwDbError(error);
  }
};

export const getPermissionDetailsHandler = async ({
  input: { ids },
  ctx,
}: {
  input: GetCollectionPermissionDetails;
  ctx: DeepNonNullable<Context>;
}) => {
  if (ids.length === 0) return [];

  const collections = await dbRead.collection.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      name: true,
      metadata: true,
      mode: true,
      tags: {
        select: {
          tag: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  // Get permissions for each of these
  const permissions = await Promise.all(
    collections.map((c) =>
      getUserCollectionPermissionsById({
        id: c.id,
        userId: ctx.user.id,
        isModerator: ctx.user.isModerator,
      })
    )
  );

  return collections.map((c) => ({
    ...c,
    tags: c.tags.map((t) => t.tag),
    metadata: (c.metadata ?? {}) as CollectionMetadataSchema,
    permissions: permissions.find((p) => p.collectionId === c.id),
  }));
};
