import { IGetMentionUseCase } from "@/src/application/use-cases/mentions/get-mention.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { Mention } from "@/src/entities/models/mention.entity";

export type IGetMentionController = ReturnType<typeof getMentionController>;

export const getMentionController =
    (getMentionUseCase: IGetMentionUseCase) =>
    async (token: string, id: number): Promise<Mention> => {
        if (!token) {
            throw new UnauthenticatedError("Must be logged in");
        }
        const mention = await getMentionUseCase(token, id);

        return mention;
    };
