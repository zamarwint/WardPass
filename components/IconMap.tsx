import { 
  User, Lock, Settings, CreditCard, Wallet, Activity, AlarmCheck, AlarmClock, 
  AlarmMinus, AlarmPlus, Album, Accessibility, Anchor, Apple, Archive, 
  ArchiveRestore, ArrowDown, ArrowUp, ArrowLeft, ArrowRight, ArrowRightFromLine, 
  ArrowRightToLine, ArrowLeftFromLine, ArrowLeftToLine, Badge, Banana, 
  BarChart, BarChart3, BatteryCharging, AtSign, BadgeAlert, Bell, 
  Fingerprint, HeartHandshake, FlagOff, HelpCircle, LucideIcon
} from 'lucide-react';

export const IconMap: Record<string, LucideIcon> = {
  'user': User,
  'lock': Lock,
  'settings': Settings,
  'credit-card': CreditCard,
  'wallet': Wallet,
  'activity': Activity,
  'alarm-check': AlarmCheck,
  'alarm-clock': AlarmClock,
  'alarm-minus': AlarmMinus,
  'alarm-plus': AlarmPlus,
  'album': Album,
  'accessibility': Accessibility,
  'anchor': Anchor,
  'apple': Apple,
  'archive': Archive,
  'archive-restore': ArchiveRestore,
  'arrow-down': ArrowDown,
  'arrow-up': ArrowUp,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'arrow-right-from-line': ArrowRightFromLine,
  'arrow-right-to-line': ArrowRightToLine,
  'arrow-left-from-line': ArrowLeftFromLine,
  'arrow-left-to-line': ArrowLeftToLine,
  'badge': Badge,
  'banana': Banana,
  'bar-chart': BarChart,
  'bar-chart-3': BarChart3,
  'battery-charging': BatteryCharging,
  'at-sign': AtSign,
  'badge-alert': BadgeAlert,
  'bell': Bell,
  'fingerprint-pattern': Fingerprint,
  'heart-handshake': HeartHandshake,
  'flag-off': FlagOff,
};

export const RenderIcon = ({ name, size = 24, className = "" }: { name: string, size?: number, className?: string }) => {
  const Icon = IconMap[name] || HelpCircle;
  return <Icon size={size} className={className} />;
};
