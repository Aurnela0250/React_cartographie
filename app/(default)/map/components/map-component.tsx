"use client";

import { useState } from "react";

type NominatimGeocoderProps = {
    onCoordinates: (coords: { lat: number; lng: number }) => void;
};

const NominatimGeocoder = ({ onCoordinates }: NominatimGeocoderProps) => {
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const geocodeAddress = async () => {
        setLoading(true);
        setError(null);
        try {
            const encodedAddress = encodeURIComponent(address);
            // Requête à l'API publique Nominatim
            const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&addressdetails=1&limit=1`;
            const response = await fetch(url);
            const results = await response.json();

            if (results && results.length > 0) {
                const { lat, lon } = results[0].geometry ?? results[0];

                // On passe les coordonnées vers le parent
                onCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
            } else {
                setError("Aucun résultat trouvé pour cette adresse.");
            }
        } catch (err) {
            setError("Erreur lors du géocodage.");
            console.error("Geocoding error:", err);
        }
        setLoading(false);
    };

    return (
        <div>
            <h2>Géocodage avec Nominatim</h2>
            <input
                placeholder="Entrez une adresse"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            <button disabled={loading} onClick={geocodeAddress}>
                {loading ? "Recherche..." : "Géocoder"}
            </button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default NominatimGeocoder;
