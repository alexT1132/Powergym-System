import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CoachProgresos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('todos');
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [planAlimentacion, setPlanAlimentacion] = useState({
    calorias: '',
    proteinas: '',
    carbohidratos: '',
    grasas: '',
    comidas: [
      { nombre: 'Desayuno', alimentos: '', horario: '' },
      { nombre: 'Media Mañana', alimentos: '', horario: '' },
      { nombre: 'Almuerzo', alimentos: '', horario: '' },
      { nombre: 'Merienda', alimentos: '', horario: '' },
      { nombre: 'Cena', alimentos: '', horario: '' }
    ],
    notas: ''
  });

  const [clientes, setClientes] = useState([]);

  const fetchClientes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/coach/progress');
      const data = await res.json();
      if (res.ok) setClientes(data);
    } catch (err) {
      console.error(err);
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

  const handleAbrirPlanAlimentacion = (e, cliente) => {
    e.stopPropagation();
    setSelectedCliente(cliente);

    // Si el cliente ya tiene plan, cargar sus datos
    if (cliente.planAlimentacion) {
      setPlanAlimentacion(cliente.planAlimentacion);
    } else {
      // Resetear formulario
      setPlanAlimentacion({
        calorias: '',
        proteinas: '',
        carbohidratos: '',
        grasas: '',
        comidas: [
          { nombre: 'Desayuno', alimentos: '', horario: '' },
          { nombre: 'Media Mañana', alimentos: '', horario: '' },
          { nombre: 'Almuerzo', alimentos: '', horario: '' },
          { nombre: 'Merienda', alimentos: '', horario: '' },
          { nombre: 'Cena', alimentos: '', horario: '' }
        ],
        notas: ''
      });
    }
    setShowPlanModal(true);
  };

  const handleCerrarPlanModal = () => {
    setShowPlanModal(false);
  };

  const handleGuardarPlan = async () => {
    if (!selectedCliente) return;

    try {
      const res = await fetch(`/api/coach/nutrition/${selectedCliente.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planAlimentacion })
      });
      if (res.ok) {
        setClientes(clientes.map(cliente =>
          cliente.id === selectedCliente.id
            ? { ...cliente, planAlimentacion: planAlimentacion }
            : cliente
        ));
      }
    } catch (e) { console.error(e) }
    setShowPlanModal(false);
  };

  const handleActualizarProgresoRapido = async () => {
    if (!selectedCliente) return;

    // Use prompts for a quick demonstration
    const pesoInput = prompt(`Nuevo Peso Corporal (kg) para ${selectedCliente.nombre}:`, selectedCliente.progreso?.peso?.slice(-1)[0]?.valor || "");
    if (pesoInput === null) return;
    const musculoInput = prompt("Nueva Masa Muscular (kg):", selectedCliente.progreso?.masaMuscular?.slice(-1)[0]?.valor || "");
    if (musculoInput === null) return;
    const grasaInput = prompt("Nueva Grasa Corporal (%):", selectedCliente.progreso?.grasaCorporal?.slice(-1)[0]?.valor || "");
    if (grasaInput === null) return;

    const peso = parseFloat(pesoInput);
    const musculo = parseFloat(musculoInput);
    const grasa = parseFloat(grasaInput);

    try {
      const res = await fetch(`/api/coach/progress/${selectedCliente.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          peso: isNaN(peso) ? 0 : peso,
          masaMuscular: isNaN(musculo) ? 0 : musculo,
          grasaCorporal: isNaN(grasa) ? 0 : grasa
        })
      });

      if (res.ok) {
        await fetchClientes();
        alert("Progreso guardado exitosamente!");
        setShowModal(false);
      } else {
        alert("Hubo un error al guardar.");
      }
    } catch (err) {
      console.error(err);
      alert("Error en el servidor");
    }
  };

  const handleUpdateComida = (index, field, value) => {
    const nuevasComidas = [...planAlimentacion.comidas];
    nuevasComidas[index][field] = value;
    setPlanAlimentacion({ ...planAlimentacion, comidas: nuevasComidas });
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
          Cargando Progresos...
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
            <h1 className="text-3xl font-bold text-white mb-2">Progreso de Clientes</h1>
            <p className="text-gray-400">Gestiona y monitorea el progreso de tus clientes</p>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
            <p className="text-gray-400 text-sm mb-1">Total Clientes</p>
            <p className="text-white text-2xl font-bold">{clientes.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
            <p className="text-gray-400 text-sm mb-1">Activos este mes</p>
            <p className="text-white text-2xl font-bold">{clientes.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
            <p className="text-gray-400 text-sm mb-1">Promedio asistencia</p>
            <p className="text-white text-2xl font-bold">92%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4">
            <p className="text-gray-400 text-sm mb-1">Con plan nutricional</p>
            <p className="text-white text-2xl font-bold">{clientes.filter(c => c.planAlimentacion).length}</p>
          </div>
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

        {/* Grid de Tarjetas de Clientes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientesFiltrados.map((cliente, index) => (
            <motion.div
              key={cliente.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
            >
              {/* Header de la tarjeta con categoría */}
              <div className={`h-2 bg-gradient-to-r ${getCategoriaColor(cliente.categoria)}`}></div>

              <div className="p-6">
                {/* Avatar y nombre */}
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getCategoriaColor(cliente.categoria)} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-bold text-2xl">{cliente.avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{cliente.nombre}</h3>
                    <p className="text-gray-400 text-sm">{cliente.edad} años</p>
                  </div>
                </div>

                {/* Información */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Categoría:</span>
                    <span className="text-white font-medium">{getCategoriaTexto(cliente.categoria)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Objetivo:</span>
                    <span className="text-white font-medium text-right">{cliente.objetivo}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Sesiones:</span>
                    <span className="text-cyan-400 font-semibold">{cliente.sesionesCompletadas}</span>
                  </div>
                </div>

                {/* Indicador de plan nutricional */}
                {cliente.planAlimentacion && (
                  <div className="bg-green-500/20 border border-green-500/50 p-3 rounded-lg mb-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-green-400 text-sm font-medium">Plan nutricional activo</p>
                    </div>
                  </div>
                )}

                {/* Botones */}
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleVerProgreso(cliente)}
                    className="w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                  >
                    Ver Progreso
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => handleAbrirPlanAlimentacion(e, cliente)}
                    className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>{cliente.planAlimentacion ? 'Ver Plan' : 'Crear Plan'} Nutricional</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sin resultados */}
        {clientesFiltrados.length === 0 && (
          <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-gray-400 text-lg">No se encontraron clientes</p>
            <p className="text-gray-500 text-sm mt-2">Intenta con otros filtros de búsqueda</p>
          </div>
        )}
      </div>

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Objetivo</p>
                  <p className="text-white font-semibold">{selectedCliente.objetivo}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Fecha de Inicio</p>
                  <p className="text-white font-semibold">{selectedCliente.fechaInicio}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Sesiones Completadas</p>
                  <p className="text-cyan-400 font-semibold text-xl">{selectedCliente.sesionesCompletadas}</p>
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

              {/* Botones de Acción */}
              <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-white/10">
                <motion.button
                  onClick={handleActualizarProgresoRapido}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                >
                  Actualizar Progreso
                </motion.button>
                <motion.button
                  onClick={handleCerrarModal}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  Cerrar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Plan de Alimentación */}
      <AnimatePresence>
        {showPlanModal && selectedCliente && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={handleCerrarPlanModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white">Plan de Alimentación</h3>
                  <p className="text-gray-400">{selectedCliente.nombre}</p>
                </div>
                <button
                  onClick={handleCerrarPlanModal}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Macronutrientes */}
              <div className="bg-white/5 p-6 rounded-xl mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">Macronutrientes Diarios</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Calorías</label>
                    <input
                      type="number"
                      value={planAlimentacion.calorias}
                      onChange={(e) => setPlanAlimentacion({ ...planAlimentacion, calorias: e.target.value })}
                      placeholder="3000"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Proteínas (g)</label>
                    <input
                      type="number"
                      value={planAlimentacion.proteinas}
                      onChange={(e) => setPlanAlimentacion({ ...planAlimentacion, proteinas: e.target.value })}
                      placeholder="180"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Carbohidratos (g)</label>
                    <input
                      type="number"
                      value={planAlimentacion.carbohidratos}
                      onChange={(e) => setPlanAlimentacion({ ...planAlimentacion, carbohidratos: e.target.value })}
                      placeholder="350"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Grasas (g)</label>
                    <input
                      type="number"
                      value={planAlimentacion.grasas}
                      onChange={(e) => setPlanAlimentacion({ ...planAlimentacion, grasas: e.target.value })}
                      placeholder="80"
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Comidas */}
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold text-white">Comidas del Día</h4>
                {planAlimentacion.comidas.map((comida, index) => (
                  <div key={index} className="bg-white/5 p-4 rounded-xl">
                    <h5 className="text-white font-semibold mb-3">{comida.nombre}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Alimentos</label>
                        <textarea
                          value={comida.alimentos}
                          onChange={(e) => handleUpdateComida(index, 'alimentos', e.target.value)}
                          placeholder="Ej: 4 claras de huevo, 1 taza de avena, 1 plátano"
                          rows="3"
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Horario</label>
                        <input
                          type="time"
                          value={comida.horario}
                          onChange={(e) => handleUpdateComida(index, 'horario', e.target.value)}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notas adicionales */}
              <div className="bg-white/5 p-4 rounded-xl mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Notas Adicionales</label>
                <textarea
                  value={planAlimentacion.notas}
                  onChange={(e) => setPlanAlimentacion({ ...planAlimentacion, notas: e.target.value })}
                  placeholder="Ej: Beber mínimo 3 litros de agua al día. Suplementar con creatina post-entrenamiento."
                  rows="4"
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Botones */}
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGuardarPlan}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300"
                >
                  Guardar Plan
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCerrarPlanModal}
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

export default CoachProgresos;