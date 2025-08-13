import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxIW7BOmLmPrjUsokhsI4p4mi1wdg9JPpPFs8KTUmBhbgetp_RfaLew8RFB6V3BajrpmQ/exec';

const Asistencias = ({ jugadoras: jugadorasProps }) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date().toISOString().split('T')[0]);
  const [divisionFiltro, setDivisionFiltro] = useState('todas');
  const [asistencias, setAsistencias] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [jugadoras, setJugadoras] = useState(jugadorasProps);
  const [cargandoAsistencias, setCargandoAsistencias] = useState(false);

  useEffect(() => {
    setJugadoras(jugadorasProps);
    cargarAsistenciasFecha(fechaSeleccionada);
  }, [jugadorasProps]);

  useEffect(() => {
    cargarAsistenciasFecha(fechaSeleccionada);
  }, [fechaSeleccionada]);

  const jugadorasFiltradas = jugadoras.filter(jugadora => 
    divisionFiltro === 'todas' || jugadora.division === divisionFiltro
  );

  const cargarAsistenciasFecha = async (fecha) => {
    try {
      setCargandoAsistencias(true);
      const params = new URLSearchParams({
        action: 'readByDate',
        fecha: fecha
      });
      
      const response = await fetch(`${SCRIPT_URL}?${params.toString()}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.asistencias) {
          const nuevasAsistencias = {};
          Object.keys(result.asistencias).forEach(jugadoraId => {
            const estado = result.asistencias[jugadoraId];
            switch (estado) {
              case 'P': nuevasAsistencias[jugadoraId] = 'presente'; break;
              case 'A': nuevasAsistencias[jugadoraId] = 'ausente'; break;
              case 'T': nuevasAsistencias[jugadoraId] = 'tardanza'; break;
            }
          });
          setAsistencias(nuevasAsistencias);
        } else {
          setAsistencias({});
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setCargandoAsistencias(false);
    }
  };

  const handleAsistenciaChange = (jugadoraId, estado) => {
    setAsistencias(prev => ({
      ...prev,
      [jugadoraId]: estado
    }));
  };

  const marcarTodas = (estado) => {
    const nuevasAsistencias = {};
    jugadorasFiltradas.forEach(jugadora => {
      nuevasAsistencias[jugadora.idJugadora] = estado;
    });
    setAsistencias(prev => ({ ...prev, ...nuevasAsistencias }));
  };

  const guardarEnGoogleSheets = async () => {
    try {
      setIsLoading(true);
      setMensaje('💾 Guardando asistencias...');
      
      const asistenciasData = {};
      jugadoras.forEach(jugadora => {
        const estado = asistencias[jugadora.idJugadora];
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
        setMensaje('⚠️ No hay asistencias marcadas');
        setIsLoading(false);
        return;
      }
      
      const params = new URLSearchParams({
        action: 'write',
        fecha: fechaSeleccionada,
        asistencias: JSON.stringify(asistenciasData)
      });
      
      const response = await fetch(`${SCRIPT_URL}?${params.toString()}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMensaje(`✅ Asistencias guardadas para ${fechaSeleccionada}`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('❌ Error al guardar');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  const contarAsistencias = () => {
    const presentes = Object.values(asistencias).filter(e => e === 'presente').length;
    const ausentes = Object.values(asistencias).filter(e => e === 'ausente').length;
    const tardanzas = Object.values(asistencias).filter(e => e === 'tardanza').length;
    return { presentes, ausentes, tardanzas };
  };

  const { presentes, ausentes, tardanzas } = contarAsistencias();

  return (
    <div className="space-y-6">
      {mensaje && (
        <div className={`p-4 rounded-lg ${
          mensaje.includes('❌') || mensaje.includes('⚠️') 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {mensaje}
        </div>
      )}

      <div className="bg-white p-4 md:p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              División
            </label>
            <select
              value={divisionFiltro}
              onChange={(e) => setDivisionFiltro(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="todas">Todas</option>
              <option value="7ma">7ma División</option>
              <option value="6ta">6ta División</option>
            </select>
          </div>
          <div className="flex items-end gap-2 col-span-2">
            <button
              onClick={() => marcarTodas('presente')}
              className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex-1"
            >
              ✓ Todas
            </button>
            <button
              onClick={() => marcarTodas('ausente')}
              className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex-1"
            >
              ✗ Todas
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {cargandoAsistencias ? (
            <div className="p-8 text-center text-gray-500">
              Cargando asistencias...
            </div>
          ) : jugadorasFiltradas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No hay jugadoras en esta división
            </div>
          ) : (
            jugadorasFiltradas.map((jugadora) => (
              <div key={jugadora.id} className="px-4 py-3 border-b hover:bg-gray-50 flex flex-col sm:flex-row justify-between">
                <div className="flex items-center gap-3 mb-2 sm:mb-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    jugadora.division === '7ma' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}>
                    {jugadora.idJugadora}
                  </div>
                  <div>
                    <div className="font-medium">{jugadora.nombre}</div>
                    <div className="text-sm text-gray-500">{jugadora.division}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAsistenciaChange(jugadora.idJugadora, 'presente')}
                    className={`px-3 py-1 rounded text-sm flex-1 min-w-[90px] ${
                      asistencias[jugadora.idJugadora] === 'presente'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 hover:bg-green-100'
                    }`}
                  >
                    Presente
                  </button>
                  <button
                    onClick={() => handleAsistenciaChange(jugadora.idJugadora, 'tardanza')}
                    className={`px-3 py-1 rounded text-sm flex-1 min-w-[90px] ${
                      asistencias[jugadora.idJugadora] === 'tardanza'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 hover:bg-yellow-100'
                    }`}
                  >
                    Tardanza
                  </button>
                  <button
                    onClick={() => handleAsistenciaChange(jugadora.idJugadora, 'ausente')}
                    className={`px-3 py-1 rounded text-sm flex-1 min-w-[90px] ${
                      asistencias[jugadora.idJugadora] === 'ausente'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 hover:bg-red-100'
                    }`}
                  >
                    Ausente
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={guardarEnGoogleSheets}
        disabled={isLoading}
        className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
      >
        <Save className="w-5 h-5" />
        {isLoading ? 'Guardando...' : 'Guardar en Google Sheets'}
      </button>
    </div>
  );
};

export default Asistencias;