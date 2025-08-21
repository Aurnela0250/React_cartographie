import { ILevelsRepository } from "@/src/application/repositories/levels.repository.interface";

export type IGetLevelUseCase = ReturnType<typeof getLevelUseCase>;

export const getLevelUseCase =
    (levelRepository: ILevelsRepository) => (token: string, id: number) => {
        // TODO: Check the permission if is valid

        const level = levelRepository.getLevel(token, id);

        return level;
    };
