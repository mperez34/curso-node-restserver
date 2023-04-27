import {Categoria} from '../models/index.js';

// ObtenerCategorias - paginado - total - populate

const obtenerCategorias = async (req, res) => {

    const { limite = 5, desde = 0 } = req.query;

    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
    ])

    const categoriaPretty = categorias.map((cat) => {
        
        const { _id, nombre, estado, usuario } = cat;
        return { idCategoria: _id, nombreCategoria: nombre, estado, nombreUsuario: usuario.nombre }

    })

    res.json({
        total,
        categoriaPretty
    })

}

const obtenerCategoria = async (req, res) => {

    const { id } = req.params;

    const categoria = await Categoria.findById(id).populate('usuario','nombre');

    res.json({
        categoria
    })
}

const crearCategoria = async (req,res) => {
    
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre } ya existe`
        })
    }

    // Generar la data a guardar

    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //Guardar BD
    await categoria.save();

    res.status(201).json( categoria );
}

const actualizarCategoria = async(req,res) => {

    const { id } = req.params;

    const nombre = req.body.nombre.toUpperCase();
    const estado = req.body.estado;
    const usuario = req.usuario._id;

    const data = {nombre,estado,usuario}

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true})

    res.json(categoria);

}

const borrarCategoria = async(req,res) => {
    
    const { id } = req.params;

    const usuario = req.usuario;
    const categoria = await Categoria.findByIdAndUpdate(id,{estado: false, usuario: usuario._id},{new: true});

    res.json(categoria)
}


export {
        crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        borrarCategoria
    }