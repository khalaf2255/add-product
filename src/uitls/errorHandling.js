export const asyncHendler = (fu) => {
    return (req, res, next) =>
        fu(req, res, next).catch(error => {
            return next(new Error(error))
        })
}

export const globalError = (error, req, res, next) => {
    return res.send({
        message: "Global error",
        msgError: error.message,
        stack: error.stack
    })
} 