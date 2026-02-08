import { useState } from "react";
import { authService } from "@/services/authService";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [devLink, setDevLink] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const data = await authService.forgotPassword(email);
            setMessage("Real email sending is disabled for this demo.");
            if (data.resetUrl) {
                setDevLink(data.resetUrl);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md bg-card border-2 border-foreground p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Link to="/auth" className="inline-flex items-center text-sm font-bold hover:underline mb-6">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Login
                </Link>
                <h1 className="text-2xl font-black uppercase tracking-tight mb-2">
                    Forgot Password?
                </h1>
                <p className="text-muted-foreground mb-6">
                    Enter your email and we'll send you a link to reset your password.
                </p>

                {message && (
                    <div className="bg-green-100 border-2 border-green-800 text-green-800 p-3 font-bold mb-4">
                        {message}
                        {devLink && (
                            <div className="mt-2 pt-2 border-t border-green-800/20">
                                <p className="text-xs uppercase mb-1 font-black text-red-600">⚠ DEMO MODE - CLICK HERE INSTEAD OF WAITING FOR EMAIL:</p>
                                <a href={devLink} className="font-bold underline break-all text-sm">{devLink}</a>
                            </div>
                        )}
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
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <input
                                type="email"
                                required
                                className="w-full p-2 pl-10 border-2 border-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
