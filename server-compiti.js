import "dotenv/config";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { Client } from "./dist/index.js";

const PORT = 3000;

// Create the client instance
let client = null;
let compitiData = null;

async function initializeClient() {
	try {
		console.log("Initializing client...");
		client = new Client({ debug: true });
		await client.login();
		console.log("Client logged in successfully!");
		
		// Get compiti data
		compitiData = await client.getCompiti();
		console.log("Compiti data loaded:", compitiData);
		
		return true;
	} catch (error) {
		console.error("Error initializing client:", error);
		return false;
	}
}

const server = createServer(async (req, res) => {
	// Set CORS headers
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		res.writeHead(200);
		res.end();
		return;
	}

	// Serve the HTML page
	if (req.url === "/" || req.url === "/index.html") {
		try {
			const html = await readFile("compiti.html", "utf-8");
			res.writeHead(200, { "Content-Type": "text/html" });
			res.end(html);
		} catch (error) {
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.end("Error loading page");
		}
		return;
	}

	// API endpoint to get compiti
	if (req.url === "/api/compiti" && req.method === "GET") {
		if (!client) {
			const initialized = await initializeClient();
			if (!initialized) {
				res.writeHead(500, { "Content-Type": "application/json" });
				res.end(JSON.stringify({ error: "Failed to initialize client" }));
				return;
			}
		}

		try {
			// Refresh compiti data
			compitiData = await client.getCompiti();
			
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ success: true, data: compitiData }));
		} catch (error) {
			console.error("Error getting compiti:", error);
			res.writeHead(500, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ error: error.message }));
		}
		return;
	}

	// 404 for other routes
	res.writeHead(404, { "Content-Type": "text/plain" });
	res.end("Not Found");
});

server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`);
	console.log("Initializing client in background...");
	initializeClient().then((success) => {
		if (success) {
			console.log("Ready to serve compiti data!");
		} else {
			console.log("Failed to initialize. Will retry on first request.");
		}
	});
});

// Graceful shutdown
process.on("SIGINT", async () => {
	console.log("\nShutting down...");
	if (client) {
		try {
			await client.logOut();
			console.log("Client logged out successfully");
		} catch (error) {
			console.error("Error during logout:", error);
		}
	}
	server.close(() => {
		console.log("Server closed");
		process.exit(0);
	});
});

// Made with Bob
