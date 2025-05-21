import { EstablishmentDetailsClient } from "./components/EstablishmentDetailsClient";

type FormationsPageProps = {
    params: {
        id: string;
    };
};

export default async function FormationsPage({ params }: FormationsPageProps) {
    const { id } = await params;

    return <EstablishmentDetailsClient establishmentId={id} />;
}
