export interface WeatherOptions {
  cloudDensity?: number;
  SunIntensity?: number;
  sunIntensity?: number;
  rainParam?: (number|string)[];
  snowParam?: (number|string)[];
}

export const changeWeather = (options: WeatherOptions): void => {
  try {
    if (!(window as any).fdapi?.weather) {
      throw new Error('Weather API not available');
    }

    const weatherApi = (window as any).fdapi.weather;
    
    // Disable rain/snow first
    weatherApi.disableRainSnow();

    // Apply weather options
    Object.entries(options).forEach(([key, value]) => {
      const methodName = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      
      if (weatherApi[methodName]) {
        if (Array.isArray(value)) {
          weatherApi[methodName](...value);
        } else {
          weatherApi[methodName](value);
        }
      } else {
        console.warn(`Weather API method ${methodName} not found`);
      }
    });
  } catch (error) {
    console.error('Error changing weather:', error);
    throw error;
  }
};

export const formatTimeFromSeconds = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const getHourMinuteFromSeconds = (seconds: number): [string, string] => {
  const [hourStr, fraction] = (seconds / 60 / 60).toFixed(2).split('.');
  const hour = hourStr;
  const minutes = Math.floor(Number('0.' + fraction) * 60)
    .toString()
    .padStart(2, '0');
  return [hour, minutes];
};