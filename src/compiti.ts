import { Client } from "portaleargo-api";
// import "dotenv/config";


// Routes
export async function getCompiti() {
    const data: { [key: string]: any[] } = {};
    const client = new Client();
    await client.login();
    for (const item of client.dashboard?.registro ?? []) {
        // if (new Date(item.datGiorno) > new Date()) {
        if (item.compiti[0] && new Date(item.compiti[0].dataConsegna) > new Date()) {
            const dataConsegna = item.compiti[0].dataConsegna;
            if (!data[dataConsegna]) {
                data[dataConsegna] = [];
            }
            data[dataConsegna].push(item.materia, item.compiti[0].compito);
        } }
    return (data);
}