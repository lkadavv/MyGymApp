
export const validateName = (value: string): boolean => {
    const nameRegex = /^[A-ZА-ЯЇІЄҐ'\s]{2,50}$/i;
    return nameRegex.test(value.trim());
};

export const validatePhone = (value: string): boolean => {
    const digits = value.replace(/\\D/g, '');
    return digits.length >= 10 && digits.length <= 15;
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

export const formatPhoneNumber = (code: string, digits: string): string => {
    let formatted = '';
    
    if (code === '+380') {
        if (digits.length > 0) formatted += digits.substring(0, 2);
        if (digits.length > 2) formatted += ' ' + digits.substring(2, 5);
        if (digits.length > 5) formatted += ' ' + digits.substring(5, 7);
        if (digits.length > 7) formatted += ' ' + digits.substring(7, 9);
    } else if (code === '+1') { 
        if (digits.length > 0) formatted += digits.substring(0, 3);
        if (digits.length > 3) formatted += ' ' + digits.substring(3, 6);
        if (digits.length > 6) formatted += ' ' + digits.substring(6, 10);
    } else {
        if (digits.length > 0) formatted += digits.substring(0, 3);
        if (digits.length > 3) formatted += ' ' + digits.substring(3, 6);
        if (digits.length > 6) formatted += ' ' + digits.substring(6, 9);
    }
    
    return formatted;
};