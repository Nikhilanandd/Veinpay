import { Link } from 'react-router-dom';
import { FiShield, FiUserPlus, FiLogIn, FiCpu, FiLock, FiZap } from 'react-icons/fi';

const features = [
  {
    icon: FiCpu,
    title: 'AI-Powered Recognition',
    description:
      'MobileNetV2 deep learning model extracts unique vein pattern embeddings for highly accurate biometric matching.',
  },
  {
    icon: FiLock,
    title: 'Secure by Design',
    description:
      'Only mathematical embeddings are stored — never raw images. Your biometric data stays private and protected.',
  },
  {
    icon: FiZap,
    title: 'Fast & Contactless',
    description:
      'Authenticate in seconds with just a vein image. No fingerprints, no passwords, no physical contact required.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Capture Vein Image',
    description: 'Upload or capture your hand/wrist vein pattern using a camera.',
  },
  {
    step: '02',
    title: 'AI Processing',
    description: 'Gabor filters enhance veins, then MobileNetV2 extracts a unique embedding vector.',
  },
  {
    step: '03',
    title: 'Secure Match',
    description: 'Cosine similarity compares your pattern against stored embeddings for authentication.',
  },
];

export default function Landing() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)',
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <FiShield className="h-4 w-4" />
              <span className="text-sm font-medium">Biometric Authentication Platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Authentication by
              <span className="block text-primary-300">Vein Pattern</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-primary-100 mb-10">
              VeinPay uses advanced computer vision and deep learning to authenticate users
              through their unique vein patterns — contactless, secure, and fast.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors shadow-lg"
              >
                <FiUserPlus className="h-5 w-5 mr-2" />
                Register Now
              </Link>
              <Link
                to="/authenticate"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-primary-600 text-white font-semibold rounded-lg border border-primary-400 hover:bg-primary-500 transition-colors"
              >
                <FiLogIn className="h-5 w-5 mr-2" />
                Authenticate
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Vein Authentication?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Vein patterns are internal, unique, and nearly impossible to forge — making them one of the most secure biometric identifiers available.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="card p-8 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-600 rounded-xl mb-5">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A three-step pipeline from image capture to authenticated access.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="relative">
                <div className="card p-8">
                  <span className="text-5xl font-extrabold text-primary-100">{item.step}</span>
                  <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-primary-100 mb-8">
            Register your vein pattern now and experience the future of biometric authentication.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors shadow-lg"
          >
            <FiUserPlus className="h-5 w-5 mr-2" />
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
