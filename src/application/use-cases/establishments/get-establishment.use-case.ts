import { IEstablishmentRepository } from "@/src/application/repositories/establishment.repository.interface";

export type IGetEstablishmentUseCase = ReturnType<
    typeof getEstablishmentUseCase
>;

export const getEstablishmentUseCase =
    (establishmentRepository: IEstablishmentRepository) =>
    (token: string, id: number) => {
        // TODO: Check the permission if is valid

        const establishment = establishmentRepository.getEstablishment(
            token,
            id
        );

        return establishment;
    };
