import { Categoria,Producto} from '../models/index.js';


const obtenerProductos = async (req, res) => {

    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true };

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
            .populate('categoria','nombre')
    ])

    const productosPretty = productos.map((prod) => {
        
        const { _id, nombre, categoria, precio, estado, disponible, usuario } = prod;

        return { idProducto: _id, 
                nombreProducto: nombre, 
                nombreCategoria: categoria.nombre, 
                precio, 
                estado, 
                disponible, 
                nombreUsuario: usuario.nombre 
            }

    })

    res.json({
        total,
        productosPretty
    })

}

const obtenerProducto = async(req, res) => {

    const {id} = req.params;

    const producto = await Producto.findById(id).populate('usuario','nombre').populate('categoria','nombre');

    res.json({
        producto
    })

}

const crearProducto = async (req,res) => {
    
    const nombre = req.body.nombre.toUpperCase();
    const categoria = req.body.categoria.toUpperCase();
    const precio = req.body.precio;


    const productoDB = await Producto.findOne({ nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre } ya existe`
        })
    }

    const categoriaDB = await Categoria.findOne({ nombre: categoria });

    const idCategoria = categoriaDB._id;

    // Generar la data a guardar

    const data = {
        nombre,
        usuario: req.usuario._id,
        categoria: idCategoria,
        precio
    }

    const producto = new Producto(data);

    //Guardar BD
    await producto.save();

    res.status(201).json( producto );
}

const actualizarProducto = async (req,res) => {

    // Parametro ID que llega en la url
    const {id} = req.params;

    // Constantes para asignar los valores que vienen en el body
    const nombre = req.body.nombre.toUpperCase();
    const categoria = req.body.categoria.toUpperCase();
    const estado = req.body.estado;
    const precio = req.body.precio;
    const disponible = req.body.disponible;
    const usuario = req.usuario._id;

    // Obtener categoría
    const categoriaDB = await Categoria.findOne({ nombre: categoria });
    const idCategoria = categoriaDB._id;

    // Generar data para actualizar producto
    const data = {nombre,categoria:idCategoria,estado,disponible,precio,usuario};
    
    // Actualizar producto en BD
    const producto = await Producto.findByIdAndUpdate(id,data,{ new:true });

    // Respuesta con producto actualizado
    res.json(producto);

}

const borrarProducto = async(req,res) => {

    const { id } = req.params;

    const usuario = req.usuario;

    const productoBorrado = await Producto.findByIdAndUpdate(id,{estado:false, usuario:usuario._id},{new:true})

    res.json(productoBorrado );
}

export {
        crearProducto,
        obtenerProductos,
        obtenerProducto,
        actualizarProducto,
        borrarProducto
    }