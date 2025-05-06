import { useState } from 'react';

const API_KEY = import.meta.env.VITE_API_KEY;

function NutritionCalculator() {
  const [aliment, setAliment] = useState('');
  const [resultats, setResultats] = useState<any[]>([]);
  const [alimentSelectionne, setAlimentSelectionne] = useState<any | null>(null);


  const searchFood = async () => {
    try {
      const res = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${aliment}&api_key=${API_KEY}`
      );
      const data = await res.json();
      setResultats(data.foods || []);
      setAlimentSelectionne(null);
      console.log(data);
    } catch (err) {
      console.error('Erreur API :', err);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Nom de l’aliment"
        value={aliment}
        onChange={(e) => setAliment(e.target.value)}
      />
      <button onClick={searchFood}>Tester l’API</button>

      {resultats.length > 0 && (
        <div>
          <h3>Résultats trouvés :</h3>
          <ul>
            {resultats.map((item) => (
              <li key={item.fdcId}>
                {item.description}
                <button onClick={() => setAlimentSelectionne(item)}>Sélectionner</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {alimentSelectionne && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Apports pour 100g de {alimentSelectionne.description} :</h3>
          <ul>
            {alimentSelectionne.foodNutrients.map((n: any) => {
              if (
                n.nutrientName === 'Calories' ||
                n.nutrientName === 'Protéines' ||
                n.nutrientName === 'Glucides, by difference' ||
                n.nutrientName === 'Total lipides (gras)'
              ) {
                return (
                  <li key={n.nutrientId}>
                    {n.nutrientName}: {n.value} {n.unitName}
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>
      )}


    </div>
  );
}

export default NutritionCalculator;
