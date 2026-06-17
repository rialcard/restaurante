import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import Spinner from '../../components/ui/Spinner'

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const [isLogin, setIsLogin] = useState(searchParams.get('modo') !== 'registro')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nombre, setNombre] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { session, signIn, signUp } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (session) navigate('/', { replace: true })
  }, [session, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      if (isLogin) {
        await signIn(email, password)
        showToast('¡Bienvenido de nuevo!', 'success')
        navigate('/')
      } else {
        if (!nombre.trim()) {
          showToast('El nombre completo es obligatorio.', 'error')
          setSubmitting(false)
          return
        }
        await signUp(email, password, nombre)
        showToast('Cuenta creada. Revisa tu correo para confirmar el registro.', 'success')
        setIsLogin(true)
      }
    } catch (err) {
      const msg = err.message || 'Error desconocido'
      if (msg.includes('Invalid login credentials')) {
        showToast('Email o contraseña incorrectos.', 'error')
      } else if (msg.includes('User already registered')) {
        showToast('Ya existe una cuenta con ese email.', 'error')
      } else if (msg.includes('Password should be')) {
        showToast('La contraseña debe tener al menos 6 caracteres.', 'error')
      } else {
        showToast(msg, 'error')
      }
    }
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Imagen izquierda */}
      <div className="hidden lg:flex lg:w-[55%] relative items-center justify-center overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3616956/pexels-photo-3616956.jpeg?auto=compress&cs=tinysrgb&w=1280"
          alt="Parrilla Estan Burger"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/65 to-surface/30 z-10" />
        <div className="relative z-20 text-center px-12 max-w-lg">
          <span className="icon text-8xl text-secondary-container block mb-6">local_fire_department</span>
          <h2 className="font-display font-black text-headline-xl text-on-surface mb-4">
            Fuego. Sabor. Actitud.
          </h2>
          <p className="text-body-lg text-on-surface-variant font-body">
            Únete a nuestra comunidad y reserva tu mesa en el mejor restaurante de hamburguesas artesanales.
          </p>
        </div>
      </div>

      {/* Formulario derecha */}
      <div className="flex-1 lg:w-[45%] flex items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="font-display font-black text-headline-lg text-secondary-container uppercase tracking-tight block mb-1">
              Estan Burger
            </Link>
            <p className="text-body-md text-on-surface-variant font-body">
              {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta gratis'}
            </p>
          </div>

          {/* Toggle login/registro */}
          <div className="relative flex p-1 bg-surface-container rounded-xl mb-6 border border-outline-variant/30">
            <div
              className={`absolute top-1 bottom-1 w-1/2 bg-surface-variant rounded-lg transition-transform duration-300 ${isLogin ? 'left-1 translate-x-0' : 'left-1 translate-x-full'}`}
            />
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`relative flex-1 py-2 text-label-bold font-body uppercase tracking-wider rounded-lg transition-colors z-10 ${isLogin ? 'text-on-surface' : 'text-on-surface-variant'}`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`relative flex-1 py-2 text-label-bold font-body uppercase tracking-wider rounded-lg transition-colors z-10 ${!isLogin ? 'text-on-surface' : 'text-on-surface-variant'}`}
            >
              Registrarse
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {!isLogin && (
              <div>
                <label className="field-label">Nombre completo</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Tu nombre y apellidos"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  required={!isLogin}
                  autoComplete="name"
                />
              </div>
            )}

            <div>
              <label className="field-label">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="field-label">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="icon text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-2" disabled={submitting}>
              {submitting
                ? <Spinner size="sm" />
                : <>
                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    <span className="icon">arrow_forward</span>
                  </>
              }
            </button>
          </form>

          <p className="text-center text-caption text-on-surface-variant font-body mt-6">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              type="button"
              onClick={() => setIsLogin(v => !v)}
              className="text-secondary-container hover:underline font-medium"
            >
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
