
export const validateName = (value: string): boolean => {
    const nameRegex = /^[A-ZА-ЯЇІЄҐ'\s]{2,50}$/i;
    return nameRegex.test(value.trim());
};

export const validatePhone = (value: string): boolean => {
    const digits = value.replace(/\D/g, '');
    return digits.length == 9;
};

export const validateDate = (value: string): boolean => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const [year, month, day] = value.split('-').map(Number);
    if (month < 1 || month > 12) return false;

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return false;

    const selectedDate = new Date(year, month - 1, day);
    selectedDate.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return selectedDate >= today;
};