import Fastify from "fastify";
import {} from './src/config/connect.js';


const start = async() => {
    const app = Fastify();
    const PORT = process.env.PORT || 3000;
    app.listen({port:PORT, host:"0.0.0.0"}, (err, addr) => {
            if(err){
                console.error(err);
            } else{
            console.log(`Wear60 listening at ${addr} and started on http://localhost:${PORT}`);
            }
        }
    );
};

start();
