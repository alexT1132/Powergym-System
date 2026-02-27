import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CoachClientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('todos');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clienteAEliminar, setClienteAEliminar] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipoMembresia: 'mensual'
  });

  // Datos reales de la DB
  const [clientes, setClientes] = useState([]);

  const fetchClientes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/coach/progress');
      const data = await res.json();
      if (res.ok) {
        setClientes(data);
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchClientes();
  }, []);

  // Filtrar clientes
  const clientesFiltrados = clientes.filter((cliente) => {
    const matchSearch = cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterCategoria === 'todos' || cliente.categoria === filterCategoria;
    return matchSearch && matchFilter;
  });

  const handleVerProgreso = (cliente) => {
    setSelectedCliente(cliente);
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setSelectedCliente(null);
  };

  const handleAbrirModalEliminar = (cliente) => {
    setClienteAEliminar(cliente);
    setShowDeleteModal(true);
  };

  const handleCerrarModalEliminar = () => {
    setShowDeleteModal(false);
    setClienteAEliminar(null);
  };

  const handleEliminarCliente = async () => {
    if (clienteAEliminar) {
      try {
        const res = await fetch(`/api/members/${clienteAEliminar.id}`, { method: 'DELETE' });
        if (res.ok) {
          setClientes(clientes.filter(c => c.id !== clienteAEliminar.id));
        }
      } catch (err) {
        console.error(err);
      }
      handleCerrarModalEliminar();
    }
  };

  const handleAbrirNuevo = () => {
    setFormData({ nombre: '', email: '', telefono: '', tipoMembresia: 'mensual' });
    setShowAddModal(true);
  };

  const handleGuardarCliente = async () => {
    if (!formData.nombre || !formData.email) {
      alert("Por favor rellena los campos obligatorios");
      return;
    }

    try {
      const price = formData.tipoMembresia === 'mensual' ? 1000 : (formData.tipoMembresia === 'semanal' ? 300 : 50);
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          precio: price,
          password: 'password123' // default pass
        })
      });

      if (res.ok) {
        // Reload to get updated list with all joins
        await fetchClientes();
        setShowAddModal(false);
        setFormData({ nombre: '', email: '', telefono: '', tipoMembresia: 'mensual' });
      } else {
        const errorData = await res.json();
        alert("Error al registrar cliente: " + (errorData.error || "Error desconocido"));
      }
    } catch (err) {
      console.error("Error guardando:", err);
      alert("Error de conexión con el servidor");
    }
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

  const calcularProgresoPeso = (progreso) => {
    if (progreso.peso.length < 2) return 0;
    const inicial = progreso.peso[0].valor;
    const actual = progreso.peso[progreso.peso.length - 1].valor;
    return ((actual - inicial) / inicial * 100).toFixed(1);
  };

  const calcularProgresoGrasa = (progreso) => {
    if (progreso.grasaCorporal.length < 2) return 0;
    const inicial = progreso.grasaCorporal[0].valor;
    const actual = progreso.grasaCorporal[progreso.grasaCorporal.length - 1].valor;
    return ((actual - inicial) / inicial * 100).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse text-center">
          <svg className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cargando Clientes...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mis Clientes</h1>
            <p className="text-gray-400">Gestiona y monitorea el progreso de tus clientes</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAbrirNuevo}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nuevo Cliente</span>
          </motion.button>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Buscar Cliente
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
                  placeholder="Buscar por nombre..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Filtro por Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Categoría
              </label>
              <select
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="todos" className="bg-slate-800">Todos</option>
                <option value="fuerza" className="bg-slate-800">Fuerza</option>
                <option value="cardio" className="bg-slate-800">Cardio</option>
                <option value="funcional" className="bg-slate-800">Funcional</option>
                <option value="hiit" className="bg-slate-800">HIIT</option>
              </select>
            </div>
          </div>

          {/* Resultados */}
          <div className="mt-4">
            <p className="text-gray-400 text-sm">
              Mostrando <span className="text-white font-semibold">{clientesFiltrados.length}</span> clientes
            </p>
          </div>
        </div>

        {/* Tabla de Clientes */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden">
          {/* Desktop View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Edad
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Objetivo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {clientesFiltrados.map((cliente, index) => (
                  <motion.tr
                    key={cliente.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => handleVerProgreso(cliente)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${getCategoriaColor(cliente.categoria)} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-semibold">{cliente.avatar}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{cliente.nombre}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-300">{cliente.edad} años</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white">{getCategoriaTexto(cliente.categoria)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300">{cliente.objetivo}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAbrirModalEliminar(cliente);
                        }}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Eliminar cliente"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden divide-y divide-white/10">
            {clientesFiltrados.map((cliente, index) => (
              <motion.div
                key={cliente.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 hover:bg-white/5 transition-colors"
                onClick={() => handleVerProgreso(cliente)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getCategoriaColor(cliente.categoria)} rounded-full flex items-center justify-center`}>
                      <span className="text-white font-semibold text-lg">{cliente.avatar}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{cliente.nombre}</p>
                      <p className="text-gray-400 text-sm">{cliente.edad} años</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAbrirModalEliminar(cliente);
                    }}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Categoría:</span>
                    <span className="text-white font-medium">{getCategoriaTexto(cliente.categoria)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Objetivo:</span>
                    <span className="text-white font-medium">{cliente.objetivo}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sin resultados */}
          {clientesFiltrados.length === 0 && (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-400 text-lg">No se encontraron clientes</p>
              <p className="text-gray-500 text-sm mt-2">Intenta con otros filtros de búsqueda</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      <AnimatePresence>
        {showDeleteModal && clienteAEliminar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={handleCerrarModalEliminar}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl max-w-md w-full"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 mb-4">
                  <svg className="h-6 w-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Eliminar Cliente</h3>
                <p className="text-gray-400 mb-6">
                  ¿Estás seguro de que deseas eliminar a <span className="text-white font-semibold">{clienteAEliminar.nombre}</span>? Esta acción no se puede deshacer.
                </p>
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCerrarModalEliminar}
                    className="flex-1 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEliminarCliente}
                    className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300"
                  >
                    Eliminar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Progreso Detallado */}
      <AnimatePresence>
        {showModal && selectedCliente && (
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
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header del Modal */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getCategoriaColor(selectedCliente.categoria)} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-bold text-2xl">{selectedCliente.avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedCliente.nombre}</h3>
                    <p className="text-gray-400">{selectedCliente.edad} años • {getCategoriaTexto(selectedCliente.categoria)}</p>
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

              {/* Información General */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Objetivo</p>
                  <p className="text-white font-semibold">{selectedCliente.objetivo}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Fecha de Inicio</p>
                  <p className="text-white font-semibold">{selectedCliente.fechaInicio}</p>
                </div>
              </div>

              {/* Progreso de Métricas */}
              <div className="space-y-6">
                <h4 className="text-xl font-bold text-white">Progreso de Métricas</h4>

                {/* Peso */}
                <div className="bg-white/5 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-lg font-semibold text-white">Peso Corporal (kg)</h5>
                    <span className={`text-sm font-semibold ${parseFloat(calcularProgresoPeso(selectedCliente.progreso)) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {calcularProgresoPeso(selectedCliente.progreso)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedCliente.progreso.peso.map((registro, index) => (
                      <div key={index} className="bg-white/5 p-3 rounded-lg text-center">
                        <p className="text-gray-400 text-xs mb-1">{registro.fecha}</p>
                        <p className="text-white text-xl font-bold">{registro.valor} kg</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Masa Muscular */}
                <div className="bg-white/5 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-lg font-semibold text-white">Masa Muscular (kg)</h5>
                    <span className="text-green-400 text-sm font-semibold">
                      +{((selectedCliente.progreso.masaMuscular[selectedCliente.progreso.masaMuscular.length - 1].valor - selectedCliente.progreso.masaMuscular[0].valor) / selectedCliente.progreso.masaMuscular[0].valor * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedCliente.progreso.masaMuscular.map((registro, index) => (
                      <div key={index} className="bg-white/5 p-3 rounded-lg text-center">
                        <p className="text-gray-400 text-xs mb-1">{registro.fecha}</p>
                        <p className="text-green-400 text-xl font-bold">{registro.valor} kg</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grasa Corporal */}
                <div className="bg-white/5 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-lg font-semibold text-white">Grasa Corporal (%)</h5>
                    <span className={`text-sm font-semibold ${parseFloat(calcularProgresoGrasa(selectedCliente.progreso)) < 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {calcularProgresoGrasa(selectedCliente.progreso)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedCliente.progreso.grasaCorporal.map((registro, index) => (
                      <div key={index} className="bg-white/5 p-3 rounded-lg text-center">
                        <p className="text-gray-400 text-xs mb-1">{registro.fecha}</p>
                        <p className="text-orange-400 text-xl font-bold">{registro.valor}%</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Medidas Corporales */}
                <div className="bg-white/5 p-6 rounded-xl">
                  <h5 className="text-lg font-semibold text-white mb-4">Medidas Corporales (cm)</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-2">Pecho</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">{selectedCliente.progreso.medidas.pecho.inicial}</span>
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span className="text-cyan-400 font-bold">{selectedCliente.progreso.medidas.pecho.actual}</span>
                      </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-2">Brazos</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">{selectedCliente.progreso.medidas.brazos.inicial}</span>
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span className="text-cyan-400 font-bold">{selectedCliente.progreso.medidas.brazos.actual}</span>
                      </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-2">Cintura</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">{selectedCliente.progreso.medidas.cintura.inicial}</span>
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span className="text-cyan-400 font-bold">{selectedCliente.progreso.medidas.cintura.actual}</span>
                      </div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-2">Piernas</p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">{selectedCliente.progreso.medidas.piernas.inicial}</span>
                        <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span className="text-cyan-400 font-bold">{selectedCliente.progreso.medidas.piernas.actual}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botón de Acción */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                >
                  Actualizar Progreso
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Modal Nuevo Cliente */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Nuevo Cliente</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10 dígitos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Membresía Inicial</label>
                  <select
                    value={formData.tipoMembresia}
                    onChange={(e) => setFormData({ ...formData, tipoMembresia: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-slate-800"
                  >
                    <option value="diaria">Diaria</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                  </select>
                </div>
                <div className="pt-4 flex space-x-3">
                  <motion.button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleGuardarCliente}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                  >
                    Guardar
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoachClientes;