import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const ClienteDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(`/api/member/dashboard/${user.id}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { profile, stats, medidas, medidasIniciales, rutinaActual } = data || {};
  const pesoDiff = (stats?.pesoActual - stats?.pesoInicial).toFixed(1);
  const grasaDiff = (stats?.grasaActual - stats?.grasaInicial).toFixed(1);
  const masaDiff = (stats?.masaActual - stats?.masaInicial).toFixed(1);
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Bienvenida */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">¡Hola, {profile?.nombre.split(' ')[0]}! 👋</h1>
          <p className="text-gray-400">Aquí está tu resumen de entrenamiento</p>
        </div>

        {/* Estadísticas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Peso Actual</p>
              <div className="p-2 bg-blue-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
            </div>
            <p className="text-white text-3xl font-bold">{stats?.pesoActual || 0} kg</p>
            <p className={`${stats?.pesoActual > stats?.pesoInicial ? 'text-green-400' : 'text-blue-400'} text-sm mt-2`}>
              {pesoDiff > 0 ? `+${pesoDiff}` : pesoDiff} kg desde inicio
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-white/30 p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Sesiones Este Mes</p>
              <div className="p-2 bg-green-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-white text-3xl font-bold">{stats?.sesionesTotal || 0}</p>
            <p className="text-cyan-400 text-sm mt-2">{stats?.sesionesSemana || 0} esta semana</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-white/30 p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Masa Muscular</p>
              <div className="p-2 bg-purple-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-white text-3xl font-bold">{stats?.masaActual || 0} kg</p>
            <p className="text-green-400 text-sm mt-2">{masaDiff > 0 ? `+${masaDiff}` : masaDiff} kg</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Grasa Corporal</p>
              <div className="p-2 bg-orange-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
            <p className="text-white text-3xl font-bold">{stats?.grasaActual || 0}%</p>
            <p className="text-green-400 text-sm mt-2">{grasaDiff > 0 ? `+${grasaDiff}` : grasaDiff}% reducción</p>
          </motion.div>
        </div>

        {/* Medidas Corporales y Rutina Actual */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Medidas Corporales */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Medidas Corporales</h3>
            <div className="space-y-4">
              {[
                { label: 'Pecho', initial: medidasIniciales?.pechoActual || 0, current: medidas?.pechoActual || 0 },
                { label: 'Brazos', initial: medidasIniciales?.brazosActual || 0, current: medidas?.brazosActual || 0 },
                { label: 'Cintura', initial: medidasIniciales?.cinturaActual || 0, current: medidas?.cinturaActual || 0 },
                { label: 'Piernas', initial: medidasIniciales?.piernasActual || 0, current: medidas?.piernasActual || 0 }
              ].map((m, idx) => (
                <div key={idx} className="bg-white/5 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm mb-3">{m.label}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">{m.initial} cm</span>
                    <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span className="text-cyan-400 font-bold text-lg">{m.current} cm</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Rutina Actual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-white/30 p-6 shadow-xl"
          >
            <h3 className="text-xl font-bold text-white mb-4">Mi Rutina Actual</h3>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-xl p-6">
              {rutinaActual ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white text-2xl font-bold">{rutinaActual.nombre}</p>
                      <p className="text-purple-400 text-sm">Categoría: {rutinaActual.categoria}</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    {rutinaActual.ejercicios.slice(0, 5).map((e, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300 text-sm">{e.nombre}</span>
                        <span className="text-white font-medium">{e.series}x{e.repeticiones}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No tienes una rutina activa asignada.</p>
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/cliente/rutinas')}
                className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
              >
                Ver Rutina Completa
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ClienteDashboard;