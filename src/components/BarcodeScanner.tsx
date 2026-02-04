
import { useState, useEffect, useRef } from "react";
import { useZxing } from "react-zxing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Barcode, X, Scan } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface BarcodeScannerProps {
  onScan: (barcodeData: string) => void;
  buttonText?: string;
}

export function BarcodeScanner({ onScan, buttonText = "Scan Barcode" }: BarcodeScannerProps) {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [lastResult, setLastResult] = useState<string>("");
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Updated implementation to match the current react-zxing API
  const { ref, torch } = useZxing({
    onDecodeResult(result) {
      const text = result.getText();
      setLastResult(text);
      onScan(text);
      setIsScannerOpen(false); // Close scanner after successful scan
    },
    timeBetweenDecodingAttempts: 300, // Adjust scan frequency
    constraints: {
      video: {
        facingMode: "environment"
      }
    },
    onError(error) {
      console.error("Camera error:", error);
      // Fix the TypeScript error by safely accessing the message property
      const errorMessage = error instanceof Error ? error.message : "Failed to access camera";
      setCameraError(errorMessage);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    },
    paused: !isScannerOpen, // This replaces the manual start/stop
  });

  const handleOpenScanner = () => {
    setCameraError(null);
    setIsScannerOpen(true);
    console.log("Scanner opening requested");
  };

  const handleCloseScanner = () => {
    setIsScannerOpen(false);
  };

  // When component unmounts, ensure camera is stopped
  useEffect(() => {
    return () => {
      setIsScannerOpen(false);
    };
  }, []);

  return (
    <div className="w-full">
      {!isScannerOpen ? (
        <Button 
          onClick={handleOpenScanner}
          variant="outline" 
          className="w-full flex items-center gap-2 h-12"
        >
          <Scan size={20} />
          {buttonText}
        </Button>
      ) : (
        <Card className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 z-10 bg-white/80 rounded-full" 
            onClick={handleCloseScanner}
          >
            <X size={18} />
          </Button>
          <CardContent className="p-0 overflow-hidden relative rounded-lg">
            {cameraError ? (
              <div className="w-full h-64 md:h-80 flex items-center justify-center bg-gray-100">
                <div className="text-center p-4">
                  <Barcode size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-red-500 font-medium mb-2">Camera access error</p>
                  <p className="text-sm text-gray-500 mb-4">{cameraError}</p>
                  <Button onClick={handleOpenScanner} size="sm">Try Again</Button>
                </div>
              </div>
            ) : (
              <div className="w-full h-64 md:h-80 relative bg-black">
                <video 
                  ref={ref}
                  className="w-full h-full object-cover"
                />
                
                {/* Scan overlay */}
                <div className="absolute inset-0 border-2 border-dashed border-primary/50 m-8 pointer-events-none" />
                
                {/* Corners */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-primary" />
                <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-primary" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-primary" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-primary" />
                
                {/* Center line */}
                <div className="absolute left-0 right-0 h-0.5 bg-red-500 top-1/2 transform -translate-y-1/2" />

                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className="bg-white/80 px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm">
                    <Barcode size={14} />
                    Position barcode in the center
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {lastResult && (
        <div className="mt-2 text-sm text-muted-foreground">
          Last scanned: <span className="font-mono">{lastResult}</span>
        </div>
      )}
    </div>
  );
}
