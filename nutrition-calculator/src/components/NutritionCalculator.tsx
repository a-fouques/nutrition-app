import { useState } from 'react';

const API_KEY = import.meta.env.VITE_API_KEY;

function NutritionCalculator() {
  const [aliment, setAliment] = useState('');
  const [resultats, setResultats] = useState<any[]>([]);
  const [alimentSelectionne, setAlimentSelectionne] = useState<any | null>(null);
  const [source, setSource] = useState<'off' | 'fdc'>('off');



  const searchFood = async () => {
    try {
      const res = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${aliment}&api_key=${API_KEY}`
      );
      const data = await res.json();
      const filtresUtiles = data.foods?.filter(
        (item: any) => item.dataType === 'Foundation' || item.dataType === 'SR Legacy'
      ) || [];
      setResultats(filtresUtiles);
      setAlimentSelectionne(null);
      console.log(data);
    } catch (err) {
      console.error('Erreur API :', err);
    }
  };

  const searchWithOFF = async () => {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${aliment}&json=1`
    );
    const data = await res.json();
    setResultats(data.products || []);
    setAlimentSelectionne(null);
  };

  const lancerRecherche = () => {
    if (source === 'off') {
      searchWithOFF();
    } else {
      searchFood();
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
      <div>
        <label>Source de données : </label>
        <select value={source} onChange={(e) => setSource(e.target.value as 'off' | 'fdc')}>
          <option value="off">Open Food Facts</option>
          <option value="fdc">FoodData Central</option>
        </select>
      </div>
      <button onClick={lancerRecherche}>Tester l’API</button>

      {resultats.length > 0 && (
        <div>
          <h3>Résultats trouvés :</h3>
          <ul>
            {resultats.map((item) => (
              <li key={item.fdcId || item.code || item.id}>
                  {source === 'off' ? item.product_name : item.description}
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
          {alimentSelectionne && (
            <div style={{ marginTop: '1rem' }}>
              <h3>
                Apports pour 100g de{' '}
                {source === 'off' ? alimentSelectionne.product_name : alimentSelectionne.description}
              </h3>

              {source === 'fdc' && (
                <ul>
                  {alimentSelectionne.foodNutrients.map((n: any) => {
                    if (
                      n.nutrientName === 'Energy' ||
                      n.nutrientName === 'Protein' ||
                      n.nutrientName === 'Carbohydrate, by difference' ||
                      n.nutrientName === 'Total lipid (fat)'
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
              )}

              {source === 'off' && (
                <ul>
                  <li>Calories : {alimentSelectionne.nutriments['energy-kcal_100g']} kcal</li>
                  <li>Protéines : {alimentSelectionne.nutriments['proteins_100g']} g</li>
                  <li>Glucides : {alimentSelectionne.nutriments['carbohydrates_100g']} g</li>
                  <li>Lipides : {alimentSelectionne.nutriments['fat_100g']} g</li>
                </ul>
              )}
            </div>
          )}

          </ul>
        </div>
      )}


    </div>
  );
}

export default NutritionCalculator;
