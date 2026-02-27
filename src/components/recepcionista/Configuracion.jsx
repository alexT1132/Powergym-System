import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Configuracion = () => {
  const [seccionActiva, setSeccionActiva] = useState('perfil');
  const [mensaje, setMensaje] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Estados para Configuración de Perfil
  const [perfil, setPerfil] = useState({
    nombre: 'Recepción',
    email: 'recepcion@powergym.com',
    telefono: '1234567890',
    rol: 'Administrador'
  });

  // Estados para Configuración del Gimnasio
  const [gimnasio, setGimnasio] = useState({
    nombreGimnasio: 'PowerGym',
    direccion: 'Av. Principal #123, Ciudad',
    telefono: '0987654321',
    email: 'contacto@powergym.com',
    horarioApertura: '06:00',
    horarioCierre: '22:00'
  });

  // Estados para Configuración de Precios
  const [precios, setPrecios] = useState({
    membresiaDiaria: 50,
    membresiaSemanal: 300,
    membresiaMensual: 1000
  });

  // Estados para Notificaciones
  const [notificaciones, setNotificaciones] = useState({
    emailPagos: true,
    emailVencimientos: true,
    emailNuevosMiembros: false,
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

  const handleGuardarGimnasio = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setMensaje('Configuración del gimnasio actualizada');
      setTimeout(() => setMensaje(''), 3000);
    }, 1000);
  };

  const handleGuardarPrecios = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setMensaje('Precios actualizados exitosamente');
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

  const menuItems = [
    { id: 'perfil', nombre: 'Mi Perfil', icono: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { id: 'gimnasio', nombre: 'Gimnasio', icono: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )},
    { id: 'precios', nombre: 'Precios', icono: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
              <p className="text-gray-400">Administra tu información personal</p>
            </div>

            <form onSubmit={handleGuardarPerfil} className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-4xl">R</span>
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
                    Rol
                  </label>
                  <input
                    type="text"
                    value={perfil.rol}
                    disabled
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
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

      case 'gimnasio':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Configuración del Gimnasio</h2>
              <p className="text-gray-400">Información general del establecimiento</p>
            </div>

            <form onSubmit={handleGuardarGimnasio} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre del Gimnasio
                  </label>
                  <input
                    type="text"
                    value={gimnasio.nombreGimnasio}
                    onChange={(e) => setGimnasio({ ...gimnasio, nombreGimnasio: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={gimnasio.telefono}
                    onChange={(e) => setGimnasio({ ...gimnasio, telefono: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={gimnasio.direccion}
                    onChange={(e) => setGimnasio({ ...gimnasio, direccion: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={gimnasio.email}
                    onChange={(e) => setGimnasio({ ...gimnasio, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Horario de Operación
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">Apertura</label>
                      <input
                        type="time"
                        value={gimnasio.horarioApertura}
                        onChange={(e) => setGimnasio({ ...gimnasio, horarioApertura: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">Cierre</label>
                      <input
                        type="time"
                        value={gimnasio.horarioCierre}
                        onChange={(e) => setGimnasio({ ...gimnasio, horarioCierre: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
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
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
              </motion.button>
            </form>
          </div>
        );

      case 'precios':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Configuración de Precios</h2>
              <p className="text-gray-400">Gestiona los precios de las membresías</p>
            </div>

            <form onSubmit={handleGuardarPrecios} className="space-y-6">
              <div className="space-y-4">
                {/* Membresía Diaria */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Membresía Diaria</h3>
                      <p className="text-gray-400 text-sm">Acceso por 1 día</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">$</span>
                      <input
                        type="number"
                        value={precios.membresiaDiaria}
                        onChange={(e) => setPrecios({ ...precios, membresiaDiaria: parseInt(e.target.value) })}
                        className="w-32 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Membresía Semanal */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Membresía Semanal</h3>
                      <p className="text-gray-400 text-sm">Acceso por 7 días</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">$</span>
                      <input
                        type="number"
                        value={precios.membresiaSemanal}
                        onChange={(e) => setPrecios({ ...precios, membresiaSemanal: parseInt(e.target.value) })}
                        className="w-32 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Membresía Mensual */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Membresía Mensual</h3>
                      <p className="text-gray-400 text-sm">Acceso por 30 días</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">$</span>
                      <input
                        type="number"
                        value={precios.membresiaMensual}
                        onChange={(e) => setPrecios({ ...precios, membresiaMensual: parseInt(e.target.value) })}
                        className="w-32 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
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
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
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
                {/* Email - Pagos */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Notificaciones de Pagos</h3>
                      <p className="text-gray-400 text-sm">Recibe alertas por email cuando se registren pagos</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificaciones.emailPagos}
                        onChange={(e) => setNotificaciones({ ...notificaciones, emailPagos: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Email - Vencimientos */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Alertas de Vencimientos</h3>
                      <p className="text-gray-400 text-sm">Recibe notificaciones de membresías próximas a vencer</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificaciones.emailVencimientos}
                        onChange={(e) => setNotificaciones({ ...notificaciones, emailVencimientos: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Email - Nuevos Miembros */}
                <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Nuevos Miembros</h3>
                      <p className="text-gray-400 text-sm">Recibe notificaciones cuando se registren nuevos miembros</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificaciones.emailNuevosMiembros}
                        onChange={(e) => setNotificaciones({ ...notificaciones, emailNuevosMiembros: e.target.checked })}
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
                      <p className="text-gray-400 text-sm">Envía recordatorios automáticos a los miembros</p>
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
          <p className="text-gray-400">Administra las preferencias del sistema</p>
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

export default Configuracion;