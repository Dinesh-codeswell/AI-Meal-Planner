import React from 'react';
import { XCircleIcon, ZapIcon, ProteinIcon, LeafIcon, DropletIcon, AtomIcon } from './icons';
import { motion } from 'framer-motion';

interface InfoModalProps {
  onClose: () => void;
}

const InfoSection: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode, delay: number }> = ({ title, icon, children, delay }) => (
  <motion.div 
    className="mb-6 p-4 bg-brand-surface dark:bg-dark-brand-surface/70 rounded-lg shadow"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: delay * 0.1 }}
  >
    <h3 className="text-xl font-semibold text-brand-primary dark:text-dark-brand-primary mb-2 flex items-center">
      {icon}
      {title}
    </h3>
    <div className="text-sm text-brand-text-secondary dark:text-dark-brand-text-secondary space-y-1">
      {children}
    </div>
  </motion.div>
);

const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose} 
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        className="bg-brand-background dark:bg-dark-brand-background text-brand-text-primary dark:text-dark-brand-text-primary p-6 md:p-8 rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative"
        onClick={(e) => e.stopPropagation()} // Prevent click inside from closing modal
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-brand-text-secondary dark:text-dark-brand-text-secondary hover:text-brand-primary dark:hover:text-dark-brand-primary transition-colors"
          aria-label="Close nutritional information"
        >
          <XCircleIcon className="w-8 h-8" />
        </button>

        <h2 className="text-2xl md:text-3xl font-bold text-brand-primary dark:text-dark-brand-primary mb-6 text-center">
          Understanding Your Nutrients
        </h2>

        <InfoSection title="Calories" icon={<ZapIcon className="w-6 h-6 mr-2 text-yellow-500 dark:text-yellow-400" />} delay={1}>
          <p>Calories are the units of energy your body gets from food and drinks. You need them for everything from breathing to exercising.</p>
          <p>The right amount depends on your age, sex, activity level, and health goals. This app provides an estimate to help you be more aware.</p>
        </InfoSection>

        <InfoSection title="Macronutrients" icon={<ProteinIcon className="w-6 h-6 mr-2 text-red-500 dark:text-red-400" />} delay={2}>
          <p>These are nutrients your body needs in larger amounts. They provide energy (calories) and are building blocks for growth and repair.</p>
          <ul className="list-disc list-inside pl-2 space-y-1 mt-2">
            <li><strong>Protein:</strong> Essential for building and repairing tissues (like muscles), making enzymes, and hormones. Found in meat, fish, dairy, eggs, legumes, and nuts.</li>
            <li><strong>Carbohydrates:</strong> Your body's main source of fuel. Found in grains (bread, pasta, rice), fruits, vegetables, and sugars. Choose complex carbs for sustained energy.</li>
            <li><strong>Fats:</strong> Important for energy storage, vitamin absorption, hormone production, and protecting organs. Healthy fats (unsaturated) are found in avocados, nuts, seeds, and olive oil.</li>
          </ul>
        </InfoSection>

        <InfoSection title="Micronutrients" icon={<AtomIcon className="w-6 h-6 mr-2 text-sky-500 dark:text-sky-400" />} delay={3}>
          <p>Vitamins and minerals are needed in smaller amounts but are crucial for overall health. They play vital roles in countless bodily functions.</p>
          <p>Examples include Vitamin C (immunity), Calcium (bone health), Iron (oxygen transport), and B Vitamins (energy metabolism). A varied, colorful diet rich in fruits and vegetables helps ensure you get a good range.</p>
        </InfoSection>
        
        <p className="text-xs text-center mt-6 text-brand-text-secondary dark:text-dark-brand-text-secondary">
            The information provided here is for general knowledge. Consult with a healthcare professional or registered dietitian for personalized dietary advice.
        </p>

      </motion.div>
    </div>
  );
};

export default InfoModal;
