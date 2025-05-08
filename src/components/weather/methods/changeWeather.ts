export const changeWeather = (options) => {
    fdapi.weather.disableRainSnow()
    Object.entries(options).forEach(([key, value]) => {
        const methodName = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`
        if (fdapi.weather[methodName]) {
            Array.isArray(value) ? fdapi.weather[methodName](...value) :
                fdapi.weather[methodName](value)
        }
    })
}