import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Miembros = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMembresia, setFilterMembresia] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [showNewMemberModal, setShowNewMemberModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [selectedMiembro, setSelectedMiembro] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    tipoMembresia: 'mesual'
  });

  const [miembros, setMiembros] = useState([]);

  // Cargar miembros desde la DB real al iniciar
  React.useEffect(() => {
    fetch('/api/members')
      .then(res => res.json())
      .then(data => {
        // Adapt Data since we joined users and member logic visually before
        setMiembros(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error cargando miembros:", err);
        setIsLoading(false);
      });
  }, []);

  // Filtrar miembros
  const fetchMiembros = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/members');
      const data = await res.json();
      setMiembros(data);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMiembros();
  }, []);

  const miembrosFiltrados = miembros.filter((miembro) => {
    const matchSearch = String(miembro.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(miembro.codigo_miembro || miembro.id || '').includes(searchTerm) ||
      String(miembro.email || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchFilter = filterMembresia === 'todos' || miembro.tipoMembresia === filterMembresia;

    return matchSearch && matchFilter;
  });

  const handleVerDetalle = (miembro) => {
    setSelectedMiembro(miembro);
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setSelectedMiembro(null);
  };

  const handleEliminar = (id) => {
    setMemberToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmarEliminar = async () => {
    if (memberToDelete) {
      try {
        const res = await fetch(`/api/members/${memberToDelete}`, { method: 'DELETE' });
        if (res.ok) {
          setMiembros(miembros.filter(m => m.id !== memberToDelete));
        }
      } catch (err) {
        console.error(err);
      }
      setShowDeleteModal(false);
      setMemberToDelete(null);
    }
  };

  const handleAbrirNuevo = () => {
    setIsEditing(false);
    setFormData({ nombre: '', email: '', telefono: '', tipoMembresia: 'mensual' });
    setShowNewMemberModal(true);
  };

  const handleAbrirEditar = (miembro) => {
    setIsEditing(true);
    setSelectedMiembro(miembro);
    setFormData({
      nombre: miembro.nombre,
      email: miembro.email,
      telefono: miembro.telefono,
      tipoMembresia: miembro.tipoMembresia || 'mensual'
    });
    setShowNewMemberModal(true);
  };

  const handleGuardarMiembro = async () => {
    // Basic API structure
    try {
      if (isEditing && selectedMiembro) {
        const res = await fetch(`/api/members/${selectedMiembro.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (res.ok) {
          const data = await res.json();
          // Refetch or update states
          setMiembros(miembros.map(m => m.id === selectedMiembro.id ? { ...m, ...data } : m));
        }
      } else {
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
          const data = await res.json();
          // Reload purely to get accurate DB join view
          const refresh = await fetch('/api/members').then(r => r.json());
          setMiembros(refresh);
        }
      }
    } catch (err) {
      console.error("Error guardando:", err);
    }
    setShowNewMemberModal(false);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'vencido':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'suspendido':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const getTipoMembresiaTexto = (tipo) => {
    switch (tipo) {
      case 'diaria':
        return 'Diaria';
      case 'semanal':
        return 'Semanal';
      case 'mensual':
        return 'Mensual';
      default:
        return tipo;
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Miembros</h1>
            <p className="text-gray-400">Gestión de miembros del gimnasio</p>
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
            <span>Nuevo Miembro</span>
          </motion.button>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Búsqueda */}
            <div className="md:col-span-2">
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
                  placeholder="Buscar por nombre, ID o email..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Filtro por Membresía */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Membresía
              </label>
              <select
                value={filterMembresia}
                onChange={(e) => setFilterMembresia(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="todos" className="bg-slate-800">Todos</option>
                <option value="diaria" className="bg-slate-800">Diaria</option>
                <option value="semanal" className="bg-slate-800">Semanal</option>
                <option value="mensual" className="bg-slate-800">Mensual</option>
              </select>
            </div>
          </div>

          {/* Resultados */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Mostrando <span className="text-white font-semibold">{miembrosFiltrados.length}</span> de <span className="text-white font-semibold">{miembros.length}</span> miembros
            </p>
          </div>
        </div>

        {/* Tabla de Miembros */}
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
                    Contacto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Membresía
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {miembrosFiltrados.map((miembro, index) => (
                  <motion.tr
                    key={miembro.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{miembro.avatar}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{miembro.nombre}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-300">{miembro.codigo_miembro || miembro.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white text-sm">{miembro.email}</p>
                        <p className="text-gray-400 text-xs">{miembro.telefono}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-white font-medium">{getTipoMembresiaTexto(miembro.tipoMembresia)}</p>
                        <p className="text-cyan-400 text-sm">${miembro.precio}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-300 text-sm">{miembro.fechaVencimiento}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleVerDetalle(miembro)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAbrirEditar(miembro)}
                          className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEliminar(miembro.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden divide-y divide-white/10">
            {miembrosFiltrados.map((miembro, index) => (
              <motion.div
                key={miembro.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">{miembro.avatar}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{miembro.nombre}</p>
                      <p className="text-gray-400 text-sm">ID: {miembro.id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Membresía:</span>
                    <span className="text-white font-medium">{getTipoMembresiaTexto(miembro.tipoMembresia)} - ${miembro.precio}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Vencimiento:</span>
                    <span className="text-white">{miembro.fechaVencimiento}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <button
                    onClick={() => handleVerDetalle(miembro)}
                    className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
                  >
                    Ver detalle
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAbrirEditar(miembro)}
                      className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEliminar(miembro.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sin resultados */}
          {miembrosFiltrados.length === 0 && (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-400 text-lg">No se encontraron miembros</p>
              <p className="text-gray-500 text-sm mt-2">Intenta con otros filtros de búsqueda</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle */}
      <AnimatePresence>
        {showModal && selectedMiembro && (
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
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header del Modal */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Detalle del Miembro</h3>
                <button
                  onClick={handleCerrarModal}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Contenido del Modal */}
              <div className="space-y-6">
                {/* Información Personal */}
                <div className="flex items-center space-x-4 pb-6 border-b border-white/10">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">{selectedMiembro.avatar}</span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white">{selectedMiembro.nombre}</h4>
                    <p className="text-gray-400">ID: {selectedMiembro.id}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold border ${getEstadoColor(selectedMiembro.estado)}`}>
                      {selectedMiembro.estado.charAt(0).toUpperCase() + selectedMiembro.estado.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Información de Contacto */}
                <div>
                  <h5 className="text-lg font-semibold text-white mb-4">Información de Contacto</h5>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-300">{selectedMiembro.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-300">{selectedMiembro.telefono}</span>
                    </div>
                  </div>
                </div>

                {/* Información de Membresía */}
                <div>
                  <h5 className="text-lg font-semibold text-white mb-4">Información de Membresía</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">Tipo</p>
                      <p className="text-white font-semibold">{getTipoMembresiaTexto(selectedMiembro.tipoMembresia)}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">Precio</p>
                      <p className="text-cyan-400 font-semibold">${selectedMiembro.precio}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">Fecha de Inicio</p>
                      <p className="text-white font-semibold">{selectedMiembro.fechaInicio}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                      <p className="text-gray-400 text-sm mb-1">Fecha de Vencimiento</p>
                      <p className="text-white font-semibold">{selectedMiembro.fechaVencimiento}</p>
                    </div>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex items-center space-x-4 pt-6 border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                  >
                    Renovar Membresía
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
                  >
                    Editar Información
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Nuevo Miembro (Básico) */}
      <AnimatePresence>
        {showNewMemberModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setShowNewMemberModal(false)}
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
                <h3 className="text-2xl font-bold text-white">{isEditing ? 'Editar Miembro' : 'Nuevo Miembro'}</h3>
                <button
                  onClick={() => setShowNewMemberModal(false)}
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
                  <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej. Juan Pérez" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="correo@ejemplo.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Teléfono</label>
                  <input type="text" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="10 dígitos" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Membresía Inicial</label>
                  <select value={formData.tipoMembresia} onChange={(e) => setFormData({ ...formData, tipoMembresia: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 [&>option]:bg-slate-800">
                    <option value="diaria">Diaria</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                  </select>
                </div>
                <div className="pt-4 flex space-x-3">
                  <motion.button
                    type="button"
                    onClick={() => setShowNewMemberModal(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleGuardarMiembro}
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

      {/* Modal Confirmación Eliminar */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¿Eliminar miembro?</h3>
              <p className="text-gray-400 mb-6">Esta acción no se puede deshacer y el miembro será eliminado permanentemente.</p>

              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmarEliminar}
                  className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300"
                >
                  Eliminar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Miembros;