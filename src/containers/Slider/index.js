import React, { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // Tri des événements par date en ordre décroissant si les données sont disponibles
  const byDateDesc = data?.focus
    ? [...data.focus].sort((evtA, evtB) =>
        new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
      )
    : [];
  
  // Fonction pour passer à la prochaine carte après un délai de 5 secondes
  // Définie à l'extérieur de useEffect pour éviter sa recréation à chaque intervalle
  const nextCard = () => {
    setIndex((prevIndex) =>
      prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0
    );
  };

  // Utilisation de useEffect pour exécuter la fonction nextCard à intervalles réguliers
  useEffect(() => {
    const intervalId = setInterval(nextCard, 5000);
    // Nettoyage de l'intervalle lors du démontage du composant pour éviter les fuites de mémoire
    return () => clearInterval(intervalId);
  }, [byDateDesc.length]); // Ajout de byDateDesc.length dans les dépendances pour suivre les changements

  return (
    <div className="SlideCardList">
      {byDateDesc.map((event, idx) => (
        <div
          key={event.title} // Utilisation de titre unique comme clé
          className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
        >
          <img src={event.cover} alt={event.title} /> {/* Ajout d'un texte alternatif descriptif */}
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((event, radioIdx) => (
            <input
              key={event.title} // Utilisation de titre unique comme clé
              type="radio"
              name="radio-button"
              checked={index === radioIdx} // remplace idx par index
              readOnly // Empêche la modification de l'état via l'interaction utilisateur
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
