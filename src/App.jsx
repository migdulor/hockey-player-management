import React, { useState, useEffect } from 'react';
import { Calendar, Users, Save, Download, Upload, Settings, CheckCircle, RefreshCw } from 'lucide-react';

const FormularioAsistencias = () => {
  // Configuración de Google Sheets
  const SPREADSHEET_ID = '1pcyu6ME8JNOdUfGDa39fkSPoAHmWdvP3NwpN_uLqrW0';
  const [apiKey, setApiKey] = useState(localStorage.getItem('google_api_key') || 'AIzaSyAABwBjJrnHC9jgBv1CF88CuClU4sWhVvU');
  const [isConfigured, setIsConfigured] = useState(true);
  const [showConfig, setShowConfig] = useState(false);

  // Estados principales
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [tipoActividad, setTipoActividad] = useState('entrenamiento');
  const [divisionFiltro, setDivisionFiltro] = useState('todas');
  const [asistencias, setAsistencias] = useState({});
  const [observaciones, setObservaciones] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  
  // Datos de la planilla
  const [jugadoras, setJugadoras] = useState([]);
  const [datosHoja, setDatosHoja] = useState([]);
  const [columnaFecha, setColumnaFecha] = useState(null);

  useEffect(() => {
    cargarDatosManual(); // Cargar datos al iniciar
    if (apiKey) {
      cargarDatosHoja();
    }
  }, [apiKey]);

  // Cargar datos reales directamente
  const cargarDatosManual = () => {
    const jugadorasReales = [
      // 7ma División
      { id: 1, idJugadora: "1", nombre: "Abdo Martina", division: "7ma" },
      { id: 2, idJugadora: "2", nombre: "Alzueta Esteban Zoe", division: "7ma" },
      { id: 3, idJugadora: "3", nombre: "Ayala Sofia", division: "7ma" },
      { id: 4, idJugadora: "4", nombre: "Buriek Ernestina", division: "7ma" },
      { id: 5, idJugadora: "5", nombre: "Buriek Sol", division: "7ma" },
      { id: 6, idJugadora: "6", nombre: "Cuadrado Justina", division: "7ma" },
      { id: 7, idJugadora: "7", nombre: "Fernandez Luz María", division: "7ma" },
      { id: 8, idJugadora: "8", nombre: "Fernández correa Morena", division: "7ma" },
      { id: 9, idJugadora: "9", nombre: "Kravtzov Mosqueira Luz", division: "7ma" },
      { id: 10, idJugadora: "10", nombre: "Oliver Ledesma Guillermina", division: "7ma" },
      { id: 11, idJugadora: "11", nombre: "Oviedo Tobchi Agustina", division: "7ma" },
      { id: 12, idJugadora: "12", nombre: "Pando Victoria", division: "7ma" },
      { id: 13, idJugadora: "13", nombre: "Rodríguez ledesma Rosario", division: "7ma" },
      { id: 14, idJugadora: "14", nombre: "Roqué Malena", division: "7ma" },
      { id: 15, idJugadora: "15", nombre: "Sagra Catalina", division: "7ma" },
      { id: 16, idJugadora: "16", nombre: "Tapie Leonor", division: "7ma" },
      { id: 17, idJugadora: "17", nombre: "Villacorta Ana Sofia", division: "7ma" },
      { id: 18, idJugadora: "18", nombre: "Zayun Trinidad", division: "7ma" },
      
      // 6ta División  
      { id: 19, idJugadora: "19", nombre: "Alzueta Esteban Lara", division: "6ta" },
      { id: 20, idJugadora: "20", nombre: "Benci Lourdes", division: "6ta" },
      { id: 21, idJugadora: "21", nombre: "Benito Ángela", division: "6ta" },
      { id: 22, idJugadora: "22", nombre: "Cano Ledesma Amparo", division: "6ta" },
      { id: 23, idJugadora: "23", nombre: "Cano Ledesma Pilar", division: "6ta" },
      { id: 24, idJugadora: "24", nombre: "Corbalán Costilla Anita", division: "6ta" },
      { id: 25, idJugadora: "25", nombre: "Coria Vignolo Maria Candelaria", division: "6ta" },
      { id: 26, idJugadora: "26", nombre: "D'Andrea Candelaria", division: "6ta" },
      { id: 27, idJugadora: "27", nombre: "Fanjul Staffolani Guadalupe", division: "6ta" },
      { id: 28, idJugadora: "28", nombre: "Fuentes Solana", division: "6ta" },
      { id: 29, idJugadora: "29", nombre: "González Terraf Rocío", division: "6ta" },
      { id: 30, idJugadora: "30", nombre: "López Islas Valentina", division: "6ta" },
      { id: 31, idJugadora: "31", nombre: "Méndez waisman Mora", division: "6ta" },
      { id: 32, idJugadora: "32", nombre: "Morano Posse Sofia Candelaria", division: "6ta" },
      { id: 33, idJugadora: "33", nombre: "Pando Lucia", division: "6ta" },
      { id: 34, idJugadora: "34", nombre: "Rodríguez Ledesma Agustina Maria", division: "6ta" },
      { id: 35, idJugadora: "35", nombre: "Romano Olivia María", division: "6ta" },
      { id: 36, idJugadora: "36", nombre: "Sánchez Noli Federica", division: "6ta" },
      { id: 37, idJugadora: "37", nombre: "Torres Ana Paula", division: "6ta" }
    ];
    
    setJugadoras(jugadorasReales);
    setMensaje('✅ Aplicación lista - 37 jugadoras cargadas (18 de 7ma + 18 de 6ta)');
    setIsLoading(false);
  };

  // Cargar datos desde Google Sheets
  const cargarDatosHoja = async () => {
    if (!apiKey) return;

    try {
      setIsLoading(true);
      setMensaje('🔍 Conectando con Google Sheets...');
      
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Asistencias!A:Z?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors'
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.values && data.values.length > 0) {
          setDatosHoja(data.values);
          
          const jugadorasExtraidas = data.values.slice(1).map((fila, index) => ({
            id: index + 1,
            idJugadora: fila[0] || '',
            nombre: fila[1] || '',
            division: fila[2] || ''
          })).filter(jugadora => jugadora.nombre);
          
          setJugadoras(jugadorasExtraidas);
          
          const encabezados = data.values[0];
          const indiceFecha = encabezados.findIndex(header => header === fechaSeleccionada);
          setColumnaFecha(indiceFecha);
          
          setMensaje('✅ Conectado con Google Sheets - Datos sincronizados');
        } else {
          cargarDatosManual();
        }
      } else {
        console.log('Error al acceder a Google Sheets, usando datos locales');
        cargarDatosManual();
      }
    } catch (error) {
      console.error('Error:', error);
      cargarDatosManual();
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar jugadoras según división
  const jugadorasFiltradas = jugadoras.filter(jugadora => 
    divisionFiltro === 'todas' || jugadora.division === divisionFiltro
  );

  // Configurar API Key
  const guardarApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('google_api_key', apiKey);
      setIsConfigured(true);
      setShowConfig(false);
      cargarDatosHoja();
      setMensaje('✅ API Key configurada correctamente');
    }
  };

  // Manejar cambio de asistencia
  const handleAsistenciaChange = (jugadoraId, estado) => {
    setAsistencias(prev => ({
      ...prev,
      [jugadoraId]: estado
    }));
  };

  // Marcar todas como presentes/ausentes
  const marcarTodas = (estado) => {
    const nuevasAsistencias = {};
    jugadorasFiltradas.forEach(jugadora => {
      nuevasAsistencias[jugadora.id] = estado;
    });
    setAsistencias(prev => ({ ...prev, ...nuevasAsistencias }));
  };

  // Determinar la letra de la columna
  const getColumnLetter = (index) => {
    let result = '';
    while (index >= 0) {
      result = String.fromCharCode(65 + (index % 26)) + result;
      index = Math.floor(index / 26) - 1;
    }
    return result;
  };

  // Guardar en Google Sheets
  const guardarEnGoogleSheets = async () => {
    if (!apiKey) {
      alert('Configura primero tu API Key de Google');
      return false;
    }

    try {
      setIsLoading(true);
      
      let columnaParaFecha = columnaFecha;
      
      if (columnaParaFecha === -1 || columnaParaFecha === null) {
        const nuevaColumna = datosHoja[0] ? datosHoja[0].length : 3;
        columnaParaFecha = nuevaColumna;
        
        const letraColumna = getColumnLetter(nuevaColumna);
        const rangeHeader = `Asistencias!${letraColumna}1`;
        
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${rangeHeader}?valueInputOption=RAW&key=${apiKey}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              values: [[fechaSeleccionada]]
            })
          }
        );
      }
      
      const updates = [];
      
      jugadoras.forEach((jugadora, index) => {
        const estado = asistencias[jugadora.id];
        if (estado) {
          const fila = index + 2;
          const letraColumna = getColumnLetter(columnaParaFecha);
          const range = `Asistencias!${letraColumna}${fila}`;
          
          let valorAsistencia = '';
          switch (estado) {
            case 'presente': valorAsistencia = 'P'; break;
            case 'ausente': valorAsistencia = 'A'; break;
            case 'tardanza': valorAsistencia = 'T'; break;
            default: valorAsistencia = ''; break;
          }
          
          updates.push({
            range: range,
            values: [[valorAsistencia]]
          });
        }
      });
      
      if (updates.length > 0) {
        const batchUpdateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchUpdate?key=${apiKey}`;
        
        const response = await fetch(batchUpdateUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            valueInputOption: 'RAW',
            data: updates
          })
        });
        
        if (response.ok) {
          setMensaje('✅ Asistencias guardadas exitosamente en Google Sheets');
          setAsistencias({});
          setObservaciones('');
          setTimeout(() => cargarDatosHoja(), 1000);
          return true;
        } else {
          setMensaje('❌ Error al guardar en Google Sheets');
          return false;
        }
      } else {
        setMensaje('⚠️ No hay asistencias marcadas para guardar');
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('❌ Error de conexión con Google Sheets');
      return false;
    } finally {
      setIsLoading(false);
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  // Exportar CSV
  const exportarCSV = () => {
    if (jugadoras.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    let csvContent = 'IDJugadora,Nombre,División,Fecha,Estado\n';
    
    jugadoras.forEach(jugadora => {
      const estado = asistencias[jugadora.id];
      if (estado && estado !== 'no-marcado') {
        csvContent += `${jugadora.idJugadora},"${jugadora.nombre}",${jugadora.division},${fechaSeleccionada},${estado}\n`;
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asistencias_${fechaSeleccionada}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Contar asistencias
  const contarAsistencias = () => {
    const presentes = Object.values(asistencias).filter(estado => estado === 'presente').length;
    const ausentes = Object.values(asistencias).filter(estado => estado === 'ausente').length;
    const tardanzas = Object.values(asistencias).filter(estado => estado === 'tardanza').length;
    return { presentes, ausentes, tardanzas };
  };

  const { presentes, ausentes, tardanzas } = contarAsistencias();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <div className="bg-blue-600 text-white p-6 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6" />
              Control de Asistencias - TLTC 2025
            </h1>
            <p className="text-blue-100 mt-2">7ma y 6ta División - Sistema Web</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={cargarDatosHoja}
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button
              onClick={() => setShowConfig(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded"
            >
              <Settings className="w-4 h-4" />
              Config
            </button>
          </div>
        </div>
      </div>

      {/* Mensaje de estado */}
      {mensaje && (
        <div className={`p-4 rounded-lg mb-4 ${mensaje.includes('❌') || mensaje.includes('⚠️') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {mensaje}
        </div>
      )}

      {/* Modal de configuración */}
      {showConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Configuración de Google Sheets API</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key de Google Cloud
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Ingresa tu API Key"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={guardarApiKey}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Guardar
              </button>
              <button
                onClick={() => setShowConfig(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Información de la planilla */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Total jugadoras:</span> {jugadoras.length}
          </div>
          <div>
            <span className="font-medium">7ma División:</span> {jugadoras.filter(j => j.division === '7ma').length}
          </div>
          <div>
            <span className="font-medium">6ta División:</span> {jugadoras.filter(j => j.division === '6ta').length}
          </div>
          <div>
            <span className="font-medium">Fecha:</span> {fechaSeleccionada}
          </div>
        </div>
      </div>

      {/* Configuración del registro */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar className="w-4 h-4 inline mr-1" />
              Fecha
            </label>
            <input
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => {
                setFechaSeleccionada(e.target.value);
                setAsistencias({});
              }}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">División</label>
            <select
              value={divisionFiltro}
              onChange={(e) => setDivisionFiltro(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas las divisiones</option>
              <option value="7ma">7ma División</option>
              <option value="6ta">6ta División</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => marcarTodas('presente')}
              className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              ✓ Todas
            </button>
            <button
              onClick={() => marcarTodas('ausente')}
              className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              ✗ Todas
            </button>
          </div>

          <div className="flex items-end">
            <div className={`flex items-center gap-2 text-sm ${isConfigured ? 'text-green-600' : 'text-orange-600'}`}>
              <CheckCircle className="w-4 h-4" />
              {isConfigured ? 'Conectado' : 'Sin configurar'}
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de asistencias */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-800">{presentes}</div>
          <div className="text-sm text-green-600">Presentes</div>
        </div>
        <div className="bg-red-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-800">{ausentes}</div>
          <div className="text-sm text-red-600">Ausentes</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-800">{tardanzas}</div>
          <div className="text-sm text-yellow-600">Tardanzas</div>
        </div>
      </div>

      {/* Lista de jugadoras */}
      <div className="bg-white border rounded-lg overflow-hidden mb-6">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-semibold text-gray-800">
            Lista de Jugadoras {divisionFiltro !== 'todas' && `- ${divisionFiltro} División`}
          </h3>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {jugadorasFiltradas.length > 0 ? (
            jugadorasFiltradas.map((jugadora) => (
              <div key={jugadora.id} className="px-4 py-3 border-b hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    jugadora.division === '7ma' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}>
                    {jugadora.idJugadora}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{jugadora.nombre}</div>
                    <div className="text-sm text-gray-500">{jugadora.division} División</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAsistenciaChange(jugadora.id, 'presente')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      asistencias[jugadora.id] === 'presente'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                    }`}
                  >
                    ✓ Presente
                  </button>
                  <button
                    onClick={() => handleAsistenciaChange(jugadora.id, 'tardanza')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      asistencias[jugadora.id] === 'tardanza'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'
                    }`}
                  >
                    ⏰ Tardanza
                  </button>
                  <button
                    onClick={() => handleAsistenciaChange(jugadora.id, 'ausente')}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      asistencias[jugadora.id] === 'ausente'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                    }`}
                  >
                    ✗ Ausente
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              {isLoading ? 'Cargando jugadoras...' : 'No se encontraron jugadoras.'}
            </div>
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={guardarEnGoogleSheets}
          disabled={isLoading || !isConfigured || jugadoras.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar en Google Sheets
            </>
          )}
        </button>

        <button
          onClick={exportarCSV}
          disabled={Object.keys(asistencias).length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>

        <div className="text-sm text-gray-600 flex items-center gap-1 px-3 py-3">
          <Upload className="w-4 h-4" />
          Asistencias marcadas: {Object.keys(asistencias).length}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-500 text-sm">
        <p>© 2025 TLTC - Control de Asistencias</p>
        <p>Desarrollado para 7ma y 6ta División</p>
      </div>
    </div>
  );
};

export default FormularioAsistencias;