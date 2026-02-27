import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../../context/AuthContext';

const ClienteProgreso = () => {
  const { user } = useContext(AuthContext);
  const [mesSeleccionado, setMesSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [añoSeleccionado, setAñoSeleccionado] = useState('2024');
  const [progresoMeses, setProgresoMeses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/member/progress/${user.id}`);
        const result = await response.json();

        // Map data to the format used by the component
        const mappedData = result.progress.map(p => {
          const m = result.measurements.find(meas => meas.fecha === p.fecha) || {};
          const date = new Date(p.fecha + 'T12:00:00');
          const mesNombre = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
          const mesCapitalizado = mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1);

          return {
            id: p.id,
            mes: mesCapitalizado,
            año: date.getFullYear().toString(),
            fecha: date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
            peso: p.peso,
            masaMuscular: p.masaMuscular,
            grasaCorporal: p.grasaCorporal,
            medidas: {
              pecho: m.pechoActual || 0,
              brazos: m.brazosActual || 0,
              cintura: m.cinturaActual || 0,
              piernas: m.piernasActual || 0
            }
          };
        });

        setProgresoMeses(mappedData);
        if (mappedData.length > 0) {
          const currentYear = new Date().getFullYear().toString();
          if (mappedData.some(m => m.año === currentYear)) {
            setAñoSeleccionado(currentYear);
          } else {
            setAñoSeleccionado('todos');
          }
        }
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProgress();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Obtener años únicos
  const añosDisponibles = [...new Set(progresoMeses.map(m => m.año))].sort((a, b) => b - a);

  // Filtrar por año
  const mesesFiltrados = progresoMeses.filter(m => m.año === añoSeleccionado);

  // Obtener datos más recientes para el resumen general
  const datosMasRecientes = progresoMeses.sort((a, b) => b.id - a.id)[0];
  const datosIniciales = progresoMeses.sort((a, b) => a.id - b.id)[0];

  const handleVerDetalle = (mes) => {
    setMesSeleccionado(mes);
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setMesSeleccionado(null);
  };

  const calcularCambio = (actual, anterior) => {
    if (!anterior) return null;
    const cambio = ((actual - anterior) / anterior * 100).toFixed(1);
    return cambio;
  };

  const calcularCambioGeneral = (actual, inicial) => {
    const cambio = ((actual - inicial) / inicial * 100).toFixed(1);
    return cambio;
  };

  const obtenerMesAnterior = (mesActual) => {
    const indexActual = mesesFiltrados.findIndex(m => m.id === mesActual.id);
    if (indexActual === 0) return null;
    return mesesFiltrados[indexActual - 1];
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mi Progreso</h1>
            <p className="text-gray-400">Seguimiento mensual de tu evolución física</p>
          </div>

          {/* Filtro por Año */}
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-xl rounded-lg p-1 border border-white/20">
            {añosDisponibles.map((año) => (
              <button
                key={año}
                onClick={() => setAñoSeleccionado(año)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${añoSeleccionado === año
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                {año}
              </button>
            ))}
            <button
              onClick={() => setAñoSeleccionado('todos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${añoSeleccionado === 'todos'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                : 'text-gray-400 hover:text-white'
                }`}
            >
              Todos
            </button>
          </div>
        </div>

        {/* Resumen General */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Peso Actual</h3>
              <div className="p-2 bg-blue-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-white text-3xl font-bold">{datosMasRecientes.peso}</span>
                <span className="text-gray-400">kg</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Inicial: {datosIniciales.peso} kg</span>
                <span className={`font-semibold ${parseFloat(calcularCambioGeneral(datosMasRecientes.peso, datosIniciales.peso)) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcularCambioGeneral(datosMasRecientes.peso, datosIniciales.peso) > 0 ? '+' : ''}{calcularCambioGeneral(datosMasRecientes.peso, datosIniciales.peso)}%
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Masa Muscular</h3>
              <div className="p-2 bg-purple-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-white text-3xl font-bold">{datosMasRecientes.masaMuscular}</span>
                <span className="text-gray-400">kg</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Inicial: {datosIniciales.masaMuscular} kg</span>
                <span className="text-green-400 font-semibold">
                  +{calcularCambioGeneral(datosMasRecientes.masaMuscular, datosIniciales.masaMuscular)}%
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Grasa Corporal</h3>
              <div className="p-2 bg-orange-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline space-x-2">
                <span className="text-white text-3xl font-bold">{datosMasRecientes.grasaCorporal}</span>
                <span className="text-gray-400">%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Inicial: {datosIniciales.grasaCorporal}%</span>
                <span className={`font-semibold ${parseFloat(calcularCambioGeneral(datosMasRecientes.grasaCorporal, datosIniciales.grasaCorporal)) < 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {calcularCambioGeneral(datosMasRecientes.grasaCorporal, datosIniciales.grasaCorporal)}%
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Título de Progreso Mensual */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            Progreso {añoSeleccionado === 'todos' ? 'Total' : añoSeleccionado}
          </h2>
          <p className="text-gray-400 text-sm">
            {añoSeleccionado === 'todos' ? progresoMeses.length : mesesFiltrados.length} mediciones registradas
          </p>
        </div>

        {/* Tarjetas de Progreso por Mes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(añoSeleccionado === 'todos' ? progresoMeses : mesesFiltrados)
            .sort((a, b) => b.id - a.id)
            .map((mes, index) => {
              const mesAnterior = obtenerMesAnterior(mes);
              const cambioPeso = mesAnterior ? calcularCambio(mes.peso, mesAnterior.peso) : null;
              const cambioMasa = mesAnterior ? calcularCambio(mes.masaMuscular, mesAnterior.masaMuscular) : null;
              const cambioGrasa = mesAnterior ? calcularCambio(mes.grasaCorporal, mesAnterior.grasaCorporal) : null;

              return (
                <motion.div
                  key={mes.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer"
                  onClick={() => handleVerDetalle(mes)}
                >
                  {/* Header de la tarjeta */}
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
                    <h3 className="text-white font-bold text-lg">{mes.mes}</h3>
                    <p className="text-blue-100 text-sm">{mes.fecha}</p>
                  </div>

                  {/* Contenido */}
                  <div className="p-6 space-y-4">
                    {/* Peso */}
                    <div className="bg-white/5 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Peso</span>
                        {cambioPeso && (
                          <span className={`text-xs font-semibold ${parseFloat(cambioPeso) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {cambioPeso > 0 ? '+' : ''}{cambioPeso}%
                          </span>
                        )}
                      </div>
                      <p className="text-white text-2xl font-bold">{mes.peso} kg</p>
                    </div>

                    {/* Masa Muscular */}
                    <div className="bg-white/5 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Masa Muscular</span>
                        {cambioMasa && (
                          <span className="text-green-400 text-xs font-semibold">
                            {cambioMasa > 0 ? '+' : ''}{cambioMasa}%
                          </span>
                        )}
                      </div>
                      <p className="text-green-400 text-2xl font-bold">{mes.masaMuscular} kg</p>
                    </div>

                    {/* Grasa Corporal */}
                    <div className="bg-white/5 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400 text-sm">Grasa Corporal</span>
                        {cambioGrasa && (
                          <span className={`text-xs font-semibold ${parseFloat(cambioGrasa) < 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {cambioGrasa}%
                          </span>
                        )}
                      </div>
                      <p className="text-orange-400 text-2xl font-bold">{mes.grasaCorporal}%</p>
                    </div>

                    {/* Botón */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleVerDetalle(mes)}
                      className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                    >
                      Ver Detalle Completo
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
        </div>

        {/* Sin resultados */}
        {(añoSeleccionado === 'todos' ? progresoMeses : mesesFiltrados).length === 0 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-400 text-lg">No hay mediciones para este año</p>
            <p className="text-gray-500 text-sm mt-2">Selecciona otro año para ver tu progreso</p>
          </div>
        )}

        {/* Mi Objetivo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 backdrop-blur-xl rounded-xl p-6"
        >
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-blue-500 rounded-xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-1">Mi Objetivo</h3>
              <p className="text-cyan-400 text-lg">Ganancia muscular</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Fecha de inicio</p>
              <p className="text-white font-semibold">15 Septiembre 2023</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal de Detalle */}
      <AnimatePresence>
        {showModal && mesSeleccionado && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={handleCerrarModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/30 p-8 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">{mesSeleccionado.mes}</h3>
                  <p className="text-gray-400">{mesSeleccionado.fecha}</p>
                </div>
                <button
                  onClick={handleCerrarModal}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Métricas Principales */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 p-6 rounded-xl text-center shadow-inner">
                  <p className="text-gray-400 text-sm mb-2">Peso</p>
                  <p className="text-white text-3xl font-bold">{mesSeleccionado.peso} kg</p>
                </div>
                <div className="bg-white/5 p-6 rounded-xl text-center">
                  <p className="text-gray-400 text-sm mb-2">Masa Muscular</p>
                  <p className="text-green-400 text-3xl font-bold">{mesSeleccionado.masaMuscular} kg</p>
                </div>
                <div className="bg-white/5 p-6 rounded-xl text-center">
                  <p className="text-gray-400 text-sm mb-2">Grasa Corporal</p>
                  <p className="text-orange-400 text-3xl font-bold">{mesSeleccionado.grasaCorporal}%</p>
                </div>
              </div>

              {/* Medidas Corporales */}
              <div className="bg-white/5 p-6 rounded-xl">
                <h4 className="text-lg font-bold text-white mb-4">Medidas Corporales (cm)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-1">Pecho</p>
                    <p className="text-cyan-400 font-bold text-xl">{mesSeleccionado.medidas.pecho} cm</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-1">Brazos</p>
                    <p className="text-cyan-400 font-bold text-xl">{mesSeleccionado.medidas.brazos} cm</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-1">Cintura</p>
                    <p className="text-cyan-400 font-bold text-xl">{mesSeleccionado.medidas.cintura} cm</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm mb-1">Piernas</p>
                    <p className="text-cyan-400 font-bold text-xl">{mesSeleccionado.medidas.piernas} cm</p>
                  </div>
                </div>
              </div>

              {/* Botón Cerrar */}
              <div className="mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCerrarModal}
                  className="w-full py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Cerrar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClienteProgreso;