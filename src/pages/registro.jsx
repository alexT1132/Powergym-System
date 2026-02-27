import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Registro = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [memberId, setMemberId] = useState('');

  // detect if estamos dentro del panel de recepcion (admin/recepcionista)
  const inPanel = user && location.pathname.startsWith('/recepcion');

  // Estado para formulario de cliente
  const [formCliente, setFormCliente] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    password: '',
    confirmPassword: '',
    tipoMembresia: '',
    precio: ''
  });

  const handleChangeCliente = (e) => {
    setFormCliente({
      ...formCliente,
      [e.target.name]: e.target.value
    });
    setMensaje('');
  };

  // Función para generar ID automático de 3 o más dígitos
  const generarMemberId = () => {
    // Genera un número aleatorio entre 100 y 999999
    const randomId = Math.floor(Math.random() * (999999 - 100 + 1)) + 100;
    return randomId.toString().padStart(3, '0');
  };

  // Función para obtener el texto del periodo según el tipo de membresía
  const obtenerTextoPeriodo = () => {
    switch(formCliente.tipoMembresia) {
      case 'diaria':
        return 'Diaria';
      case 'semanal':
        return 'Semanal';
      case 'mensual':
        return 'Mensual';
      default:
        return '';
    }
  };

  const handleSubmitCliente = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (formCliente.password !== formCliente.confirmPassword) {
      setMensaje('Las contraseñas no coinciden');
      return;
    }

    if (formCliente.password.length < 6) {
      setMensaje('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!formCliente.tipoMembresia) {
      setMensaje('Por favor selecciona un tipo de membresía');
      return;
    }

    if (!formCliente.precio || formCliente.precio <= 0) {
      setMensaje('Por favor ingresa un precio válido');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formCliente)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Hubo un error');
      setMemberId(data.memberId);
      setShowModal(true);
    } catch (err) {
      setMensaje(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    // Si no hay usuario (registro público) enviamos a login,
    // si hay usuario (admin en panel) volvemos al panel de recepcion
    setTimeout(() => {
      if (user) {
        navigate('/recepcion');
      } else {
        navigate('/login');
      }
    }, 300);
  };

  return (
    <div className={
        inPanel
          ? "w-full h-full flex items-start justify-center py-8"
          : "min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-12"
      }>
      {/* Logo flotante en la esquina superior izquierda (oculto dentro del panel) */}
      {!inPanel && (
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute top-6 left-6 flex items-center space-x-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-lg">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" 
              />
            </svg>
          </div>
          <span className="text-white font-bold text-xl hidden sm:block">
            PowerGym
          </span>
        </motion.div>
      )}

      {/* Contenido Principal */}
      <div className={inPanel ? "flex items-start justify-center w-full h-full px-6" : "flex items-center justify-center min-h-screen px-4 py-12"}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className={inPanel ? "w-full max-w-4xl mx-auto" : "w-full max-w-2xl"}
        >
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
            {/* Encabezado */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mb-4">
                <svg 
                  className="w-8 h-8 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Registro de Miembro
              </h2>
              <p className="text-gray-300">
                Completa tus datos para unirte a PowerGym
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmitCliente} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formCliente.nombre}
                    onChange={handleChangeCliente}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="María"
                  />
                </div>

                {/* Apellido */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={formCliente.apellido}
                    onChange={handleChangeCliente}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="García"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formCliente.email}
                  onChange={handleChangeCliente}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formCliente.telefono}
                    onChange={handleChangeCliente}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="1234567890"
                  />
                </div>

                {/* Fecha de Nacimiento */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    value={formCliente.fechaNacimiento}
                    onChange={handleChangeCliente}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formCliente.password}
                    onChange={handleChangeCliente}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formCliente.confirmPassword}
                    onChange={handleChangeCliente}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Sección de Membresía */}
              <div className="pt-4 border-t border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Información de Membresía
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tipo de Membresía */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tipo de Membresía
                    </label>
                    <select
                      name="tipoMembresia"
                      value={formCliente.tipoMembresia}
                      onChange={handleChangeCliente}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="" className="bg-slate-800">Selecciona el tipo</option>
                      <option value="diaria" className="bg-slate-800">Diaria</option>
                      <option value="semanal" className="bg-slate-800">Semanal</option>
                      <option value="mensual" className="bg-slate-800">Mensual</option>
                    </select>
                  </div>

                  {/* Precio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Precio
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                        $
                      </span>
                      <input
                        type="number"
                        name="precio"
                        value={formCliente.precio}
                        onChange={handleChangeCliente}
                        required
                        min="1"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        placeholder="100.00"
                      />
                    </div>
                  </div>
                </div>

                {/* Vista previa de membresía */}
                {formCliente.tipoMembresia && formCliente.precio > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                  >
                    <p className="text-sm text-blue-300 text-center">
                      <span className="font-semibold">Membresía seleccionada:</span> {obtenerTextoPeriodo()} - ${parseFloat(formCliente.precio).toFixed(2)}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Mensaje de Error */}
              {mensaje && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-red-500/20 border border-red-500/50"
                >
                  <p className="text-sm font-medium text-red-300 text-center">{mensaje}</p>
                </motion.div>
              )}

              {/* Botón Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                        fill="none"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  'Registrar Miembro'
                )}
              </motion.button>

              {/* Link a Login - sólo si no hay usuario autenticado (admin en panel no lo ve) */}
              {!user && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-400">
                    ¿Ya tienes una cuenta?{' '}
                    <button
                      type="button"
                      onClick={() => navigate('/login')}
                      className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                    >
                      Inicia sesión aquí
                    </button>
                  </p>
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>

      {/* Modal de Éxito con ID */}
      <AnimatePresence>
        {showModal && (
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
              className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl max-w-md w-full"
            >
              {/* Icono de Éxito */}
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full"
                >
                  <svg 
                    className="w-10 h-10 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </motion.div>
              </div>

              {/* Título */}
              <h3 className="text-2xl font-bold text-white text-center mb-4">
                ¡Registro Exitoso!
              </h3>

              {/* Mensaje */}
              <p className="text-gray-300 text-center mb-6">
                Tu cuenta ha sido creada exitosamente. Este es tu ID de miembro:
              </p>

              {/* ID del Miembro */}
              <div className="bg-white/10 border-2 border-blue-500/50 rounded-xl p-6 mb-6">
                <p className="text-sm text-gray-400 text-center mb-2">
                  Tu ID de Miembro
                </p>
                <motion.p
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                  className="text-5xl font-bold text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
                >
                  {memberId}
                </motion.p>
              </div>

              {/* Información de Membresía */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-300 text-center">
                  <strong>Membresía:</strong> {obtenerTextoPeriodo()} - ${parseFloat(formCliente.precio).toFixed(2)}
                </p>
              </div>

              {/* Nota Importante */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg 
                    className="w-5 h-5 text-yellow-400 mr-3 mt-0.5 flex-shrink-0" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                    />
                  </svg>
                  <p className="text-sm text-yellow-200">
                    <strong>Importante:</strong> Guarda este ID, lo necesitarás para registrar tu asistencia y acceder al gimnasio.
                  </p>
                </div>
              </div>

              {/* Botón de Cerrar */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCerrarModal}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
              >
                {user ? 'Aceptar' : 'Ir a Iniciar Sesión'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Registro;