import { MonitorX } from "lucide-react";

export default function UnsupportedScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-adani-primary/10 via-background to-adani-secondary/10 p-6">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-xl p-10 text-center max-w-md w-full">
        <MonitorX className="w-16 h-16 mx-auto text-adani-primary mb-4" />
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Application Not Supported
        </h1>
        <p className="text-text-muted">
          This application is not available on small screens. Please use a device
          with a width of at least 700px.
        </p>
      </div>
    </div>
  );
}
