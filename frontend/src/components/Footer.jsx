import { FiShield } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <FiShield className="h-5 w-5 text-primary-600" />
            <span className="text-sm font-semibold text-gray-900">
              Vein<span className="text-primary-600">Pay</span>
            </span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} VeinPay. Biometric vein pattern authentication.
          </p>
        </div>
      </div>
    </footer>
  );
}
