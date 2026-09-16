const products = [
    { id: 1, name: "Phone", price: 20000, description: "AI powered smartphone with an OLED display" },
    { id: 2, name: "Laptop", price: 65000, description: "High performance gaming laptop with 16GB RAM" },
    { id: 3, name: "Smart Watch", price: 4500, description: "Waterproof fitness tracker with continuous heart monitor" },
    { id: 4, name: "Headphones", price: 3000, description: "Wireless noise-cancelling over-ear headphones" },
    { id: 5, name: "Tablet", price: 25000, description: "10-inch display tailored for work and entertainment" },
    { id: 6, name: "Camera", price: 45000, description: "4K mirrorless digital camera with kit lens" },
    { id: 7, name: "Speaker", price: 2500, description: "Portable bluetooth speaker with extra deep bass" },
    { id: 8, name: "Monitor", price: 12000, description: "24-inch full HD bezel-less IPS monitor" },
    { id: 9, name: "Keyboard", price: 1800, description: "Mechanical RGB backlit gaming keyboard" },
    { id: 10, name: "Mouse", price: 1200, description: "Ergonomic wireless optical mouse with adjustable DPI" },
    { id: 11, name: "Router", price: 3500, description: "Dual-band high speed Wi-Fi 6 router" },
    { id: 12, name: "Power Bank", price: 1500, description: "20000mAh fast charging compact power bank" },
    { id: 13, name: "Hard Drive", price: 5000, description: "2TB external portable hard drive for backup" },
    { id: 14, name: "Earbuds", price: 2200, description: "True wireless stereo earbuds with smart touch controls" },
    { id: 15, name: "Microphone", price: 6000, description: "USB condenser mic optimized for streaming and podcasts" },
    { id: 16, name: "Webcam", price: 4000, description: "1080p HD webcam with built-in privacy shutter" },
    { id: 17, name: "Desk Lamp", price: 1100, description: "Smart LED lamp with multiple adjustable brightness levels" },
    { id: 18, name: "Fitness Band", price: 1900, description: "Slim activity tracker featuring sleep monitoring" },
    { id: 19, name: "VR Headset", price: 35000, description: "Standalone virtual reality gaming headset" },
    { id: 20, name: "Gaming Chair", price: 15000, description: "Ergonomic high-back leather gaming chair" }
];


export async function getAllProduct()
{
    return products;
}

export async function getAllProducts()
{
    return getAllProduct();
}

export async function getProductById(id)
{
    return new Promise((resolve)=>
    {
        const product=products.find(prd=>prd.id===Number(id))

        resolve(product||null)
    });
}

export {products};