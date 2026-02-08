import { useState } from "react";
import { authService } from "@/services/authService";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError("");
        setMessage("");
        setLoading(true);

        try {
            await authService.resetPassword(token, password);
            setMessage("Password successfully reset! Redirecting to login...");
            setTimeout(() => navigate("/auth"), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md bg-card border-2 border-foreground p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-2xl font-black uppercase tracking-tight mb-2">
                    Reset Password
                </h1>
                <p className="text-muted-foreground mb-6">
                    Enter your new password below.
                </p>

                {message && (
                    <div className="bg-green-100 border-2 border-green-800 text-green-800 p-3 font-bold mb-4">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border-2 border-destructive text-destructive p-3 font-bold mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider">
                            New Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <input
                                type="password"
                                required
                                className="w-full p-2 pl-10 border-2 border-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase tracking-wider">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <input
                                type="password"
                                required
                                className="w-full p-2 pl-10 border-2 border-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
