// Importation des hooks et des composants nécessaires depuis React et les bibliothèques tierces.
import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () => new Promise((resolve) => { setTimeout(resolve, 900); }); // Fonction qui simule une API de contact qui résout une promesse après un délai.
const Form = ({ onSuccess, onError }) => { // Définition du composant Form avec les props onSuccess et onError pour gérer les résultats de l'envoi.
  const [sending, setSending] = useState(false); // Utilisation du hook useState pour gérer l'état de l'envoi (sending).
  const sendContact = useCallback( // Utilisation du hook useCallback pour mémoriser la fonction d'envoi du formulaire.
    async (evt) => {
      evt.preventDefault(); // Empêche le comportement par défaut de soumission du formulaire.
      setSending(true); // Commence l'envoi en mettant à jour l'état.
      try {
        await mockContactApi(); // Tente d'appeler l'API de contact simulée.
        setSending(false);
        onSuccess(); // Assurez-vous d'appeler onSuccess ici si nécessaire
      } catch (err) {
        setSending(false);  // Arrête l'envoi en cas de succès.
        onError(err); // Appelle la fonction onError avec l'erreur.
      }
    },
    [onSuccess, onError] // Dépendances du hook useCallback.
  );

  // Rendu du formulaire avec les champs et boutons nécessaires.
  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          {/* Champs de formulaire pour le nom, prénom, type de contact et email avec les attributs id, name et autocomplete. */}
          <Field
            id="nom"
            name="nom"
            placeholder="Votre nom"
            label="Nom"
           autocomplete="family-name" // Ajout de l'attribut autocomplete pour le nom de famille
          />
          <Field
            id="prenom"
            name="prenom"
            placeholder="Votre prénom"
            label="Prénom"
             autocomplete="given-name" // Ajout de l'attribut autocomplete pour le prénom
          />
          <Select
            id="typeContact"
            name="typeContact"
            selection={["Personel", "Entreprise"]}
            onChange={() => null}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
           autocomplete="organization-title" // Ajout de l'attribut autocomplete pour le titre au sein de l'organisation
          />
          <Field
           id="email"
            name="email"
            placeholder="Entre votre email"
            label="Email"
           autocomplete="email" // Ajout de l'attribut autocomplete pour l'email
           />
          {/* Bouton de soumission du formulaire qui est désactivé pendant l'envoi. */}
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending}>
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            id="message"
            name="message"
            placeholder="message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
            autocomplete="message" // Ajout de l'attribut autocomplete pour message
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
};

export default Form;
