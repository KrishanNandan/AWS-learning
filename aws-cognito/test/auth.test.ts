import { AuthService } from "./AuthService";

async function testAuth() {
    const service = new AuthService();
    const loginResult = await service.login("jyotikumari", "Bitu@Kumar@2710");
    const token = await service.getIdToken();
    console.log("krishan", loginResult, token);
}

testAuth();

console.log("done");