import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../../context/AuthContext';

const ClienteRutinas = () => {
  const { user } = useContext(AuthContext);
  const [selectedRutina, setSelectedRutina] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rutinas, setRutinas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRoutines = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/member/routines/${user.id}`);
        const result = await response.json();
        // The API returns routines with exercies. We assume active if they appear here for now.
        // In a more complex setup we could have an 'activa' field in the DB.
        setRutinas(result.map(r => ({
          ...r,
          activa: true, // For now, all fetched assigned routines are treated as active
          coach: 'Tu Coach', // We could fetch coach name too if needed
          fechaAsignacion: 'Asignada recientemente'
        })));
      } catch (error) {
        console.error('Error fetching routines:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoutines();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleVerDetalle = (rutina) => {
    setSelectedRutina(rutina);
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setSelectedRutina(null);
  };

  const getCategoriaTexto = (categoria) => {
    switch (categoria) {
      case 'fuerza':
        return 'Fuerza';
      case 'cardio':
        return 'Cardio';
      case 'funcional':
        return 'Funcional';
      case 'hiit':
        return 'HIIT';
      default:
        return categoria;
    }
  };

  const getCategoriaColor = (categoria) => {
    switch (categoria) {
      case 'fuerza':
        return 'from-red-500 to-orange-500';
      case 'cardio':
        return 'from-blue-500 to-cyan-500';
      case 'funcional':
        return 'from-purple-500 to-pink-500';
      case 'hiit':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const rutinasActivas = rutinas.filter(r => r.activa);
  const rutinasInactivas = rutinas.filter(r => !r.activa);

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mis Rutinas</h1>
          <p className="text-gray-400">Planes de entrenamiento asignados por tu coach</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total Rutinas</p>
              <div className="p-2 bg-blue-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-white text-3xl font-bold">{rutinas.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Rutinas Activas</p>
              <div className="p-2 bg-green-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-white text-3xl font-bold">{rutinasActivas.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Mi Coach</p>
              <div className="p-2 bg-purple-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <p className="text-white text-xl font-bold">Carlos Mendoza</p>
          </motion.div>
        </div>

        {/* Rutinas Activas */}
        {rutinasActivas.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Rutinas Activas</h2>
              <span className="text-green-400 text-sm font-semibold">{rutinasActivas.length} activas</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rutinasActivas.map((rutina, index) => (
                <motion.div
                  key={rutina.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer"
                  onClick={() => handleVerDetalle(rutina)}
                >
                  {/* Header de la tarjeta */}
                  <div className={`h-2 bg-gradient-to-r ${getCategoriaColor(rutina.categoria)}`}></div>

                  <div className="p-6">
                    {/* Título y categoría */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1">{rutina.nombre}</h3>
                        <span className={`inline-block px-3 py-1 bg-gradient-to-r ${getCategoriaColor(rutina.categoria)} text-white text-xs font-semibold rounded-full`}>
                          {getCategoriaTexto(rutina.categoria)}
                        </span>
                      </div>
                      <div className="p-2 bg-green-500/20 rounded-lg">
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className="text-gray-400 text-sm mb-4">{rutina.descripcion}</p>

                    {/* Información */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Coach:</span>
                        <span className="text-white font-medium">{rutina.coach}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Duración:</span>
                        <span className="text-white font-medium">{rutina.duracion}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Ejercicios:</span>
                        <span className="text-cyan-400 font-semibold">{rutina.ejercicios.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Asignada:</span>
                        <span className="text-white font-medium">{rutina.fechaAsignacion}</span>
                      </div>
                    </div>

                    {/* Botón */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleVerDetalle(rutina)}
                      className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                    >
                      Ver Rutina Completa
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Rutinas Inactivas */}
        {rutinasInactivas.length > 0 && (
          <>
            <div className="flex items-center justify-between mt-8">
              <h2 className="text-2xl font-bold text-white">Rutinas Anteriores</h2>
              <span className="text-gray-400 text-sm font-semibold">{rutinasInactivas.length} rutinas</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rutinasInactivas.map((rutina, index) => (
                <motion.div
                  key={rutina.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden hover:shadow-lg hover:shadow-gray-500/20 transition-all duration-300 cursor-pointer opacity-75"
                  onClick={() => handleVerDetalle(rutina)}
                >
                  {/* Header de la tarjeta */}
                  <div className={`h-2 bg-gradient-to-r ${getCategoriaColor(rutina.categoria)} opacity-50`}></div>

                  <div className="p-6">
                    {/* Título y categoría */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1">{rutina.nombre}</h3>
                        <span className={`inline-block px-3 py-1 bg-gradient-to-r ${getCategoriaColor(rutina.categoria)} text-white text-xs font-semibold rounded-full opacity-50`}>
                          {getCategoriaTexto(rutina.categoria)}
                        </span>
                      </div>
                      <div className="p-2 bg-gray-500/20 rounded-lg">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className="text-gray-400 text-sm mb-4">{rutina.descripcion}</p>

                    {/* Información */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Duración:</span>
                        <span className="text-white font-medium">{rutina.duracion}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Ejercicios:</span>
                        <span className="text-gray-300 font-semibold">{rutina.ejercicios.length}</span>
                      </div>
                    </div>

                    {/* Botón */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleVerDetalle(rutina)}
                      className="w-full py-2 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
                    >
                      Ver Rutina
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal de Detalle de Rutina */}
      <AnimatePresence>
        {showModal && selectedRutina && (
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
              className="bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-white/30 p-8 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-2xl font-bold text-white">{selectedRutina.nombre}</h3>
                    {selectedRutina.activa && (
                      <span className="px-3 py-1 bg-green-500/20 border border-green-500/50 text-green-400 text-xs font-semibold rounded-full">
                        Activa
                      </span>
                    )}
                  </div>
                  <span className={`inline-block px-3 py-1 bg-gradient-to-r ${getCategoriaColor(selectedRutina.categoria)} text-white text-sm font-semibold rounded-full`}>
                    {getCategoriaTexto(selectedRutina.categoria)}
                  </span>
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

              {/* Descripción */}
              <div className="bg-white/5 p-4 rounded-lg mb-6">
                <p className="text-gray-300">{selectedRutina.descripcion}</p>
              </div>

              {/* Información General */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/10 p-4 rounded-lg text-center shadow-inner">
                  <p className="text-gray-400 text-sm mb-1">Coach</p>
                  <p className="text-white font-bold">{selectedRutina.coach}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg text-center shadow-inner">
                  <p className="text-gray-400 text-sm mb-1">Duración</p>
                  <p className="text-white font-bold">{selectedRutina.duracion}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg text-center shadow-inner">
                  <p className="text-gray-400 text-sm mb-1">Ejercicios</p>
                  <p className="text-cyan-400 font-bold text-lg">{selectedRutina.ejercicios.length}</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg text-center shadow-inner">
                  <p className="text-gray-400 text-sm mb-1">Asignada</p>
                  <p className="text-white font-bold text-sm">{selectedRutina.fechaAsignacion}</p>
                </div>
              </div>

              {/* Lista de Ejercicios */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4">Ejercicios</h4>
                <div className="space-y-3">
                  {selectedRutina.ejercicios.map((ejercicio, index) => (
                    <div key={index} className="bg-white/10 p-5 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-inner">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-white font-semibold text-lg">
                          {index + 1}. {ejercicio.nombre}
                        </h5>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Series</p>
                          <p className="text-white font-medium">{ejercicio.series}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Repeticiones</p>
                          <p className="text-white font-medium">{ejercicio.repeticiones}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Descanso</p>
                          <p className="text-white font-medium">{ejercicio.descanso}</p>
                        </div>
                      </div>
                      {ejercicio.notas && (
                        <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                          <p className="text-blue-300 text-sm">
                            <span className="font-semibold">Nota:</span> {ejercicio.notas}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
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

export default ClienteRutinas;