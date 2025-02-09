import multer , {StorageEngine} from "multer";

const storage : StorageEngine = multer.diskStorage({
    destination:(req , file , callback)=>{
        callback(null,'public/')
    },
    filename:(req, file ,callback)=> {
        const name = req.session.user.name.replace(' ', '_');
        const id = req.session.user.id
        const uniqueIdentifier = name + "&" + id + "@" + new Date().toLocaleDateString('en-CA');
        callback(null , `${uniqueIdentifier}_resume.pdf`)
    }
})

export const upload = multer({storage});