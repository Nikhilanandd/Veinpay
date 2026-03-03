import { FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const variants = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: FiCheckCircle,
    iconColor: 'text-green-500',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: FiXCircle,
    iconColor: 'text-red-500',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: FiAlertCircle,
    iconColor: 'text-yellow-500',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: FiInfo,
    iconColor: 'text-blue-500',
  },
};

export default function StatusMessage({ type = 'info', message, className = '' }) {
  if (!message) return null;

  const variant = variants[type] || variants.info;
  const Icon = variant.icon;

  return (
    <div
      className={`flex items-start space-x-3 p-4 rounded-lg border ${variant.bg} ${variant.border} ${className}`}
    >
      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${variant.iconColor}`} />
      <p className={`text-sm font-medium ${variant.text}`}>{message}</p>
    </div>
  );
}
