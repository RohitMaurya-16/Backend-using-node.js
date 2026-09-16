// import * as db from '../db.js';
// import { CustomNotFoundError } from '../../middleWare/errors/CustomNotFoundError.js';

// export async function getProduct(req,res)
// {
// const prd=await db.getAllProduct();
// res.render("view/products/list",{prd});
// }

// export async function getProductById(req,res){
//     const prdId= Number(req.params.prdId);
//     const prdn=await db.getProductById(prdId);

//     if(!prdn)
//     {
//         throw new CustomNotFoundError("Product not found ?");
//     }
//     res.render("view/products/list", {prdn});
// }

import * as db from '../db.js';
import { CustomNotFoundError } from '../../middleWare/errors/CustomNotFoundError.js';

// 1. Saare products ki list render karne ke liye
export async function getProduct(req, res) {
    const search = req.query.search?.trim().toLowerCase() || "";
    const products = await db.getAllProducts();
    const prd = search
        ? products.filter(product =>
            `${product.name} ${product.description}`.toLowerCase().includes(search)
        )
        : products;
    
    // ⚠️ 'view/' hatakar sirf 'products/list' likhein
    res.render("products/list", { prd, search });
}

// 2. Ek specific product ki detail render karne ke liye
export async function getProductById(req, res) {
    const prdId = Number(req.params.prdId);
    const prdn = await db.getProductById(prdId);

    if (!prdn) {
        throw new CustomNotFoundError("Product not found!");
    }

    // Single product ke liye detail view render karein (e.g., products/detail)
    res.render("products/detail", { prdn });
}