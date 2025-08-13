import React, { useState, useEffect, useRef } from 'react';
import { Save, Download, FileText, X } from 'lucide-react';
import html2canvas from 'html2canvas';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxIW7BOmLmPrjUsokhsI4p4mi1wdg9JPpPFs8KTUmBhbgetp_RfaLew8RFB6V3BajrpmQ/exec';

const FormacionesPartidos = ({ jugadoras }) => {
  const [divisionFormacion, setDivisionFormacion] = useState('7ma');
  const [formacion, setFormacion] = useState({
    fecha: new Date().toISOString().split('T')[0],
    equipoContrario: '',
    lugar: '',
    horaCitacion: '',
    horaPartido: '',
    division: '7ma',
    arquera: null,
    defensorDerecha: null,
    defensorIzquierda: null,
    central1: null,
    central2: null,
    volanteDerecho: null,
    volanteIzquierdo: null,
    volanteCentral: null,
    delanteroDerecha: null,
    delanteroIzquierda: null,
    delanteroPunta: null,
    suplente1: null,
    suplente2: null,
    suplente3: null,
    suplente4: null,
    suplente5: null,
    suplente6: null,
    suplente7: null,
    suplente8: null,
    suplente9: null
  });

  const [posicionSeleccionada, setPosicionSeleccionada] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [vistaPrevia, setVistaPrevia] = useState(false);
  const canchaRef = useRef(null);

  useEffect(() => {
    setFormacion(prev => ({
      ...prev,
      division: divisionFormacion
    }));
  }, [divisionFormacion]);

  const posiciones = [
    { key: 'arquera', nombre: 'Arquera', x: 50, y: 90 },
    { key: 'defensorDerecha', nombre: 'Def. Derecha', x: 75, y: 70 },
    { key: 'defensorIzquierda', nombre: 'Def. Izquierda', x: 25, y: 70 },
    { key: 'central1', nombre: 'Central 1', x: 40, y: 65 },
    { key: 'central2', nombre: 'Central 2', x: 60, y: 65 },
    { key: 'volanteDerecho', nombre: 'Vol. Derecho', x: 75, y: 45 },
    { key: 'volanteIzquierdo', nombre: 'Vol. Izquierdo', x: 25, y: 45 },
    { key: 'volanteCentral', nombre: 'Vol. Central', x: 50, y: 40 },
    { key: 'delanteroDerecha', nombre: 'Del. Derecha', x: 70, y: 20 },
    { key: 'delanteroIzquierda', nombre: 'Del. Izquierda', x: 30, y: 20 },
    { key: 'delanteroPunta', nombre: 'Del. Punta', x: 50, y: 15 }
  ];

  const suplentes = Array.from({ length: 9 }, (_, i) => ({
    key: `suplente${i + 1}`,
    nombre: `Suplente ${i + 1}`
  }));

  const jugadorasDivision = jugadoras.filter(j => 
    j.division === divisionFormacion && 
    !Object.values(formacion).some(val => val === j.nombre)
  );

  const otrasJugadoras = jugadoras.filter(j => 
    j.division !== divisionFormacion && 
    !Object.values(formacion).some(val => val === j.nombre)
  );

  const seleccionarJugadora = (posicionKey) => {
    setPosicionSeleccionada(posicionKey);
  };

  const asignarJugadora = (jugadora) => {
    if (posicionSeleccionada) {
      setFormacion(prev => ({
        ...prev,
        [posicionSeleccionada]: jugadora.nombre
      }));
      setPosicionSeleccionada(null);
    }
  };

  const quitarJugadora = (posicionKey) => {
    setFormacion(prev => ({
      ...prev,
      [posicionKey]: null
    }));
  };

  const guardarFormacion = async () => {
    try {
      const params = new URLSearchParams({
        action: 'savePartido',
        partido: JSON.stringify(formacion)
      });
      
      const response = await fetch(`${SCRIPT_URL}?${params.toString()}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setMensaje('✅ Formación guardada exitosamente');
          setTimeout(() => setMensaje(''), 3000);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('❌ Error al guardar la formación');
    }
  };

  const exportarTexto = () => {
    let texto = `FORMACIÓN - TLTC HOCKEY ${formacion.division.toUpperCase()}\n`;
    texto += `========================\n\n`;
    texto += `Fecha: ${formacion.fecha}\n`;
    texto += `Rival: ${formacion.equipoContrario}\n`;
    texto += `Lugar: ${formacion.lugar}\n`;
    texto += `Citación: ${formacion.horaCitacion}\n`;
    texto += `Partido: ${formacion.horaPartido}\n\n`;
    texto += `TITULARES\n`;
    texto += `---------\n`;
    posiciones.forEach(pos => {
      texto += `${pos.nombre}: ${formacion[pos.key] || 'Sin asignar'}\n`;
    });
    texto += `\nSUPLENTES\n`;
    texto += `---------\n`;
    suplentes.forEach(sup => {
      if (formacion[sup.key]) {
        texto += `${sup.nombre}: ${formacion[sup.key]}\n`;
      }
    });

    const blob = new Blob([texto], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formacion_${formacion.fecha}_${formacion.equipoContrario || 'partido'}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportarImagen = () => {
    if (!canchaRef.current) return;
    
    setVistaPrevia(true);
    setTimeout(() => {
      html2canvas(canchaRef.current).then(canvas => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `formacion_${formacion.fecha}_${formacion.equipoContrario || 'partido'}.png`;
        link.click();
        setVistaPrevia(false);
      });
    }, 500);
  };

  const getNombreCorto = (nombreCompleto) => {
    if (!nombreCompleto) return '';
    const jugadora = jugadoras.find(j => j.nombre === nombreCompleto);
    return jugadora?.nombreCorto || nombreCompleto.split(' ')[0];
  };

  return (
    <div className="space-y-6">
      {mensaje && (
        <div className={`p-4 rounded-lg ${
          mensaje.includes('❌') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {mensaje}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Datos del Partido</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              División
            </label>
            <select
              value={divisionFormacion}
              onChange={(e) => setDivisionFormacion(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="7ma">7ma División</option>
              <option value="6ta">6ta División</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              value={formacion.fecha}
              onChange={(e) => setFormacion(prev => ({ ...prev, fecha: e.target.value }))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipo Contrario
            </label>
            <input
              type="text"
              value={formacion.equipoContrario}
              onChange={(e) => setFormacion(prev => ({ ...prev, equipoContrario: e.target.value }))}
              className="w-full p-2 border rounded"
              placeholder="Universitario"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lugar
            </label>
            <input
              type="text"
              value={formacion.lugar}
              onChange={(e) => setFormacion(prev => ({ ...prev, lugar: e.target.value }))}
              className="w-full p-2 border rounded"
              placeholder="TLTC"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora Citación
            </label>
            <input
              type="time"
              value={formacion.horaCitacion}
              onChange={(e) => setFormacion(prev => ({ ...prev, horaCitacion: e.target.value }))}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora Partido
            </label>
            <input
              type="time"
              value={formacion.horaPartido}
              onChange={(e) => setFormacion(prev => ({ ...prev, horaPartido: e.target.value }))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow" ref={canchaRef}>
          <h3 className="text-lg font-bold mb-4">Formación Titular</h3>
          <div className="relative bg-green-500 rounded-lg p-4" style={{ minHeight: '500px' }}>
            <div className="absolute inset-x-4 top-1/2 border-t-2 border-white opacity-50"></div>
            <div className="absolute left-1/2 top-4 bottom-4 border-l-2 border-white opacity-50"></div>
            <div className="absolute bottom-0 left-1/4 right-1/4 h-24 border-2 border-white opacity-50 rounded-t-full"></div>
            <div className="absolute bottom-0 left-1/3 right-1/3 h-16 border-2 border-white opacity-50 rounded-t-full"></div>

            {posiciones.map(pos => (
              <div
                key={pos.key}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                onClick={() => seleccionarJugadora(pos.key)}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  posicionSeleccionada === pos.key
                    ? 'bg-yellow-400 text-black scale-110'
                    : formacion[pos.key]
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700'
                }`}>
                  {formacion[pos.key] ? (
                    <div className="text-center">
                      <div className="text-[10px]">{getNombreCorto(formacion[pos.key])}</div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-center">{pos.nombre}</div>
                  )}
                </div>
                {formacion[pos.key] && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      quitarJugadora(pos.key);
                    }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">
              {posicionSeleccionada ? `Seleccionar para: ${posiciones.find(p => p.key === posicionSeleccionada)?.nombre || suplentes.find(s => s.key === posicionSeleccionada)?.nombre}` : 'Jugadoras Disponibles'}
            </h3>
            
            <h4 className="font-medium mb-2">Jugadoras de {divisionFormacion}</h4>
            <div className="max-h-48 overflow-y-auto space-y-2 mb-4">
              {jugadorasDivision.length === 0 ? (
                <div className="text-center text-gray-500 py-2">
                  Todas las jugadoras están asignadas
                </div>
              ) : (
                jugadorasDivision.map(jugadora => (
                  <div
                    key={jugadora.id}
                    onClick={() => asignarJugadora(jugadora)}
                    className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                      posicionSeleccionada 
                        ? 'hover:bg-blue-100 border border-gray-200'
                        : 'bg-gray-50 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span className="text-sm">{jugadora.nombre}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      jugadora.division === '7ma' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {jugadora.division}
                    </span>
                  </div>
                ))
              )}
            </div>

            <h4 className="font-medium mb-2">Otras jugadoras</h4>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {otrasJugadoras.map(jugadora => (
                <div
                  key={jugadora.id}
                  onClick={() => asignarJugadora(jugadora)}
                  className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                    posicionSeleccionada 
                      ? 'hover:bg-blue-100 border border-gray-200'
                      : 'bg-gray-50 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span className="text-sm">{jugadora.nombre}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    jugadora.division === '7ma' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {jugadora.division}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">Suplentes</h3>
            <div className="grid grid-cols-3 gap-2">
              {suplentes.map(sup => (
                <div
                  key={sup.key}
                  onClick={() => seleccionarJugadora(sup.key)}
                  className={`p-2 rounded text-center cursor-pointer text-sm ${
                    posicionSeleccionada === sup.key
                      ? 'bg-yellow-400 text-black'
                      : formacion[sup.key]
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {formacion[sup.key] ? getNombreCorto(formacion[sup.key]) : sup.nombre}
                  {formacion[sup.key] && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        quitarJugadora(sup.key);
                      }}
                      className="ml-2 text-red-300 hover:text-red-500"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {vistaPrevia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Vista Previa - Formación</h2>
                <button
                  onClick={() => setVistaPrevia(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">TLTC HOCKEY</h1>
                    <p className="text-xl">{formacion.division.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formacion.horaPartido || '00:00'}</p>
                    <p className="text-lg">{formacion.equipoContrario || 'Rival'}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-bold">{formacion.fecha}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Lugar</p>
                  <p className="font-bold">{formacion.lugar || 'Por definir'}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Citación</p>
                  <p className="font-bold">{formacion.horaCitacion || 'Por definir'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-3 text-blue-600">TITULARES</h3>
                  <div className="space-y-2">
                    {posiciones.map((pos, index) => (
                      <div key={pos.key} className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium">{formacion[pos.key] || 'Por definir'}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-3 text-gray-600">SUPLENTES</h3>
                  <div className="space-y-2">
                    {suplentes.filter(sup => formacion[sup.key]).map((sup, index) => (
                      <div key={sup.key} className="flex items-center gap-2">
                        <span className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 12}
                        </span>
                        <span className="text-sm font-medium">{formacion[sup.key]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={exportarTexto}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Exportar como Texto
                </button>
                <button
                  onClick={exportarImagen}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Exportar como Imagen
                </button>
                <button
                  onClick={() => setVistaPrevia(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <button
          onClick={guardarFormacion}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Guardar Formación
        </button>
        <button
          onClick={() => setVistaPrevia(true)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <FileText className="w-5 h-5" />
          Vista Previa
        </button>
        <button
          onClick={exportarTexto}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Exportar Texto
        </button>
        <button
          onClick={exportarImagen}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Exportar Imagen
        </button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-bold text-blue-900 mb-2">📝 Instrucciones</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Haz clic en una posición en la cancha o en un lugar de suplente</li>
          <li>• Luego selecciona la jugadora de la lista</li>
          <li>• Puedes quitar jugadoras con el botón × </li>
          <li>• Guarda la formación cuando esté completa</li>
          <li>• Exporta como texto o imagen para compartir</li>
        </ul>
      </div>
    </div>
  );
};

export default FormacionesPartidos;