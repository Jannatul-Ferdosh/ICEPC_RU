module.exports = function asyncMiddleware (handler){
    return async(req,res,next) => {
        try{
            await handler();
        }
        catch (er)
        {
            next(er);
        }
    }
}