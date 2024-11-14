

const addProduct = async (req, res) => {
    try {
        const user = req.user;
        const {title, description, categoryId, price, stock, images} = req.body;

        if(!title ||
            !description ||
            !categoryId ||
            !price ||
            !stock){
                return res.status(400).json({
                    success: false,
                    message : "Fill all the mandatory fields"
                });
            }

        if(!images || images.length == 0){
            return res.status(400).json({
                success: false,
                message: "Add atleast one image"
            })
        }

        


    } catch (error) {
        
    }
}

module.exports = {addProduct}