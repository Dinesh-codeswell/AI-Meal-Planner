
import React from 'react';

// All icons are designed to inherit color via `stroke="currentColor"` or `fill="currentColor"`
// className will be used to set size and color.

export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
  </svg>
);

export const RefreshCwIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const ZapIcon: React.FC<{ className?: string }> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);

export const ProteinIcon: React.FC<{ className?: string }> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9.75A2.25 2.25 0 0 0 19.5 7.5h-15A2.25 2.25 0 0 0 2.25 9.75v4.5A2.25 2.25 0 0 0 4.5 16.5h15a2.25 2.25 0 0 0 2.25-2.25v-4.5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 7.5V6a2.25 2.25 0 0 0-2.25-2.25h-4.5A2.25 2.25 0 0 0 7.5 6v1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 16.5v1.5a2.25 2.25 0 0 0 2.25 2.25h3a2.25 2.25 0 0 0 2.25-2.25v-1.5" />
</svg>
);

export const LeafIcon: React.FC<{ className?: string }> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.002 9.002 0 0 0 9-9c0-4.968-4.032-9-9-9s-9 4.032-9 9a9.002 9.002 0 0 0 9 9Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.002 9.002 0 0 0 9-9c0-4.968-4.032-9-9-9s-9 4.032-9 9a9.002 9.002 0 0 0 9 9Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.788 15.212A9.025 9.025 0 0 1 12 3a9.025 9.025 0 0 1 8.212 12.212" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.212 8.788A9.025 9.025 0 0 1 12 21a9.025 9.025 0 0 1-8.212-12.212" />
  </svg>
);

export const DropletIcon: React.FC<{ className?: string }> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c3.036 0 5.5-2.464 5.5-5.5 0-2.028-1.105-3.783-2.75-4.693V3.75a1.5 1.5 0 0 0-1.5-1.5h-2.5a1.5 1.5 0 0 0-1.5 1.5v7.807C7.605 12.467 6.5 14.222 6.5 16.25c0 3.036 2.464 5.5 5.5 5.5Z" />
  </svg>
);

export const AlertTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
  </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
  </svg>
);

export const AtomIcon: React.FC<{ className?: string }> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm0 0a8.949 8.949 0 0 0 5.038-1.657M12 21a8.949 8.949 0 0 1-5.038-1.657M12 3a8.949 8.949 0 0 1 5.038 1.657M12 3a8.949 8.949 0 0 0-5.038 1.657m10.076 0A8.966 8.966 0 0 1 21 12M3 12a8.966 8.966 0 0 1 4.038-7.343M16.962 4.657A8.95 8.95 0 0 1 12 21M7.038 19.343A8.95 8.95 0 0 1 12 3m0 0v.001m0 17.998V12m0-9v.001M12 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
  </svg>
);

export const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  </svg>
);

export const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21c3.978 0 7.44-2.135 9.002-5.25Z" />
  </svg>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

export const ClipboardListIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 6.45 3.75H6a2.25 2.25 0 0 0-2.25 2.25v12A2.25 2.25 0 0 0 6 20.25h9A2.25 2.25 0 0 0 17.25 18v-2.25A2.25 2.25 0 0 0 15 13.5H9.75Z" />
  </svg>
);

export const CalendarDaysIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-3.75h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008Zm0 2.25h.008v.008H9.75V18Zm2.25-4.5h.008v.008H12v-.008Zm0 2.25h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008Zm2.25-4.5h.008v.008H14.25v-.008Zm0 2.25h.008v.008H14.25V15Zm0 2.25h.008v.008H14.25v-.008Z" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.5 13.5h.008v.008H16.5v-.008Z" />
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const FoodPlateIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.187 11.19a9.75 9.75 0 0 1-8.373 8.374m8.373-8.374a9.708 9.708 0 0 1-3.084 7.288m3.084-7.288H12.75M3.75 12C3.75 6.892 7.892 2.75 13 2.75m0 0v.01M13 2.76a9.718 9.718 0 0 0-3.13-.709m-4.706 4.708a9.75 9.75 0 1 0 12.538 12.536A9.708 9.708 0 0 1 12.81 21.188" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.752 10.022a2.502 2.502 0 0 1 2.48-2.27M6.75 13.5C6.75 9.664 9.664 6.75 13.5 6.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15.75a3 3 0 0 1-3 3M9 12.75a3 3 0 0 1 3-3" />
  </svg>
);

export const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a3 3 0 0 0-3-3m3 3a3 3 0 0 0 3-3m-3 3V11.25m2.25 4.5V18m-.008-6.75h.008v.008H14.25V11.25Zm-4.5 0H9.75v.008H9.75V11.25Zm0 0A2.25 2.25 0 0 1 12 9m0 0A2.25 2.25 0 0 0 9.75 11.25M12 9m0 0A2.25 2.25 0 0 1 14.25 11.25M12 9V6.75M9.75 11.25A2.25 2.25 0 0 0 12 9m2.25 2.25A2.25 2.25 0 0 1 12 9m0 2.25V6.375c0-.621.504-1.125 1.125-1.125h.008c.006 0 .01 0 .014-.002l.006-.001c.616 0 1.123.505 1.123 1.125V9.75M12 6.375C12 5.754 11.496 5.25 10.875 5.25h-.008a1.125 1.125 0 0 0-1.124 1.123L9.75 9.75M12 12.75a.75.75 0 0 0 .75-.75V11.25a.75.75 0 0 0-.75-.75H9.75a.75.75 0 0 0-.75.75V12a.75.75 0 0 0 .75.75H12Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a.75.75 0 0 1 .75-.75H14.25a.75.75 0 0 1 .75.75V12a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75V11.25a.75.75 0 0 1 .75-.75H12Zm0 0h-.008v.008H12V12.75Z" />
  </svg>
);

export const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);
