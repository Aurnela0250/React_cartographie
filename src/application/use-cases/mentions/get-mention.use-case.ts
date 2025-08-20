import { IMentionRepository } from "@/src/application/repositories/mention.repository.interface";
import { Mention } from "@/src/entities/models/mention.entity";

export type IGetMentionUseCase = ReturnType<typeof getMentionUseCase>;

export const getMentionUseCase =
    (mentionRepository: IMentionRepository) =>
    async (token: string, id: number): Promise<Mention> => {
        // TODO: Check the permission if is valid

        const mention = await mentionRepository.getMention(token, id);

        return mention;
    };
