import React from 'react';
import { motion } from 'framer-motion';

const DashboardContent = () => {
  const [stats, setStats] = React.useState({
    activeMembers: 0,
    attendanceToday: 0,
    totalRevenue: 0,
    expiringSoon: 0
  });
  const [recentData, setRecentData] = React.useState({
    recentAttendance: [],
    upcomingExpirations: []
  });

  React.useEffect(() => {
    // Fetch stats
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error(err));

    // Fetch recent activity
    fetch('/api/dashboard/recent')
      .then(res => res.json())
      .then(data => setRecentData(data))
      .catch(err => console.error(err));
  }, []);

  // Componente para las estadísticas
  const StatCard = ({ title, value, icon, color, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-semibold ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-white text-2xl font-bold">{value}</p>
    </motion.div>
  );

  return (
    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
      <div className="space-y-6">
        {/* Título */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Bienvenido al panel de recepción</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Miembros Activos"
            value={stats.activeMembers}
            trend={12}
            color="bg-cyan-500"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatCard
            title="Asistencias Hoy"
            value={stats.attendanceToday}
            trend={8}
            color="bg-green-500"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Pagos del Mes"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            trend={15}
            color="bg-gradient-to-br from-purple-500 to-pink-500"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Membresías Vencen"
            value={stats.expiringSoon}
            trend={-5}
            color="bg-gradient-to-br from-orange-500 to-red-500"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Actividad Reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Últimas Asistencias */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Últimas Asistencias</h3>
            <div className="space-y-3">
              {recentData.recentAttendance.length > 0 ? (
                recentData.recentAttendance.map((asistencia, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {asistencia.nombre?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{asistencia.nombre}</p>
                        <p className="text-gray-400 text-sm">ID: {asistencia.codigo_miembro || asistencia.member_id}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">{asistencia.horaEntrada}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No hay asistencias recientes</p>
              )}
            </div>
          </motion.div>

          {/* Pagos Pendientes / Próximos Vencimientos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Próximos Vencimientos</h3>
            <div className="space-y-3">
              {recentData.upcomingExpirations.length > 0 ? (
                recentData.upcomingExpirations.map((pago, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {pago.nombre?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{pago.nombre}</p>
                        <p className="text-gray-400 text-sm">Vence: {new Date(pago.fechaVencimiento).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-cyan-400 font-semibold">{pago.tipoMembresia}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">Sin vencimientos próximos</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;