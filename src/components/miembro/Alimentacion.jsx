import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../../context/AuthContext';

const ClienteAlimentacion = () => {
  const { user } = useContext(AuthContext);
  const [diaSeleccionado, setDiaSeleccionado] = useState('lunes');
  const [showModal, setShowModal] = useState(false);
  const [comidaSeleccionada, setComidaSeleccionada] = useState(null);
  const [planAlimentacion, setPlanAlimentacion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNutrition = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/member/nutrition/${user.id}`);
        const result = await response.json();

        if (result && result.comidas) {
          // Add icons and colors to the meals if they are missing
          const mealsWithAssets = result.comidas.map(comida => {
            let assets = {
              icono: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              color: 'from-blue-500 to-cyan-500'
            };

            const nombre = comida.nombre.toLowerCase();
            if (nombre.includes('desayuno')) {
              assets = {
                icono: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                color: 'from-yellow-500 to-orange-500'
              };
            } else if (nombre.includes('mañana') || nombre.includes('snack')) {
              assets = {
                icono: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: 'from-green-500 to-emerald-500'
              };
            } else if (nombre.includes('almuerzo') || nombre.includes('comida')) {
              assets = {
                icono: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                color: 'from-red-500 to-pink-500'
              };
            } else if (nombre.includes('merienda') || nombre.includes('tarde')) {
              assets = {
                icono: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: 'from-purple-500 to-indigo-500'
              };
            } else if (nombre.includes('cena')) {
              assets = {
                icono: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ),
                color: 'from-blue-500 to-cyan-500'
              };
            }

            return { ...comida, ...assets };
          });
          setPlanAlimentacion({ ...result, comidas: mealsWithAssets });
        }
      } catch (error) {
        console.error('Error fetching nutrition plan:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNutrition();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!planAlimentacion) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-12 max-w-lg">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-2">Sin Plan de Alimentación</h2>
          <p className="text-gray-400">Tu coach aún no ha asignado un plan nutricional para ti. ¡Consulta con tu coach próximamente!</p>
        </div>
      </div>
    );
  }

  const handleVerDetalle = (comida) => {
    setComidaSeleccionada(comida);
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setComidaSeleccionada(null);
  };

  const calcularTotalesComida = (comida) => {
    return comida.alimentos.reduce((totales, alimento) => ({
      calorias: totales.calorias + alimento.calorias,
      proteinas: totales.proteinas + alimento.proteinas,
      carbohidratos: totales.carbohidratos + alimento.carbohidratos,
      grasas: totales.grasas + alimento.grasas
    }), { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });
  };

  const calcularProgreso = (consumido, objetivo) => {
    return Math.min((consumido / objetivo * 100), 100);
  };

  // Totales consumidos (ejemplo - en producción vendría del usuario)
  const totalesConsumidos = {
    calorias: 2850,
    proteinas: 175,
    carbohidratos: 340,
    grasas: 75
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Plan de Alimentación</h1>
          <p className="text-gray-400">Plan nutricional personalizado por tu coach</p>
        </div>

        {/* Información del Plan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
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
            <p className="text-white text-xl font-bold">{planAlimentacion.coach}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Objetivo</p>
              <div className="p-2 bg-blue-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <p className="text-white text-xl font-bold">{planAlimentacion.objetivo}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Asignado</p>
              <div className="p-2 bg-green-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-white text-xl font-bold">{planAlimentacion.fechaAsignacion}</p>
          </motion.div>
        </div>

        {/* Macronutrientes Diarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Macronutrientes Objetivo Diario</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Calorías */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Calorías</span>
                <span className="text-white font-semibold">{totalesConsumidos.calorias} / {planAlimentacion.macronutrientes.calorias}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${calcularProgreso(totalesConsumidos.calorias, planAlimentacion.macronutrientes.calorias)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400">{calcularProgreso(totalesConsumidos.calorias, planAlimentacion.macronutrientes.calorias).toFixed(0)}% completado</p>
            </div>

            {/* Proteínas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Proteínas</span>
                <span className="text-white font-semibold">{totalesConsumidos.proteinas}g / {planAlimentacion.macronutrientes.proteinas}g</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${calcularProgreso(totalesConsumidos.proteinas, planAlimentacion.macronutrientes.proteinas)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400">{calcularProgreso(totalesConsumidos.proteinas, planAlimentacion.macronutrientes.proteinas).toFixed(0)}% completado</p>
            </div>

            {/* Carbohidratos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Carbohidratos</span>
                <span className="text-white font-semibold">{totalesConsumidos.carbohidratos}g / {planAlimentacion.macronutrientes.carbohidratos}g</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${calcularProgreso(totalesConsumidos.carbohidratos, planAlimentacion.macronutrientes.carbohidratos)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400">{calcularProgreso(totalesConsumidos.carbohidratos, planAlimentacion.macronutrientes.carbohidratos).toFixed(0)}% completado</p>
            </div>

            {/* Grasas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Grasas</span>
                <span className="text-white font-semibold">{totalesConsumidos.grasas}g / {planAlimentacion.macronutrientes.grasas}g</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${calcularProgreso(totalesConsumidos.grasas, planAlimentacion.macronutrientes.grasas)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400">{calcularProgreso(totalesConsumidos.grasas, planAlimentacion.macronutrientes.grasas).toFixed(0)}% completado</p>
            </div>
          </div>
        </motion.div>

        {/* Comidas del Día */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Plan de Comidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {planAlimentacion.comidas.map((comida, index) => {
              const totales = calcularTotalesComida(comida);
              return (
                <motion.div
                  key={comida.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer"
                  onClick={() => handleVerDetalle(comida)}
                >
                  {/* Header */}
                  <div className={`bg-gradient-to-r ${comida.color} p-4`}>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        {comida.icono}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg">{comida.nombre}</h3>
                        <p className="text-white/80 text-sm">{comida.horario}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="p-6">
                    {/* Macros totales */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/5 p-3 rounded-lg text-center">
                        <p className="text-gray-400 text-xs mb-1">Calorías</p>
                        <p className="text-white font-bold">{totales.calorias}</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg text-center">
                        <p className="text-gray-400 text-xs mb-1">Proteínas</p>
                        <p className="text-white font-bold">{totales.proteinas}g</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg text-center">
                        <p className="text-gray-400 text-xs mb-1">Carbos</p>
                        <p className="text-white font-bold">{totales.carbohidratos}g</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg text-center">
                        <p className="text-gray-400 text-xs mb-1">Grasas</p>
                        <p className="text-white font-bold">{totales.grasas}g</p>
                      </div>
                    </div>

                    {/* Lista de alimentos */}
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-400 text-sm font-semibold mb-2">Alimentos:</p>
                      {comida.alimentos.slice(0, 3).map((alimento, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                          <p className="text-gray-300 text-sm">{alimento.nombre}</p>
                        </div>
                      ))}
                      {comida.alimentos.length > 3 && (
                        <p className="text-gray-400 text-xs">+{comida.alimentos.length - 3} más...</p>
                      )}
                    </div>

                    {/* Botón */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleVerDetalle(comida)}
                      className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                    >
                      Ver Detalle
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Notas del Coach */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/50 backdrop-blur-xl rounded-xl p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">Notas de tu Coach</h3>
              <p className="text-gray-300 mb-3">{planAlimentacion.notas}</p>
            </div>
          </div>
        </motion.div>

        {/* Recomendaciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Recomendaciones Generales</h3>
          <div className="space-y-3">
            {planAlimentacion.recomendaciones.map((recomendacion, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="p-1 bg-green-500/20 rounded-lg mt-0.5">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-300 text-sm flex-1">{recomendacion}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modal de Detalle de Comida */}
      <AnimatePresence>
        {showModal && comidaSeleccionada && (
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
                <div className="flex items-center space-x-3">
                  <div className={`p-3 bg-gradient-to-r ${comidaSeleccionada.color} rounded-xl`}>
                    {comidaSeleccionada.icono}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{comidaSeleccionada.nombre}</h3>
                    <p className="text-gray-400">{comidaSeleccionada.horario}</p>
                  </div>
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

              {/* Totales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <p className="text-gray-400 text-sm mb-1">Calorías Totales</p>
                  <p className="text-white text-2xl font-bold">{calcularTotalesComida(comidaSeleccionada).calorias}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <p className="text-gray-400 text-sm mb-1">Proteínas</p>
                  <p className="text-red-400 text-2xl font-bold">{calcularTotalesComida(comidaSeleccionada).proteinas}g</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <p className="text-gray-400 text-sm mb-1">Carbohidratos</p>
                  <p className="text-green-400 text-2xl font-bold">{calcularTotalesComida(comidaSeleccionada).carbohidratos}g</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl text-center">
                  <p className="text-gray-400 text-sm mb-1">Grasas</p>
                  <p className="text-purple-400 text-2xl font-bold">{calcularTotalesComida(comidaSeleccionada).grasas}g</p>
                </div>
              </div>

              {/* Lista detallada de alimentos */}
              <div className="bg-white/5 p-6 rounded-xl">
                <h4 className="text-lg font-bold text-white mb-4">Alimentos Detallados</h4>
                <div className="space-y-4">
                  {comidaSeleccionada.alimentos.map((alimento, index) => (
                    <div key={index} className="bg-white/10 p-4 rounded-lg border border-white/20 shadow-inner">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-white font-semibold">{alimento.nombre}</h5>
                        <span className="text-gray-400 text-sm">{alimento.cantidad}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Cal</p>
                          <p className="text-white text-sm font-medium">{alimento.calorias}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Prot</p>
                          <p className="text-red-400 text-sm font-medium">{alimento.proteinas}g</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Carb</p>
                          <p className="text-green-400 text-sm font-medium">{alimento.carbohidratos}g</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs mb-1">Gras</p>
                          <p className="text-purple-400 text-sm font-medium">{alimento.grasas}g</p>
                        </div>
                      </div>
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

export default ClienteAlimentacion;