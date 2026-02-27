import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CoachConfiguracion = () => {
  const [seccionActiva, setSeccionActiva] = useState('perfil');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estados para Configuración de Perfil
  const [perfil, setPerfil] = useState({
    nombre: 'Coach',
    email: 'coach@powergym.com',
    telefono: '1234567890',
    especialidad: 'Entrenamiento Funcional',
    certificaciones: 'NSCA-CPT, CrossFit Level 1',
    experiencia: '5 años'
  });

  // Estados para Disponibilidad
  const [disponibilidad, setDisponibilidad] = useState({
    lunes: { activo: true, inicio: '08:00', fin: '18:00' },
    martes: { activo: true, inicio: '08:00', fin: '18:00' },
    miercoles: { activo: true, inicio: '08:00', fin: '18:00' },
    jueves: { activo: true, inicio: '08:00', fin: '18:00' },
    viernes: { activo: true, inicio: '08:00', fin: '18:00' },
    sabado: { activo: false, inicio: '09:00', fin: '14:00' },
    domingo: { activo: false, inicio: '09:00', fin: '14:00' }
  });

  // Estados para Notificaciones
  const [notificaciones, setNotificaciones] = useState({
    emailNuevoCliente: true,
    emailCancelacion: true,
    emailRecordatorio: false,
    smsRecordatorios: true
  });

  // Estados para Cambio de Contraseña
  const [passwords, setPasswords] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  });

  const handleGuardarPerfil = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setMensaje('Perfil actualizado exitosamente');
      setTimeout(() => setMensaje(''), 3000);
    }, 1000);
  };

  const handleGuardarDisponibilidad = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setMensaje('Disponibilidad actualizada exitosamente');
      setTimeout(() => setMensaje(''), 3000);
    }, 1000);
  };

  const handleGuardarNotificaciones = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setMensaje('Preferencias de notificaciones guardadas');
      setTimeout(() => setMensaje(''), 3000);
    }, 1000);
  };

  const handleCambiarPassword = (e) => {
    e.preventDefault();
    
    if (passwords.nueva !== passwords.confirmar) {
      setMensaje('Las contraseñas no coinciden');
      setTimeout(() => setMensaje(''), 3000);
      return;
    }

    if (passwords.nueva.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres');
      setTimeout(() => setMensaje(''), 3000);
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setMensaje('Contraseña cambiada exitosamente');
      setPasswords({ actual: '', nueva: '', confirmar: '' });
      setTimeout(() => setMensaje(''), 3000);
    }, 1000);
  };

  const handleUpdateDisponibilidad = (dia, field, value) => {
    setDisponibilidad({
      ...disponibilidad,
      [dia]: {
        ...disponibilidad[dia],
        [field]: value
      }
    });
  };

  const menuItems = [
    { id: 'perfil', nombre: 'Mi Perfil', icono: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { id: 'disponibilidad', nombre: 'Disponibilidad', icono: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { id: 'notificaciones', nombre: 'Notificaciones', icono: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 16h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )},
    { id: 'seguridad', nombre: 'Seguridad', icono: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )}
  ];

  const renderContenido = () => {
    switch (seccionActiva) {
      case 'perfil':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Mi Perfil</h2>
              <p className="text-gray-400">Administra tu información profesional</p>
            </div>

            <form onSubmit={handleGuardarPerfil} className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-4xl">C</span>
                </div>
                <div>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300"
                  >
                    Cambiar Foto
                  </motion.button>
                  <p className="text-gray-400 text-sm mt-2">JPG, PNG o GIF (máx. 2MB)</p>
                </div>
              </div>

              {/* Campos del formulario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={perfil.nombre}
                    onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={perfil.email}
                    onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={perfil.telefono}
                    onChange={(e) => setPerfil({ ...perfil, telefono: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Especialidad
                  </label>
                  <input
                    type="text"
                    value={perfil.especialidad}
                    onChange={(e) => setPerfil({ ...perfil, especialidad: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Certificaciones
                  </label>
                  <input
                    type="text"
                    value={perfil.certificaciones}
                    onChange={(e) => setPerfil({ ...perfil, certificaciones: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Años de Experiencia
                  </label>
                  <input
                    type="text"
                    value={perfil.experiencia}
                    onChange={(e) => setPerfil({ ...perfil, experiencia: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </motion.button>
            </form>
          </div>
        );

      case 'disponibilidad':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Disponibilidad Horaria</h2>
              <p className="text-gray-400">Configura tus horarios de trabajo</p>
            </div>

            <form onSubmit={handleGuardarDisponibilidad} className="space-y-4">
              {Object.entries(disponibilidad).map(([dia, horario]) => (
                <div key={dia} className="bg-white/5 p-4 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={horario.activo}
                          onChange={(e) => handleUpdateDisponibilidad(dia, 'activo', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                      <span className="text-white font-medium capitalize">{dia}</span>
                    </div>
                  </div>

                  {horario.activo && (
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Hora Inicio</label>
                        <input
                          type="time"
                          value={horario.inicio}
                          onChange={(e) => handleUpdateDisponibilidad(dia, 'inicio', e.target.value)}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Hora Fin</label>
                        <input
                          type="time"
                          value={horario.fin}
                          onChange={(e) => handleUpdateDisponibilidad(dia, 'fin', e.target.value)}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Guardando...' : 'Guardar Disponibilidad'}
              </motion.button>
            </form>
          </div>
        );

      case 'notificaciones':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Preferencias de Notificaciones</h2>
              <p className="text-gray-400">Configura cómo deseas recibir notificaciones</p>
            </div>

            <form onSubmit={handleGuardarNotificaciones} className="space-y-6">
              <div className="space-y-4">
                {/* Email - Nuevo Cliente */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Nuevo Cliente Asignado</h3>
                      <p className="text-gray-400 text-sm">Recibe alertas cuando se te asigne un nuevo cliente</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificaciones.emailNuevoCliente}
                        onChange={(e) => setNotificaciones({ ...notificaciones, emailNuevoCliente: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Email - Cancelación */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Cancelación de Sesiones</h3>
                      <p className="text-gray-400 text-sm">Notificaciones cuando un cliente cancele una sesión</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificaciones.emailCancelacion}
                        onChange={(e) => setNotificaciones({ ...notificaciones, emailCancelacion: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Email - Recordatorios */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Recordatorios de Sesiones</h3>
                      <p className="text-gray-400 text-sm">Recordatorios de sesiones programadas del día</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificaciones.emailRecordatorio}
                        onChange={(e) => setNotificaciones({ ...notificaciones, emailRecordatorio: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* SMS - Recordatorios */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Recordatorios por SMS</h3>
                      <p className="text-gray-400 text-sm">Recibe recordatorios por mensaje de texto</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificaciones.smsRecordatorios}
                        onChange={(e) => setNotificaciones({ ...notificaciones, smsRecordatorios: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Guardando...' : 'Guardar Preferencias'}
              </motion.button>
            </form>
          </div>
        );

      case 'seguridad':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Seguridad</h2>
              <p className="text-gray-400">Gestiona la seguridad de tu cuenta</p>
            </div>

            <form onSubmit={handleCambiarPassword} className="space-y-6">
              <div className="bg-white/5 p-6 rounded-xl border border-white/10 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Cambiar Contraseña</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contraseña Actual
                  </label>
                  <input
                    type="password"
                    value={passwords.actual}
                    onChange={(e) => setPasswords({ ...passwords, actual: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Ingresa tu contraseña actual"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={passwords.nueva}
                    onChange={(e) => setPasswords({ ...passwords, nueva: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={passwords.confirmar}
                    onChange={(e) => setPasswords({ ...passwords, confirmar: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Cambiando...' : 'Cambiar Contraseña'}
              </motion.button>
            </form>

            {/* Sesiones Activas */}
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Sesiones Activas</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-500 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-medium">Sesión Actual</p>
                      <p className="text-gray-400 text-sm">Windows • Chrome</p>
                    </div>
                  </div>
                  <span className="text-green-400 text-sm font-semibold">Activa</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Configuración</h1>
          <p className="text-gray-400">Administra tus preferencias y configuraciones</p>
        </div>

        {/* Mensaje de Estado */}
        <AnimatePresence>
          {mensaje && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-500/20 border border-green-500/50 text-green-300 p-4 rounded-lg"
            >
              <p className="text-sm font-medium text-center">{mensaje}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Layout con Menú y Contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Menú Lateral */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 space-y-2">
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => setSeccionActiva(item.id)}
                  whileHover={{ x: 5 }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    seccionActiva === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {item.icono}
                  <span className="font-medium">{item.nombre}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Contenido */}
          <div className="lg:col-span-3">
            <div className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6">
              {renderContenido()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachConfiguracion;