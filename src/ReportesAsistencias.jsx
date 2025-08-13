import React, { useState, useEffect } from 'react';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxIW7BOmLmPrjUsokhsI4p4mi1wdg9JPpPFs8KTUmBhbgetp_RfaLew8RFB6V3BajrpmQ/exec';

const ReportesAsistencias = ({ jugadoras }) => {
  const [stats, setStats] = useState({});
  const [divisionFiltro, setDivisionFiltro] = useState('todas');
  const [isLoading, setIsLoading] = useState(false);
  const [fechaInicio, setFechaInicio] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);
  const [asistenciasPorFecha, setAsistenciasPorFecha] = useState([]);

  useEffect(() => {
    cargarEstadisticas();
    cargarAsistenciasPorFecha();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${SCRIPT_URL}?action=getStats`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStats(result.stats || {});
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cargarAsistenciasPorFecha = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        action: 'getAttendanceByDateRange',
        start: fechaInicio,
        end: fechaFin
      });
      
      const response = await fetch(`${SCRIPT_URL}?${params.toString()}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAsistenciasPorFecha(result.data || []);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarAsistenciasPorFecha();
  }, [fechaInicio, fechaFin]);

  const jugadorasFiltradas = jugadoras.filter(j => 
    divisionFiltro === 'todas' || j.division === divisionFiltro
  );

  const calcularPorcentaje = (jugadoraId) => {
    const stat = stats[jugadoraId];
    if (!stat || stat.total === 0) return 0;
    return Math.round((stat.presentes / stat.total) * 100);
  };

  const calcularEstadisticasDivision = (division) => {
    const jugadorasDivision = jugadoras.filter(j => j.division === division);
    let totalPresentes = 0;
    let totalAusentes = 0;
    let totalTardanzas = 0;
    let totalEntrenamientos = 0;

    jugadorasDivision.forEach(jugadora => {
      const stat = stats[jugadora.idJugadora];
      if (stat) {
        totalPresentes += stat.presentes || 0;
        totalAusentes += stat.ausentes || 0;
        totalTardanzas += stat.tardanzas || 0;
        totalEntrenamientos = Math.max(totalEntrenamientos, stat.total || 0);
      }
    });

    const totalAsistencias = totalPresentes + totalAusentes + totalTardanzas;
    const porcentajeAsistencia = totalAsistencias > 0 
      ? Math.round((totalPresentes / totalAsistencias) * 100) 
      : 0;

    return {
      totalPresentes,
      totalAusentes,
      totalTardanzas,
      totalEntrenamientos,
      porcentajeAsistencia,
      jugadoras: jugadorasDivision.length
    };
  };

  const stats7ma = calcularEstadisticasDivision('7ma');
  const stats6ta = calcularEstadisticasDivision('6ta');

  const asistenciasAgrupadas = asistenciasPorFecha.reduce((acc, item) => {
    if (!acc[item.fecha]) {
      acc[item.fecha] = {
        '7ma': { presentes: 0, total: 0 },
        '6ta': { presentes: 0, total: 0 }
      };
    }
    
    if (item.division === '7ma') {
      acc[item.fecha]['7ma'].presentes += item.presentes;
      acc[item.fecha]['7ma'].total += item.total;
    } else if (item.division === '6ta') {
      acc[item.fecha]['6ta'].presentes += item.presentes;
      acc[item.fecha]['6ta'].total += item.total;
    }
    
    return acc;
  }, {});

  const datosGrafico = Object.keys(asistenciasAgrupadas)
    .sort()
    .map(fecha => {
      const datos = asistenciasAgrupadas[fecha];
      return {
        fecha,
        '7ma': datos['7ma'].total > 0 
          ? Math.round((datos['7ma'].presentes / datos['7ma'].total) * 100) 
          : 0,
        '6ta': datos['6ta'].total > 0 
          ? Math.round((datos['6ta'].presentes / datos['6ta'].total) * 100) 
          : 0
      };
    });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Reportes de Asistencia</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              División
            </label>
            <select
              value={divisionFiltro}
              onChange={(e) => setDivisionFiltro(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="todas">Todas las divisiones</option>
              <option value="7ma">7ma División</option>
              <option value="6ta">6ta División</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={cargarAsistenciasPorFecha}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
            >
              Actualizar
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold mb-4">Asistencia por Fecha</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-end h-40 gap-2 md:gap-4">
              {datosGrafico.map((dato, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-1">
                    {dato.fecha.split('-')[2]}
                  </div>
                  <div className="flex items-end justify-center gap-1 w-full h-32">
                    <div 
                      className="w-full bg-blue-500 rounded-t-md relative"
                      style={{ height: `${dato['7ma']}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-700">
                        {dato['7ma']}%
                      </div>
                    </div>
                    <div 
                      className="w-full bg-purple-500 rounded-t-md relative"
                      style={{ height: `${dato['6ta']}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-purple-700">
                        {dato['6ta']}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 mr-2"></div>
                <span className="text-sm">7ma División</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 mr-2"></div>
                <span className="text-sm">6ta División</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {jugadorasFiltradas.map(jugadora => {
            const porcentaje = calcularPorcentaje(jugadora.idJugadora);
            const stat = stats[jugadora.idJugadora] || { presentes: 0, ausentes: 0, tardanzas: 0, total: 0 };
            
            return (
              <div key={jugadora.id} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{jugadora.nombre}</span>
                  <span className="text-sm text-gray-600">
                    {porcentaje}% asistencia
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-green-500 h-full transition-all duration-500 flex items-center justify-center text-white text-xs"
                    style={{ width: `${porcentaje}%` }}
                  >
                    {porcentaje > 10 && `${porcentaje}%`}
                  </div>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-600 flex-wrap">
                  <span>✓ {stat.presentes} presentes</span>
                  <span>⏰ {stat.tardanzas} tardanzas</span>
                  <span>✗ {stat.ausentes} ausentes</span>
                  <span>Total: {stat.total} entrenamientos</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-4 text-blue-600">7ma División</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Jugadoras:</span>
              <span className="font-medium">{stats7ma.jugadoras}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">% Asistencia promedio:</span>
              <span className="font-medium">{stats7ma.porcentajeAsistencia}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total entrenamientos:</span>
              <span className="font-medium">{stats7ma.totalEntrenamientos}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-4 text-purple-600">6ta División</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Jugadoras:</span>
              <span className="font-medium">{stats6ta.jugadoras}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">% Asistencia promedio:</span>
              <span className="font-medium">{stats6ta.porcentajeAsistencia}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total entrenamientos:</span>
              <span className="font-medium">{stats6ta.totalEntrenamientos}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesAsistencias;