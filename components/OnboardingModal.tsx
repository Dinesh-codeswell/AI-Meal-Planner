import React, { useState, useEffect } from 'react';
import { UserData, ActivityLevel, DietaryPreference, WeightUnit, HeightUnit } from '../types';
import { XCircleIcon, UserIcon, ChevronDownIcon } from './icons';
import { motion } from 'framer-motion';

interface OnboardingModalProps {
  currentData: UserData | null;
  onSave: (data: UserData) => void;
  onClose: () => void;
}

const commonInputClasses = "w-full px-3 py-2.5 bg-brand-surface dark:bg-dark-brand-surface-alt text-brand-text-primary dark:text-dark-brand-text-primary border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 placeholder-slate-400 dark:placeholder-slate-500";

const InputField: React.FC<{label: string, id: string, children: React.ReactNode, required?: boolean}> = ({ label, id, children, required }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-brand-text-secondary dark:text-dark-brand-text-secondary mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const SelectField: React.FC<{label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: {value: string, label: string}[], required?: boolean, placeholder?: string}> = 
  ({ label, id, value, onChange, options, required, placeholder }) => (
  <InputField label={label} id={id} required={required}>
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`${commonInputClasses} appearance-none pr-8`} // Added pr-8 for ChevronDownIcon
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <ChevronDownIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  </InputField>
);


const OnboardingModal: React.FC<OnboardingModalProps> = ({ currentData, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<UserData>>({
    name: '',
    age: undefined,
    weight: undefined,
    weightUnit: 'kg',
    height: undefined,
    heightUnit: 'cm',
    activityLevel: 'moderate',
    dietaryPreference: 'omnivore',
    allergies: '',
    calorieGoal: undefined,
    onboardingCompleted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (currentData) {
      setFormData(currentData);
    }
  }, [currentData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number | undefined = value;
    if (type === 'number') {
      processedValue = value === '' ? undefined : parseFloat(value);
      if (name === 'age' || name === 'calorieGoal') {
         processedValue = value === '' ? undefined : parseInt(value, 10);
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: processedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (formData.age !== undefined && (formData.age < 10 || formData.age > 100)) newErrors.age = "Age must be between 10 and 100.";
    if (formData.weight !== undefined && (formData.weight <= 0)) newErrors.weight = "Weight must be positive.";
    if (formData.height !== undefined && (formData.height <= 0)) newErrors.height = "Height must be positive.";
    if (formData.calorieGoal !== undefined && (formData.calorieGoal < 500 || formData.calorieGoal > 10000)) newErrors.calorieGoal = "Calorie goal seems unrealistic.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    const dataToSave: UserData = {
      name: formData.name || '',
      age: formData.age,
      weight: formData.weight,
      weightUnit: formData.weightUnit || 'kg',
      height: formData.height,
      heightUnit: formData.heightUnit || 'cm',
      activityLevel: formData.activityLevel || 'moderate',
      dietaryPreference: formData.dietaryPreference || 'omnivore',
      allergies: formData.allergies || '',
      calorieGoal: formData.calorieGoal,
      onboardingCompleted: true, // Mark as completed on save
    };
    onSave(dataToSave);
  };

  const activityLevels: {value: ActivityLevel, label: string}[] = [
    { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
    { value: 'light', label: 'Lightly Active (light exercise/sports 1-3 days/week)' },
    { value: 'moderate', label: 'Moderately Active (moderate exercise/sports 3-5 days/week)' },
    { value: 'active', label: 'Very Active (hard exercise/sports 6-7 days a week)' },
    { value: 'very_active', label: 'Super Active (very hard exercise/physical job & exercise)' },
  ];

  const dietaryPreferences: {value: DietaryPreference, label: string}[] = [
    { value: 'omnivore', label: 'Omnivore (Eat everything)' },
    { value: 'vegetarian', label: 'Vegetarian (No meat/fish)' },
    { value: 'vegan', label: 'Vegan (No animal products)' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <motion.div
        className="bg-brand-background dark:bg-dark-brand-background text-brand-text-primary dark:text-dark-brand-text-primary p-6 md:p-8 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto custom-scrollbar relative"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-brand-text-secondary dark:text-dark-brand-text-secondary hover:text-brand-primary dark:hover:text-dark-brand-primary transition-colors"
          aria-label="Close onboarding"
        >
          <XCircleIcon className="w-8 h-8" />
        </button>

        <div className="text-center mb-6">
          <UserIcon className="w-16 h-16 text-brand-primary dark:text-dark-brand-primary mx-auto mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold text-brand-primary dark:text-dark-brand-primary">
            {currentData?.onboardingCompleted ? 'Update Your Profile' : 'Personalize Your Experience'}
          </h2>
          <p className="text-sm text-brand-text-secondary dark:text-dark-brand-text-secondary mt-1">
            Help us tailor meal suggestions for you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Name (Optional)" id="name">
            <input type="text" name="name" id="name" value={formData.name || ''} onChange={handleChange} className={commonInputClasses} placeholder="e.g., Alex"/>
          </InputField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Age (Years)" id="age">
              <input type="number" name="age" id="age" value={formData.age || ''} onChange={handleChange} className={commonInputClasses} placeholder="e.g., 30"/>
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </InputField>
            <InputField label="Calorie Goal (kcal, Optional)" id="calorieGoal">
              <input type="number" name="calorieGoal" id="calorieGoal" value={formData.calorieGoal || ''} onChange={handleChange} className={commonInputClasses} placeholder="e.g., 2000"/>
              {errors.calorieGoal && <p className="text-red-500 text-xs mt-1">{errors.calorieGoal}</p>}
            </InputField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <InputField label="Weight" id="weight">
                    <input type="number" step="0.1" name="weight" id="weight" value={formData.weight || ''} onChange={handleChange} className={commonInputClasses} placeholder="e.g., 70"/>
                </InputField>
                {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
             </div>
             <SelectField label="Unit" id="weightUnit" value={formData.weightUnit || 'kg'} onChange={handleChange} options={[{value: 'kg', label: 'Kilograms (kg)'}, {value: 'lbs', label: 'Pounds (lbs)'}]} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <InputField label="Height" id="height">
                    <input type="number" step="0.1" name="height" id="height" value={formData.height || ''} onChange={handleChange} className={commonInputClasses} 
                           placeholder={formData.heightUnit === 'cm' ? "e.g., 175" : "e.g., 68 (total inches)"}/>
                </InputField>
                {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height}</p>}
            </div>
            <SelectField label="Unit" id="heightUnit" value={formData.heightUnit || 'cm'} onChange={handleChange} options={[{value: 'cm', label: 'Centimeters (cm)'}, {value: 'ft_in', label: 'Feet & Inches (provide total inches)'}]} />
          </div>


          <SelectField label="Activity Level" id="activityLevel" value={formData.activityLevel || 'moderate'} onChange={handleChange} options={activityLevels} />
          <SelectField label="Dietary Preference" id="dietaryPreference" value={formData.dietaryPreference || 'omnivore'} onChange={handleChange} options={dietaryPreferences} />

          <InputField label="Allergies or Dislikes (Optional, comma-separated)" id="allergies">
            <textarea name="allergies" id="allergies" value={formData.allergies || ''} onChange={handleChange} rows={2} className={commonInputClasses} placeholder="e.g., Peanuts, Shellfish, Very Spicy Food"></textarea>
          </InputField>
          
          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-brand-text-secondary dark:text-dark-brand-text-secondary hover:bg-slate-100 dark:hover:bg-dark-brand-surface-alt transition-all-smooth font-medium">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg shadow-md hover:shadow-lg transition-all-smooth font-semibold">
              Save Profile
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default OnboardingModal;
