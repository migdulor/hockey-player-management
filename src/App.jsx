import React, { useState, useEffect } from 'react';
import { Calendar, Users, Save, Download, Upload, CheckCircle, RefreshCw } from 'lucide-react';

const FormularioAsistencias = () => {
  // URL del Google Apps Script configurado
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxIW7BOmLmPrjUsokhsI4p4mi1wdg9JPpPFs8KTUmBhbgetp_RfaLew8RFB6V3BajrpmQ/exec';
  
  // Estados principales
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [divisionFiltro, setDivisionFiltro] = useState('todas');
  const [asistencias, setAsistencias] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  
  // Datos de la planilla
  const [jugadoras, setJugadoras] = useState([]);
  const [datosHoja, setDatosHoja] = useState([]);

  useEffect(() => {
    cargarDatosHoja();
  }, [fechaSeleccionada]); // Recargar cuando cambia la fecha

  // Cargar datos desde Google Sheets usando Apps Script
  const cargarDatosHoja = async () => {
    try {
      setIsLoading(true);
      setMensaje('🔍 Conectando con Google Sheets...');
      
      const response = await fetch(`${SCRIPT_URL}?action=read`);
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          setDatosHoja(result.data);
          
          const jugadorasExtraidas = result.data.slice(1).map((fila, index) => ({
            id: index + 1,
            idJugadora: fila[0]?.toString() || '',
            nombre: fila[1] || '',
            division: fila[2] || ''
          })).filter(jugadora => jugadora.nombre);
          
          setJugadoras(jugadorasExtraidas);
          
          // Cargar asistencias existentes para la fecha seleccionada
          const encabezados = result.data[0];
          const indiceFecha = encabezados.findIndex(header => header === fechaSeleccionada);
          
          if (indiceFecha >= 0) {
            const asistenciasExistentes = {};
            jugadorasExtraidas.forEach((jugadora, index) => {
              const valorAsistencia = result.data[index + 1][indiceFecha];
              if (valorAsistencia) {
                let estado = '';
                switch (valorAsistencia) {
                  case 'P': estado = 'presente'; break;
                  case 'A': estado = 'ausente'; break;
                  case 'T': estado = 'tardanza'; break;
                }
                if (estado) {
                  asistenciasExistentes[jugadora.id] = estado;
                }
              }
            });
            setAsistencias(asistenciasExistentes);
            
            if (Object.keys(asistenciasExistentes).length > 0) {
              setMensaje(`✅ Datos cargados - ${Object.keys(asistenciasExistentes).length} asistencias previas encontradas`);
            } else {
              setMensaje(`✅ Conectado - ${jugadorasExtraidas.length} jugadoras cargadas`);
            }
          } else {
            setAsistencias({});
            setMensaje(`✅ Conectado - ${jugadorasExtraidas.length} jugadoras cargadas`);
          }
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
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  // Cargar datos manuales como respaldo
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
    setMensaje('⚠️ Usando datos locales - Verifica la conexión con Google Sheets');
    setIsLoading(false);
  };

  // Filtrar jugadoras según división
  const jugadorasFiltradas = jugadoras.filter(jugadora => 
    divisionFiltro === 'todas' || jugadora.division === divisionFiltro
  );

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

  // Guardar en Google Sheets usando Apps Script
  const guardarEnGoogleSheets = async () => {
    try {
      setIsLoading(true);
      setMensaje('💾 Guardando asistencias...');
      
      // Preparar datos de asistencias por ID de jugadora
      const asistenciasData = {};
      jugadoras.forEach(jugadora => {
        const estado = asistencias[jugadora.id];
        if (estado) {
          let valorAsistencia = '';
          switch (estado) {
            case 'presente': valorAsistencia = 'P'; break;
            case 'ausente': valorAsistencia = 'A'; break;
            case 'tardanza': valorAsistencia = 'T'; break;
          }
          if (valorAsistencia) {
            asistenciasData[jugadora.idJugadora] = valorAsistencia;
          }
        }
      });
      
      if (Object.keys(asistenciasData).length === 0) {
        setMensaje('⚠️ No hay asistencias marcadas para guardar');
        setIsLoading(false);
        setTimeout(() => setMensaje(''), 3000);
        return false;
      }
      
      // Enviar datos al Apps Script
      const params = new URLSearchParams({
        action: 'write',
        fecha: fechaSeleccionada,
        asistencias: JSON.stringify(asistenciasData)
      });
      
      const response = await fetch(`${SCRIPT_URL}?${params.toString()}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMensaje(`✅ Asistencias guardadas exitosamente para ${fechaSeleccionada}`);
          // Recargar los datos después de guardar
          setTimeout(() => cargarDatosHoja(), 1000);
          return true;
        } else {
          setMensaje(`❌ Error: ${result.error || 'Error desconocido'}`);
          return false;
        }
      } else {
        setMensaje('❌ Error al conectar con Google Sheets');
        return false;
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('❌ Error de conexión. Verifica tu conexión a internet');
      return false;
    } finally {
      setIsLoading(false);
      setTimeout(() => setMensaje(''), 5000);
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
        let estadoTexto = '';
        switch (estado) {
          case 'presente': estadoTexto = 'Presente'; break;
          case 'ausente': estadoTexto = 'Ausente'; break;
          case 'tardanza': estadoTexto = 'Tardanza'; break;
        }
        csvContent += `${jugadora.idJugadora},"${jugadora.nombre}",${jugadora.division},${fechaSeleccionada},${estadoTexto}\n`;
      }
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asistencias_TLTC_${fechaSeleccionada}.csv`;
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
          <button
            onClick={cargarDatosHoja}
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Mensaje de estado */}
      {mensaje && (
        <div className={`p-4 rounded-lg mb-4 transition-all ${
          mensaje.includes('❌') || mensaje.includes('⚠️') 
            ? 'bg-red-100 text-red-800 border border-red-300' 
            : 'bg-green-100 text-green-800 border border-green-300'
        }`}>
          {mensaje}
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
              className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
            >
              ✓ Todas
            </button>
            <button
              onClick={() => marcarTodas('ausente')}
              className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
            >
              ✗ Todas
            </button>
          </div>

          <div className="flex items-end">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              {jugadoras.length > 0 ? 'Google Sheets conectado' : 'Conectando...'}
            </div>
          </div>
        </div>
      </div>

      {/* Resumen de asistencias */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-lg text-center border border-green-200">
          <div className="text-2xl font-bold text-green-800">{presentes}</div>
          <div className="text-sm text-green-600">Presentes</div>
        </div>
        <div className="bg-red-100 p-4 rounded-lg text-center border border-red-200">
          <div className="text-2xl font-bold text-red-800">{ausentes}</div>
          <div className="text-sm text-red-600">Ausentes</div>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center border border-yellow-200">
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
          disabled={isLoading || jugadoras.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
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