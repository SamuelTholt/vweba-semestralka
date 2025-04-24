import HttpError from "./HttpError.js";

const checkValidation = (errors, res) => {
    if(!errors.isEmpty())
    {
        const errMess = errors.array()
        .map((eror) => `${eror.path}  ${eror.msg}`)
        .join(",");
        
        throw new HttpError(errMess, 400);
    }
}

export default checkValidation;