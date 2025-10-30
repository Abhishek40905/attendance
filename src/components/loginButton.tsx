import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function LoginButton() {
  const handleLoginSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      const userData = jwtDecode(credentialResponse.credential);
      console.log("✅ User logged in:", userData);
    } else {
      console.log("❌ No credentials received");
    }
  };

  const handleLoginError = () => {
    console.log("❌ Login Failed");
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
    </div>
  );
}
