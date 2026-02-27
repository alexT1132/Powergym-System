import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Reportes = () => {
  const [tipoReporte, setTipoReporte] = useState('general');
  const [periodoReporte, setPeriodoReporte] = useState('mes');
  const [isLoading, setIsLoading] = useState(true);

  // Estados para los datos reales
  const [datosAsistencias, setDatosAsistencias] = useState([]);
  const [datosIngresos, setDatosIngresos] = useState([]);
  const [datosMembresias, setDatosMembresias] = useState([]);
  const [datosMiembrosActivos, setDatosMiembrosActivos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalMiembros: 0,
    miembrosActivos: 0,
    asistenciasHoy: 0,
    ingresosDelMes: 0,
    pagosPendientes: 0,
    tasaCrecimiento: 0
  });

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/reports');
      const data = await res.json();
      if (res.ok) {
        setEstadisticas(data.estadisticas);
        setDatosAsistencias(data.datosAsistencias);
        setDatosIngresos(data.datosIngresos);
        setDatosMembresias(data.datosMembresias);
        setDatosMiembrosActivos(data.datosMiembrosActivos);
      }
    } catch (e) {
      console.error("Error cargando reportes:", e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    cargarDatos();
  }, []);

  // Función para generar PDF
  const generarPDF = () => {
    const doc = new jsPDF();
    const fechaActual = new Date().toLocaleDateString('es-ES');

    // Encabezado
    doc.setFillColor(59, 130, 246);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('PowerGym', 105, 15, { align: 'center' });

    doc.setFontSize(16);
    doc.text('Reporte de Gestión', 105, 25, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Fecha: ${fechaActual}`, 105, 33, { align: 'center' });

    // Resetear color de texto
    doc.setTextColor(0, 0, 0);

    // Sección de Estadísticas Generales
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Estadísticas Generales', 14, 50);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);

    const estadisticasData = [
      ['Total de Miembros', estadisticas.totalMiembros.toString()],
      ['Miembros Activos', estadisticas.miembrosActivos.toString()],
      ['Asistencias Hoy', estadisticas.asistenciasHoy.toString()],
      ['Ingresos del Mes', `$${estadisticas.ingresosDelMes.toLocaleString()}`],
      ['Pagos Pendientes', estadisticas.pagosPendientes.toString()],
      ['Tasa de Crecimiento', `${estadisticas.tasaCrecimiento}%`]
    ];

    doc.autoTable({
      startY: 55,
      head: [['Métrica', 'Valor']],
      body: estadisticasData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 14, right: 14 }
    });

    // Sección de Asistencias
    let yPosition = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Asistencias Recientes', 14, yPosition);
    const asistenciasData = datosAsistencias.map(dia => [dia.nombre, dia.asistencias.toString()]);
    doc.autoTable({
      startY: yPosition + 5,
      head: [['Día', 'Asistencias']],
      body: asistenciasData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] },
      margin: { left: 14, right: 14 }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128);
      doc.text(`Página ${i} de ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    doc.save(`Reporte_PowerGym_${fechaActual.replace(/\//g, '-')}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse text-center">
          <svg className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generando Análisis...
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
            <h1 className="text-3xl font-bold text-white mb-2">Reportes</h1>
            <p className="text-gray-400">Análisis y estadísticas del gimnasio</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generarPDF}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Exportar PDF</span>
          </motion.button>
        </div>

        {/* Filtros */}
        <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo de Reporte */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de Reporte
              </label>
              <select
                value={tipoReporte}
                onChange={(e) => setTipoReporte(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="general" className="bg-slate-800">General</option>
                <option value="asistencias" className="bg-slate-800">Asistencias</option>
                <option value="ingresos" className="bg-slate-800">Ingresos</option>
                <option value="miembros" className="bg-slate-800">Miembros</option>
              </select>
            </div>

            {/* Período */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Período
              </label>
              <select
                value={periodoReporte}
                onChange={(e) => setPeriodoReporte(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              >
                <option value="semana" className="bg-slate-800">Esta Semana</option>
                <option value="mes" className="bg-slate-800">Este Mes</option>
                <option value="trimestre" className="bg-slate-800">Este Trimestre</option>
                <option value="año" className="bg-slate-800">Este Año</option>
              </select>
            </div>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Total Miembros</p>
              <div className="p-2 bg-blue-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="text-white text-3xl font-bold">{estadisticas.totalMiembros}</p>
            <p className="text-green-400 text-sm mt-2">+{estadisticas.tasaCrecimiento}% este mes</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Asistencias Hoy</p>
              <div className="p-2 bg-green-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-white text-3xl font-bold">{estadisticas.asistenciasHoy}</p>
            <p className="text-gray-400 text-sm mt-2">{estadisticas.miembrosActivos} activos</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Ingresos del Mes</p>
              <div className="p-2 bg-purple-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-white text-3xl font-bold">${estadisticas.ingresosDelMes.toLocaleString()}</p>
            <p className="text-green-400 text-sm mt-2">+15% vs mes anterior</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-400 text-sm">Pagos Pendientes</p>
              <div className="p-2 bg-orange-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-white text-3xl font-bold">{estadisticas.pagosPendientes}</p>
            <p className="text-gray-400 text-sm mt-2">Requieren atención</p>
          </motion.div>
        </div>

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfica de Asistencias */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Asistencias de la Semana</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosAsistencias}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="nombre" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="asistencias"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  name="Asistencias"
                  dot={{ fill: '#3B82F6', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Gráfica de Distribución de Membresías */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Distribución de Membresías</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={datosMembresias}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="valor"
                >
                  {datosMembresias.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-6 mt-4">
              {datosMembresias.map((tipo, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tipo.color }}></div>
                  <span className="text-gray-300 text-sm">{tipo.nombre}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Gráfica de Ingresos Mensuales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Ingresos Mensuales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosIngresos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="mes" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Bar
                  dataKey="ingresos"
                  fill="#8B5CF6"
                  name="Ingresos"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Gráfica de Miembros Activos vs Nuevos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
          >
            <h3 className="text-xl font-bold text-white mb-4">Miembros Activos vs Nuevos</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosMiembrosActivos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="mes" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Bar dataKey="activos" fill="#10B981" name="Activos" radius={[8, 8, 0, 0]} />
                <Bar dataKey="nuevos" fill="#06B6D4" name="Nuevos" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Resumen de Métricas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6"
        >
          <h3 className="text-xl font-bold text-white mb-6">Resumen de Métricas Clave</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Tasa de Retención</span>
                <span className="text-white font-semibold">94%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Ocupación Promedio</span>
                <span className="text-white font-semibold">76%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '76%' }}></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Satisfacción</span>
                <span className="text-white font-semibold">4.8/5</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reportes;