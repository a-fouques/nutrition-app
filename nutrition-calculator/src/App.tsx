import './App.css';
import NutritionCalculator from './components/NutritionCalculator';

function App() {
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>Calculateur Nutritionnel</h1>
      <NutritionCalculator />
    </div>
  );
}

export default App;