import { IGetLevelUseCase } from "@/src/application/use-cases/levels/get-level.use-case";
import { UnauthenticatedError } from "@/src/entities/errors/auth";
import { Level } from "@/src/entities/models/level.entity";

export type IGetLevelController = ReturnType<typeof getLevelController>;

export const getLevelController =
    (getLevelUseCase: IGetLevelUseCase) =>
    async (token: string, id: number): Promise<Level> => {
        if (!token) {
            throw new UnauthenticatedError("Must be logged in");
        }
        const level = await getLevelUseCase(token, id);

        return level;
    };
