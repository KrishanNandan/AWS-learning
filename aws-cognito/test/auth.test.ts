import { AuthService } from "./AuthService";

async function testAuth() {
    const service = new AuthService();
    const loginResult = await service.login("username", "password");
    const token = await service.getIdToken();
    console.log("krishan", loginResult, token);
}

testAuth();