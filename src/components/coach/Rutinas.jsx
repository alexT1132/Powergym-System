import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CoachRutinas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('todos');
  const [selectedRutina, setSelectedRutina] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rutinaAEliminar, setRutinaAEliminar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rutinas, setRutinas] = useState([]);

  const fetchRutinas = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/coach/routines');
      const data = await res.json();
      if (res.ok) setRutinas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRutinas();
  }, []);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [nuevaRutina, setNuevaRutina] = useState({
    nombre: '',
    descripcion: '',
    categoria: 'fuerza',
    duracion: '',
    ejercicios: [
      { nombre: '', series: '', repeticiones: '', descanso: '' }
    ]
  });

  // Filtrar rutinas
  const rutinasFiltradas = rutinas.filter((rutina) => {
    const matchSearch = rutina.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rutina.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter = filterCategoria === 'todos' || rutina.categoria === filterCategoria;
    return matchSearch && matchFilter;
  });

  const handleVerDetalle = (rutina) => {
    setSelectedRutina(rutina);
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setSelectedRutina(null);
  };

  const handleAbrirModalEliminar = (rutina) => {
    setRutinaAEliminar(rutina);
    setShowDeleteModal(true);
  };

  const handleCerrarModalEliminar = () => {
    setShowDeleteModal(false);
    setRutinaAEliminar(null);
  };

  const handleEliminarRutina = async () => {
    try {
      const res = await fetch(`/api/coach/routines/${rutinaAEliminar.id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setRutinas(rutinas.filter(r => r.id !== rutinaAEliminar.id));
      }
    } catch (e) {
      console.error(e);
    }
    handleCerrarModalEliminar();
  };

  const handleAbrirModalCrear = () => {
    setNuevaRutina({
      nombre: '',
      descripcion: '',
      categoria: 'fuerza',
      duracion: '',
      ejercicios: [
        { nombre: '', series: '', repeticiones: '', descanso: '' }
      ]
    });
    setShowCreateModal(true);
  };

  const handleCerrarModalCrear = () => {
    setShowCreateModal(false);
  };

  const handleAgregarEjercicio = () => {
    setNuevaRutina({
      ...nuevaRutina,
      ejercicios: [...nuevaRutina.ejercicios, { nombre: '', series: '', repeticiones: '', descanso: '' }]
    });
  };

  const handleEliminarEjercicio = (index) => {
    const nuevosEjercicios = nuevaRutina.ejercicios.filter((_, i) => i !== index);
    setNuevaRutina({ ...nuevaRutina, ejercicios: nuevosEjercicios });
  };

  const handleUpdateEjercicio = (index, field, value) => {
    const nuevosEjercicios = [...nuevaRutina.ejercicios];
    nuevosEjercicios[index][field] = value;
    setNuevaRutina({ ...nuevaRutina, ejercicios: nuevosEjercicios });
  };

  const handleGuardarRutina = async () => {
    const rutinaData = {
      nombre: nuevaRutina.nombre,
      descripcion: nuevaRutina.descripcion,
      categoria: nuevaRutina.categoria,
      duracion: nuevaRutina.duracion,
      ejercicios: nuevaRutina.ejercicios.map(ej => ({
        nombre: ej.nombre,
        series: parseInt(ej.series) || 0,
        repeticiones: ej.repeticiones,
        descanso: ej.descanso
      }))
    };

    try {
      const res = await fetch('/api/coach/routines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rutinaData)
      });
      if (res.ok) {
        await fetchRutinas();
        handleCerrarModalCrear();
      }
    } catch (err) {
      console.error(err);
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

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse text-center">
          <svg className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Cargando Rutinas...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Rutinas de Entrenamiento</h1>
            <p className="text-gray-400">Crea y gestiona rutinas para tus clientes</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAbrirModalCrear}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Nueva Rutina</span>
          </motion.button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
            <p className="text-gray-400 text-sm mb-1">Total Rutinas</p>
            <p className="text-white text-2xl font-bold">{rutinas.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
            <p className="text-gray-400 text-sm mb-1">Rutinas de Fuerza</p>
            <p className="text-white text-2xl font-bold">{rutinas.filter(r => r.categoria === 'fuerza').length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
            <p className="text-gray-400 text-sm mb-1">Rutinas de Cardio</p>
            <p className="text-white text-2xl font-bold">{rutinas.filter(r => r.categoria === 'cardio').length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
            <p className="text-gray-400 text-sm mb-1">Clientes Asignados</p>
            <p className="text-white text-2xl font-bold">{rutinas.reduce((sum, r) => sum + r.clientesAsignados, 0)}</p>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Buscar Rutina
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
                  placeholder="Buscar por nombre o descripción..."
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
              Mostrando <span className="text-white font-semibold">{rutinasFiltradas.length}</span> rutinas
            </p>
          </div>
        </div>

        {/* Grid de Rutinas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rutinasFiltradas.map((rutina, index) => (
            <motion.div
              key={rutina.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAbrirModalEliminar(rutina);
                    }}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
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
                    <span className="text-cyan-400 font-semibold">{rutina.ejercicios.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Clientes asignados:</span>
                    <span className="text-white font-medium">{rutina.clientesAsignados}</span>
                  </div>
                </div>

                {/* Botón */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleVerDetalle(rutina)}
                  className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                >
                  Ver Detalle
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sin resultados */}
        {rutinasFiltradas.length === 0 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 text-lg">No se encontraron rutinas</p>
            <p className="text-gray-500 text-sm mt-2">Intenta con otros filtros de búsqueda</p>
          </div>
        )}
      </div>

      {/* Modal de Confirmación de Eliminación */}
      <AnimatePresence>
        {showDeleteModal && rutinaAEliminar && (
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
                <h3 className="text-xl font-bold text-white mb-2">Eliminar Rutina</h3>
                <p className="text-gray-400 mb-6">
                  ¿Estás seguro de que deseas eliminar <span className="text-white font-semibold">{rutinaAEliminar.nombre}</span>? Esta acción no se puede deshacer.
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
                    onClick={handleEliminarRutina}
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
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedRutina.nombre}</h3>
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
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm mb-1">Duración</p>
                  <p className="text-white font-bold text-lg">{selectedRutina.duracion}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm mb-1">Ejercicios</p>
                  <p className="text-cyan-400 font-bold text-lg">{selectedRutina.ejercicios.length}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg text-center">
                  <p className="text-gray-400 text-sm mb-1">Clientes</p>
                  <p className="text-white font-bold text-lg">{selectedRutina.clientesAsignados}</p>
                </div>
              </div>

              {/* Lista de Ejercicios */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4">Ejercicios</h4>
                <div className="space-y-3">
                  {selectedRutina.ejercicios.map((ejercicio, index) => (
                    <div key={index} className="bg-white/5 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-white font-semibold">{index + 1}. {ejercicio.nombre}</h5>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-400">Series</p>
                          <p className="text-white font-medium">{ejercicio.series}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Repeticiones</p>
                          <p className="text-white font-medium">{ejercicio.repeticiones}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Descanso</p>
                          <p className="text-white font-medium">{ejercicio.descanso}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones */}
              <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                >
                  Asignar a Cliente
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Editar Rutina
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Crear Rutina */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={handleCerrarModalCrear}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Nueva Rutina</h3>
                <button
                  onClick={handleCerrarModalCrear}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Información Básica */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre de la Rutina</label>
                  <input
                    type="text"
                    value={nuevaRutina.nombre}
                    onChange={(e) => setNuevaRutina({ ...nuevaRutina, nombre: e.target.value })}
                    placeholder="Ej: Fuerza Upper Body"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
                  <textarea
                    value={nuevaRutina.descripcion}
                    onChange={(e) => setNuevaRutina({ ...nuevaRutina, descripcion: e.target.value })}
                    placeholder="Breve descripción de la rutina"
                    rows="3"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
                    <select
                      value={nuevaRutina.categoria}
                      onChange={(e) => setNuevaRutina({ ...nuevaRutina, categoria: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="fuerza" className="bg-slate-800">Fuerza</option>
                      <option value="cardio" className="bg-slate-800">Cardio</option>
                      <option value="funcional" className="bg-slate-800">Funcional</option>
                      <option value="hiit" className="bg-slate-800">HIIT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Duración</label>
                    <input
                      type="text"
                      value={nuevaRutina.duracion}
                      onChange={(e) => setNuevaRutina({ ...nuevaRutina, duracion: e.target.value })}
                      placeholder="Ej: 60 min"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Ejercicios */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-white">Ejercicios</h4>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAgregarEjercicio}
                    className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Agregar Ejercicio</span>
                  </motion.button>
                </div>

                <div className="space-y-4">
                  {nuevaRutina.ejercicios.map((ejercicio, index) => (
                    <div key={index} className="bg-white/5 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-white font-semibold">Ejercicio {index + 1}</h5>
                        {nuevaRutina.ejercicios.length > 1 && (
                          <button
                            onClick={() => handleEliminarEjercicio(index)}
                            className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            value={ejercicio.nombre}
                            onChange={(e) => handleUpdateEjercicio(index, 'nombre', e.target.value)}
                            placeholder="Nombre del ejercicio"
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <input
                          type="text"
                          value={ejercicio.series}
                          onChange={(e) => handleUpdateEjercicio(index, 'series', e.target.value)}
                          placeholder="Series (ej: 4)"
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={ejercicio.repeticiones}
                          onChange={(e) => handleUpdateEjercicio(index, 'repeticiones', e.target.value)}
                          placeholder="Repeticiones (ej: 8-10)"
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            value={ejercicio.descanso}
                            onChange={(e) => handleUpdateEjercicio(index, 'descanso', e.target.value)}
                            placeholder="Descanso (ej: 90s)"
                            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones */}
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGuardarRutina}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                >
                  Guardar Rutina
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCerrarModalCrear}
                  className="flex-1 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Cancelar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoachRutinas;