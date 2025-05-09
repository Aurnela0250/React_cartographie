import { useState } from "react";

const Etablissements = () => {
    const [data, setData] = useState([]);

    return (
        <div>
            <h1>Liste des établissements</h1>
            <ul>
                {data.length > 0 ? (
                    data.map((item) => (
                        <li key={item.id}>{item.nom}</li> // Assurez-vous que "nom" existe dans votre API
                    ))
                ) : (
                    <p>Aucune donnée disponible</p>
                )}
            </ul>
        </div>
    );
};

export default Etablissements;
