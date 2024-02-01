import { getTRPCErrorFromUnknown } from '@trpc/server';
import {
  CreateBuzzWithdrawalRequestSchema,
  GetPaginatedBuzzWithdrawalRequestForModerationSchema,
  GetPaginatedBuzzWithdrawalRequestSchema,
} from '../schema/buzz-withdrawal-request.schema';
import { Context } from '../createContext';
import {
  cancelBuzzWithdrawalRequest,
  createBuzzWithdrawalRequest,
  getPaginatedBuzzWithdrawalRequests,
  getPaginatedOwnedBuzzWithdrawalRequests,
} from '../services/buzz-withdrawal-request.service';
import { throwDbError } from '../utils/errorHandling';
import { GetByIdInput, GetByIdStringInput } from '~/server/schema/base.schema';

export function createBuzzWithdrawalRequestHandler({
  input,
  ctx,
}: {
  input: CreateBuzzWithdrawalRequestSchema;
  ctx: DeepNonNullable<Context>;
}) {
  try {
    return createBuzzWithdrawalRequest({ userId: ctx.user.id, ...input });
  } catch (error) {
    throw getTRPCErrorFromUnknown(error);
  }
}

export const getPaginatedOwnedBuzzWithdrawalRequestsHandler = async ({
  input,
  ctx,
}: {
  input: GetPaginatedBuzzWithdrawalRequestSchema;
  ctx: DeepNonNullable<Context>;
}) => {
  const { user } = ctx;
  try {
    return getPaginatedOwnedBuzzWithdrawalRequests({ ...input, userId: user.id });
  } catch (error) {
    throw throwDbError(error);
  }
};

export const getPaginatedBuzzWithdrawalRequestsHandler = async ({
  input,
  ctx,
}: {
  input: GetPaginatedBuzzWithdrawalRequestForModerationSchema;
  ctx: DeepNonNullable<Context>;
}) => {
  try {
    return getPaginatedBuzzWithdrawalRequests({ ...input });
  } catch (error) {
    throw throwDbError(error);
  }
};

export function cancelBuzzWithdrawalRequestHandler({
  input,
  ctx,
}: {
  input: GetByIdStringInput;
  ctx: DeepNonNullable<Context>;
}) {
  try {
    return cancelBuzzWithdrawalRequest({ userId: ctx.user.id, ...input });
  } catch (error) {
    throw getTRPCErrorFromUnknown(error);
  }
}
