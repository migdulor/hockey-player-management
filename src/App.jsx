import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import Asistencias from './Asistencias';
import ReportesAsistencias from './ReportesAsistencias';
import FormacionesPartidos from './FormacionesPartidos';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxIW7BOmLmPrjUsokhsI4p4mi1wdg9JPpPFs8KTUmBhbgetp_RfaLew8RFB6V3BajrpmQ/exec';

const App = () => {
  const [currentPage, setCurrentPage] = useState('asistencias');
  const [jugadoras, setJugadoras] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    cargarJugadoras();
  }, []);

  const cargarJugadoras = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${SCRIPT_URL}?action=read`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const jugadorasExtraidas = result.data.slice(1).map((fila, index) => ({
            id: index + 1,
            idJugadora: fila[0]?.toString() || '',
            nombre: fila[1] || '',
            nombreCorto: fila[2] || '',
            division: fila[3] || ''
          })).filter(jugadora => jugadora.nombre);
          setJugadoras(jugadorasExtraidas);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h1 className="text-2xl font-bold">TLTC Hockey 2025</h1>
                <p className="text-blue-200 text-sm">Sistema de Gestión - 7ma y 6ta División</p>
              </div>
            </div>
          </div>
          
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-2">
            <button onClick={() => setCurrentPage('asistencias')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors min-w-max ${
                currentPage === 'asistencias' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
              }`}>
              Asistencias
            </button>
            <button onClick={() => setCurrentPage('reportes')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors min-w-max ${
                currentPage === 'reportes' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
              }`}>
              Reportes
            </button>
            <button onClick={() => setCurrentPage('formaciones')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors min-w-max ${
                currentPage === 'formaciones' 
                  ? 'bg-blue-700 text-white' 
                  : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
              }`}>
              Formaciones
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentPage === 'asistencias' && <Asistencias jugadoras={jugadoras} />}
        {currentPage === 'reportes' && <ReportesAsistencias jugadoras={jugadoras} />}
        {currentPage === 'formaciones' && <FormacionesPartidos jugadoras={jugadoras} />}
      </main>
    </div>
  );
};

export default App;