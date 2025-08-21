import { getMentionUseCase } from "@/src/application/use-cases/mentions/get-mention.use-case";
import { getMentionController } from "@/src/controllers/mentions/get-mention.controller";
import { MentionsRepository } from "@/src/infrastructure/repositories/mentions.repository";
import { createModule } from "@evyweb/ioctopus";

import { DI_SYMBOLS } from "../types";

export const createMentionsModule = () => {
    const mentionsModule = createModule();

    //* Repositories
    mentionsModule
        .bind(DI_SYMBOLS.IMentionsRepository)
        .toClass(MentionsRepository);

    //* Use Cases
    mentionsModule
        .bind(DI_SYMBOLS.IGetMentionUseCase)
        .toHigherOrderFunction(getMentionUseCase, [
            DI_SYMBOLS.IMentionsRepository,
        ]);

    //* Controllers
    mentionsModule
        .bind(DI_SYMBOLS.IGetMentionController)
        .toHigherOrderFunction(getMentionController, [
            DI_SYMBOLS.IGetMentionUseCase,
        ]);

    return mentionsModule;
};
