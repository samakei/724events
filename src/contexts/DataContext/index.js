// Importation des hooks et des composants nécessaires depuis React et les bibliothèques tierces.
import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Création d'un contexte de données vide qui sera utilisé pour passer les données à travers l'arbre des composants
const DataContext = createContext({});
// Définition d'une API pour charger des données, ici depuis un fichier JSON local.
export const api = {
  loadData: async () => {
    const json = await fetch("/events.json"); // Utilisation de fetch pour charger les données.
    return json.json();  // Conversion de la réponse en JSON.
  },
};
// Composant fournisseur qui gère le chargement des données et les erreurs.
export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null); // État pour gérer les erreurs.
  const [data, setData] = useState(null); // État pour stocker les données chargées.
  const getData = useCallback(async () => { // Fonction pour charger les données en utilisant useCallback pour éviter des re-créations inutiles.
    try {
      setData(await api.loadData());  // Tentative de chargement des données et mise à jour de l'état.
    } catch (err) {
      setError(err); // En cas d'erreur, mise à jour de l'état d'erreur.
    }
  }, []);  // Tableau de dépendances vide signifie que cette fonction ne sera créée qu'une fois.

  // Utilisation de useEffect pour charger les données au montage du composant.
  useEffect(() => {
    if (data) return; // Si les données sont déjà chargées, ne rien faire.
    getData();  // Appel de la fonction de chargement des données.
  });
  // Fourniture des données, des erreurs et du dernier événement à travers le contexte.
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
       last: data && data.events ? data.events[data.events.length - 1] : null,
      }}
    >
      {children} 
    </DataContext.Provider>
  );
};
// Validation des types des props pour DataProvider.
DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext); // Hook personnalisé pour accéder au contexte de données.

export default DataContext; // Exportation par défaut du DataContext pour être utilisé avec le hook useContext.
