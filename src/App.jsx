import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import Asistencias from './Asistencias';
import ReportesAsistencias from './ReportesAsistencias';
import FormacionesPartidos from './FormacionesPartidos';

// Actualiza la URL del script con la última versión desplegada
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxG6YJ03xM1VGlQCzmEGz3wkWgnjw9Sy4cKLCA91QPckIxsBbdS9eBh7PUxO6C-vOehug/exec';

const App = () => {
  const [currentPage, setCurrentPage] = useState('asistencias');
  const [jugadoras, setJugadoras] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarJugadoras();
  }, []);

  const cargarJugadoras = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Iniciando carga de jugadoras...');

      const response = await fetch(`${SCRIPT_URL}?action=read`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const responseText = await response.text();
      console.log('Respuesta cruda:', responseText);

      if (!responseText || responseText.trim() === '') {
        throw new Error('Respuesta vacía del servidor');
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Error al parsear respuesta: ${responseText}`);
      }

      if (!result.success) {
        throw new Error(result.error || 'Error desconocido en la respuesta');
      }

      if (!result.data || !Array.isArray(result.data)) {
        throw new Error('Formato de datos inválido');
      }

      const jugadorasExtraidas = result.data
        .slice(1)
        .map((fila, index) => ({
          id: index + 1,
          idJugadora: fila[0]?.toString() || '',
          nombre: fila[1] || '',
          nombreCorto: fila[2] || '',
          division: fila[3] || ''
        }))
        .filter(jugadora => jugadora.nombre && jugadora.idJugadora);

      console.log(`${jugadorasExtraidas.length} jugadoras cargadas`);
      setJugadoras(jugadorasExtraidas);

    } catch (error) {
      console.error('Error detallado:', error);
      setError(error.message);
      setJugadoras([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar estado de carga o error
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando jugadoras...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-xl mb-4">❌ Error al cargar datos</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={cargarJugadoras}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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