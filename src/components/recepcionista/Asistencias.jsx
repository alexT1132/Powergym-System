import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Asistencias = () => {
  const [memberId, setMemberId] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const [miembros, setMiembros] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFecha, setFilterFecha] = useState('hoy');

  const [asistencias, setAsistencias] = useState([]);

  const handleRegistrarAsistencia = async (idToRegister) => {
    if (typeof idToRegister !== 'string') {
      idToRegister = memberId; // fallback for form submit
    }
    if (!idToRegister || !idToRegister.trim()) {
      setMensaje('Por favor ingresa un ID válido');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId: idToRegister })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'error registrando');
      setMensaje('¡Asistencia registrada exitosamente!');
      setMemberId('');
      await cargarAsistencias();
    } catch (err) {
      setMensaje(err.message);
    } finally {
      setIsLoading(false);
      setTimeout(() => setMensaje(''), 3000);
    }
  };

  const cargarAsistencias = async () => {
    try {
      const res = await fetch('/api/attendance');
      const data = await res.json();
      if (res.ok) {
        setAsistencias(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const cargarMiembros = async () => {
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      if (res.ok) {
        setMiembros(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  React.useEffect(() => {
    cargarAsistencias();
    cargarMiembros();
  }, []);

  // Filtrar miembros para busqueda rapida
  const miembrosBusqueda = memberSearch.trim() === ''
    ? miembros.slice(0, 10) // Mostrar últimos 10 miembros por defecto
    : miembros.filter(m =>
      String(m.nombre || '').toLowerCase().includes(memberSearch.toLowerCase()) ||
      String(m.codigo_miembro || m.id).includes(memberSearch)
    ).slice(0, 10);

  // Filtrar asistencias
  const asistenciasFiltradas = asistencias.filter((asistencia) => {
    const matchSearch = String(asistencia.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(asistencia.member_id || '').includes(searchTerm) ||
      String(asistencia.codigo_miembro || '').includes(searchTerm);

    // Ajustamos la fecha que viene del backend a formato local año-mes-dia asumiendo que es date
    const fechaAsistencia = asistencia.fecha ? new Date(asistencia.fecha).toISOString().split('T')[0] : '';
    const hoy = new Date().toISOString().split('T')[0];
    const ayer = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let matchFilter = true;
    if (filterFecha === 'hoy') {
      matchFilter = fechaAsistencia === hoy;
    } else if (filterFecha === 'ayer') {
      matchFilter = fechaAsistencia === ayer;
    }

    // Le agregamos la fecha formateada para el render visual posterior
    asistencia.fechaVisual = fechaAsistencia;

    return matchSearch && matchFilter;
  });

  return (
    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Asistencias</h1>
          <p className="text-gray-400">Registro y control de asistencias del gimnasio</p>
        </div>

        {/* Formulario de Registro Rápido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">Registro Rápido de Asistencia</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Buscar Miembro (Nombre o ID)
              </label>
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => { setMemberSearch(e.target.value); setMemberId(e.target.value); }}
                placeholder="Ej: Juan Pérez o 001"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Resultados Rápidos */}
            {miembros.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-lg p-2 space-y-2 mt-2 max-h-64 overflow-y-auto">
                {miembrosBusqueda.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 hover:bg-white/10 rounded-lg transition-colors">
                    <div>
                      <p className="text-white font-medium">{m.nombre}</p>
                      <p className="text-gray-400 text-sm">ID: {m.codigo_miembro || m.id}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setMemberSearch(''); handleRegistrarAsistencia((m.codigo_miembro || m.id).toString()); }}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300"
                    >
                      Asistencia
                    </motion.button>
                  </div>
                ))}
                {miembrosBusqueda.length === 0 && memberSearch.trim() !== '' && (
                  <p className="text-gray-400 text-sm mt-2 text-center p-2">No se encontraron miembros para "{memberSearch}"</p>
                )}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleRegistrarAsistencia(memberId); }} className="pt-2">
              {/* Mensaje de Estado */}
              {mensaje && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg mb-4 ${mensaje.includes('exitosamente')
                    ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                    : 'bg-red-500/20 border border-red-500/50 text-red-300'
                    }`}
                >
                  <p className="text-sm font-medium text-center">{mensaje}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isLoading || !memberId}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  'Registrar Asistencia Manual'
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Asistencias Hoy</p>
                <p className="text-white text-3xl font-bold">
                  {asistencias.filter(a => (a.fecha ? new Date(a.fecha).toISOString().split('T')[0] : '') === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
              <div className="p-3 bg-green-500 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Activos Ahora</p>
                <p className="text-white text-3xl font-bold">
                  {asistencias.filter(a => !a.horaSalida && (a.fecha ? new Date(a.fecha).toISOString().split('T')[0] : '') === new Date().toISOString().split('T')[0]).length}
                </p>
              </div>
              <div className="p-3 bg-blue-500 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Esta Semana</p>
                <p className="text-white text-3xl font-bold">124</p>
              </div>
              <div className="p-3 bg-purple-500 rounded-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Buscar
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre o ID..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Filtro por Fecha */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filtrar por Fecha
              </label>
              <select
                value={filterFecha}
                onChange={(e) => setFilterFecha(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="hoy" className="bg-slate-800">Hoy</option>
                <option value="ayer" className="bg-slate-800">Ayer</option>
                <option value="todos" className="bg-slate-800">Todos</option>
              </select>
            </div>
          </div>

          {/* Resultados */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Mostrando <span className="text-white font-semibold">{asistenciasFiltradas.length}</span> asistencias
            </p>
          </div>
        </div>

        {/* Tabla de Asistencias */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden">
          {/* Desktop View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Miembro
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Hora Entrada
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {asistenciasFiltradas.map((asistencia, index) => (
                  <motion.tr
                    key={asistencia.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{asistencia.avatar}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{asistencia.nombre}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-300">{asistencia.codigo_miembro || asistencia.member_id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-300">{asistencia.fechaVisual || asistencia.fecha}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white font-medium">{asistencia.horaEntrada}</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden divide-y divide-white/10">
            {asistenciasFiltradas.map((asistencia, index) => (
              <motion.div
                key={asistencia.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">{asistencia.avatar}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{asistencia.nombre}</p>
                      <p className="text-gray-400 text-sm">ID: {asistencia.codigo_miembro || asistencia.member_id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Fecha:</span>
                    <span className="text-white">{asistencia.fechaVisual || asistencia.fecha}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Hora de Entrada:</span>
                    <span className="text-white font-medium">{asistencia.horaEntrada}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sin resultados */}
          {asistenciasFiltradas.length === 0 && (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-400 text-lg">No se encontraron asistencias</p>
              <p className="text-gray-500 text-sm mt-2">Intenta con otros filtros de búsqueda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Asistencias;